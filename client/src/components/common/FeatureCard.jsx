import React from 'react';

const FeatureCard = ({
  icon,
  title,
  description,
  badgeText,
  iconBgColor,
  gradient,
}) => {
  return (
    <div className="group relative p-6 bg-white border border-gray-100 shadow-md rounded-2xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      {badgeText && (
        <span
          className={`absolute -top-3 right-4 px-3 py-1.5 text-xs font-semibold text-white rounded-full shadow-md bg-gradient-to-r ${
            gradient || 'from-[#16a34a] to-[#128c43]'
          }`}
        >
          {badgeText}
        </span>
      )}

      <div className="text-gray-900">
        {/* --- Icon --- */}
        <div
          className={`w-14 h-14 ${
            iconBgColor || 'bg-gradient-to-br from-green-50 to-emerald-100'
          } rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}
        >
          {icon}
        </div>

        {/* --- Title --- */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#128c43] transition-colors duration-300">
          {title}
        </h3>

        {/* --- Description --- */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>

        {/* --- Hover Accent Line --- */}
        <div
          className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${
            gradient || 'from-[#16a34a] to-[#128c43]'
          } rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        ></div>
      </div>
    </div>
  );
};

export default FeatureCard;
