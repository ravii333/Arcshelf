import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

function Navbar({ onMenuClick }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const logout = () => {
    localStorage.removeItem("profile");
    setUser(null);
    setAnchorEl(null);
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

  const navLinks = [
    { name: "Browse Papers", to: "/browse" },
    { name: "Upload", to: "/submit" },
    { name: "Colleges", to: "/manage/colleges" },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px !important" }}>
          {/* Left Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={onMenuClick}
              sx={{ color: "text.primary" }}
              aria-label="Open sidebar"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component={Link}
              to="/"
              variant="h5"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #0b1f17 0%, #15322d 50%, #128c43 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textDecoration: "none",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              ArcShelf
            </Typography>
          </Box>

          {/* Center Navigation - Hidden on mobile */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
            {navLinks.map((link) => (
              <Button
                key={link.name}
                component={Link}
                to={link.to}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: "transparent",
                  },
                }}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          {/* Right Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                <Button
                  component={Link}
                  to="/submit"
                  variant="contained"
                  startIcon={<FavoriteIcon />}
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    backgroundColor: "#16a34a",
                    "&:hover": {
                      backgroundColor: "#128c43",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Contribute
                </Button>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#16a34a",
                        fontSize: "0.875rem",
                      }}
                    >
                      {user.result.name.charAt(0).toUpperCase()}
                    </Avatar>
                    {!isMobile && (
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {user.result.name}
                      </Typography>
                    )}
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={logout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: "#dcfce7",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    backgroundColor: "#16a34a",
                    "&:hover": {
                      backgroundColor: "#128c43",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
