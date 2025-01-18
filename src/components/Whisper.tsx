import { FixedSizeList, VariableSizeList as List } from "react-window";
import { ActionIcon, ContentIcon, InputDeleteIcon } from "./SvgIcons";
import { Link, useParams } from "react-router-dom";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { generateSearchResults } from "../mock";
import { dispatchCommand, ProgressData, WhisperItem } from "../types";
import { listen } from "@tauri-apps/api/event";

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
		<Link to={`/whisper/${index + 1}`} style={style} className="block">
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
				<div className="text-sm text-gray-500 whitespace-nowrap">{result.createdAt}</div>
			</div>
		</Link>
	);
};

interface ItemData {
	items: SearchResult[];
	setSize: (index: number, size: number) => void;
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
	const rowRef = useRef<HTMLDivElement>(null);

	const updateSize = useCallback(() => {
		if (rowRef.current) {
			const newHeight = rowRef.current.getBoundingClientRect().height;
			data.setSize(index, newHeight);
		}
	}, [index, data]);

	useEffect(() => {
		updateSize();
	}, [result.transcriptSnippets]); // 当内容变化时重新计算高度

	useEffect(() => {
		const handleResize = () => {
			updateSize();
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [updateSize]);
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
							{snippet}
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
	duration: string;
	createdAt: string;
	transcriptSnippets: string[];
}

const Whispser = () => {
	const [searchValue, setSearchValue] = useState("");
	const [showClearButton, setShowClearButton] = useState(false);
	const [resultsCount, setResultsCount] = useState(0);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [whisperData, setWhisperData] = useState<WhisperItem[]>([]);
	const [progress, setProgress] = useState<ProgressData>();
	const listRef = useRef<any>(null);
	const sizeMap = useRef<{ [key: number]: number }>({});

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
	const getSize = useCallback((index: number) => {
		return sizeMap.current[index] || 250;
	}, []);

	const setSize = useCallback((index: number, size: number) => {
		if (sizeMap.current[index] !== size) {
			sizeMap.current[index] = size;
			listRef.current?.resetAfterIndex(index);
		}
	}, []);

	const handleSearch = () => {
		// 清空之前的结果
		sizeMap.current = [];
		if (listRef.current) {
			listRef.current.resetAfterIndex(0);
		}

		const newResults = generateSearchResults();
		setSearchResults(newResults);

		// 模拟搜索逻辑
		const count = searchValue ? newResults.length : 0;
		setResultsCount(count);
		console.log("执行搜索:", searchValue);
	};

	const handleClear = () => {
		setSearchValue("");
		setShowClearButton(false);
		setResultsCount(0);
		console.log("清除搜索");
	};

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
				default: {
					console.log(`未知事件 ${event}`);
				}
			}
		});

		dispatchCommand({ type: "load_whisper_data" });

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
					<div className="h-[600px]">
						<FixedSizeList
							height={600}
							itemCount={whisperData.length}
							itemSize={80}
							width="100%"
							itemData={{
								items: whisperData,
							}}
						>
							{ListItem}
						</FixedSizeList>
					</div>
				</div>
			) : (
				<div>
					<div className="flex items-center justify-between mb-8">
						<span className="font-medium">
							共{resultsCount}个与"{searchValue}"相关的结果
						</span>
					</div>
					{/* 分割线 */}
					<hr className="mb-4" />

					{/* 搜索结果列表 */}
					<div className="h-[600px]">
						<List
							ref={listRef}
							height={700}
							itemCount={resultsCount}
							itemSize={getSize}
							width="100%"
							itemData={{
								items: searchResults,
								setSize,
							}}
						>
							{SearchResultItem}
						</List>
					</div>
				</div>
			)}
		</div>
	);
};

export default Whispser;
