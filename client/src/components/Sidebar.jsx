import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/index.js";
import {
  Drawer,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import FolderIcon from "@mui/icons-material/Folder";

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
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 320,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(18, 140, 67, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            component={Link}
            to="/"
            onClick={() => setIsOpen(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #0b1f17 0%, #15322d 50%, #128c43 100%)',
                fontWeight: 700,
              }}
            >
              A
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #16a34a 0%, #128c43 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ArcShelf
            </Typography>
          </Box>
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{ color: 'text.secondary' }}
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MenuBookIcon sx={{ color: '#16a34a', fontSize: 20 }} />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: 1,
                }}
              >
                Browse Papers
              </Typography>
            </Box>

            <List sx={{ p: 0 }}>
              {Object.keys(navStructure).map((uni) => (
                <Paper
                  key={uni}
                  elevation={0}
                  sx={{
                    mb: 1,
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <ListItemButton
                    onClick={() => toggleUniversity(uni)}
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(22, 163, 74, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#16a34a',
                        mr: 1.5,
                      }}
                    />
                    <ListItemText
                      primary={uni}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    />
                    {openUniversities[uni] ? (
                      <ExpandLessIcon sx={{ color: '#16a34a' }} />
                    ) : (
                      <ExpandMoreIcon sx={{ color: 'text.secondary' }} />
                    )}
                  </ListItemButton>

                  <Collapse in={openUniversities[uni]} timeout="auto" unmountOnExit>
                    <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)', pl: 2, pr: 2, pb: 1 }}>
                      {Object.keys(navStructure[uni]).map((college) => (
                        <Box key={college} sx={{ py: 1 }}>
                          <Chip
                            label={college}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(22, 163, 74, 0.1)',
                              color: 'text.primary',
                              border: '1px solid rgba(22, 163, 74, 0.2)',
                              mb: 1,
                              fontSize: '0.75rem',
                            }}
                          />
                          <List sx={{ pl: 2, py: 0 }}>
                            {Array.from(navStructure[uni][college]).map((course) => (
                              <ListItem key={course} disablePadding>
                                <ListItemButton
                                  component={Link}
                                  to={`/browse?course=${encodeURIComponent(course)}`}
                                  onClick={() => setIsOpen(false)}
                                  sx={{
                                    borderRadius: 1,
                                    '&:hover': {
                                      bgcolor: 'rgba(22, 163, 74, 0.15)',
                                      color: '#128c43',
                                    },
                                  }}
                                >
                                  <ListItemText
                                    primary={course}
                                    primaryTypographyProps={{
                                      fontSize: '0.875rem',
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Paper>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
