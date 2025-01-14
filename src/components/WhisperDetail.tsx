import { useNavigate, useParams } from "react-router-dom";
import { CaptionBackIcon, ActionIcon } from "./SvgIcons";
import { VariableSizeList as List } from "react-window";
import speaker1 from "../assets/1.png";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { generateData } from "../mock";

interface MessageProps {
	content: string;
	start: number;
	end: number;
	searchKeyworkd?: string;
}
const MessageTime = React.memo(
	({ start, end }: { start: number; end: number }) => {
		return (
			<div className="absolute -top-4 left-0 text-xs text-slate-500 whitespace-nowrap flex items-center">
				<img
					src={speaker1} // 使用占位符图片
					alt="Avatar"
					className="h-5 w-5 rounded-full"
				/>
				<span className="ml-2">
					{start}s - {end}s
				</span>
			</div>
		);
	}
);

const Message = React.memo(
	({ content, start, end, searchKeyworkd }: MessageProps) => {
		const highlightText = (text: string, keyword?: string) => {
			if (!keyword) {
				return text;
			}
			const regex = new RegExp(keyword, "gi");
			return text.replace(
				regex,
				(match) => `<span class="bg-yellow-200 text-yellow-900">${match}</span>`
			);
		};
		return (
			<div className="flex bg-slate-100 px-4 py-4 pt-6 dark:bg-slate-900 sm:px-6 border-b border-slate-200 dark:border-slate-700">
				<div className="relative mt-2">
					<MessageTime start={start} end={end} />
				</div>
				<div className="flex min-w-0 flex-1 items-start gap-x-4 mt-2">
					<div className="min-w-0 flex-auto">
						<p className="break-words pt-1">
							{highlightText(content, searchKeyworkd)}
						</p>
					</div>
				</div>
			</div>
		);
	}
);
interface ItemData {
	items: any[];
	setSize: (index: number, size: number) => void;
	searchKeyword?: string;
}
const Row = ({
	index,
	style,
	data,
}: {
	index: number;
	style: React.CSSProperties;
	data: ItemData;
}) => {
	const item = data.items[index];
	const rowRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (rowRef.current) {
			const newHeight = rowRef.current.getBoundingClientRect().height;
			data.setSize(index, newHeight);
		}
	}, [item.content]); // 当内容变化时重新计算高度

	const updateSize = useCallback(() => {
		if (rowRef.current) {
			const newHeight = rowRef.current.getBoundingClientRect().height;
			data.setSize(index, newHeight);
		}
	}, [index, data]);

	useEffect(() => {
		updateSize();
	}, [item.content]); // 当内容变化时重新计算高度

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
		<div style={style}>
			<div ref={rowRef}>
				<Message
					content={item.content}
					start={item.start}
					end={item.end}
					searchKeyworkd={data.searchKeyword}
				/>
			</div>
		</div>
	);
};

export const WhisperDetail = () => {
	const { id } = useParams();
	const [message] = useState(generateData());
	const listRef = useRef<any>(null);

	const listContainerRef = useRef<HTMLDivElement>(null);

	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const [searchKeyword, setSearchKeyword] = useState<string>();
	const [searchItems, setSearchItems] = useState<any[]>([]);
	const [searchIndex, setSearchIndex] = useState(0);
	const sizeMap = useRef<{ [key: number]: number }>({});

	const getSize = useCallback((index: number) => {
		return sizeMap.current[index] || 70;
	}, []);

	const setSize = useCallback((index: number, size: number) => {
		sizeMap.current[index] = size;
		listRef.current?.resetAfterIndex(index);
	}, []);

	useEffect(() => {
		const handleResize = () => {
			if (listContainerRef.current) {
				setWindowHeight(listContainerRef.current.clientHeight);
				setTimeout(() => {
					if (listRef.current) {
						listRef.current.resetAfterIndex(0, true);
					}
				}, 0);
			}
		};
		window.addEventListener("resize", handleResize);
		handleResize();
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (listRef.current && message.length > 0) {
			listRef.current.resetAfterIndex(0, true);
		}
	}, [message]);

	const scrollTimeoutRef = useRef<any>();
	useEffect(() => {
		if (searchItems.length > 0 && listRef.current) {
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
			scrollTimeoutRef.current = setTimeout(() => {
				const targetIndex = searchItems[searchIndex].index;
				listRef.current.resetAfterIndex(0, true);
				listRef.current.scrollToItem(targetIndex, "center");
			}, 300);
		}
		return () => {
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, [searchItems, searchIndex]);

	const navigate = useNavigate();
	return (
		<div className="flex flex-col h-screen p-4 dark:text-white text-black animate-fade-in">
			{/* 头部 */}
			<div className="flex items-center mb-4">
				<button onClick={() => navigate(-1)}>
					<CaptionBackIcon />
				</button>
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
			<div
				ref={listContainerRef}
				className="flex-1 relative bg-slate-50 text-sm leading-6 text-slate-900 shadow-md dark:bg-slate-900 dark:text-slate-50 sm:text-base sm:leading-7 w-full h-full"
				style={{ overflow: "hidden" }}
			>
				<List
					ref={listRef}
					height={windowHeight}
					itemCount={message.length}
					itemSize={getSize}
					width="100%"
					itemData={{
						items: message,
						setSize,
						searchKeyword: searchKeyword ?? undefined,
					}}
					overscanCount={5}
				>
					{Row}
				</List>
			</div>
		</div>
	);
};
