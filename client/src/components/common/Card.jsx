// client/src/components/common/Card.jsx
import React from 'react';

const Card = ({ children, className, hover = true, ...props }) => {
  // Base styles with a subtle green accent for ArcShelf theme
  const baseClasses = `
    bg-white border border-gray-200 rounded-2xl shadow-lg transition-all duration-300
    ${hover ? 'hover:shadow-[0_6px_20px_rgba(22,163,74,0.15)] hover:-translate-y-1 hover:border-[#16a34a]/60' : ''}
  `;

  return (
    <div className={`${baseClasses} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
