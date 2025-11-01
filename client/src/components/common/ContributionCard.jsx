// client/src/components/common/ContributionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline'; // Let's use a nice icon

const ContributionCard = ({ question }) => {
  // A placeholder image. Later, we can generate these dynamically or have defaults.
  const placeholderImageUrl = `https://picsum.photos/seed/${question._id}/400/300`;

  return (
    <Link to={`/questions/${question._id}`} className="block group">
      <div className="w-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden h-full flex flex-col">
        
        {/* --- Image Section with Hover Effect --- */}
        <div className="relative overflow-hidden h-48">
          <img
            src={placeholderImageUrl}
            alt={`Visual for ${question.subject}`}
            className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Floating badges */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-800 rounded-full shadow-lg">
            {question.year}
          </div>
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg">
              {question.course}
            </span>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {question.subject}
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
            {question.college?.name}, {question.college?.university?.name}
          </p>

          {/* --- Footer Section of the Card --- */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">
                {question.examType}
              </span>
            </div>
            
            <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
              <span className="text-sm font-semibold mr-2">View</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContributionCard;