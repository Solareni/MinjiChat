import { useTranslation } from "react-i18next";
import { useTheme } from "../../ThemeContext";

export default function NormalSettings() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">{t("normal_settings")}</h1>

      {/* 主题设置 */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-lg font-medium">{t("theme")}</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "light" | "dark")}
          className="px-4 py-2 rounded border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none dark:text-black w-48 text-left"
        >
          <option value="light">{t("light_theme")}</option>
          <option value="dark">{t("dark_theme")}</option>
        </select>
      </div>

      {/* 语言设置 */}
      <div className="flex items-center justify-between">
        <label className="text-lg font-medium">{t("language")}</label>
        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none dark:text-black w-48 text-left"
        >
          <option value="en">English</option>
          <option value="zh">简体中文</option>
          <option value="zh-Hant">繁體中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
        </select>
      </div>
    </div>
  );
}
