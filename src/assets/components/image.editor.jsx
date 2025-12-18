import { useState } from "react";
import { TITLE_TEXT } from "./text.module";

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
                
            </div>
        </div>
    );
}