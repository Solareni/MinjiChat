import { invoke } from "@tauri-apps/api/core";
export interface WhisperItem {
	id: string;
	fileName: string;
	duration: number;
	createdAt: string;
	progress?: number;
}

export interface ProgressData {
	id: string;
	progress: number;
}

export interface AstaCommand {
	type: string;
	command?: any;
}
export async function dispatchCommand(cmd: AstaCommand) {
	invoke("dispatch_command", { msg: JSON.stringify(cmd) });
}
