import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import { SearchIcon, BookOpenIcon, UploadIcon, UsersIcon } from '../components/common/Icons';
import Card from "../components/common/Card";
import ContributionCard from "../components/common/ContributionCard";
import FeatureCard from "../components/common/FeatureCard";

// --- Section 1: The Hero Section ---
const HeroSection = () => (
  <section className="relative text-center pt-16 md:pt-24 pb-20">
    {/* Background decoration */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
    </div>
    
    <div className="relative z-10">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
        <span className="gradient-text">Unlock Your</span>
        <br />
        <span className="text-gray-900">Exam Success</span>
      </h1>
      <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed">
        ArcShelf is a collaborative, open-source archive of previous years' university exam papers. 
        <span className="font-semibold text-gray-800"> Search, prepare, and contribute</span> to help students excel.
      </p>
      
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          </div>
          <input
            type="search"
            placeholder="Search for a subject, course, or college..."
            className="w-full py-5 pl-16 pr-6 text-sm bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-green-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-[#029456] text-white font-normal rounded-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Search
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500 flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Or, browse the full archive in the sidebar
        </p>
      </div>
    </div>
  </section>
);

// --- Section 2: How It Works ---
const HowItWorksSection = () => {
  const features = [
    {
      icon: <BookOpenIcon className="w-10 h-10 text-blue-600" />,
      title: "Prepare & Practice",
      description: "Browse a vast collection of papers to understand exam patterns, important topics, and question styles for your specific course.",
      badgeText: "Step 1",
      iconBgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <UploadIcon className="w-10 h-10 text-green-600" />,
      title: "Contribute & Collaborate",
      description: "Have a paper we're missing? Upload it in seconds and become a part of a community helping thousands of fellow students.",
      badgeText: "Step 2",
      iconBgColor: "bg-gradient-to-br from-green-100 to-green-200",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: <UsersIcon className="w-10 h-10 text-purple-600" />,
      title: "Community Powered",
      description: "ArcShelf is built by students, for students. The more we all contribute, the more powerful this resource becomes.",
      badgeText: "Step 3",
      iconBgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            A Simple, Powerful Tool for Students
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prepare for your exams and help others do the same. Join thousands of students building the future of education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                {/* Badge */}
                <div className={`absolute -top-4 right-6 px-4 py-2 bg-gradient-to-r ${feature.gradient} text-white text-sm font-bold rounded-full shadow-lg`}>
                  {feature.badgeText}
                </div>
                
                {/* Icon */}
                <div className={`w-20 h-20 ${feature.iconBgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



// --- Section 3: Recent Contributions (UPDATED WITH CARDS) ---
const RecentContributionsSection = ({ questions, loading }) => (
  <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Latest Uploads
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See what your peers have been sharing and discover new study materials.
        </p>
      </div>
      
      <div className="mt-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-4 text-lg text-gray-600">Loading recent papers...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl shadow-lg border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No papers yet</h3>
            <p className="text-gray-600 mb-8">Be the first to contribute and help build this amazing resource!</p>
            <Link to="/submit" className="btn-modern">
              Upload First Paper
            </Link>
          </div>
        ) : (
          <div className="relative">
            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
                {questions.map((q) => (
                  <div key={q._id} className="flex-shrink-0 w-80">
                    <ContributionCard question={q} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
            </div>
            
            {/* Scroll Hint */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Scroll horizontally to see more papers
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </p>
            </div>
          </div>
        )}
        
        {questions.length > 0 && (
          <div className="text-center mt-16">
            <Link 
              to="/submit" 
              className="inline-flex items-center px-8 py-4 bg-[#029456] text-white font-medium text-lg rounded-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Have a paper? Contribute now
            </Link>
          </div>
        )}
      </div>
    </div>
  </section>
);

// --- Main HomePage Component ---
function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecentQuestions = async () => {
      try {
        console.log("Fetching questions...");
        const { data } = await api.fetchQuestions();
        console.log("Questions fetched:", data);
        // Slice the array to only show the 5 most recent
        setQuestions(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching questions:", error);
        console.error("Error details:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    getRecentQuestions();
  }, []);

  // We no longer need the top-level loading check here,
  // as each section will handle its own loading state if needed.
  return (
    // The parent div is now a simple container. Spacing is handled by each section.
    <div>
      <HeroSection />
      <HowItWorksSection />
      <RecentContributionsSection questions={questions} loading={loading} />
    </div>
  );
}

export default HomePage;