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


export function formatTime(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	// 使用 padStart 补零
	const pad = (num: number) => num.toString().padStart(2, "0");

	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export interface WhisperDetailProps {
	content: string;
	start: number;
	end: number;
	index?: number;
}

export interface MessageProps {
	message: WhisperDetailProps;
	searchKeyworkd?: string;
}

export interface ItemData {
	items: WhisperDetailProps[];
	setSize: (index: number, size: number) => void;
	searchKeyword?: string;
}