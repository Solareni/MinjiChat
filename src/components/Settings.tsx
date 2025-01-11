import { Link, useLocation, Outlet } from "react-router-dom";
import { router } from "../router";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const settingsRoutes = router.routes[0].children?.filter((route) =>
    route.path?.startsWith("settings")
  )?.[0].children;
  return (
    <div className="flex h-full">
      {/* 左侧导航栏 */}
      <div className="w-1/4 p-4 border-r border-gray-200 dark:border-gray-700">
        <nav className="space-y-2">
          {settingsRoutes &&
            settingsRoutes.map(
              (route) =>
                route.path && (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`block px-4 py-2 rounded-lg ${
                      location.pathname.endsWith(route.path)
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t(route.path)}
                  </Link>
                )
            )}
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
