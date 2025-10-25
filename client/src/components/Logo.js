import React, { useState } from 'react';

const Logo = ({ className = 'h-12 w-auto', alt = 'E-GROOTS Logo' }) => {
  const [src, setSrc] = useState('/egroots-logo.jpg');

  const handleError = () => {
    if (src !== '/egroots-logo.svg') {
      setSrc('/egroots-logo.svg');
    }
  };

  return (
    <img
      src={src}
      onError={handleError}
      alt={alt}
      className={className}
    />
  );
};

export default Logo;