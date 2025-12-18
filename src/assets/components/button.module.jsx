export const NORMAL_BUTTON = ({text}) => {
    return <button className="normal-button-hero">{text}</button>
}

export const ICON_BUTTON = ({ icon, text, onClick }) => {
    return (
        <div className="icon-button-hero" onClick={onClick}>
            <img src={icon} alt={text} className="icon-image" />
            <button className="button">{text}</button>
        </div>
    );
}
