import React, { useState, useEffect } from 'react';
import { InputCustom as InputCustomProps } from '@/types/input';


const InputCustom = ({ type, value, name, id, placeholder, className, required, onChange }: InputCustomProps) => {
    const [inputValue, setInputValue] = useState(value || '');
    
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange?.(e);
    };

    return (
        <input 
            type={type}
            value={inputValue}
            onChange={handleOnChange}
            placeholder={placeholder}
            className={className}
            required={required}
            id={id}
            name={name}
        />
    );
}

export default InputCustom;