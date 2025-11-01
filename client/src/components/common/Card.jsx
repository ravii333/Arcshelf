// client/src/components/common/Card.jsx
import React from 'react';

const Card = ({ children, className, hover = true, ...props }) => {
  // Define the base styles for every card with modern design
  const baseClasses = `
    bg-white border border-gray-200 rounded-2xl shadow-lg transition-all duration-300
    ${hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''}
  `;

  return (
    <div className={`${baseClasses} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default Card;