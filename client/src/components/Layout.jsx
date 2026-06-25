import { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>

        <Footer />
      </Box>
    </Box>
  );
}

export default Layout;