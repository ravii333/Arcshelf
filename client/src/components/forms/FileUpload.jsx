import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export const FileUpload = ({ label, name, file, onChange, error, accept = ".pdf,.png,.jpg,.jpeg,.gif" }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <div className={`relative flex justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition-all duration-300 ${
      error 
        ? 'border-red-300 bg-red-50' 
        : file 
          ? 'border-green-300 bg-green-50' 
          : 'border-gray-300 bg-gray-50 hover:border-green-600 hover:bg-green-50'
    }`}>
      <div className="text-center">
        {file ? (
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" aria-hidden="true" />
        ) : (
          <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
        )}
        
        <div className="mt-6">
          <label
  htmlFor={name}
  className="relative cursor-pointer rounded-sm bg-[#029456] px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-[#027b48] focus:outline-none focus:ring-4 focus:ring-[#029456]/30 transition-all duration-300 transform hover:scale-105"
>
            <span>{file ? 'Change File' : 'Upload a file'}</span>
            <input 
              id={name} 
              name={name} 
              type="file" 
              className="sr-only" 
              onChange={onChange}
              accept={accept}
            />
          </label>
          <p className="mt-3 text-sm text-gray-600">
            or drag and drop
          </p>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          PDF, PNG, JPG, GIF up to 10MB
        </p>
        
        {file && (
          <div className="mt-4 p-3 bg-white rounded-lg shadow-sm border border-green-200">
            <p className="text-sm font-semibold text-green-700 flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Selected: {file.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-600 flex items-center justify-center mt-2">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  </div>
);
