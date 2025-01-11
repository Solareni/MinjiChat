import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function WhisperSettings() {
  const [computeMode, setComputeMode] = useState<string>("cpu");
  const [promptText, setPromptText] = useState<string>("");
  const [language, setLanguage] = useState<string>("zh");
  const { t } = useTranslation();

  const handleModelFileLoad = () => {
    console.log("handleModelFileLoad");
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">{t("whisper_settings")}</h1>
      <div className="flex flex-col justify-between mb-4">
        <div className="space-y-2">
          {/* 模型导入 */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium dark:text-white">{t("ffmpeg_load")}</h3>
            <div className="flex items-center gap-2">
              <input
                type="file"
                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100
                                    dark:file:bg-slate-700 dark:file:text-slate-200"
                onClick={handleModelFileLoad}
              />
            </div>
          </div>
          {/* 模型导入 */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium dark:text-white">{t("whisper_load")}</h3>
            <div className="flex items-center gap-2">
              <input
                type="file"
                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100
                                    dark:file:bg-slate-700 dark:file:text-slate-200"
                onClick={handleModelFileLoad}
              />
            </div>
          </div>
          <h3 className="text-lg font-medium dark:text-white">{t("compute_mode")}</h3>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="compute_mode"
                value="cpu"
                checked={computeMode === "cpu"}
                onChange={(e) => setComputeMode(e.target.value)}
                className="form-radio"
              />
              <span className="ml-2 dark:text-white">CPU</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                name="compute_mode"
                value="gpu"
                checked={computeMode === "gpu"}
                onChange={(e) => setComputeMode(e.target.value)}
                className="form-radio"
              />
              <span className="ml-2 dark:text-white">GPU</span>
            </label>
          </div>
        </div>

        {/* 语言选择 */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium dark:text-white">{t("language")}</h3>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="language"
                value="zh"
                checked={language === "zh"}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-radio"
              />
              <span className="ml-2 dark:text-white">中文</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === "en"}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-radio"
              />
              <span className="ml-2 dark:text-white">English</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium dark:text-white">{t("whisper_prompt")}</h3>
          <textarea
            className="w-full h-24 px-3 py-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 dark:bg-slate-700 dark:text-white dark:border-slate-600"
            placeholder={t("whisper_prompt_placeholder")}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
