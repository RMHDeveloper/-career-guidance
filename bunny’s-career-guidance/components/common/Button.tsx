import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  const baseClasses = "brutalist-button font-bold uppercase text-lg px-8 py-4 cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75 ease-out";
  const variantClasses = {
    primary: "bg-neon-green text-black hover:bg-[#2eff00]", // Slightly brighter on hover
    secondary: "bg-electric-yellow text-black hover:bg-[#edff00]", // Slightly brighter on hover
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
