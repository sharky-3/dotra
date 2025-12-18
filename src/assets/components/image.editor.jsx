import { useState, useRef, useEffect } from "react";

import { RANGE } from "./range-hero";
import { ICON_BUTTON } from "./button.module";

export const IMAGE_EDITOR = () => {
    const [image, setImage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [dotSize, setDotSize] = useState(10);
    const [shape, setShape] = useState("square");
    const offscreenRef = useRef(null);

    const canvasRef = useRef(null);
    const imgRef = useRef(null);

    const uploadImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            imgRef.current = img;
            setImage(img.src); // triggers canvas render
        };
    };

    const drawImage = () => {
        const canvas = canvasRef.current;
        const img = imgRef.current;

        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Setup offscreen canvas once
        if (!offscreenRef.current) {
            const off = document.createElement("canvas");
            off.width = img.width;
            off.height = img.height;
            off.getContext("2d").drawImage(img, 0, 0);
            offscreenRef.current = off;
        }

        const offCtx = offscreenRef.current.getContext("2d");
        const pixels = offCtx.getImageData(0, 0, img.width, img.height).data;

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        for (let y = 0; y < img.height; y += dotSize) {
            for (let x = 0; x < img.width; x += dotSize) {
                const index = (y * img.width + x) * 4;
                const r = pixels[index];
                const g = pixels[index + 1];
                const b = pixels[index + 2];

                ctx.fillStyle = `rgb(${r},${g},${b})`;

                if (shape === "circle") {
                    ctx.beginPath();
                    ctx.arc(
                        x + dotSize / 2,
                        y + dotSize / 2,
                        dotSize / 2,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                } else {
                    ctx.fillRect(x, y, dotSize, dotSize);
                }
            }
        }

        ctx.restore();
    };


    useEffect(() => {
        if (!image) return;
        drawImage();
    }, [image, zoom, rotation, dotSize, shape]);

    const reset = () => {
        setZoom(1);
        setRotation(0);
        setDotSize(10);
        setShape("square");
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = "edited-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div className="image-editor-hero">
            <div className="upload-image">
                {!image && (
                    <div className="upload-image">
                        <label className="upload-image-btn">
                            <img
                                className="upload-icon"
                                src="/images/icons/upload.png"
                                alt="upload"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={uploadImage}
                                hidden
                            />
                        </label>
                    </div>
                )}

                {image && (
                    <canvas
                        ref={canvasRef}
                        className="uploaded-image"
                    />
                )}
            </div>

            <div className="image-editor">
                <div className="top">
                    <div className="left">
                        <RANGE
                            title="Dot size"
                            min_value={2}
                            max_value={40}
                            current_value={dotSize}
                            onChange={setDotSize}
                        />
                        <RANGE
                            title="Zoom"
                            min_value={0.5}
                            max_value={3}
                            current_value={zoom}
                            onChange={setZoom}
                        />
                    </div>

                    <div className="right">
                        <RANGE
                            title="Rotation"
                            min_value={0}
                            max_value={360}
                            current_value={rotation}
                            onChange={setRotation}
                        />
                        <button
                            onClick={() =>
                                setShape(shape === "square" ? "circle" : "square")
                            }
                        >
                            Shape: {shape}
                        </button>
                    </div>
                </div>

                <div className="bottom">
                    <ICON_BUTTON
                        icon="/images/icons/reload.png"
                        text="Reset"
                        onClick={reset}
                    />
                    <ICON_BUTTON
                        icon="/images/icons/download.png"
                        text="Download"
                        onClick={downloadImage}
                    />
                </div>
            </div>
        </div>
    );
};
