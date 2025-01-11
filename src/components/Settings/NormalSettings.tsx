import { useTranslation } from "react-i18next";

export default function NormalSettings() {
  const { t } = useTranslation();
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      {t("normal_settings")}
    </div>
  );
}
