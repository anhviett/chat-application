import React, { useState, useEffect } from "react";
import { InputCustom as InputCustomProps } from "@/types/input";

const InputCustom = ({
  type,
  value,
  name,
  id,
  placeholder,
  className,
  required,
  disabled,
  onChange,
  onKeyDown,
}: InputCustomProps) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(e);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
  };

  return (
    <input
      id={id}
      name={name}
      type={type}
      value={inputValue}
      placeholder={placeholder}
      className={className}
      required={required}
      disabled={disabled}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
    />
  );
};

export default InputCustom;
