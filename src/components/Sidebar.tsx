// Sidebar.tsx
import { Link } from "react-router-dom";
import React from "react";
import { routes } from "../App";
import { useTheme } from "../ThemeContext";
import { ThemeToggle } from "./SidebarItems";

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className="flex h-screen w-12 flex-col items-center bg-background border-r border-border p-2 sm:w-16">
      {/* Navigation Links */}
      {routes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
        >
          {route.icon}
        </Link>
      ))}
      
      {/* Theme Toggle at Bottom */}
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
