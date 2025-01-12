// 生成随机字符串
const generateRandomString = (length: number) => {
	return Array.from({ length }, () =>
		String.fromCharCode(Math.floor(Math.random() * 26) + 97)
	).join("");
};
export const whisperData = Array.from({ length: 100 }, (_, i) => ({
	id: i + 1,
	fileName: `文件名 ${i + 1}`,
	duration: "00:30",
	createdAt: "2023-10-01",
}));
export const searchResults = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    fileName: `搜索结果 ${i + 1}`,
    duration: "00:30",
    createdAt: "2023-10-01",
    transcriptSnippets: Array.from({ length: 4 }, () => {
        const snippetLength = Math.floor(Math.random() * 500) + 200; // 生成50-250长度的随机数
        return generateRandomString(snippetLength);
    }),
}));


// 生成对话数据
export const generateData = () => {
	return Array.from({ length: 100 }, (_, i) => ({
		timestamp: new Date(Date.now() - i * 60000).toISOString(),
		start: i * 10,
		end: (i + 1) * 10,
		content: generateRandomString(Math.floor(Math.random() * 1000)),
		speaker: i % 2 === 0 ? "User" : "AI",
	}));
};