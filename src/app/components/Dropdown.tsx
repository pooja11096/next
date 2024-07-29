import React from 'react'

interface DropdownProps{
    options: {value: string, label: string}[],
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string;
}
const Dropdown: React.FC<DropdownProps> = ({options,value,onChange}) => {
  return (
    <select value={value} onChange={onChange} className='dropdown'>
        {
            options.map(option=>(
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))
        }
    </select>
  )
}

export default Dropdown