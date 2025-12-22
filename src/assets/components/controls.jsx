import { useState, useEffect } from "react";

export const RANGE = ({
  title,
  type,
  min_value,
  max_value,
  step,
  current_value,
  onChange
}) => {
    const [inputValue, setInputValue] = useState(String(current_value));
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

    useEffect(() => {
        setInputValue(String(current_value));
    }, [current_value]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        const num = Number(val);
        if (val === "" || isNaN(num)) return;
        onChange(num);
    };

    return (
        <div className="range-hero">
        <header>
            <div className="range-title">{splitWords(title)}</div>
            <input
                className="word"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
            />{type}
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
