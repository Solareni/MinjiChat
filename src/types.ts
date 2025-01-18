import { invoke } from "@tauri-apps/api/core";
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
			
			break;

		default:
			invoke("dispatch_command", { msg: JSON.stringify(cmd) });
			break;
	}
}
