import { createBrowserRouter } from "react-router-dom";
import Whisper from "./components/Whisper";
import Settings from "./components/Settings";
import Layout from "./Layout";
import WhisperSettings from "./components/Settings/WhisperSettings";
import AboutMe from "./components/Settings/AboutMe";
import NormalSettings from "./components/Settings/NormalSettings";
import { WhisperDetail } from "./components/WhisperDetail";
export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "whisper",
				children: [
					{ index: true, element: <Whisper /> },
					{ path: ":id", element: <WhisperDetail /> }, // 新增详情页
				],
			},
			{ path: "theme", element: <div /> },
			{
				path: "settings",
				element: <Settings />,
				children: [
					{ index: true, element: <NormalSettings /> },
					{
						path: "normal_settings",
						element: <NormalSettings />,
					},
					{
						path: "whisper_settings",
						element: <WhisperSettings />,
					},
					{
						path: "about_me",
						element: <AboutMe />,
					},
				],
			},
		],
	},
]);
