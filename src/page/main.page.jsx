import { useState, useEffect, useRef } from "react";
import HEADER from "../assets/components/modules";
import { IMAGE_EDITOR } from "../assets/components/image.editor";
import { TEXT_HERO } from "../assets/components/text.module";
import { TRANSLATION } from "../lang/translations";

export const MAIN = ({language, setLanguage}) => {
  const t = TRANSLATION.getTranslation(language).ArtStudio;

  return (
    <div className="main-page-hero">
      <HEADER language={language} setLanguage={setLanguage} />

      <TEXT_HERO key="hero-1" title={t[1].title} text={t[1].text} />
      <IMAGE_EDITOR language={language} />
      <TEXT_HERO key="hero-2" title={t[2].title} text={t[2].text} />
    </div>
  );
};
