export const Textarea = ({ label, name, error, ...props }) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700"
    >
      {label}
    </label>

    <div className="relative">
      <textarea
        id={name}
        name={name}
        rows={4}
        className={`block w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-500 
          focus:outline-none focus:ring-4 transition-all duration-300 sm:text-sm resize-none
          ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 hover:border-[#128c43] focus:border-[#16a34a] focus:ring-[#16a34a]/20'
          }`}
        {...props}
      />

      {error && (
        <div className="absolute top-3 right-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>

    {error && (
      <p className="text-sm text-red-600 flex items-center">
        <svg
          className="w-4 h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {error}
      </p>
    )}
  </div>
);
