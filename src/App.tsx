// App.tsx
import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useTheme } from "./ThemeContext";
import { routes, getRoute } from "./router";

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={theme === "light" ? "" : "dark"}>
      <div className="flex min-h-screen bg-white dark:bg-background">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 dark:text-white text-black">
          <Routes>{routes.map(getRoute)}</Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
