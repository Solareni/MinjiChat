import { useTheme } from "./ThemeContext";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
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

export type RouteConfig = {
  path: string;
  icon: JSX.Element;
  label: string;
};

const routes: RouteConfig[] = [
  { path: "/logo", icon: <LogoIcon />, label: "logo" },
  { path: "/new_conversation", icon: <NewConversationIcon />, label: "new conversation" },
  { path: "/conversations", icon: <ConversationsIcon />, label: "conversations" },
  { path: "/discover", icon: <DiscoverIcon />, label: "discover" },
  { path: "/audio", icon: <AudioIcon />, label: "audio" },
  { path: "/user", icon: <UserIcon />, label: "user" },
  { path: "/theme", icon: <ThemeToggle />, label: "theme" },
  { path: "/settings", icon: <SettingsIcon />, label: "settings" },
];

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={theme === "light" ? "" : "dark"}>
      <div className="flex min-h-screen bg-white dark:bg-background">
        <Sidebar routes={routes} />

        {/* Main Content */}
        <div className="flex-1 p-4 dark:text-white text-black">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
