import { FixedSizeList } from "react-window";
import { WhisperItem } from "../types";
import { ActionIcon, ContentIcon, InputDeleteIcon } from "./SidebarItems";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

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

const SearchResultItem = ({ index, style }: SearchResultItemProps) => {
	const result = searchResults[index];
	return (
		<div style={style} className="space-y-4">
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
					<div key={i} className="text-sm text-gray-600">
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

const whisperData: WhisperItem[] = Array.from({ length: 100 }, (_, i) => ({
	id: i + 1,
	fileName: `文件名 ${i + 1}`,
	duration: "00:30",
	createdAt: "2023-10-01",
}));

interface SearchResult {
	id: number;
	fileName: string;
	duration: string;
	createdAt: string;
	transcriptSnippets: string[];
}

const searchResults: SearchResult[] = Array.from({ length: 10 }, (_, i) => ({
	id: i + 1,
	fileName: `搜索结果 ${i + 1}`,
	duration: "00:30",
	createdAt: "2023-10-01",
	transcriptSnippets: [
		"这是第一个匹配的文本片段这是第一个匹配的文本片段这是第一个匹配的文本片段这是第一个匹配的文本片段这是第一个匹配的文本片段这是第一个匹配的文本片段这是第一个匹配的文本片段这是第一个匹配的文本片段这是第一个匹配的文本片段这是第一个匹配的文本片段这是第一个匹配的文本片段",
		"这是第二个匹配的文本片段",
		"这是第三个匹配的文本片段",
		"这是第4个匹配的文本片段",
	],
}));

const Whispser = () => {
	const [searchValue, setSearchValue] = useState("");
	const [showClearButton, setShowClearButton] = useState(false);
	const [resultsCount, setResultsCount] = useState(0);

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
						<FixedSizeList
							height={700}
							itemCount={resultsCount}
							itemSize={250}
							width="100%"
						>
							{({ index, style }) => (
								<SearchResultItem index={index} style={style} />
							)}
						</FixedSizeList>
					</div>
				</div>
			)}
		</div>
	);
};

export default Whispser;
