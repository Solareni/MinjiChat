use serde::{Deserialize, Serialize};
use std::hash::{Hash, Hasher};

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
    #[serde(rename = "stt_process_task")]
    STTProcessTask(String),
    #[serde(rename = "stt_fetch_task_trans")]
    STTFetchTaskTrans(String),
    #[serde(rename = "stt_fetch_task_list")]
    STTFetchTaskList,
    #[serde(rename = "stt_fetch_task_simple")]
    STTFetchTaskSimple(String),
    #[serde(rename = "stt_search_tasks_like")]
    STTSearchTasksLike(String),
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
    #[serde(rename = "stt_task_search_result")]
    STTaskSearchResult(Vec<STTSearchTasksLike>),
    #[serde(rename = "stt_task_simple")]
    STTaskSimple(STTTask),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct STTTaskContent {
    pub content: String,
    pub start: f64,
    pub end: f64,
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

// 实现 PartialEq，只比较 id 字段
impl PartialEq for STTTask {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

// 实现 Eq
impl Eq for STTTask {}

// 实现 Hash，只对 id 字段进行哈希
impl Hash for STTTask {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.id.hash(state);
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct STTSearchTasksLike {
    #[serde(flatten)]
    pub task: STTTask,
    #[serde(rename = "transcriptSnippets")]
    pub transcript_snippets: Vec<String>,
}
