import React from 'react';

const FeatureCard = ({ icon, title, description, badgeText, iconBgColor, gradient }) => {
  return (
    <div className="group relative p-8 bg-white border border-gray-100 shadow-lg rounded-3xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      {badgeText && (
        <span className={`absolute -top-4 right-6 px-4 py-2 bg-gradient-to-r ${gradient || 'from-blue-500 to-blue-600'} text-white text-sm font-bold rounded-full shadow-lg`}>
          {badgeText}
        </span>
      )}

      <div className="text-gray-900">
        <div className={`w-20 h-20 ${iconBgColor || 'bg-gradient-to-br from-gray-100 to-gray-200'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Decorative element */}
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${gradient || 'from-blue-500 to-blue-600'} rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </div>
    </div>
  );
};

export default FeatureCard;