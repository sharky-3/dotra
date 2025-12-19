import { useState } from "react";

import { IMAGE_EDITOR } from "../assets/components/image.editor";
import HEADER  from "../assets/components/modules";
import { TEXT_HERO } from "../assets/components/text.module";
import { TEXT_DATABASE } from "../lang/translations";

export const MAIN = () => {
    const [language, setLanguage] = useState("en");

    return (
        <div className="main-page-hero">
            <HEADER language={language} setLanguage={setLanguage} />

            <TEXT_HERO 
                key={`hero-1-${language}`}
                title={TEXT_DATABASE().ArtStudio[language][1].title}
                text={TEXT_DATABASE().ArtStudio[language][1].text}
            />

            <IMAGE_EDITOR />

            <TEXT_HERO 
                key={`hero-2-${language}`}
                title={TEXT_DATABASE().ArtStudio[language][2].title}
                text={TEXT_DATABASE().ArtStudio[language][2].text}
            />

        </div>
    );
};
