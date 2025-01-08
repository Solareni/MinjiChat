// App.tsx
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Route, Routes, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { LogoIcon, NewConversationIcon, ConversationsIcon, DiscoverIcon, UserIcon, SettingsIcon } from "./components/SidebarItems";

const Logo = () => {
  return (
    <div className="text-base text-foreground">
      Welcome to the Home Page!
    </div>
  );
}

const NewConversation = () => {
  return (
    <div className="text-4xl font-bold text-white animate-fade-in">
      New Conversation
    </div>
  );
}

const Conversations = () => {
  return (
    <div className="text-4xl font-bold text-white animate-fade-in">
      Conversations
    </div>
  );
}

const Discover = () => {
  return (
    <div className="text-4xl font-bold text-white animate-fade-in">
      Discover
    </div>
  );
}

const User = () => {
  return (
    <div className="text-4xl font-bold text-white animate-fade-in">
      User
    </div>
  );
}

const Settings = () => {
  return (
    <div className="text-4xl font-bold text-white animate-fade-in">
      Settings
    </div>
  );
}
export const routes = [
  { path: "/logo", element: <Logo />, icon: <LogoIcon />, label: "logo" },
  { path: "/new_conversation", element: <NewConversation />, icon: <NewConversationIcon />, label: "new conversation" },
  { path: "/conversations", element: <Conversations />, icon: <ConversationsIcon />, label: "conversations" },
  { path: "/discover", element: <Discover />, icon: <DiscoverIcon />, label: "discover" },
  { path: "/user", element: <User />, icon: <UserIcon />, label: "user" },
  { path: "/settings", element: <Settings />, icon: <SettingsIcon />, label: "settings" },
];



const App: React.FC = () => {
  const getRoute = (route: { path: string; element: JSX.Element }) => (
    <Route key={route.path} path={route.path} element={route.element} />
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Routes>{routes.map(getRoute)}</Routes>
      </div>
    </div>
  );
};

export default App;
