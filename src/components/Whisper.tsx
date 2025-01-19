import { ActionIcon, ContentIcon, InputDeleteIcon } from "./SvgIcons";
import { Link, useParams } from "react-router-dom";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { dispatchCommand, ProgressData, WhisperItem } from "../types";
import { listen } from "@tauri-apps/api/event";
import { highlightText, VirtualList } from "./VirtualList";
import { useDynamicHeight } from "../hooks/useDynamicHeight";

interface ListItemProps {
	index: number;
	style: React.CSSProperties;
	data: ListItemData;
}

interface ListItemData {
	items: WhisperItem[];
}
const ListItem = ({ index, style, data }: ListItemProps) => {
	const result = data.items[index];
	return (
		<Link to={`/whisper/${result.id}`} style={style} className="block">
			<div className="grid grid-cols-[2fr_1fr_1fr] items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
				{/* 文件名称 */}
				<div className="text-sm">{result.fileName}</div>
				{/* 时长/进度*/}
				{result.progress && result.progress < result.duration ? (
					<div className="text-sm text-yellow-500">
						处理了 {((result.progress / result.duration) * 100).toFixed(2)}%
					</div> // 或者 null
				) : (
					<div className="text-sm text-gray-500">{result.duration}s</div> // 或者 null
				)}
				{/* 创建时间 */}
				<div className="text-sm text-gray-500 whitespace-nowrap">
					{result.createdAt}
				</div>
			</div>
		</Link>
	);
};

interface ItemData {
	items: SearchResult[];
	setSize: (index: number, size: number) => void;
	searchKeyword?: string;
}

const SearchResultItem = ({
	index,
	style,
	data,
}: {
	index: number;
	style: React.CSSProperties;
	data: ItemData;
}) => {
	const result = data.items[index];
	const rowRef = useDynamicHeight(index, data, result.transcriptSnippets);
	return (
		<div style={{ ...style, height: "auto" }}>
			<div ref={rowRef} className="space-y-4">
				{/* 文件信息 */}
				<div className="flex items-center gap-4">
					<div>
						<div className="font-medium">{result.fileName}</div>
						<div className="text-sm text-gray-500">
							{result.createdAt} · {result.duration}
						</div>
					</div>
				</div>

				{/* 文字记录 */}
				<div className="space-y-2">
					<div className="font-medium">文字记录</div>
					{result.transcriptSnippets.slice(0, 3).map((snippet, i) => (
						<div
							key={i}
							className="text-sm text-gray-600 whitespace-pre-wrap break-words"
							style={{
								wordBreak: "break-word",
								overflowWrap: "break-word",
								maxWidth: "100%",
							}}
						>
							{highlightText(snippet, data.searchKeyword)}
						</div>
					))}
				</div>

				{/* 跳转链接 */}
				<Link
					to={`/whisper/${result.id}`}
					className="text-sm text-blue-500 hover:text-blue-700"
				>
					查看完整记录
				</Link>
				{/* 分割线 */}
				<hr className="mb-4" />
			</div>
		</div>
	);
};

interface SearchResult {
	id: number;
	fileName: string;
	duration: number;
	createdAt: string;
	transcriptSnippets: string[];
}

const Whisper = () => {
	const [searchValue, setSearchValue] = useState("");
	const [showClearButton, setShowClearButton] = useState(false);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [whisperData, setWhisperData] = useState<WhisperItem[]>([]);
	const [progress, setProgress] = useState<ProgressData>();

	useEffect(() => {
		if (progress) {
			const updatedWhisperData = whisperData.map((item) =>
				item.id === progress.id
					? { ...item, progress: progress.progress }
					: item
			);
			setWhisperData(updatedWhisperData);
		}
	}, [progress, whisperData]);

	const handleSearch = () => {
		dispatchCommand({ type: "stt_search_tasks_like", command: searchValue });
	};

	const handleClear = () => {
		setSearchValue("");
		setShowClearButton(false);
		setResultsCount(false);
		console.log("清除搜索");
	};
	const [resultsCount, setResultsCount] = useState(false);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	// 首次加载，读取whisperData

	useEffect(() => {
		const unsubscribe = listen<string>("emit_event", (event) => {
			const payload = JSON.parse(event.payload);
			switch (payload.type) {
				case "stt_task_begin": {
					const data = payload.event;
					setWhisperData([data, ...whisperData]);
					break;
				}
				case "stt_task_progress": {
					const data = payload.event;
					setProgress(data);
					break;
				}
				case "stt_task_end": {
					const data = payload.event;
					setProgress(data);
					break;
				}
				case "stt_task_list": {
					const data = payload.event;
					setWhisperData(data);
					break;
				}
				case "stt_task_search_result": {
					const data = payload.event;
					setSearchResults(data);
					setResultsCount(true);
					break;
				}
				default: {
					console.log(`未知事件 ${event}`);
				}
			}
		});

		dispatchCommand({ type: "stt_fetch_task_list" });

		return () => {
			unsubscribe.then((unlisten) => unlisten());
		};
	}, []);

	return (
		<div className="w-full max-w-5xl mx-auto p-4">
			{/* 搜索框 */}
			<div className="flex items-center gap-4 mb-8 relative">
				<input
					type="text"
					placeholder="搜索音频文件"
					className="flex-1 p-2 border rounded pr-10"
					value={searchValue}
					onChange={(e) => {
						setSearchValue(e.target.value);
						setShowClearButton(e.target.value.length > 0);
					}}
					onKeyDown={handleKeyDown}
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck="false"
				/>
				{showClearButton && (
					<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
						<button
							onClick={handleClear}
							className="p-2 text-gray-500 hover:text-gray-700"
						>
							<InputDeleteIcon />
						</button>
					</div>
				)}
			</div>
			{!showClearButton ? (
				<div>
					<div className="flex items-center justify-between mb-8">
						<span className="font-medium">我的内容</span>
						<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
							上传
						</button>
					</div>
					{/* 表头 */}
					<div className="grid grid-cols-[2fr_1fr_1fr] items-center mb-2">
						<span className="font-medium">文件</span>
						<span className="font-medium">时长</span>
						<span className="font-medium">创建时间</span>
					</div>

					{/* 分割线 */}
					<hr className="mb-4" />

					{/* 虚拟列表区域 */}
					<VirtualList
						className="w-full h-full"
						message={whisperData}
						rowRenderer={ListItem}
					/>
				</div>
			) : (
				<div>
					<div className="flex items-center justify-between mb-8">
						{resultsCount && (
							<span className="font-medium">
								共{searchResults.length}个与"{searchValue}"相关的结果
							</span>
						)}
					</div>
					{/* 分割线 */}
					<hr className="mb-4" />

					{/* 搜索结果列表 */}
					<VirtualList
						message={searchResults}
						className="w-full h-full"
						searchKeyword={searchValue}
						rowRenderer={SearchResultItem}
					/>
				</div>
			)}
		</div>
	);
};

export default Whisper;
