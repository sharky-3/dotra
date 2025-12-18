import { IMAGE_EDITOR } from "../assets/components/image.editor";
import { TITLE_TEXT } from "../assets/components/text.module";

export const MAIN = ({}) => {
    return (
        <div className="main-page-hero">
            <div className="text-hero">
                <TITLE_TEXT text={"Dithering Shader Playground"} />
                <label>I've been playing around with dithering shaders for the last couple days. I built this playground to help me quickly try out different shapes and values.</label>
            </div>
            <IMAGE_EDITOR />
        </div>
    );
}