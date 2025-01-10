// Sidebar.tsx
import { NavLink } from "react-router-dom";
import React from "react";
import { AudioIcon, ConversationsIcon, DiscoverIcon, LogoIcon, NewConversationIcon, SettingsIcon, ThemeToggle, UserIcon } from "./SidebarItems";


const routes = [
  {
    path: "/logo",
    icon: <LogoIcon />,
    label: "logo",
  },
  {
    path: "/new_conversation",
    icon: <NewConversationIcon />,
    label: "new conversation",
  },
  {
    path: "/conversations",
    icon: <ConversationsIcon />,
    label: "conversations",
  },
  {
    path: "/discover",
    icon: <DiscoverIcon />,
    label: "discover",
  },
  {
    path: "/audio",
    icon: <AudioIcon />,
    label: "audio",
  },
  {
    path: "/user",
    icon: <UserIcon />,
    label: "user",
  },
  {
    path: "/theme",
    icon: <ThemeToggle />,
    label: "theme",
  },
  {
    path: "/settings",
    icon: <SettingsIcon />,
    label: "settings"
  }
]

const Sidebar = () => {
  return (
    <div className="flex h-screen w-12 flex-col items-center bg-background border-r border-border p-2 sm:w-16">
      {/* Navigation Links */}
      {routes
        // .filter((route) => !["logo", "theme"].includes(route.label))
        .map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              `w-8 h-8 flex items-center justify-center rounded-full transition-colors mb-8 ${
                isActive
                  ? "bg-gray-200/50 dark:bg-gray-700/50"
                  : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              }`
            }
          >
            {route.icon}
          </NavLink>
        ))}
    </div>
  );
};

export default Sidebar;
