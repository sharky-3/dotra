import { IMAGE_EDITOR } from "../assets/components/image.editor";
import { HEADER } from "../assets/components/modules";
import { TITLE_TEXT, TEXT_HERO } from "../assets/components/text.module";

export const MAIN = ({}) => {
    return (
        <div className="main-page-hero">
            <HEADER />

            <TEXT_HERO 
                title={"Dithering Playground"}
                text={"Upload any image and experiment with pixel shapes, sizes, colors, and rotations. Watch your image transform into stunning, stylized patterns in real-time."}
            />

            <IMAGE_EDITOR />

            <TEXT_HERO 
                title={"Get Creative"}
                text={"Try different shapes, opacity, and brightness settings to create unique effects. Once satisfied, download your artwork and share it with the world. Reach me at jakub@kbo.sk for questions, or check out my other projects on Twitter and my newsletter."}
            />
        </div>
    );
}
