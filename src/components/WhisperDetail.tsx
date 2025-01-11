import { useParams } from "react-router-dom";
import { CaptionBackIcon, ActionIcon } from "./SidebarItems";
import { VariableSizeList as List } from "react-window";
import { useState, useRef, useCallback } from "react";

// 生成随机字符串
const generateRandomString = (length: number) => {
	return Array.from({ length }, () =>
		String.fromCharCode(Math.floor(Math.random() * 26) + 97)
	).join("");
};

// 生成对话数据
const generateData = () => {
	return Array.from({ length: 100 }, (_, i) => ({
		timestamp: new Date(Date.now() - i * 60000).toISOString(),
		start: i * 10,
		end: (i + 1) * 10,
		content: generateRandomString(Math.floor(Math.random() * 1000)),
		speaker: i % 2 === 0 ? "User" : "AI",
	}));
};

const Row = ({ index, style, data }: any) => {
	const item = data[index];
	return (
		<div style={style} className="flex flex-col mb-2">
			{" "}
			{/* 减少margin-bottom */}
			<div className="flex items-center mb-1">
				<div className="text-sm font-medium text-gray-600 dark:text-gray-300">
					{item.speaker}
				</div>
				<div className="ml-2 text-xs text-gray-400 dark:text-gray-500">
					{item.start}s - {item.end}s
				</div>
			</div>
			<div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-pre-wrap break-words">
				{" "}
				{/* 减少padding */}
				{item.content}
			</div>
		</div>
	);
};

export const WhisperDetail = () => {
	const { id } = useParams();
	const [data] = useState(generateData());
	const listRef = useRef<any>(null);
	const rowHeights = useRef<number[]>([]);

	// 动态计算行高
	const getRowHeight = useCallback(
		(index: number) => {
			const content = data[index].content;
			const lineHeight = 18; // 减小行高
			const padding = 50; // 减少基础高度
			const lines = Math.ceil(content.length / 80);
			return padding + lines * lineHeight;
		},
		[data]
	);

	// 缓存行高
	const setRowHeight = useCallback((index: number, height: number) => {
		listRef.current?.resetAfterIndex(0);
		rowHeights.current[index] = height;
	}, []);

	return (
		<div className="flex flex-col h-screen p-4 dark:text-white text-black animate-fade-in">
			{/* 头部 */}
			<div className="flex items-center mb-4">
				<CaptionBackIcon />
				<div className="ml-4">
					<h1 className="text-2xl font-bold">Whisper {id}</h1>
					<p className="text-sm text-gray-500">创建时间: 2023-10-01 12:00:00</p>
				</div>
			</div>

			{/* 搜索栏 */}
			<div className="flex justify-between items-center mb-4">
				<span className="text-lg">对话记录</span>
				<div className="flex items-center gap-2">
					<input
						type="text"
						placeholder="搜索..."
						className="px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
					/>
					<ActionIcon />
				</div>
			</div>

			{/* 对话列表 */}
			<div className="flex-1">
				<List
					ref={listRef}
					height={600}
					itemCount={data.length}
					itemSize={getRowHeight}
					width="100%"
					itemData={data}
				>
					{({ index, style }) => (
						<Row
							index={index}
							style={{ ...style, height: "auto" }}
							data={data}
						/>
					)}
				</List>
			</div>
		</div>
	);
};
