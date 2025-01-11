import { useTranslation } from "react-i18next";

export default function AboutMe() {
  const { t } = useTranslation();
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      {t("about_me")}
    </div>
  );
}
