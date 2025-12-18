import { useState } from "react";
import { TITLE_TEXT } from "./text.module";
import { NORMAL_BUTTON, ICON_BUTTON } from "./button.module";
import { RANGE } from "./range-hero";

export const IMAGE_EDITOR = () => {
    const [image, setImage] = useState(null);

    const uploadImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(URL.createObjectURL(file));
    };

    return (
        <div className="image-editor-hero">
            <div className="upload-image">
                {!image && (
                <div className="upload-image">
                    <label className="upload-image-btn">
                    <img className="upload-icon" src="/images/icons/upload.png" alt="upload" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={uploadImage}
                        hidden
                    />
                    </label>
                </div>
                )}

                {image && <img src={image} alt="preview" className="uploaded-image" />}
            </div>
            <div className="image-editor">
                <div className="top">
                    <div className="left">
                        <RANGE title={"Dot size"} min_value={0} max_value={100} current_value={10} />
                    </div>
                    <div className="right">
                        <RANGE title={"Dot size"} min_value={0} max_value={100} current_value={10} />
                    </div>
                </div>
                <div className="bottom">
                    <ICON_BUTTON icon={"/images/icons/reload.png"} text={"Reset"} />
                    <ICON_BUTTON icon={"/images/icons/download.png"} text={"Download"} />
                </div>
            </div>
        </div>
    );
}