// Sidebar.tsx
import { Link } from "react-router-dom";
import React from "react";
import { routes } from "../App";


const Sidebar: React.FC = () => {
  return (
    <div className="flex h-screen w-12 flex-col items-center space-y-8 border-r border-slate-300 bg-slate-50 py-8 dark:border-slate-700 dark:bg-slate-900 sm:w-16">
      {/* Navigation Links */}
      {routes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {route.icon}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
