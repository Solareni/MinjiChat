use crate::{extension::zimu_dir, types::STTTask};
use anyhow::{Context, Result};
use sqlx::sqlite::SqliteQueryResult;
use sqlx::Row;
use tracing::info;

#[derive(Debug, Clone)]
pub struct Db {
    pool: sqlx::Pool<sqlx::Sqlite>,
}

impl Db {
    pub async fn fetch_tasks(&self) -> Result<Vec<STTTask>> {
        let tasks = sqlx::query("SELECT * FROM stt_tasks")
            .fetch_all(&self.pool)
            .await
            .context("Failed to fetch tasks")?;


        Ok(tasks
            .iter()
            .map(|row| STTTask {
                id: row.get("id"),
                file_name: row.get("file_name"),
                duration: row.get("duration"),
                created_at: row.get("created_at"),
            })
            .collect::<Vec<_>>())
    }
    pub async fn insert_task(&self, task: &STTTask) -> Result<()> {
        info!(?task);
        match sqlx::query(
            "INSERT INTO stt_tasks (id, file_name, duration, created_at) VALUES ($1, $2, $3, $4)",
        )
        .bind(&task.id)
        .bind(&task.file_name)
        .bind(&task.duration)
        .bind(&task.created_at)
        .execute(&self.pool)
        .await{
            Ok(_) => Ok(()),
            Err(e) => {
                Err(e.into())
            }
        }
    }
    pub async fn new() -> Result<Self> {
        let db_path: std::path::PathBuf = zimu_dir().join("test.db");
        let options = sqlx::sqlite::SqliteConnectOptions::new()
            .filename(db_path)
            .create_if_missing(true)
            .read_only(false)
            .foreign_keys(true);
        let pool = sqlx::SqlitePool::connect_with(options)
            .await
            .context("Failed to connect to database")?;

        let _ = sqlx::query(
            "CREATE TABLE stt_tasks (
                id TEXT PRIMARY KEY,
                file_name TEXT NOT NULL,
                duration REAL NOT NULL,
                created_at TEXT NOT NULL
            )",
        )
        .execute(&pool)
        .await;
        let _ = sqlx::query(
            "CREATE TABLE IF NOT EXISTS stt_sentences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id TEXT NOT NULL,
                start_timestamp INTEGER NOT NULL,
                end_timestamp INTEGER NOT NULL,
                text TEXT NOT NULL,
                FOREIGN KEY(task_id) REFERENCES stt_tasks(id)
            )",
        )
        .execute(&pool)
        .await;
        Ok(Self { pool })
    }
}
