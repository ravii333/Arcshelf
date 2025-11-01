import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Bars3Icon } from "@heroicons/react/24/outline";

function Navbar({ onMenuClick }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("profile");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    const currentUser = JSON.parse(localStorage.getItem("profile"));
    if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
      setUser(currentUser);
    }
  }, [location, user, navigate]);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <Link
              to="/"
              className="text-xl font-bold tracking-tight bg-gradient-to-br from-[#0b1f17] via-[#15322d] to-[#128c43] text-transparent bg-clip-text"
            >
              ArcShelf
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Contribute Button */}
                <Link
                  to="/submit"
                  className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-normal text-white bg-[#16a34a] rounded-sm shadow-lg hover:bg-[#128c43] hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Contribute
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {user.result.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block">{user.result.name}</span>
                    <svg
                      className="h-4 w-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-100">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="text-sm font-normal text-gray-600 hover:text-gray-900 px-3 py-2 rounded-sm hover:bg-[#dcfce7] transition-all duration-200"
                >
                  Login
                </Link>

                {/* Get Started Button */}
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-normal text-white bg-[#16a34a] rounded-sm shadow-lg hover:bg-[#128c43] hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
