import { useState, useEffect } from "react";
import { useTranslation } from "../../hooks/useTranslation";

export const HEADER = () => {
  const { t, setLanguage, lang } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--white-color", "#ededed");
      root.style.setProperty("--black-color", "#111111");
      root.style.setProperty("--gray-color", "#1f1f1f");
    } else {
      root.style.setProperty("--white-color", "#111111");
      root.style.setProperty("--black-color", "#ededed");
      root.style.setProperty("--gray-color", "#d8d8d8ff");
    }

    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    localStorage.setItem("theme", theme);
    console.log("Language changed: ", lang)
  }, [theme, lang]);

  const handleSelectChange = (e) => {
    const value = e.target.value;

    if (value === "language") {
      setLanguage(lang === "en" ? "sl" : "en");
    }
    if (value === "theme") {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }

    e.target.value = "";
  };

  return (
    <div className="header-hero">
      {/* Back arrow */}
      <div className="img">
        <img src="/images/icons/arrow-left.png" alt="back" />
      </div>

      {/* Settings dropdown */}
      <div className="img settings-wrapper">
        <img src="/images/icons/settings.png" alt="settings" />
        <select defaultValue="" onChange={handleSelectChange}>
          <option value="" disabled>
            Settings
          </option>
          <option value="language">
            {lang === "en" ? "Switch to Slovenian" : "Switch to English"}
          </option>
          <option value="theme">
            {theme === "dark" ? "Light Theme" : "Dark Theme"}
          </option>
        </select>
      </div>
    </div>
  );
};

export default HEADER;
