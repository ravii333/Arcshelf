import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/index.js";
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function Sidebar({ isOpen, setIsOpen }) {
  const [navStructure, setNavStructure] = useState({});
  const [openUniversities, setOpenUniversities] = useState({});

  useEffect(() => {
    const buildNavStructure = async () => {
      try {
        const { data } = await api.fetchQuestions();
        const structure = data.reduce((acc, q) => {
          const uniName = q.college?.university?.name;
          const collegeName = q.college?.name;
          if (uniName && collegeName) {
            if (!acc[uniName]) acc[uniName] = {};
            if (!acc[uniName][collegeName]) acc[uniName][collegeName] = new Set();
            acc[uniName][collegeName].add(q.course);
          }
          return acc;
        }, {});
        setNavStructure(structure);
      } catch (error) {
        console.error("Could not build nav structure", error);
      }
    };
    buildNavStructure();
  }, []);

  const toggleUniversity = (uniName) => {
    setOpenUniversities(prev => ({ ...prev, [uniName]: !prev[uniName] }));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-md border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200/50 h-20 flex items-center justify-between bg-gradient-to-r from-[#16a34a]/10 to-[#128c43]/10">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0b1f17] via-[#15322d] to-[#128c43] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#16a34a] to-[#128c43] bg-clip-text text-transparent">
              ArcShelf
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="p-6 overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Browse Papers
            </h3>

            <div className="space-y-2">
              {Object.keys(navStructure).map((uni) => (
                <div key={uni} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <button 
                    onClick={() => toggleUniversity(uni)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-[#16a34a]/10 hover:text-[#128c43] transition-all duration-200"
                  >
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-[#16a34a] rounded-full mr-3"></div>
                      {uni}
                    </span>
                    <ChevronRightIcon 
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        openUniversities[uni] ? "rotate-90 text-[#16a34a]" : ""
                      }`} 
                    />
                  </button>

                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openUniversities[uni] ? 'max-h-[1000px]' : 'max-h-0'
                    }`}
                  >
                    <div className="px-4 py-2 space-y-1 bg-white/50">
                      {Object.keys(navStructure[uni]).map((college) => (
                        <div key={college} className="py-2">
                          <div className="px-3 py-2 font-medium text-gray-700 text-sm bg-[#16a34a]/10 rounded-lg mb-2 border border-[#16a34a]/20">
                            {college}
                          </div>
                          <div className="pl-4 space-y-1">
                            {Array.from(navStructure[uni][college]).map((course) => (
                              <Link 
                                key={course}
                                to="#" 
                                onClick={() => setIsOpen(false)} 
                                className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-[#16a34a]/15 hover:text-[#128c43] transition-all duration-200"
                              >
                                {course}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
