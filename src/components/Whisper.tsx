import { FixedSizeList } from "react-window";
const Whipser = () => {
	return (
		<div className="w-full max-w-5xl mx-auto p-4">
			{/* 搜索框 */}
			<div className="flex items-center gap-4 mb-8">
				<input
					type="text"
					placeholder="搜索音频文件"
					className="flex-1 p-2 border rounded"
				/>
			</div>

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
					itemCount={100} // 替换为实际数据长度
					itemSize={80}
					width="100%"
				>
					{({ index, style }) => (
						<div
							style={style}
							className="grid grid-cols-[2fr_1fr_100px] items-center"
						>
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
					)}
				</FixedSizeList>
			</div>
		</div>
	);
};
const ActionIcon = () => {
	return (
		<svg
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			data-icon="MoreOutlined"
		>
			<path
				d="M5.5 11.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm8.225 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm8.275 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z"
				fill="currentColor"
			></path>
		</svg>
	);
};
const ContentIcon = () => {
	return (
		<svg
			width="120"
			height="68"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<path d="M120 0H0v68h120V0z" fill="url(#paint0_linear)" />
			<path fill="url(#pattern0)" d="M34 9h56v53H34z" />
			<path
				d="M75 33c0-7-6-12-12-12h-6c-6 0-12 5-12 12v11c0 2 1 3 3 3h1c3 0 5-2 5-5v-2c0-2-2-5-5-5h-1v-2c0-5 4-9 9-9h6c5 0 9 4 9 9v2h-1c-3 0-5 3-5 5v2c0 3 2 5 5 5h1c2 0 3-1 3-3V33z"
				fill="url(#paint1_linear)"
			/>
			<defs>
				<linearGradient
					id="paint0_linear"
					x1="121.2"
					y1="34"
					x2="-.9"
					y2="34"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#71D6F7" />
					<stop offset="1" stop-color="#8BEDF2" />
				</linearGradient>
				<linearGradient
					id="paint1_linear"
					x1="45"
					y1="34"
					x2="75"
					y2="34"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#fff" />
					<stop offset="1" stop-color="#C8FAFC" />
				</linearGradient>
				<pattern
					id="pattern0"
					patternContentUnits="objectBoundingBox"
					width="1"
					height="1"
				>
					<use xlinkHref="#image0" />
				</pattern>
				<image
					id="image0"
					xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA2CAYAAAB9TjFQAAAACXBIWXMAAAsSAAALEgHS3X78AAAA"
				/>
			</defs>
		</svg>
	);
};
export default Whipser;
