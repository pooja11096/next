import React from 'react'

interface ButtonProps{
    type?: 'button'|'submit'| 'reset';
    onClick?: () => void;
    children: React.ReactNode
}

const Button:React.FC<ButtonProps> = ({onClick, type='button', children}) => {
  return (
    <button type={type} onClick={onClick} className='btn'>
        {children}
    </button>
  )
}

export default Button