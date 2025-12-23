import { useState, useRef, useEffect } from "react";
import { RANGE, OPTION } from "./controls";
import { ICON_BUTTON } from "./button.module";
import { TITLE_TEXT } from "./text.module";
import { TRANSLATION } from "../../lang/translations";

export const IMAGE_EDITOR = ({ language }) => {
    const t = TRANSLATION.getTranslation().Controls; 

    const [image, setImage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [dotSize, setDotSize] = useState(50);
    const [shape, setShape] = useState("square");
    const [colorMode, setColorMode] = useState("color");
    const [opacity, setOpacity] = useState(100);
    const [brightness, setBrightness] = useState(100);
    const [colorVibration, setColorVibration] = useState(0);
    const [dotSizeMode, setDotSizeMode] = useState("normal"); 
    const [spacing, setSpacing] = useState(0);

    const offscreenRef = useRef(null);
    const canvasRef = useRef(null);
    const imgRef = useRef(null);

    // --- upload image ---
    const uploadImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            imgRef.current = img;
            setImage(img.src);
        };
    };

    // --- draw image ---
    const drawImage = () => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

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

        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;
        ctx.translate(canvasCenterX, canvasCenterY);
        ctx.scale(zoom, zoom);
        ctx.translate(-canvasCenterX, -canvasCenterY);

        for (let y = 0; y < img.height; y += dotSize + spacing) {
            for (let x = 0; x < img.width; x += dotSize + spacing) {
                const index = (y * img.width + x) * 4;
                let r = pixels[index];
                let g = pixels[index + 1];
                let b = pixels[index + 2];

                if (colorMode === "bw") {
                    const gray = Math.round((r + g + b) / 3);
                    r = g = b = gray;
                }

                r = Math.min(255, r * (brightness / 100));
                g = Math.min(255, g * (brightness / 100));
                b = Math.min(255, b * (brightness / 100));

                if (colorVibration > 0) {
                    const vibrate = (value) => {
                        const shift = (Math.random() * 2 - 1) * colorVibration;
                        return Math.min(255, Math.max(0, value + shift));
                    };
                    r = vibrate(r);
                    g = vibrate(g);
                    b = vibrate(b);
                }

                let currentDotSize = dotSize;
                if (dotSizeMode === "random") currentDotSize = Math.random() * dotSize + 1;
                else if (dotSizeMode === "brightness") {
                    const gray = Math.round((r + g + b) / 3);
                    currentDotSize = (gray / 255) * dotSize;
                }

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.globalAlpha = opacity / 100;

                ctx.save();
                const centerX = x + currentDotSize / 2;
                const centerY = y + currentDotSize / 2;
                ctx.translate(centerX, centerY);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.translate(-centerX, -centerY);

                switch (shape) {
                    case "circle":
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, currentDotSize / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case "triangle":
                        ctx.beginPath();
                        ctx.moveTo(x + currentDotSize / 2, y);
                        ctx.lineTo(x + currentDotSize, y + currentDotSize);
                        ctx.lineTo(x, y + currentDotSize);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case "diamond":
                        ctx.beginPath();
                        ctx.moveTo(x + currentDotSize / 2, y);
                        ctx.lineTo(x + currentDotSize, y + currentDotSize / 2);
                        ctx.lineTo(x + currentDotSize / 2, y + currentDotSize);
                        ctx.lineTo(x, y + currentDotSize / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case "hexagon":
                        ctx.beginPath();
                        const a = currentDotSize / 2;
                        const h = Math.sqrt(3) * a / 2;
                        ctx.moveTo(x + a, y);
                        ctx.lineTo(x + currentDotSize, y + h);
                        ctx.lineTo(x + currentDotSize, y + h + a);
                        ctx.lineTo(x + a, y + currentDotSize);
                        ctx.lineTo(x, y + h + a);
                        ctx.lineTo(x, y + h);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case "star":
                        ctx.beginPath();
                        const spikes = 5;
                        const outerRadius = currentDotSize / 2;
                        const innerRadius = outerRadius / 2.5;
                        let rot = Math.PI / 2 * 3;
                        let step = Math.PI / spikes;
                        ctx.moveTo(centerX, centerY - outerRadius);
                        for (let i = 0; i < spikes; i++) {
                            ctx.lineTo(centerX + Math.cos(rot) * outerRadius, centerY + Math.sin(rot) * outerRadius);
                            rot += step;
                            ctx.lineTo(centerX + Math.cos(rot) * innerRadius, centerY + Math.sin(rot) * innerRadius);
                            rot += step;
                        }
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case "heart":
                        const s = currentDotSize;
                        ctx.beginPath();
                        ctx.moveTo(x + s / 2, y + s);
                        ctx.bezierCurveTo(x + s, y + s / 2, x + s, y, x + s / 2, y + s / 3);
                        ctx.bezierCurveTo(x, y, x, y + s / 2, x + s / 2, y + s);
                        ctx.fill();
                        break;
                    default:
                        ctx.fillRect(x, y, currentDotSize, currentDotSize);
                }
                ctx.restore();
            }
        }

        ctx.restore();
        ctx.globalAlpha = 1;
    };

    useEffect(() => {
        if (!image) return;
        drawImage();
    }, [image, zoom, rotation, dotSize, shape, colorMode, opacity, brightness, colorVibration, dotSizeMode, spacing, language]);

    const reset = () => {
        setZoom(1);
        setRotation(0);
        setDotSize(50);
        setShape("square");
        setColorMode("color");
        setOpacity(100);
        setBrightness(100);
        setColorVibration(0);
        setDotSizeMode("normal");
        setSpacing(0);
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = "edited-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const splitWords = (text) =>
        text.split(" ").map((word, i) => (
            <span
                className="word"
                key={`${word}-${i}-${text}`}
                style={{ "--i": i }}
                >{word}&nbsp;
            </span>
        )
    );

    return (
        <div className="image-editor-hero">
            <section className="upload-image">
                {!image && (
                    <div className="image">
                        <label className="upload-image-btn">
                            <img className="upload-icon" src="/images/icons/upload.png" alt="upload" />
                            <input type="file" accept="image/*" onChange={uploadImage} hidden />
                        </label>
                    </div>
                )}
                {image && <canvas ref={canvasRef} className="uploaded-image" />}
            </section>

            <section className="image-editor">
                <main className="top">
                    <nav className="left">
                        <TITLE_TEXT text={splitWords(t.shape)} />
                        <OPTION
                            list={[
                                { label: t.option.square, value: "square" },
                                { label: t.option.circle, value: "circle" },
                                { label: t.option.triangle, value: "triangle" },
                                { label: t.option.diamond, value: "diamond" },
                                { label: t.option.hexagon, value: "hexagon" },
                                { label: t.option.star, value: "star" },
                                { label: t.option.heart, value: "heart" },
                            ]}
                            value={shape}
                            onChange={setShape}
                        />
                        <OPTION
                            list={[
                                { label: t.option.normal, value: "normal" },
                                { label: t.option.random, value: "random" },
                                { label: t.option.brightness, value: "brightness" },
                            ]}
                            value={dotSizeMode}
                            onChange={setDotSizeMode}
                        />
                        <RANGE title={t.pixelSize} type="px" min_value={2} max_value={300} step={1} current_value={dotSize} onChange={setDotSize} />
                        <RANGE title={t.spacing} type="px" min_value={0} max_value={100} step={1} current_value={spacing} onChange={setSpacing} />
                    </nav>

                    <nav className="right">
                        <TITLE_TEXT text={splitWords(t.effects)} />
                        <OPTION list={[{ label: t.option.color, value: "color" }, { label: t.option.bw, value: "bw" }]} value={colorMode} onChange={setColorMode} />
                        <RANGE title={t.zoom} type="x" min_value={1} max_value={10} step={0.25} current_value={zoom} onChange={setZoom} />
                        <RANGE title={t.rotation} type="°" min_value={0} max_value={90} step={1} current_value={rotation} onChange={setRotation} />
                        <RANGE title={t.opacity} type="%" min_value={0} max_value={100} step={1} current_value={opacity} onChange={setOpacity} />
                        <RANGE title={t.brightness} type="%" min_value={0} max_value={200} step={1} current_value={brightness} onChange={setBrightness} />
                        <RANGE title={t.colorVibration} type="%" min_value={0} max_value={50} step={1} current_value={colorVibration} onChange={setColorVibration} />
                    </nav>
                </main>

                <footer className="bottom">
                    <ICON_BUTTON icon="/images/icons/reload.png" text={t.reset} onClick={reset} />
                    <ICON_BUTTON icon="/images/icons/download.png" text={t.download} onClick={downloadImage} />
                </footer>
            </section>
        </div>
    );
};
