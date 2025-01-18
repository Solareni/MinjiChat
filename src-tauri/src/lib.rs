use anyhow::Result;
use rust_embed::Embed;
use serde::{Deserialize, Serialize};
use tauri::{async_runtime::Mutex, Manager};
use tauri_plugin_sql::{Migration, MigrationKind};
use tracing::{info, Instrument};
mod extension;
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
    None,
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
