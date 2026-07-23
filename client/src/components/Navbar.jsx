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
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import useScrollShadow from "../hooks/useScrollShadow";

const NavLinkButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'active' })(({ theme, active }) => ({
  color: active ? theme.palette.primary[700] : theme.palette.neutral[600],
  fontSize: '14px',
  fontWeight: 500,
  position: 'relative',
  padding: '6px 0',
  minWidth: 0,
  margin: '0 16px',
  borderRadius: 0,
  backgroundColor: 'transparent !important',
  '&:hover': {
    color: theme.palette.primary[700],
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    backgroundColor: theme.palette.primary[600],
    transform: active ? 'scaleX(1)' : 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
  }
}));

const LogoIcon = () => (
  <Box
    sx={{
      width: 28,
      height: 28,
      borderRadius: "8px",
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
      mr: 1.5,
      flexShrink: 0,
    }}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 22H6.5L12 9.5L17.5 22H22L12 2Z" fill="white" />
    </svg>
  </Box>
);

function Navbar({ onMenuClick }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const hasShadow = useScrollShadow(10);

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
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: hasShadow
          ? "0 4px 20px rgba(0, 0, 0, 0.08)"
          : "0 1px 0 rgba(0, 0, 0, 0.06)",
        transition: "box-shadow 250ms ease-in-out",
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: "56px !important", md: "64px !important" },
          }}
        >
          {/* Left Side: Brand Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={onMenuClick}
              sx={{
                color: "text.primary",
                mr: 1,
                display: { xs: "inline-flex", md: "inline-flex" }, // Show on all viewports to trigger Sidebar
              }}
              aria-label="Open sidebar"
            >
              <MenuIcon />
            </IconButton>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                transition: "opacity 150ms ease",
                "&:hover": { opacity: 0.8 },
              }}
            >
              <LogoIcon />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.01em",
                }}
              >
                ArcShelf
              </Typography>
            </Box>
          </Box>

          {/* Center Navigation - Hidden on mobile */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            {navLinks.map((link) => (
              <NavLinkButton
                key={link.name}
                component={Link}
                to={link.to}
                active={location.pathname === link.to}
              >
                {link.name}
              </NavLinkButton>
            ))}
          </Box>

          {/* Right Side: Auth / Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
            {user ? (
              <>
                <Button
                  component={Link}
                  to="/submit"
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    boxShadow: "none",
                    backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    "&:hover": {
                      backgroundImage: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
                      boxShadow: "var(--shadow-brand)",
                    },
                  }}
                >
                  Contribute
                </Button>

                <Box
                  onClick={handleMenuOpen}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: "9999px",
                    border: "1px solid",
                    borderColor: "neutral.200",
                    p: "4px 12px 4px 4px",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                    '&:hover': {
                      bgcolor: 'neutral.50',
                      borderColor: 'neutral.300',
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "primary.contrastText",
                      boxShadow: "0 2px 8px rgba(5, 150, 105, 0.15)",
                    }}
                  >
                    {user.result.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {!isMobile && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        userSelect: "none",
                      }}
                    >
                      {user.result.name.split(" ")[0]}
                    </Typography>
                  )}
                </Box>
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
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: '12px',
                      boxShadow: theme.shadows[4],
                      minWidth: 160,
                      border: "1px solid",
                      borderColor: "neutral.200",
                    }
                  }}
                >
                  <MenuItem disabled sx={{ opacity: "0.8 !important", borderBottom: "1px solid", borderColor: "neutral.150", pb: 1, mb: 0.5 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1.5, fontSize: "0.75rem", bgcolor: "primary.main" }}>
                      {user.result.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "neutral.800", lineHeight: 1.2 }}>{user.result.name}</Typography>
                      <Typography variant="caption" sx={{ color: "neutral.400", display: "block" }}>{user.result.email}</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem component={Link} to="/" onClick={handleMenuClose} sx={{ color: "neutral.700", py: 1 }}>
                    <DashboardIcon sx={{ mr: 1.5, fontSize: 20, color: "neutral.500" }} />
                    Dashboard
                  </MenuItem>
                  <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={{ color: "neutral.700", py: 1 }}>
                    <PersonOutlineIcon sx={{ mr: 1.5, fontSize: 20, color: "neutral.500" }} />
                    My Profile
                  </MenuItem>
                  {user.result?.role === "admin" && (
                    <MenuItem component={Link} to="/admin" onClick={handleMenuClose} sx={{ color: "neutral.700", py: 1 }}>
                      <ShieldOutlinedIcon sx={{ mr: 1.5, fontSize: 20, color: "primary.main" }} />
                      Moderation
                    </MenuItem>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={logout} sx={{ color: "error.main", py: 1 }}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{
                    color: "neutral.700",
                    '&:hover': {
                      bgcolor: 'neutral.100',
                    }
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    borderRadius: "10px",
                    height: 36,
                    px: 2,
                    bgcolor: "primary.600",
                    '&:hover': {
                      bgcolor: "primary.700",
                      boxShadow: "var(--shadow-brand)",
                    }
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
