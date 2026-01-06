// --- normal button module ---
export const NORMAL_BUTTON = ({text}) => {
    return <button className="normal-button-hero">{text}</button>
}

// --- icon button module ---
export const ICON_BUTTON = ({ icon, text, onClick }) => {
    return (
        <section className="icon-button-hero" onClick={onClick}>
            <img src={icon} alt={text} className="icon-image" />
            <button className="button">{text}</button>
        </section>
    );
}
