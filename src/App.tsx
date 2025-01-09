// App.tsx
import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { LogoIcon, NewConversationIcon, ConversationsIcon, DiscoverIcon, UserIcon, SettingsIcon, ThemeToggle } from "./components/SidebarItems";
import { useTheme } from "./ThemeContext";


const NewConversation = () => {
  const { theme } = useTheme();
  
  // Use a key to force re-render when theme changes
  return (
    <div
      key={theme}
      className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} animate-fade-in`}
    >
      New Conversation
    </div>
  );
}

const Conversations = () => {
  const { theme } = useTheme();
  
  // Use a key to force re-render when theme changes
  return (
    <div
      key={theme}
      className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} animate-fade-in`}
    >
      Conversations
    </div>
  );
}

const Discover = () => {
  const { theme } = useTheme();
  
  // Use a key to force re-render when theme changes
  return (
    <div
      key={theme}
      className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} animate-fade-in`}
    >
      Discover
    </div>
  );
}

const User = () => {
  const { theme } = useTheme();
  
  // Use a key to force re-render when theme changes
  return (
    <div
      key={theme}
      className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} animate-fade-in`}
    >
      User
    </div>
  );
}

const Settings = () => {
  const { theme } = useTheme();
  useEffect(() => {
    console.log(theme);
  }, [theme]);
  // Use a key to force re-render when theme changes
  return (
    <div
      key={theme}
      className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} animate-fade-in`}
    >
      Settings
    </div>
  );
};
export const routes = [
  { path: "/logo", element: <div />, icon: <LogoIcon />, label: "logo" },
  { path: "/new_conversation", element: <NewConversation />, icon: <NewConversationIcon />, label: "new conversation" },
  { path: "/conversations", element: <Conversations />, icon: <ConversationsIcon />, label: "conversations" },
  { path: "/discover", element: <Discover />, icon: <DiscoverIcon />, label: "discover" },
  { path: "/user", element: <User />, icon: <UserIcon />, label: "user" },
  { path: "/theme", element: <div />, icon: <ThemeToggle />, label: "theme" },
  { path: "/settings", element: <Settings />, icon: <SettingsIcon />, label: "settings" },
];

const getRoute = (route: { path: string; element: JSX.Element }) => (
  <Route key={route.path} path={route.path} element={route.element} />
);

const App: React.FC = () => {

  const { theme } = useTheme();

  return (
    <div className={`flex min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-background' }`}>
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 p-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <Routes>{routes.map(getRoute)}</Routes>
      </div>
    </div>
  );
};

export default App;
