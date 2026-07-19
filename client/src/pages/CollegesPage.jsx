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
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PlaceIcon from '@mui/icons-material/Place';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as api from '../api';
import EmptyState from '../components/common/EmptyState';

const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '10px' } };

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [collegeForm, setCollegeForm] = useState({ name: '', slug: '', location: '', university: '' });
  const [universityForm, setUniversityForm] = useState({ name: '', slug: '', location: '' });
  const [isSubmittingCollege, setIsSubmittingCollege] = useState(false);
  const [isSubmittingUniversity, setIsSubmittingUniversity] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [uniRes, colRes] = await Promise.all([api.fetchUniversities(), api.fetchColleges()]);
        setUniversities(uniRes.data);
        setColleges(colRes.data);
      } catch {
        setError('Could not load page data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleCollegeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setCollegeForm({ ...collegeForm, name: value, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') });
    } else {
      setCollegeForm({ ...collegeForm, [name]: value });
    }
  };

  const handleUniversityChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setUniversityForm({ ...universityForm, name: value, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') });
    } else {
      setUniversityForm({ ...universityForm, [name]: value });
    }
  };

  const handleCollegeSubmit = async (e) => {
    e.preventDefault();
    if (!collegeForm.university) { setError('Please select a university.'); return; }
    setError(''); setIsSubmittingCollege(true);
    try {
      const { data } = await api.createCollege(collegeForm);
      setColleges((p) => [...p, data].sort((a, b) => a.name.localeCompare(b.name)));
      setCollegeForm({ name: '', slug: '', location: '', university: '' });
      flash('College added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add college.');
    } finally { setIsSubmittingCollege(false); }
  };

  const handleUniversitySubmit = async (e) => {
    e.preventDefault();
    setError(''); setIsSubmittingUniversity(true);
    try {
      const { data } = await api.createUniversity(universityForm);
      setUniversities((p) => [...p, data].sort((a, b) => a.name.localeCompare(b.name)));
      setUniversityForm({ name: '', slug: '', location: '' });
      flash('University added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add university.');
    } finally { setIsSubmittingUniversity(false); }
  };

  const groupedColleges = universities.reduce((acc, uni) => {
    acc[uni._id] = {
      universityName: uni.name,
      colleges: colleges.filter((c) => c.university?._id === uni._id || c.university === uni._id),
    };
    return acc;
  }, {});

  const formCardSx = {
    p: '28px',
    border: '1px solid',
    borderColor: 'neutral.200',
    borderRadius: '16px',
    bgcolor: 'neutral.0',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const submitBtnSx = {
    height: 44,
    borderRadius: '10px',
    mt: 'auto',
    backgroundImage: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    '&:hover': {
      backgroundImage: 'linear-gradient(135deg, #047857 0%, #064e3b 100%)',
      boxShadow: 'var(--shadow-brand)',
    },
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 }, py: 4 }}>

      {/* ── Header ── */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            color: 'neutral.900',
            mb: 0.5,
          }}
        >
          Manage Colleges
        </Typography>
        <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
          Add universities and colleges to organize academic content.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>
          {successMsg}
        </Alert>
      )}

      {/* ── Forms Row ── */}
      <Grid container spacing={3} sx={{ mb: 5 }}>

        {/* Add University */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={formCardSx}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ width: 38, height: 38, bgcolor: 'rgba(5,150,105,0.1)' }}>
                <AccountBalanceIcon sx={{ color: 'primary.700', fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'neutral.800', lineHeight: 1.2 }}>
                  Add University
                </Typography>
                <Typography variant="caption" color="neutral.500">
                  Top-level academic institution
                </Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleUniversitySubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
              <TextField
                label="University Name"
                name="name"
                value={universityForm.name}
                onChange={handleUniversityChange}
                placeholder="e.g., Stanford University"
                required fullWidth sx={fieldSx}
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="URL Slug"
                    name="slug"
                    value={universityForm.slug}
                    onChange={handleUniversityChange}
                    placeholder="e.g., stanford"
                    required fullWidth helperText="Auto-generated"
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Location (Optional)"
                    name="location"
                    value={universityForm.location}
                    onChange={handleUniversityChange}
                    placeholder="e.g., Stanford, CA"
                    fullWidth sx={fieldSx}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit" variant="contained"
                disabled={isSubmittingUniversity}
                startIcon={isSubmittingUniversity ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <AddIcon />}
                sx={submitBtnSx}
              >
                {isSubmittingUniversity ? 'Adding...' : 'Add University'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Add College */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={formCardSx}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.50' }}>
                <SchoolIcon sx={{ color: 'primary.700', fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'neutral.800', lineHeight: 1.2 }}>
                  Add College
                </Typography>
                <Typography variant="caption" color="neutral.500">
                  Assign to a parent university
                </Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleCollegeSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>Parent University</InputLabel>
                <Select
                  name="university"
                  value={collegeForm.university}
                  onChange={handleCollegeChange}
                  label="Parent University"
                  sx={{ borderRadius: '10px' }}
                >
                  <MenuItem value="" disabled>-- Select University --</MenuItem>
                  {universities.map((uni) => (
                    <MenuItem key={uni._id} value={uni._id}>{uni.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="College Name"
                name="name"
                value={collegeForm.name}
                onChange={handleCollegeChange}
                placeholder="e.g., School of Engineering"
                required fullWidth sx={fieldSx}
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="URL Slug"
                    name="slug"
                    value={collegeForm.slug}
                    onChange={handleCollegeChange}
                    placeholder="e.g., soe-stanford"
                    required fullWidth helperText="Auto-generated"
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Location (Optional)"
                    name="location"
                    value={collegeForm.location}
                    onChange={handleCollegeChange}
                    placeholder="e.g., Stanford, CA"
                    fullWidth sx={fieldSx}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit" variant="contained"
                disabled={isSubmittingCollege}
                startIcon={isSubmittingCollege ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <AddIcon />}
                sx={submitBtnSx}
              >
                {isSubmittingCollege ? 'Adding...' : 'Add College'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Universities List ── */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <AccountBalanceIcon sx={{ color: 'primary.700', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'neutral.800' }}>
            Universities
          </Typography>
          <Chip
            label={universities.length}
            size="small"
            sx={{ bgcolor: 'rgba(5,150,105,0.1)', color: 'primary.800', fontWeight: 700, fontSize: '11px', height: 20 }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : universities.length === 0 ? (
          <EmptyState
            icon={<AccountBalanceIcon />}
            title="No universities yet"
            description="Use the form above to add the first university."
          />
        ) : (
          <Grid container spacing={2.5}>
            {universities.map((uni) => {
              const count = colleges.filter((c) => c.university?._id === uni._id || c.university === uni._id).length;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={uni._id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid', borderColor: 'neutral.200', borderRadius: '16px',
                      bgcolor: 'neutral.0', height: '100%',
                      transition: 'all 0.18s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(0,0,0,0.06)' },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: 'rgba(5,150,105,0.1)' }}>
                          <AccountBalanceIcon sx={{ color: 'primary.700', fontSize: 17 }} />
                        </Avatar>
                        <Box sx={{ display: 'flex', gap: 0.25 }}>
                          <IconButton size="small" disabled sx={{ color: 'neutral.300' }}>
                            <EditIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                          <IconButton size="small" disabled sx={{ color: 'neutral.300' }}>
                            <DeleteIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'neutral.800', lineHeight: 1.4, mb: 0.75 }}>
                        {uni.name}
                      </Typography>

                      {uni.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, color: 'neutral.500' }}>
                          <PlaceIcon sx={{ fontSize: 13 }} />
                          <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 500 }}>
                            {uni.location}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
                        <Chip label={`slug: ${uni.slug}`} size="small"
                          sx={{ bgcolor: 'neutral.100', color: 'neutral.600', fontWeight: 600, fontSize: '10px', height: 18 }} />
                        <Chip label={`${count} college${count !== 1 ? 's' : ''}`} size="small"
                          sx={{ bgcolor: 'rgba(5,150,105,0.08)', color: 'primary.700', fontWeight: 600, fontSize: '10px', height: 18 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      <Divider sx={{ borderColor: 'neutral.200', mb: 5 }} />

      {/* ── Colleges by University ── */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <SchoolIcon sx={{ color: 'primary.700', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'neutral.800' }}>
            Colleges by University
          </Typography>
          <Chip
            label={colleges.length}
            size="small"
            sx={{ bgcolor: 'rgba(5,150,105,0.1)', color: 'primary.800', fontWeight: 700, fontSize: '11px', height: 20 }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : colleges.length === 0 ? (
          <EmptyState
            icon={<SchoolIcon />}
            title="No colleges added yet"
            description="Use the form above to add the first college."
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.keys(groupedColleges).map((uniId) => {
              const group = groupedColleges[uniId];
              if (group.colleges.length === 0) return null;
              return (
                <Accordion
                  key={uniId} elevation={0} defaultExpanded
                  sx={{
                    border: '1px solid', borderColor: 'neutral.200',
                    borderRadius: '16px !important', overflow: 'hidden',
                    bgcolor: 'neutral.0', '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                    sx={{ bgcolor: 'neutral.50', borderBottom: '1px solid', borderColor: 'neutral.200', px: 2.5, py: 0.5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'neutral.800' }}>
                        {group.universityName}
                      </Typography>
                      <Chip
                        label={`${group.colleges.length} college${group.colleges.length !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{ bgcolor: 'rgba(5,150,105,0.08)', color: 'primary.800', fontWeight: 700, fontSize: '11px', height: 20 }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2.5 }}>
                    <Grid container spacing={2}>
                      {group.colleges.map((college) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={college._id}>
                          <Card
                            elevation={0}
                            sx={{
                              border: '1px solid', borderColor: 'neutral.200', borderRadius: '16px',
                              bgcolor: 'neutral.0', height: '100%',
                              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' },
                            }}
                          >
                            <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'neutral.800', lineHeight: 1.4 }}>
                                  {college.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
                                  <IconButton size="small" disabled sx={{ color: 'neutral.300' }}>
                                    <EditIcon sx={{ fontSize: 15 }} />
                                  </IconButton>
                                  <IconButton size="small" disabled sx={{ color: 'neutral.300' }}>
                                    <DeleteIcon sx={{ fontSize: 15 }} />
                                  </IconButton>
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5, color: 'neutral.500' }}>
                                <PlaceIcon sx={{ fontSize: 13 }} />
                                <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 500 }}>
                                  {college.location || 'No location specified'}
                                </Typography>
                              </Box>

                              <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                <Chip label={`slug: ${college.slug}`} size="small"
                                  sx={{ bgcolor: 'neutral.100', color: 'neutral.600', fontWeight: 600, fontSize: '10px', height: 18 }} />
                                <Chip label={group.universityName} size="small"
                                  sx={{ bgcolor: 'rgba(5,150,105,0.05)', color: 'primary.700', fontWeight: 600, fontSize: '10px', height: 18, maxWidth: 160 }} />
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
    </Container>
  );
};

export default CollegesPage;
