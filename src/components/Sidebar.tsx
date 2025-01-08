// Sidebar.tsx
import { Link } from "react-router-dom";
import { routes } from "../App";

const Sidebar: React.FC = () => {
  const navItems = routes.map((route) => ({
    path: route.path,
    label: route.label,
  }));

  return (
    <div className="w-64 bg-white/20 backdrop-blur-md p-6 shadow-lg">
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="block text-white hover:text-purple-200 transition-colors duration-300"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
