import React from 'react';
import clsx from 'clsx';

const base = 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-400';

const variants = {
  primary: 'text-white bg-primary-600 hover:bg-primary-700 shadow-sm',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm',
  danger: 'text-white bg-red-600 hover:bg-red-700 shadow-sm',
  glass: 'text-gray-700 bg-white border border-gray-200',
};

const GlowButton = ({ children, className = '', variant = 'primary', ...props }) => {
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default GlowButton;
