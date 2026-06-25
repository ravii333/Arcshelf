import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as api from "../api/index.js";
import {
  SwipeableDrawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Avatar,
  Divider,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";

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
    }}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 22H6.5L12 9.5L17.5 22H22L12 2Z" fill="white" />
    </svg>
  </Box>
);

function Sidebar({ isOpen, setIsOpen }) {
  const [navStructure, setNavStructure] = useState({});
  const [openUniversities, setOpenUniversities] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = JSON.parse(localStorage.getItem("profile"));

  const logout = () => {
    localStorage.removeItem("profile");
    setIsOpen(false);
    navigate("/");
    window.dispatchEvent(new Event("storage"));
  };

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
    setOpenUniversities((prev) => ({ ...prev, [uniName]: !prev[uniName] }));
  };

  const isNavEmpty = Object.keys(navStructure).length === 0;

  // Helper to parse search params for active states
  const queryParams = new URLSearchParams(location.search);
  const activeCourse = queryParams.get("course") || "";

  return (
    <SwipeableDrawer
      anchor="left"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      disableDiscovery={true}
      disableBackdropTransition={!isMobile}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        zIndex: 1200,
        "& .MuiDrawer-paper": {
          width: 320,
          borderRight: "1px solid",
          borderColor: "neutral.200",
          boxShadow: "none",
          bgcolor: "neutral.0",
        },
        "& .MuiBackdrop-root": {
          bgcolor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            height: { xs: 56, md: 64 },
            p: "0 24px",
            borderBottom: "1px solid",
            borderColor: "neutral.200",
            background: "linear-gradient(135deg, rgba(5,150,105,0.06) 0%, rgba(4,120,87,0.03) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            component={Link}
            to="/"
            onClick={() => setIsOpen(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <LogoIcon />
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700,
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.01em",
              }}
            >
              ArcShelf
            </Typography>
          </Box>
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{ color: "neutral.500" }}
            aria-label="Close sidebar"
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Navigation Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {user && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                border: "1px solid",
                borderColor: "neutral.200",
                borderRadius: 3.5,
                bgcolor: "neutral.50",
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "primary.main",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "primary.contrastText",
                  boxShadow: "0 2px 8px rgba(5, 150, 105, 0.15)",
                }}
              >
                {user.result.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "neutral.800",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.result.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "neutral.400",
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.result.email}
                </Typography>
              </Box>
            </Paper>
          )}

          {/* Browse Papers Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <MenuBookIcon sx={{ color: "primary.main", fontSize: 18 }} />
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                color: "neutral.500",
                letterSpacing: "0.1em",
              }}
            >
              Browse Papers
            </Typography>
          </Box>

          {/* Navigation Tree */}
          {isNavEmpty ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                py: 4,
                px: 2,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.4, marginBottom: 12 }}>
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 11H7V9H17V11ZM17 15H7V13H17V15Z" fill="#059669" />
              </svg>
              <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                No papers yet — be the first to contribute!
              </Typography>
            </Box>
          ) : (
            <List disablePadding sx={{ mb: 4 }}>
              {Object.keys(navStructure).map((uni) => {
                const isExpanded = openUniversities[uni];
                return (
                  <Paper
                    key={uni}
                    elevation={0}
                    sx={{
                      mb: 1.5,
                      border: "1px solid",
                      borderColor: "neutral.200",
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "neutral.50",
                    }}
                  >
                    <ListItemButton
                      onClick={() => toggleUniversity(uni)}
                      sx={{
                        p: "10px 16px",
                        bgcolor: "neutral.0",
                        "&:hover": {
                          bgcolor: "primary.50",
                        },
                      }}
                    >
                      {isExpanded ? (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            mr: 1.5,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            border: "1.5px solid",
                            borderColor: "neutral.400",
                            mr: 1.5,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <ListItemText
                        primary={uni}
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "neutral.800",
                          noWrap: true,
                        }}
                      />
                      {isExpanded ? (
                        <ExpandLessIcon sx={{ color: "primary.main", fontSize: 18 }} />
                      ) : (
                        <ExpandMoreIcon sx={{ color: "neutral.400", fontSize: 18 }} />
                      )}
                    </ListItemButton>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ bgcolor: "neutral.0", pl: 2, pr: 2, pb: 1.5, pt: 1 }}>
                        {Object.keys(navStructure[uni]).map((college) => (
                          <Box key={college} sx={{ mt: 1.5 }}>
                            <Chip
                              label={college}
                              size="small"
                              sx={{
                                bgcolor: "rgba(5, 150, 105, 0.08)",
                                color: "primary.800",
                                border: "1px solid rgba(5, 150, 105, 0.2)",
                                mb: 1,
                                height: 22,
                                fontWeight: 600,
                                fontSize: "0.718rem",
                                maxWidth: "100%",
                                "& .MuiChip-label": {
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }
                              }}
                            />
                            <List disablePadding sx={{ pl: 1.5 }}>
                              {Array.from(navStructure[uni][college]).map((course) => {
                                const isActive = activeCourse === course;
                                return (
                                  <ListItem key={course} disablePadding sx={{ mb: 0.5 }}>
                                    <ListItemButton
                                      component={Link}
                                      to={`/browse?course=${encodeURIComponent(course)}`}
                                      onClick={() => setIsOpen(false)}
                                      sx={{
                                        borderRadius: 1,
                                        p: "4px 10px",
                                        borderLeft: isActive ? "3px solid" : "3px solid transparent",
                                        borderColor: "primary.600",
                                        bgcolor: isActive ? "primary.50" : "transparent",
                                        color: isActive ? "primary.700" : "neutral.700",
                                        transition: "all 200ms var(--ease-out-quint)",
                                        "&:hover": {
                                          bgcolor: "primary.50",
                                          color: "primary.700",
                                          transform: "translateX(2px)",
                                        },
                                      }}
                                    >
                                      <ListItemText
                                        primary={course}
                                        primaryTypographyProps={{
                                          fontSize: "0.8125rem",
                                          fontWeight: isActive ? 600 : 500,
                                        }}
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </Paper>
                );
              })}
            </List>
          )}

          <Divider sx={{ my: 3, borderColor: "neutral.200" }} />

          {/* Quick Links */}
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              color: "neutral.500",
              letterSpacing: "0.1em",
              display: "block",
              mb: 2,
            }}
          >
            Quick Links
          </Typography>

          <List disablePadding>
            {user && (
              <>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    to="/"
                    onClick={() => setIsOpen(false)}
                    sx={{
                      borderRadius: 1.5,
                      p: "8px 12px",
                      color: "neutral.700",
                      transition: "all 150ms ease",
                      "&:hover": {
                        bgcolor: "primary.50",
                        color: "primary.700",
                      },
                    }}
                  >
                    <DashboardIcon sx={{ mr: 2, fontSize: 18, color: "primary.600" }} />
                    <ListItemText
                      primary="My Dashboard"
                      primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    sx={{
                      borderRadius: 1.5,
                      p: "8px 12px",
                      color: "neutral.700",
                      transition: "all 150ms ease",
                      "&:hover": {
                        bgcolor: "primary.50",
                        color: "primary.700",
                      },
                    }}
                  >
                    <PersonOutlineIcon sx={{ mr: 2, fontSize: 18, color: "primary.600" }} />
                    <ListItemText
                      primary="My Profile"
                      primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to="/submit"
                onClick={() => setIsOpen(false)}
                sx={{
                  borderRadius: 1.5,
                  p: "8px 12px",
                  color: "neutral.700",
                  transition: "all 150ms ease",
                  "&:hover": {
                    bgcolor: "primary.50",
                    color: "primary.700",
                  },
                }}
              >
                <AddCircleOutlineIcon sx={{ mr: 2, fontSize: 18, color: "primary.600" }} />
                <ListItemText
                  primary="Upload a Paper"
                  primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to="/browse"
                onClick={() => setIsOpen(false)}
                sx={{
                  borderRadius: 1.5,
                  p: "8px 12px",
                  color: "neutral.700",
                  transition: "all 150ms ease",
                  "&:hover": {
                    bgcolor: "primary.50",
                    color: "primary.700",
                  },
                }}
              >
                <SearchIcon sx={{ mr: 2, fontSize: 18, color: "primary.600" }} />
                <ListItemText
                  primary="Browse All"
                  primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to="/manage/colleges"
                onClick={() => setIsOpen(false)}
                sx={{
                  borderRadius: 1.5,
                  p: "8px 12px",
                  color: "neutral.700",
                  transition: "all 150ms ease",
                  "&:hover": {
                    bgcolor: "primary.50",
                    color: "primary.700",
                  },
                }}
              >
                <SchoolIcon sx={{ mr: 2, fontSize: 18, color: "primary.600" }} />
                <ListItemText
                  primary="Manage Colleges"
                  primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>

            {user && (
              <ListItem disablePadding sx={{ mb: 0.5, mt: 1 }}>
                <ListItemButton
                  onClick={logout}
                  sx={{
                    borderRadius: 1.5,
                    p: "8px 12px",
                    color: "error.main",
                    transition: "all 150ms ease",
                    "&:hover": {
                      bgcolor: "#fef2f2",
                      color: "error.dark",
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 2, fontSize: 18, color: "error.main" }} />
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 600 }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}

export default Sidebar;
