use std::{
    io::{BufRead, Read, Write},
    path::PathBuf,
};

use anyhow::{Context, Result};
use chrono::Timelike;
use extension::zimu_dir;
use rust_embed::Embed;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tauri::{async_runtime::Mutex, AppHandle, Emitter, Manager};
use tracing::info;
mod extension;
mod script;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tracing_subscriber::fmt::init();
    ffmpeg_sidecar::download::auto_download().unwrap();
    {
        let whisper_cli = Assets::get("whisper-cli").unwrap();
        let whisper_cli_path = extension::whisper_cli();
        std::fs::write(&whisper_cli_path, whisper_cli.data).unwrap();
    }
    {
        let embed = Assets::get("ggml-model-whisper-tiny-q5_1.bin").unwrap();
        let model_path = zimu_dir().join("ggml-model-whisper-tiny-q5_1.bin");
        let mut file = std::fs::File::create(&model_path).unwrap();
        file.write_all(&embed.data).unwrap();
    }

    let (async_proc_tx, async_proc_rx) = flume::bounded(1);
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .manage(AsyncProcState {
            inner: Mutex::new(async_proc_tx),
        })
        .setup(|app| {
            let app_handle = app.handle().clone();

            tauri::async_runtime::spawn(async move {
                {
                    let handle = app_handle.clone();
                    let window = app_handle.get_webview_window("main").unwrap();
                    window.on_window_event(move |event| match event {
                        tauri::WindowEvent::DragDrop(event) => match event {
                            tauri::DragDropEvent::Drop { paths, .. } => {
                                println!("Dropped file(s): {:?}", paths);
                                if let Some(path) = paths.first() {
                                    let _ = exec_stt_task(path, &handle);
                                }
                            }
                            _ => {}
                        },
                        _ => {}
                    });
                }

                loop {
                    if let Ok(cmd) = async_proc_rx.recv_async().await {
                        match cmd {
                            Command::STTTaskProcess(task_id) => {
                                info!("STTTaskProcess: {}", task_id);
                            }
                        }
                    }
                }
            });
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![dispatch_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "command")]
pub enum Command {
    #[serde(rename = "stt_task_process")]
    STTTaskProcess(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "event")]
enum Event {
    #[serde(rename = "stt_task_begin")]
    STTTaskBegin(STTTask),
    #[serde(rename = "stt_task_progress")]
    STTTaskProgress(STTTaskProcess),
    #[serde(rename = "stt_task_end")]
    STTTaskEnd(STTTaskProcess),
    None,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct STTTaskProcess {
    id: String,
    progress: f64,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
struct STTTask{
    id: String,
    #[serde(rename = "fileName")]
    file_name:String,
    duration:f64,
    #[serde(rename = "createdAt")]
    created_at: String
}

fn emit_event<R: tauri::Runtime>(event: &Event, manager: &AppHandle<R>) {
    let message = serde_json::to_string(event).unwrap();
    manager.emit("emit_event", message).unwrap();
}

#[tauri::command]
async fn dispatch_command(
    command: &str,
    state: tauri::State<'_, AsyncProcState>,
) -> Result<(), String> {
    // 将结果重新序列化 传回前端
    let cmd: Command = serde_json::from_str(command).map_err(|e| e.to_string())?;
    let input = state.inner.lock().await;
    input.send(cmd).map_err(|e| e.to_string())
}

struct AsyncProcState {
    inner: Mutex<flume::Sender<Command>>,
}

#[derive(Embed)]
#[folder = "assets"]
struct Assets;

fn exec_stt_task(path: &PathBuf, app: &AppHandle) -> Result<()> {
    let current_time = chrono::Local::now();
    let current_time = current_time.format("%Y/%m/%d %H:%M").to_string();
    let task_id = get_task_id(path);
    info!(?task_id);
    let file_name = path
        .file_stem()
        .and_then(|v| v.to_str())
        .map(|v| v.to_string())
        .unwrap_or(task_id.clone());
    info!(?file_name);
    let input = zimu_dir().join(&format!("{}.wav", &task_id));
    let input = input.display().to_string();
    let _ = script::divide_audio(&path.display().to_string(), &input);
    let duration = script::get_duration(&input)?;

    {

        info!(?duration);
        let stt_task = STTTask{
            id: task_id.clone(),
            file_name,
            duration,
            created_at: current_time
        };
        let event = Event::STTTaskBegin(stt_task);
        emit_event(&event, app);
    }
    // whisper

    let model_path = zimu_dir().join("ggml-model-whisper-tiny-q5_1.bin");
    let model_path = model_path.display().to_string();
    let language = "en";
    let prompt = "所以我跟大家讲,还是那句话,我不见得有多好,真的,但是我绝对是你们见到的最真的人,我都不愿意说假话.";
    
    // 创建一个线程来处理输出
    let (sx, rx) = flume::bounded(1);

    let app = app.clone();
    tauri::async_runtime::spawn(async move {

        tauri::async_runtime::spawn_blocking(move || {
            let mut whisper_process = script::whisper_command(&model_path, &input, language, prompt).unwrap();

            let stdout = whisper_process
                .stdout
                .take()
                .unwrap();
            let reader = std::io::BufReader::new(stdout);
            for line in reader
                .lines()
                .flatten()
                .map(|v| script::parse_srt_line(&v))
                .flatten()
            {
                sx.send(line).unwrap();
            }
        });
        
        let mut process = STTTaskProcess{
            id: task_id.clone(),
            progress: 0.0
        };
        while let Ok((start, end,text)) = rx.recv() {
            let time = chrono::NaiveTime::parse_from_str(&end, "%H:%M:%S%.3f").unwrap();
            let time = time.num_seconds_from_midnight() as f64;
            process.progress = time;
            let event = Event::STTTaskProgress(process.clone());
            emit_event(&event, &app);
        }
        {
            process.progress = duration;
            let event = Event::STTTaskEnd(process.clone());
            emit_event(&event, &app);
        }
    });
   


    Ok(())
}

fn get_task_id<P>(audio_path: P) -> String
where
    P: AsRef<std::path::Path>,
{
    let data = std::fs::File::open(audio_path).unwrap();
    let mut reader = std::io::BufReader::new(data);
    let mut context = md5::Context::new();
    let mut buffer = [0; 1024];

    loop {
        let count = reader.read(&mut buffer).unwrap();
        if count == 0 {
            break;
        }
        context.consume(&buffer[..count]);
    }

    format!("{:x}", context.compute())
}
