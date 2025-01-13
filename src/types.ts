import { invoke } from "@tauri-apps/api/core";
export interface WhisperItem {
    id: number;
    fileName: string;
    duration: string;
    createdAt: string;
  }

export interface WhisperCommand {
  type: string;
  command?: any;
}
export async function dispatchCommand(params: WhisperCommand) {
  invoke("dispatch_command", { msg: JSON.stringify(params) });
}