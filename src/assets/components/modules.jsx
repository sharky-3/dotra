import { useState, useEffect } from "react";

export const HEADER = () => {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark"); 

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
  }, [theme]);

  const handleSelectChange = (e) => {
    const { value } = e.target;

    if (value === "en" || value === "es") {
      setLanguage(value);
    } else if (value === "toggle-theme") {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "dark" ? "light" : "dark";
            document.body.classList.remove("light", "dark");
            document.body.classList.add(newTheme);
            return newTheme;
        });
    }
  };

  return (
    <div className="header-hero">
      <div className="img">
        <img src="/images/icons/arrow-left.png" alt="back" />
      </div>

      <div className="img settings-wrapper">
        <img src="/images/icons/settings.png" alt="settings" />

        <select onChange={handleSelectChange} value={language}>
          <option value="en">English</option>
          <option value="toggle-theme">
            {theme === "dark" ? "Light Theme" : "Dark Theme"}
          </option>
        </select>

      </div>
    </div>
  );
};
