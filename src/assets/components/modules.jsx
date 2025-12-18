import { useState } from "react";

export const HEADER = () => {
    const [language, setLanguage] = useState("en");
    const [theme, setTheme] = useState("light");

    const handleSelectChange = (e) => {
        const value = e.target.value;

        if (value === "en" || value === "sl") {
            setLanguage(value);
        } else if (value === "light" || value === "dark") {
            setTheme(value);

            const root = document.documentElement;
            if (value === "light") {
                root.style.setProperty("--white-color", "#ededed");
                root.style.setProperty("--black-color", "#111111");
            } else {
                root.style.setProperty("--white-color", "#111111");
                root.style.setProperty("--black-color", "#ededed");
            }
        }
    };

    return (
        <div className="header-hero">
            {/* Back arrow */}
            <div className="img">
                <img src="/images/icons/arrow-left.png" alt="back" />
            </div>

            {/* Settings */}
            <div className="img settings-wrapper">
                <img src="/images/icons/settings.png" alt="settings" />
                <select onChange={handleSelectChange} defaultValue="">
                    <option value="" disabled hidden></option>
                    {/* Language options */}
                    <option value="en">English</option>
                    <option value="sl">Slovenian</option>
                    {/* Theme options */}
                    <option value="light">Dark Theme</option>
                    <option value="dark">Light Theme</option>
                </select>
            </div>

            <style jsx>{`
                .settings-wrapper {
                    position: relative;
                    display: inline-block;
                }

                .settings-wrapper select {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0; /* hide text, only clickable */
                    cursor: pointer;
                }

                .settings-wrapper img {
                    display: block;
                }
            `}</style>
        </div>
    );
};
