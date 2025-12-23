    import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { TRANSLATION } from "../lang/translations";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
    const [lang, setLang] = useState(TRANSLATION.currentLang);
    const [translations, setTranslations] = useState(TRANSLATION.getTranslation());

    useEffect(() => {
        const unsubscribe = TRANSLATION.subscribe((newLang) => {
            setLang(newLang);
            setTranslations(TRANSLATION.getTranslation(newLang));
        });
        return unsubscribe;
    }, [lang]);

    const t = useCallback((key) => translations[key] || key, [translations]);

    return (
        <TranslationContext.Provider value={{ t, lang, setLanguage: TRANSLATION.setLanguage }}>
            {children}
        </TranslationContext.Provider>
    );
};
export const useTranslation = () => useContext(TranslationContext);
