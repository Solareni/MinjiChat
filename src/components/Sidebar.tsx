// Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
  WhisperIcon,
  ConversationsIcon,
  DiscoverIcon,
  LogoIcon,
  NewConversationIcon,
  SettingsIcon,
  ThemeToggle,
  UserIcon,
} from "./SvgIcons";
import { router } from "../router";

const getIcon = (path: string) => {
  switch (path) {
    case "logo":
      return <LogoIcon />;
    case "new_conversation":
      return <NewConversationIcon />;
    case "conversations":
      return <ConversationsIcon />;
    case "discover":
      return <DiscoverIcon />;
    case "whisper":
      return <WhisperIcon />;
    case "user":
      return <UserIcon />;
    case "theme":
      return <ThemeToggle />;
    case "settings":
      return <SettingsIcon />;
    default:
      return <LogoIcon />;
  }
};

const splitArray = <T,>(arr: T[], condition: (item: T) => boolean): [T[], T[]] => {
  return arr.reduce<[T[], T[]]>(
    ([pass, fail], item) => {
      condition(item) ? pass.push(item) : fail.push(item);
      return [pass, fail];
    },
    [[], []]
  );
};
const Sidebar = () => {
  
  const [sidebars, bottom] = splitArray(router.routes[0].children || [], (route) => 
    route.path !== "theme" && route.path !== "settings"
  );

  const renderRoutes = (routes: any[]) => {
    return routes.map((route) => {
      const path = route.path!;
      return (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `w-8 h-8 flex items-center justify-center rounded-full transition-colors mb-8 ${
              isActive
                ? "bg-gray-200/50 dark:bg-gray-700/50"
                : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
            }`
          }
        >
          {getIcon(path)}
        </NavLink>
      );
    });
  };
  return (
    <div className="flex h-screen w-12 flex-col items-center bg-background border-r border-border p-2 sm:w-16">
      {sidebars && renderRoutes(sidebars)}
      <div className="mt-auto">{bottom && renderRoutes(bottom)}</div>
    </div>
  );
};

export default Sidebar;
