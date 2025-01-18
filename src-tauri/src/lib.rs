use std::{
    io::{BufRead, Read},
    path::PathBuf,
};

use anyhow::{Context, Result};
use extension::zimu_dir;
use rust_embed::Embed;
use serde::{Deserialize, Serialize};
use tauri::{async_runtime::Mutex, AppHandle, Emitter, Manager};
use tracing::info;
mod extension;
mod script;
mod whisper;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tracing_subscriber::fmt::init();
    ffmpeg_sidecar::download::auto_download().unwrap();
    {
        let whisper_cli = Assets::get("whisper-cli").unwrap();
        let whisper_cli_path = extension::whisper_cli();
        std::fs::write(&whisper_cli_path, whisper_cli.data).unwrap();
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
    BeginSTTTask(String),
    None,
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
    let task_id = get_task_id(path);

    let path_name = path
        .file_stem()
        .and_then(|v| v.to_str())
        .map(|v| v.to_string())
        .unwrap_or(task_id.clone());

    let input = zimu_dir().join(&format!("{}.wav", &task_id));
    let input = input.display().to_string();
    let _ = script::divide_audio(&path.display().to_string(), &input);
    {
        let event = Event::BeginSTTTask(task_id.clone());
        emit_event(&event, app);
    }
    // whisper

    let model_path = zimu_dir().join("ggml-model-whisper-tiny-q5_1.bin");
    let model_path = model_path.display().to_string();
    let language = "en";
    let prompt = "所以我跟大家讲,还是那句话,我不见得有多好,真的,但是我绝对是你们见到的最真的人,我都不愿意说假话.";
    let mut whisper_process = script::whisper_command(&model_path, &input, language, prompt)?;

    let stdout = whisper_process
        .stdout
        .take()
        .context("Could not take stdout of process")?;
    // 创建一个线程来处理输出
    let (sx, rx) = flume::bounded(1);
    std::thread::spawn(move || {
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

    while let Ok(r) = rx.recv() {
        dbg!(r);
    }

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
