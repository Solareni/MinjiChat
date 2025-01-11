import { useParams } from "react-router-dom";
import { CaptionBackIcon, ActionIcon } from "./SidebarItems";
import { FixedSizeList as List } from 'react-window';
import { useState } from 'react';

// 生成随机字符串
const generateRandomString = (length: number) => {
  return Array.from({length}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('');
};

// 生成对话数据
const generateData = () => {
  return Array.from({length: 100}, (_, i) => ({
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    start: i * 10,
    end: (i + 1) * 10,
    content: generateRandomString(Math.floor(Math.random() * 1000)),
    speaker: i % 2 === 0 ? 'User' : 'AI'
  }));
};

const Row = ({ index, style, data }: any) => {
  const item = data[index];
  return (
    <div style={style} className="flex flex-col mb-4">
      <div className="flex items-center mb-1">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {item.speaker}
        </div>
        <div className="ml-2 text-xs text-gray-400 dark:text-gray-500">
          {item.start}s - {item.end}s
        </div>
      </div>
      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {item.content}
      </div>
    </div>
  );
};

export const WhisperDetail = () => {
  const { id } = useParams();
  const [data] = useState(generateData());
  
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
          height={600}
          itemCount={data.length}
          itemSize={100} // 每行高度
          width="100%"
          itemData={data}
        >
          {Row}
        </List>
      </div>
    </div>
  );
};