
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8 min-h-[200px] flex flex-col justify-center items-center text-center ${className}`}
    >
      {children}
    </div>
  );
};
