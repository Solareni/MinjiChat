use tauri::Manager;

mod extension;
mod whisper;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // let window = app.get_webview_window("main").unwrap();
            // window.on_window_event(|event| match event {
            //     tauri::WindowEvent::DragDrop(event) => match event {
            //         tauri::DragDropEvent::Drop { paths, .. } => {
            //             println!("Dropped file(s): {:?}", paths);
            //         }
            //         _ => {}
            //     },
            //     _ => {}
            // });
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
