const DEFAULT_LANG = "en";

export const TRANSLATION = (() => {
    let currentLang = localStorage.getItem("language") || DEFAULT_LANG;
    const listeners = new Set();

    // --- choose language ---
    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem("language", lang);
        listeners.forEach((callback) => callback(lang));
    };

    const subscribe = (callback) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
    };

    // --- return text transations
    const getTranslation = () => {
        const translations = {
            Controls: {
                sl: {
                    shape: "Oblika",
                    dotSizeMode: "Način velikosti pikslov",
                    pixelSize: "Velikost pikslov",
                    spacing: "Razmik",
                    effects: "Efekti",
                    colorMode: "Barvni način",
                    zoom: "Povečava",
                    rotation: "Rotacija",
                    opacity: "Prosojnost",
                    brightness: "Svetlost",
                    colorVibration: "Barvno vibriranje",
                    reset: "Ponastavi",
                    download: "Prenesi",
                    option: {
                        square: "Kvadrat",
                        circle: "Krog",
                        triangle: "Trikotnik",
                        diamond: "Diamant",
                        hexagon: "Šesterokotnik",
                        star: "Zvezda",
                        heart: "Srce",
                        normal: "Normalno",
                        random: "Naključna velikost",
                        brightness: "Skalirano s svetlostjo",
                        color: "Barva",
                        bw: "Monokrom"
                    }
                },
                en: {
                    shape: "Shape",
                    dotSizeMode: "Dot size mode",
                    pixelSize: "Pixel size",
                    spacing: "Spacing",
                    effects: "Effects",
                    colorMode: "Color mode",
                    zoom: "Zoom",
                    rotation: "Rotation",
                    opacity: "Opacity",
                    brightness: "Brightness",
                    colorVibration: "Color vibration",
                    reset: "Reset",
                    download: "Download",
                    option: {
                        square: "Square",
                        circle: "Circle",
                        triangle: "Triangle",
                        diamond: "Diamond",
                        hexagon: "Hexagon",
                        star: "Star",
                        heart: "Heart",
                        normal: "Normal",
                        random: "Random Size",
                        brightness: "Scale with Brightness",
                        color: "Color",
                        bw: "Monochrome"
                    }
                }
            },
            ArtStudio: {
                sl: {
                    1: {
                        title: "Dithering Playground",
                        text: "Naložite katerokoli sliko in opazujte, kako se vaša fotografija spremeni v osupljiv pikseliran vzorec. Igrajte se z različnimi velikostmi pikslov, oblikami, rotacijami in barvami ter ustvarite edinstveno vizualno umetnino, ki je popolnoma vaša."
                    },
                    2: {
                        title: "Bodite ustvarjalni",
                        text: "Preizkusite različne oblike, prosojnost, svetlost in barvne kombinacije, da ustvarite edinstvene učinke. Spreminjajte velikost pikslov, razmak med njimi ali način merjenja velikosti glede na svetlost, da dosežete popoln rezultat. Ko ste zadovoljni, prenesite svoje delo in ga delite s svetom."
                    },
                    3: {
                        left_title: "Oblike",
                        right_title: "Efekt"
                    }
                },
                en: {
                    1: {
                        title: "Dithering Playground",
                        text: "Upload any image and watch it transform into an amazing pixelated pattern. Play with different pixel sizes, shapes, rotations, and colors to create a unique artwork that is completely your own."
                    },
                    2: {
                        title: "Get Creative",
                        text: "Experiment with shapes, opacity, brightness, and color combinations to achieve unique effects. Adjust pixel size, spacing, or scale based on brightness to perfect your design. When finished, download your creation and share it with the world."
                    },
                    3: {
                        left_title: "Shape",
                        right_title: "Effects"
                    }
                }
            }
        };

        return {
            Controls: translations.Controls[currentLang],
            ArtStudio: translations.ArtStudio[currentLang]
        };
    };

    return { getTranslation, setLanguage, currentLang, subscribe };
})();
