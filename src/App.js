import { useState, useEffect } from "react";
import { MAIN } from "./page/main.page";
import { TranslationProvider } from "./hooks/useTranslation";
import "./assets/styles/root.css";

function App() {
  const [language, setLanguage] = useState(localStorage.getItem("language") ||  "en");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <TranslationProvider>
      <MAIN setLanguage={setLanguage} />
    </TranslationProvider>
  );
}

export default App;
