import { Routes, Route, Link, useLocation, Outlet } from "react-router-dom";

const settingsRoutes =  [
  {
    path: "audio",
    label: "音频设置",
    element: <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">音频设置</div>
  },
  {
    path: "about", 
    label: "关于我们",
    element: <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">关于我们</div>
  }
];
const Settings = () => {
  const location = useLocation();

  return (
    <div className="flex h-full">
      {/* 左侧导航栏 */}
      <div className="w-1/4 p-4 border-r border-gray-200 dark:border-gray-700">
        <nav className="space-y-2">
          {settingsRoutes.map((route) => (
            route.path && (
              <Link
                key={route.path}
                to={`/settings/${route.path}`}
                className={`block px-4 py-2 rounded-lg ${
                  location.pathname.endsWith(route.path)
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {route.label}
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 p-4">
       <Outlet />
      </div>
    </div>
  );
};

export default Settings;