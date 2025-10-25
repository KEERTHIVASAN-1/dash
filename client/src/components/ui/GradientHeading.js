import React from 'react';
import clsx from 'clsx';

const GradientHeading = ({ children, className = '' }) => (
  <h1
    className={clsx(
      'text-3xl md:text-4xl font-bold text-gray-900',
      className
    )}
  >
    {children}
  </h1>
);

export default GradientHeading;