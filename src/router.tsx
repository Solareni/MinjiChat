import { createHashRouter, RouteObject } from "react-router-dom";
import Audio from "./components/Audio";
import Settings from "./components/Settings";
import App from "./App";
import {
  LogoIcon,
  NewConversationIcon,
  ConversationsIcon,
  DiscoverIcon,
  UserIcon,
  SettingsIcon,
  ThemeToggle,
  AudioIcon,
} from "./components/SidebarItems";

const NewConversation = () => {
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      New Conversation
    </div>
  );
};

const Conversations = () => {
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      Conversations
    </div>
  );
};

const Discover = () => {
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      Discover
    </div>
  );
};

const User = () => {
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      User
    </div>
  );
};

// 扩展路由配置对象
export const routeConfig = {
  main: [
    { path: "/logo", icon: <LogoIcon />, label: "logo" },
    { path: "/new_conversation", icon: <NewConversationIcon />, label: "new conversation" },
    { path: "/conversations", icon: <ConversationsIcon />, label: "conversations" },
    { path: "/discover", icon: <DiscoverIcon />, label: "discover" },
    { path: "/audio", icon: <AudioIcon />, label: "audio" },
    { path: "/user", icon: <UserIcon />, label: "user" },
    { path: "/theme", icon: <ThemeToggle />, label: "theme" },
    { path: "/settings", icon: <SettingsIcon />, label: "settings" }
  ],
  settings: [
    {
      path: "audio",
      label: "音频设置",
      element: <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">音频设置</div>
    },
    {
      path: "about", 
      label: "关于我们",
      element: <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">关于我们</div>
    }
  ]
};

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/logo", element: <div /> },
      { path: "/new_conversation", element: <NewConversation /> },
      { path: "/conversations", element: <Conversations /> },
      { path: "/discover", element: <Discover /> },
      { path: "/audio", element: <Audio /> },
      { path: "/user", element: <User /> },
      { path: "/theme", element: <div /> },
      {
        path: "/settings/*",
        element: <Settings />,
        children: routeConfig.settings.map(({path, element}) => ({path, element}))
      },
    ]
  }
]);
