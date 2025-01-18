use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WhisperData {
    #[serde(rename = "systeminfo")]
    info: String,
    pub transcription: Vec<Transcription>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transcription {
    offsets: Offsets,
    text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Offsets {
    from: f64,
    to: f64,
}



#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "command")]
pub enum Command {
    #[serde(rename = "stt_task_process")]
    STTTaskProcess(String),
    #[serde(rename = "load_whisper_data")]
    LoadWhisperData,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "event")]
pub enum Event {
    #[serde(rename = "stt_task_begin")]
    STTTaskBegin(STTTask),
    #[serde(rename = "stt_task_progress")]
    STTTaskProgress(STTTaskProcess),
    #[serde(rename = "stt_task_end")]
    STTTaskEnd(STTTaskProcess),
    None,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct STTTaskProcess {
    pub id: String,
    pub progress: f64,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct STTTask {
    pub id: String,
    #[serde(rename = "fileName")]
    pub file_name: String,
    pub duration: f64,
    #[serde(rename = "createdAt")]
    pub created_at: String,
}