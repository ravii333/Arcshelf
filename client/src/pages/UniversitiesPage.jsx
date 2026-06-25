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
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import * as api from '../api';
import EmptyState from '../components/common/EmptyState';

const UniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', location: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const { data } = await api.fetchUniversities();
        setUniversities(data);
      } catch (err) {
        setError('Could not load university data.');
      } finally {
        setLoading(false);
      }
    };
    loadUniversities();
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
    setError('');
    setIsSubmitting(true);
    try {
      const { data: newUniversity } = await api.createUniversity(formData);
      setUniversities((prev) => [...prev, newUniversity].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData({ name: '', slug: '', location: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add university.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Manage Universities
        </Typography>
        <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
          Add, edit, or remove universities from the platform.
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
                Add New University
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="University Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Stanford University"
                required
                fullWidth
              />

              <TextField
                label="URL Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g., stanford"
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
                {isSubmitting ? 'Adding...' : 'Add University'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* --- Right Column: List Section --- */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800", mb: 0.5 }}>
              All Universities ({universities.length})
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: "primary.main" }} />
              </Box>
            ) : universities.length === 0 ? (
              <EmptyState
                icon={<SchoolIcon />}
                title="No universities added yet"
                description="Use the form on the left to add the first university to the platform."
              />
            ) : (
              <Grid container spacing={2.5}>
                {universities.map((uni) => (
                  <Grid item xs={12} sm={6} key={uni._id}>
                    <Card
                      elevation={0}
                      sx={{
                        border: "1px solid",
                        borderColor: "neutral.200",
                        borderRadius: 3.5,
                        bgcolor: "neutral.0",
                        height: "100%",
                        '&:hover': {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", height: "100%" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1.5 }}>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: "neutral.800", lineHeight: 1.3 }}>
                            {uni.name}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                            <IconButton size="small" disabled sx={{ color: "neutral.300" }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" disabled sx={{ color: "neutral.300" }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "neutral.500" }}>
                          <PlaceIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontSize: "13px" }}>
                            {uni.location || "No location specified"}
                          </Typography>
                        </Box>

                        {uni.createdAt && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, color: "neutral.400" }}>
                            <CalendarTodayIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontSize: "11px" }}>
                              Added: {new Date(uni.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ mt: "auto", pt: 1.5 }}>
                          <Chip
                            label={`slug: ${uni.slug}`}
                            size="small"
                            sx={{
                              bgcolor: "neutral.100",
                              color: "neutral.600",
                              fontWeight: 600,
                              fontSize: "11px",
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UniversitiesPage;
