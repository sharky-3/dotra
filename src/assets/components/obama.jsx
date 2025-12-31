import { useState, useRef, useEffect } from "react";
import { RANGE, OPTION } from "./controls";
import { ICON_BUTTON } from "./button.module";
import { TITLE_TEXT } from "./text.module";
import { TRANSLATION } from "../../lang/translations";

export const OBAMA_EDITOR = ({ language }) => {
  const t = TRANSLATION.getTranslation().Controls;

  const [image, setImage] = useState(null);
  const [dotSize, setDotSize] = useState(20);
  const [shape, setShape] = useState("square");

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const targetRef = useRef(null);
  const animationRef = useRef(null);
  const pixelsRef = useRef([]);
  const convertedRef = useRef(false);

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      imgRef.current = img;
      setImage(img.src);
      convertedRef.current = false;
    };
  };

  useEffect(() => {
    const targetImg = new Image();
    targetImg.src = "/images/obama.jpeg";
    targetImg.onload = () => (targetRef.current = targetImg);
  }, []);

  const getGray = (r, g, b) => Math.round((r + g + b) / 3);

  const drawImage = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = imgRef.current.width;
    canvas.height = imgRef.current.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pixels = [];
    const offCanvas = document.createElement("canvas");
    offCanvas.width = imgRef.current.width;
    offCanvas.height = imgRef.current.height;
    const offCtx = offCanvas.getContext("2d");
    offCtx.drawImage(imgRef.current, 0, 0);
    const imgData = offCtx.getImageData(0, 0, imgRef.current.width, imgRef.current.height).data;

    for (let y = 0; y < imgRef.current.height; y += dotSize) {
      for (let x = 0; x < imgRef.current.width; x += dotSize) {
        const i = (y * imgRef.current.width + x) * 4;
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        pixels.push({ x, y, r, g, b, brightness: getGray(r, g, b), currentX: x, currentY: y });
      }
    }

    // If already converted, draw pixels at current positions
    if (convertedRef.current && pixelsRef.current.length) {
      pixelsRef.current.forEach((p) => drawPixel(ctx, p.currentX, p.currentY, p.r, p.g, p.b));
    } else {
      pixels.forEach((p) => drawPixel(ctx, p.x, p.y, p.r, p.g, p.b));
    }
  };

  const drawPixel = (ctx, x, y, r, g, b) => {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    const s = dotSize;
    ctx.beginPath();
    switch (shape) {
      case "circle":
        ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "triangle":
        ctx.moveTo(x + s / 2, y);
        ctx.lineTo(x + s, y + s);
        ctx.lineTo(x, y + s);
        ctx.closePath();
        ctx.fill();
        break;
      case "diamond":
        ctx.moveTo(x + s / 2, y);
        ctx.lineTo(x + s, y + s / 2);
        ctx.lineTo(x + s / 2, y + s);
        ctx.lineTo(x, y + s / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case "hexagon":
        const a = s / 2;
        const h = Math.sqrt(3) * a / 2;
        ctx.moveTo(x + a, y);
        ctx.lineTo(x + s, y + h);
        ctx.lineTo(x + s, y + h + a);
        ctx.lineTo(x + a, y + s);
        ctx.lineTo(x, y + h + a);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fill();
        break;
      case "star":
        const spikes = 5;
        const outer = s / 2;
        const inner = outer / 2.5;
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        ctx.moveTo(x + outer, y);
        for (let i = 0; i < spikes; i++) {
          ctx.lineTo(x + outer + Math.cos(rot) * outer, y + outer + Math.sin(rot) * outer);
          rot += step;
          ctx.lineTo(x + outer + Math.cos(rot) * inner, y + outer + Math.sin(rot) * inner);
          rot += step;
        }
        ctx.closePath();
        ctx.fill();
        break;
      case "heart":
        ctx.moveTo(x + s / 2, y + s);
        ctx.bezierCurveTo(x + s, y + s / 2, x + s, y, x + s / 2, y + s / 3);
        ctx.bezierCurveTo(x, y, x, y + s / 2, x + s / 2, y + s);
        ctx.fill();
        break;
      default:
        ctx.fillRect(x, y, s, s);
    }
  };

  useEffect(() => {
    if (image) drawImage();
  }, [image, dotSize, shape]);

  const convertToObama = () => {
    if (!imgRef.current || !targetRef.current) return;

    const w = imgRef.current.width;
    const h = imgRef.current.height;

    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = w;
    srcCanvas.height = h;
    const srcCtx = srcCanvas.getContext("2d");
    srcCtx.drawImage(imgRef.current, 0, 0);
    const srcData = srcCtx.getImageData(0, 0, w, h).data;

    const tgtCanvas = document.createElement("canvas");
    tgtCanvas.width = w;
    tgtCanvas.height = h;
    const tgtCtx = tgtCanvas.getContext("2d");
    tgtCtx.drawImage(targetRef.current, 0, 0, w, h);
    const tgtData = tgtCtx.getImageData(0, 0, w, h).data;

    const sourcePixels = [];
    const targetPixels = [];

    for (let y = 0; y < h; y += dotSize) {
      for (let x = 0; x < w; x += dotSize) {
        const i = (y * w + x) * 4;
        sourcePixels.push({
          x,
          y,
          r: srcData[i],
          g: srcData[i + 1],
          b: srcData[i + 2],
          brightness: getGray(srcData[i], srcData[i + 1], srcData[i + 2]),
          currentX: x,
          currentY: y,
        });
        targetPixels.push({
          x,
          y,
          brightness: getGray(tgtData[i], tgtData[i + 1], tgtData[i + 2]),
        });
      }
    }

    sourcePixels.sort((a, b) => a.brightness - b.brightness);
    targetPixels.sort((a, b) => a.brightness - b.brightness);

    pixelsRef.current = sourcePixels.map((p, idx) => ({
      ...p,
      targetX: targetPixels[idx].x,
      targetY: targetPixels[idx].y,
      speed: 0.02 + Math.random() * 0.05,
    }));

    convertedRef.current = true;
    animatePixels();
  };

  const animatePixels = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let finished = true;
      pixelsRef.current.forEach((p) => {
        const dx = p.targetX - p.currentX;
        const dy = p.targetY - p.currentY;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          finished = false;
          p.currentX += dx * p.speed;
          p.currentY += dy * p.speed;
        }
        drawPixel(ctx, p.currentX, p.currentY, p.r, p.g, p.b);
      });

      if (!finished) animationRef.current = requestAnimationFrame(step);
    };

    step();
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "obama-pixel.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const splitWords = (text) =>
    text.split(" ").map((word, i) => (
      <span className="word" key={`${word}-${i}-${text}`} style={{ "--i": i }}>
        {word}&nbsp;
      </span>
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
              onChange={(s) => {
                setShape(s);
                if (convertedRef.current) drawImage(); // redraw converted pixels with new shape
              }}
            />
            <RANGE
              title={t.pixelSize}
              type="px"
              min_value={2}
              max_value={50}
              step={1}
              current_value={dotSize}
              onChange={(s) => {
                setDotSize(s);
                if (convertedRef.current) drawImage(); // redraw converted pixels with new size
              }}
            />
          </nav>
        </main>

        <footer className="bottom">
          <ICON_BUTTON icon="/images/icons/reload.png" text={t.convert} onClick={convertToObama} />
          <ICON_BUTTON icon="/images/icons/download.png" text={t.download} onClick={downloadImage} />
        </footer>
      </section>
    </div>
  );
};
