import { useTheme } from "./ThemeContext";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={theme === "light" ? "" : "dark"}>
      <div className="flex min-h-screen bg-white dark:bg-background">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 dark:text-white text-black">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
