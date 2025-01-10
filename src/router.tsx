import { RouteObject } from "react-router-dom";
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
import Audio from "./components/Audio";
import Settings from "./components/Settings";

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

export type RouteConfig = RouteObject & {
  icon?: JSX.Element;
  label?: string;
};

export const routes: RouteConfig[] = [
  { path: "/logo", element: <div />, icon: <LogoIcon />, label: "logo" },
  {
    path: "/new_conversation",
    element: <NewConversation />,
    icon: <NewConversationIcon />,
    label: "new conversation",
  },
  {
    path: "/conversations",
    element: <Conversations />,
    icon: <ConversationsIcon />,
    label: "conversations",
  },
  {
    path: "/discover",
    element: <Discover />,
    icon: <DiscoverIcon />,
    label: "discover",
  },
  {
    path: "/audio",
    element: <Audio />,
    icon: <AudioIcon />,
    label: "audio",
  },
  { path: "/user", element: <User />, icon: <UserIcon />, label: "user" },
  { path: "/theme", element: <div />, icon: <ThemeToggle />, label: "theme" },
  {
    path: "/settings/*",
    element: <Settings />,
    icon: <SettingsIcon />,
    label: "settings",
    children: [
      {
        path: "audio",
        element: <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">音频设置</div>,
        label: "音频设置"
      } as RouteConfig,
      {
        path: "about",
        element: <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">关于我们</div>,
        label: "关于我们"
      } as RouteConfig
    ]
  },
];
