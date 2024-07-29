import React, { forwardRef } from 'react';

interface InputProps {
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    value: string | number;
    label: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, type = 'text', onChange, placeholder, value }, ref) => (
    <>
        <label>{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className='input'
            ref={ref}
        />
    </>
));

export default Input;
