// --- title text module ---
export const TITLE_TEXT = ({text}) => {
    return <h1 className="title-hero word">{text}</h1>
}

// --- text hero module ---
export const TEXT_HERO = ({ title, text, children }) => {

    // --- split words ---
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
        <section className="text-hero">
            <div className="row title-row">
                <h1 className="title" id="text1" onChange={(e) => splitWords(title)}>{splitWords(title)}</h1>
            </div>

            <div className="row text-row">
                <label className="text">{splitWords(text)}</label>
            </div>

            {children && (
                <div className="row actions-row" id="text2">
                {children}
                </div>
            )}
        </section>
    );
};
