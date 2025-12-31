import { useState, useRef, useEffect } from "react";
import { RANGE, OPTION } from "./controls";
import { ICON_BUTTON } from "./button.module";
import { TITLE_TEXT } from "./text.module";
import { TRANSLATION } from "../../lang/translations";

const luminance = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

export const OBAMA_EDITOR = ({ language }) => {
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
    const [animating, setAnimating] = useState(false);

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const obamaRef = useRef(null);
    const tilesRef = useRef([]);
    const rafRef = useRef(null);

    // Load Obama reference
    useEffect(() => {
        const img = new Image();
        img.src = "/images/obama.jpeg";
        img.crossOrigin = "anonymous";
        img.onload = () => (obamaRef.current = img);
    }, []);

    // Upload image
    const uploadImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            imgRef.current = img;
            setImage(img.src);
            setAnimating(false);
            setTimeout(() => setAnimating(true), 500);
        };
    };

    // Prepare tiles and draw initial image
    const prepareTiles = () => {
        const user = imgRef.current;
        const obama = obamaRef.current;
        const canvas = canvasRef.current;
        if (!user || !obama || !canvas) return;

        const ctx = canvas.getContext("2d");

        // Full screen canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const w = obama.width;
        const h = obama.height;

        const offsetX = (canvas.width - w * zoom) / 2;
        const offsetY = (canvas.height - h * zoom) / 2;

        // Offscreen canvases
        const uCan = document.createElement("canvas");
        const oCan = document.createElement("canvas");
        uCan.width = oCan.width = w;
        uCan.height = oCan.height = h;

        const uCtx = uCan.getContext("2d");
        const oCtx = oCan.getContext("2d");

        uCtx.drawImage(user, 0, 0, w, h);
        oCtx.drawImage(obama, 0, 0, w, h);

        const uPix = uCtx.getImageData(0, 0, w, h).data;
        const oPix = oCtx.getImageData(0, 0, w, h).data;

        const colors = [];
        const targets = [];

        // collect uploaded image pixels with effects
        for (let y = 0; y < h; y += dotSize + spacing) {
            for (let x = 0; x < w; x += dotSize + spacing) {
                const i = (y * w + x) * 4;
                let r = uPix[i];
                let g = uPix[i + 1];
                let b = uPix[i + 2];

                if (colorMode === "bw") {
                    const gray = Math.round((r + g + b) / 3);
                    r = g = b = gray;
                }

                r = Math.min(255, r * (brightness / 100));
                g = Math.min(255, g * (brightness / 100));
                b = Math.min(255, b * (brightness / 100));

                if (colorVibration > 0) {
                    const shift = (Math.random() * 2 - 1) * colorVibration;
                    r = Math.min(255, Math.max(0, r + shift));
                    g = Math.min(255, Math.max(0, g + shift));
                    b = Math.min(255, Math.max(0, b + shift));
                }

                colors.push({ r, g, b, x, y });
            }
        }

        // collect Obama target positions
        for (let y = 0; y < h; y += dotSize + spacing) {
            for (let x = 0; x < w; x += dotSize + spacing) {
                const i = (y * w + x) * 4;
                if (oPix[i + 3] < 40) continue;
                targets.push({ x, y });
            }
        }

        tilesRef.current = targets.map((t, i) => {
            const c = colors[i % colors.length];
            return { r: c.r, g: c.g, b: c.b, x: c.x, y: c.y, tx: t.x * zoom, ty: t.y * zoom };
        });

        drawInitial(ctx, offsetX, offsetY);
    };

    const drawInitial = (ctx, offsetX, offsetY) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        tilesRef.current.forEach(p => {
            ctx.save();
            const cx = p.x + offsetX + dotSize / 2;
            const cy = p.y + offsetY + dotSize / 2;
            ctx.translate(cx, cy);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-cx, -cy);

            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${opacity/100})`;
            ctx.fillRect(p.x + offsetX, p.y + offsetY, dotSize, dotSize);
            ctx.restore();
        });
    };

    const animatePixels = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let moving = false;
        const offsetX = (canvas.width - obamaRef.current.width * zoom) / 2;
        const offsetY = (canvas.height - obamaRef.current.height * zoom) / 2;

        tilesRef.current.forEach(p => {
            p.x += (p.tx - p.x) * 0.08;
            p.y += (p.ty - p.y) * 0.08;

            if (Math.abs(p.x - p.tx) > 0.5 || Math.abs(p.y - p.ty) > 0.5) moving = true;

            ctx.save();
            const cx = p.x + offsetX + dotSize / 2;
            const cy = p.y + offsetY + dotSize / 2;
            ctx.translate(cx, cy);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-cx, -cy);

            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${opacity / 100})`;
            switch (shape) {
                case "circle":
                    ctx.beginPath();
                    ctx.arc(cx, cy, dotSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                default:
                    ctx.fillRect(p.x + offsetX, p.y + offsetY, dotSize, dotSize);
            }
            ctx.restore();
        });

        if (moving) rafRef.current = requestAnimationFrame(animatePixels);
    };

    useEffect(() => {
        if (!image) return;
        prepareTiles();
    }, [image, dotSize, spacing, colorMode, brightness, colorVibration, rotation, shape, opacity, zoom]);

    useEffect(() => {
        if (!animating) return;
        cancelAnimationFrame(rafRef.current);
        animatePixels();
    }, [animating]);

    const reset = () => {
        setImage(null);
        setAnimating(false);
        tilesRef.current = [];
    };

    const downloadImage = () => {
        const link = document.createElement("a");
        link.download = "obama-pixel-animation.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    const splitWords = (text) => text.split(" ").map((word, i) => (
        <span className="word" key={`${word}-${i}-${text}`} style={{ "--i": i }}>{word}&nbsp;</span>
    ));

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
                        <OPTION list={[{ label: t.option.square, value: "square" }, { label: t.option.circle, value: "circle" }, { label: t.option.triangle, value: "triangle" }, { label: t.option.diamond, value: "diamond" }, { label: t.option.hexagon, value: "hexagon" }, { label: t.option.star, value: "star" }, { label: t.option.heart, value: "heart" }]} value={shape} onChange={setShape} />
                        <OPTION list={[{ label: t.option.normal, value: "normal" }, { label: t.option.random, value: "random" }, { label: t.option.brightness, value: "brightness" }]} value={dotSizeMode} onChange={setDotSizeMode} />
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