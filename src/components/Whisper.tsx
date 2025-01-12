import { FixedSizeList, VariableSizeList as List } from "react-window";
import { ActionIcon, ContentIcon, InputDeleteIcon } from "./SidebarItems";
import { Link, useParams } from "react-router-dom";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { searchResults, whisperData } from "../mock";

const resizeObserver = new ResizeObserver((entries) => {
	entries.forEach((entry) => {
		const target = entry.target as HTMLElement;
		const index = target.dataset.index;
		const onResize = target.dataset.onResize;
		if (index && onResize) {
			const height = target.getBoundingClientRect().height;
			(window as any)[onResize](parseInt(index), height);
		}
	});
});

interface ListItemProps {
	index: number;
	style: React.CSSProperties;
}

interface SearchResultItemProps {
	index: number;
	style: React.CSSProperties;
}

const ListItem = ({ index, style }: ListItemProps) => {
	return (
		<Link to={`/whisper/${index + 1}`} style={style} className="block">
			<div className="grid grid-cols-[2fr_1fr_100px] items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
				{/* 文件信息 */}
				<div className="flex items-center gap-4">
					<ContentIcon />
					<div>
						<div className="font-medium">文件名 {index}</div>
						<div className="text-sm text-gray-500">00:30</div>
					</div>
				</div>

				{/* 创建时间 */}
				<div className="text-sm text-gray-500">2023-10-01</div>

				{/* 操作 */}
				<div className="flex justify-end">
					<ActionIcon />
				</div>
			</div>
		</Link>
	);
};

interface ItemData {
	items: any[];
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
	const result = searchResults[index];
	const rowRef = useRef<HTMLDivElement>(null);
	const callbackName = `updateHeight_${index}`;

	const updateRowHeight = useCallback(() => {
		if (rowRef.current) {
			const height = rowRef.current.getBoundingClientRect().height;
			data.setSize(index, height);
		}
	}, [data.setSize, index]);

	useEffect(() => {
		(window as any)[callbackName] = updateRowHeight;
		return () => {
			delete (window as any)[callbackName];
		};
	}, [callbackName, updateRowHeight]);

	useEffect(() => {
		if (rowRef.current) {
			rowRef.current.dataset.index = index.toString();
			rowRef.current.dataset.onResize = callbackName;
			resizeObserver.observe(rowRef.current);
		}
		return () => {
			if (rowRef.current) {
				resizeObserver.unobserve(rowRef.current);
			}
		};
	}, [callbackName, index]);

	useEffect(() => {
		if (rowRef.current) {
			const timer = setTimeout(() => {
				updateRowHeight();
			}, 0);
			return () => {
				clearTimeout(timer);
			};
		}
	}, []);

	useEffect(() => {
		updateRowHeight();
	}, [result.transcriptSnippets, updateRowHeight]);

	return (
		<div
			ref={rowRef}
			style={{
				...style,
				height: "auto",
				position: "absolute",
				top: style.top,
				left: 0,
				width: "100%",
				transform: "translateY(0)",
				margin: 0,
				padding: 0,
				borderTop: "none",
				borderBottom: "none",
			}}
			className="space-y-4"
		>
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
	const listRef = useRef<any>(null);
	const sizeMap = useRef<number[]>([]);

	const getSize = useCallback((index: number) => {
		return sizeMap.current[index] || 250;
	}, []);

	const setSize = useCallback((index: number, size: number) => {
		const oldSize = sizeMap.current[index];
		if (oldSize !== size) {
			sizeMap.current[index] = size;
			if (listRef.current) {
				listRef.current.resetAfterIndex(index);
			}
		}
	}, []);

	const itemData = useMemo(
		() => ({
			items: searchResults,
			setSize,
		}),
		[setSize]
	);

	const handleSearch = () => {
		// 模拟搜索逻辑
		const count = searchValue ? searchResults.length : 0;
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
					<div className="grid grid-cols-[2fr_1fr_100px] items-center mb-2">
						<span className="font-medium">文件</span>
						<span className="font-medium">创建时间</span>
						<span className="font-medium text-right">操作</span>
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
						>
							{({ index, style }) => <ListItem index={index} style={style} />}
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
							itemData={itemData}
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
