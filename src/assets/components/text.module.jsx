export const TITLE_TEXT = ({text}) => {
    return <h1 className="title-hero">{text}</h1>
}

export const TEXT_HERO = ({ title, text, children }) => {

    const splitWords = (text) =>
        text.split(" ").map((word, i) => (
            <span
                className="word"
                key={i}
                style={{ "--i": i }}
            >{word}&nbsp;</span>
    ));

    return (
        <div className="text-hero">
        <div className="row title-row">
            <h1 className="title">{splitWords(title)}</h1>
        </div>

        <div className="row text-row">
            <label className="text">{splitWords(text)}</label>
        </div>

        {children && (
            <div className="row actions-row">
            {children}
            </div>
        )}
        </div>
    );
};
