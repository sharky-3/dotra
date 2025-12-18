export const TITLE_TEXT = ({text}) => {
    return <h1 className="title-hero">{text}</h1>
}

export const TEXT_HERO = ({title, text}) => {
    return (
        <div className="text-hero">
            <h1 className="title">{title}</h1>
            <label className="text">{text}</label>
        </div>
    );
}