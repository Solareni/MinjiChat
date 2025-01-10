import { useTheme } from "./ThemeContext";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import { routeConfig } from "./router";

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={theme === "light" ? "" : "dark"}>
      <div className="flex min-h-screen bg-white dark:bg-background">
        <Sidebar routes={routeConfig.main} />

        {/* Main Content */}
        <div className="flex-1 p-4 dark:text-white text-black">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
