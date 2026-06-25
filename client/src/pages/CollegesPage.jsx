import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import PlaceIcon from '@mui/icons-material/Place';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as api from '../api';
import EmptyState from '../components/common/EmptyState';

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', slug: '', location: '', university: '' });
  const [universities, setUniversities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [uniResponse, colResponse] = await Promise.all([
          api.fetchUniversities(),
          api.fetchColleges()
        ]);
        setUniversities(uniResponse.data);
        setColleges(colResponse.data);
      } catch (err) {
        setError('Could not load page data.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData({ ...formData, name: value, slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.university) {
      setError('Please select a university.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const { data: newCollege } = await api.createCollege(formData);
      setColleges((prev) => [...prev, newCollege].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData({ name: '', slug: '', location: '', university: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add college.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group colleges by university name
  const groupedColleges = universities.reduce((acc, uni) => {
    const uniColleges = colleges.filter(col => col.university?._id === uni._id || col.university === uni._id);
    acc[uni._id] = {
      universityName: uni.name,
      colleges: uniColleges
    };
    return acc;
  }, {});

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 }, py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            color: "neutral.900",
            mb: 0.5,
          }}
        >
          Manage Colleges
        </Typography>
        <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
          Add colleges and assign them to a parent university.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* --- Left Column: Add Form --- */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: "28px",
              border: "1px solid",
              borderColor: "neutral.200",
              borderRadius: 5,
              bgcolor: "neutral.0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.50" }}>
                <SchoolIcon sx={{ color: "primary.700", fontSize: 20 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800" }}>
                Add New College
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormControl fullWidth required>
                <InputLabel id="parent-university-select-label">Parent University</InputLabel>
                <Select
                  labelId="parent-university-select-label"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  label="Parent University"
                >
                  <MenuItem value="" disabled>-- Select University --</MenuItem>
                  {universities.map((uni) => (
                    <MenuItem key={uni._id} value={uni._id}>
                      {uni.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="College Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., School of Engineering"
                required
                fullWidth
              />

              <TextField
                label="URL Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g., soe-stanford"
                required
                fullWidth
                helperText="Auto-generated from name"
              />

              <TextField
                label="Location (Optional)"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Stanford, CA"
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} sx={{ color: "white" }} /> : <AddIcon />}
                sx={{
                  height: 44,
                  backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  "&:hover": {
                    backgroundImage: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
                    boxShadow: "var(--shadow-brand)",
                  },
                }}
              >
                {isSubmitting ? 'Adding...' : 'Add College'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* --- Right Column: Grouped List Accordions --- */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800", mb: 0.5 }}>
              Existing Colleges grouped by University
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: "primary.main" }} />
              </Box>
            ) : colleges.length === 0 ? (
              <EmptyState
                icon={<SchoolIcon />}
                title="No colleges added yet"
                description="Use the form on the left to add the first college."
              />
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {Object.keys(groupedColleges).map((uniId) => {
                  const group = groupedColleges[uniId];
                  if (group.colleges.length === 0) return null;

                  return (
                    <Accordion
                      key={uniId}
                      elevation={0}
                      defaultExpanded
                      sx={{
                        border: "1px solid",
                        borderColor: "neutral.200",
                        borderRadius: "16px !important",
                        overflow: "hidden",
                        bgcolor: "neutral.0",
                        mb: 1,
                        "&::before": { display: "none" }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                        sx={{
                          bgcolor: "neutral.50",
                          borderBottom: "1px solid",
                          borderColor: "neutral.200",
                          px: 2.5,
                          py: 0.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: "neutral.800" }}>
                            {group.universityName}
                          </Typography>
                          <Chip
                            label={`${group.colleges.length} college${group.colleges.length !== 1 ? "s" : ""}`}
                            size="small"
                            sx={{
                              bgcolor: "rgba(5, 150, 105, 0.08)",
                              color: "primary.800",
                              fontWeight: 700,
                              fontSize: "11px",
                              height: 20
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 2.5 }}>
                        <Grid container spacing={2}>
                          {group.colleges.map((college) => (
                            <Grid item xs={12} sm={6} key={college._id}>
                              <Card
                                elevation={0}
                                sx={{
                                  border: "1px solid",
                                  borderColor: "neutral.200",
                                  borderRadius: 3,
                                  height: "100%",
                                  bgcolor: "neutral.0",
                                  '&:hover': {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                                  }
                                }}
                              >
                                <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: "neutral.800", lineHeight: 1.4 }}>
                                      {college.name}
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                                      <IconButton size="small" disabled sx={{ color: "neutral.300" }}>
                                        <EditIcon sx={{ fontSize: 16 }} />
                                      </IconButton>
                                      <IconButton size="small" disabled sx={{ color: "neutral.300" }}>
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                      </IconButton>
                                    </Box>
                                  </Box>

                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, color: "neutral.500" }}>
                                    <PlaceIcon sx={{ fontSize: 14 }} />
                                    <Typography variant="caption" sx={{ fontSize: "12px", fontWeight: 500 }}>
                                      {college.location || "No location specified"}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ mt: "auto", display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                    <Chip
                                      label={`slug: ${college.slug}`}
                                      size="small"
                                      sx={{
                                        bgcolor: "neutral.100",
                                        color: "neutral.600",
                                        fontWeight: 600,
                                        fontSize: "10px",
                                        height: 18
                                      }}
                                    />
                                    <Chip
                                      label={group.universityName}
                                      size="small"
                                      sx={{
                                        bgcolor: "rgba(5, 150, 105, 0.04)",
                                        color: "primary.700",
                                        fontWeight: 600,
                                        fontSize: "10px",
                                        height: 18,
                                        maxWidth: 150
                                      }}
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CollegesPage;
