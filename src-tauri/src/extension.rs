const APP_NAME: &str = "minji_chat";
pub fn zimu_dir() -> std::path::PathBuf {
    let dir = dirs::data_dir().unwrap();
    let dir = dir.join(APP_NAME);
    if !dir.exists() {
        std::fs::create_dir_all(&dir).unwrap();
    }
    dir
}

pub fn whisper_cli() -> std::path::PathBuf {
    let dir = zimu_dir();
    #[cfg(target_os = "windows")]
    let path = dir.join("whisper-cli.exe");
    
    #[cfg(not(target_os = "windows"))]
    let path = dir.join("whisper-cli");
    path
}