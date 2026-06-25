import { useState } from "react";
import { Box, Container } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #c8e6c9 100%)',
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
            py: { xs: 3, md: 4 },
          }}
        >
          <Container maxWidth="xl">
            {children}
          </Container>
        </Box>

        <Footer />
      </Box>
    </Box>
  );
}

export default Layout;