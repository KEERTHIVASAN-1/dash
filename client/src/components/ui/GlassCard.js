import React from 'react';
import clsx from 'clsx';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white p-6 transition-all duration-200 border border-gray-200 rounded-xl shadow-sm hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;