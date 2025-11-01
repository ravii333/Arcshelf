import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col min-h-screen">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main content with modern spacing and background */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-fadeInUp">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;