import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={props.id} className="text-neon-green font-bold uppercase mb-2">
          {label}
        </label>
      )}
      <input
        className={`brutalist-input bg-white text-black p-4 text-lg w-full focus:outline-none focus:ring-0 ${className || ''}`}
        {...props}
      />
    </div>
  );
};

export default Input;
