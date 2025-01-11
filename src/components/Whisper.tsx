import { FixedSizeList } from "react-window";
import { ActionIcon, ContentIcon } from "./SidebarItems";
const Whispser = () => {
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
export default Whispser;
