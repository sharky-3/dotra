import { IMAGE_EDITOR } from "../assets/components/image.editor";
import { TITLE_TEXT, TEXT_HERO } from "../assets/components/text.module";

export const MAIN = ({}) => {
    return (
        <div className="main-page-hero">
            <TEXT_HERO 
                title={"Dithering Shader Playground"}
                text={"I've been playing around with dithering shaders for the last couple days. I built this playground to help me quickly try out different shapes and values."}
            />

            <IMAGE_EDITOR />

            <TEXT_HERO 
                title={"More"}
                text={"In case you have any questions reach me at jakub@kbo.sk, see more of my work on Twitter or subscribe to my newsletter."}
            />
        </div>
    );
}