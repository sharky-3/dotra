export const RANGE = ({
    title,
    type,
    min_value,
    max_value,
    step,
    current_value,
    onChange
}) => {
    return (
        <div className="range-hero">
            <header>
                <div className="range-title">{title}</div>
                <div id="range-value">{current_value} {type}</div>
            </header>

            <input
                type="range"
                min={min_value}
                max={max_value}
                value={current_value}
                step={step}
                style={{
                    "--progress": `${((current_value - min_value) / (max_value - min_value)) * 100}%`
                }}
                onChange={(e) => onChange(Number(e.target.value))}
            />

        </div>
    );
};

export const OPTION = ({ list, value, onChange }) => {
    return (
        <div className="option-hero">
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                {list.map((item, index) => (
                    <option
                        key={index}
                        value={item.value ? item.value : item}
                    >
                        {item.label ? item.label : item}
                    </option>
                ))}
            </select>
        </div>
    );
};
