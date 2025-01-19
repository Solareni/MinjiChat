use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WhisperData {
    #[serde(rename = "systeminfo")]
    info: String,
    pub transcription: Vec<Transcription>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transcription {
    pub offsets: Offsets,
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Offsets {
    pub from: f64,
    pub to: f64,
}



#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "command")]
pub enum Command {
    #[serde(rename = "stt_task_process")]
    STTTaskProcess(String),
    #[serde(rename = "stt_task_load")]
    STTTaskLoad(String),
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
    #[serde(rename = "stt_task_list")]
    STTTaskList(Vec<STTTask>),
    #[serde(rename = "stt_task_content")]
    STTaskContent(Vec<STTTaskContent>),
    None,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct STTTaskContent{
    pub content: String,
    pub start: f64,
    pub end: f64
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