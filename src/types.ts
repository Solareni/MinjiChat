import { invoke } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";

class DatabaseManager {
	private db: Database | null = null;
	private static instance: DatabaseManager;
	private constructor() {}
	private async init() {
		this.db = await Database.load("sqlite:./db.sqlite");
		await this.db.execute(`CREATE TABLE IF NOT EXISTS stt_tasks (
            id TEXT PRIMARY KEY,
            date DATE NOT NULL,
            basic_info TEXT
        `);
		await this.db.execute(`CREATE TABLE IF NOT EXISTS stt_sentences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT NOT NULL,
            start_timestamp INTEGER NOT NULL,
            end_timestamp INTEGER NOT NULL,
            text TEXT NOT NULL,
            FOREIGN KEY(task_id) REFERENCES stt_tasks(id)
        )`);
	}

	public static async getInstance(): Promise<DatabaseManager> {
		if (!DatabaseManager.instance) {
			DatabaseManager.instance = new DatabaseManager();
			await DatabaseManager.instance.init();
		}
		return this.instance;
	}

	public getTTSDb() {
		if (!this.db) {
			throw new Error("Database not initialized");
		}
		return this.db;
	}
}

export interface WhisperItem {
	id: string;
	fileName: string;
	duration: number;
	createdAt: string;
  progress?: number;
}

export interface ProgressData{
  id: string;
  progress: number;
}


export interface AstaCommand {
	type: string;
	command?: any;
}
export async function dispatchCommand(cmd: AstaCommand) {
	switch (cmd.type) {
		case "load_whipser_data":
			const db = await DatabaseManager.getInstance();
			const ttsDb = db.getTTSDb();
			const result = await ttsDb.select("SELECT * FROM stt_tasks");
			console.log("result", result);
			break;

		default:
			invoke("dispatch_command", { msg: JSON.stringify(cmd) });
			break;
	}
}
