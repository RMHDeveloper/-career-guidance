import React from 'react';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div className={`brutalist-box bg-white p-6 md:p-8 ${className || ''}`}>
      {children}
    </div>
  );
};

export default Box;
