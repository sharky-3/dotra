export const RANGE = ({
    title,
    min_value,
    max_value, 
    current_value
}) => {
    return (
        <div className="range-hero">
            <header>
                <div className="range-title">{title}</div>
                <div id="range-value">0.0</div>
            </header>
            <input type="range" id="range" min={min_value} max={max_value} value={current_value} />
        </div>
    );
}