import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, icon, className, ...props }) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={props.id} className="text-gray-800 font-semibold mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`brutalist-input bg-gray-50 text-black p-4 text-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${icon ? 'pl-12' : ''} ${className || ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
