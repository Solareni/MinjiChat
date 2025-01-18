use crate::extension::zimu_dir;
use anyhow::{Context, Result};
pub struct Db {
    pool: sqlx::Pool<sqlx::Sqlite>,
}

impl Db {
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
            "CREATE TABLE IF NOT EXISTS stt_tasks (
                    id TEXT PRIMARY KEY,
                    date DATE NOT NULL,
                    basic_info TEXT
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
