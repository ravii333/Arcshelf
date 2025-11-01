// client/src/components/common/ContributionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ContributionCard = ({ question }) => {
  const placeholderImageUrl = `https://picsum.photos/seed/${question._id}/400/250`;

  return (
    <Link
      to={`/questions/${question._id}`}
      className="block group"
    >
      <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 overflow-hidden h-full flex flex-col mt-2">
        
        {/* --- Image Section --- */}
        <div className="relative overflow-hidden h-40">
          <img
            src={placeholderImageUrl}
            alt={`Visual for ${question.subject}`}
            className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Year Badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-800 rounded-full shadow">
            {question.year}
          </div>

          {/* Course Tag */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-br from-[#0b1f17] via-[#15322d] to-[#128c43] text-white rounded-full shadow">
              {question.course}
            </span>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#128c43] transition-colors duration-300 line-clamp-2">
            {question.subject}
          </h2>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {question.college?.name}, {question.college?.university?.name}
          </p>

          {/* --- Footer Section --- */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-[#16a34a] rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">
                {question.examType}
              </span>
            </div>

            <div className="flex items-center text-[#16a34a] group-hover:text-[#128c43] transition-colors duration-300">
              <span className="text-xs font-semibold mr-1">View</span>
              <svg
                className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
