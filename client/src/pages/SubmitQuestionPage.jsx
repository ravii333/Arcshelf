import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  CircularProgress,
  Avatar,
  Fade,
  Collapse,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import * as api from "../api";
import { useToast } from "../context/ToastContext";

const UploadZone = styled(Box, { shouldForwardProp: (prop) => prop !== 'hasfile' && prop !== 'isdragover' })(({ theme, hasfile, isdragover }) => ({
  border: `2px dashed ${
    isdragover === "true"
      ? theme.palette.primary[400]
      : hasfile === "true"
      ? theme.palette.primary[500]
      : theme.palette.neutral[300]
  }`,
  borderRadius: 16,
  padding: theme.spacing(4),
  minHeight: 180,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 200ms ease",
  backgroundColor:
    isdragover === "true" || hasfile === "true"
      ? "rgba(5, 150, 105, 0.05)" // primary.50 at low opacity
      : theme.palette.neutral[50],
  "&:hover": {
    borderColor: theme.palette.primary[400],
    backgroundColor: "rgba(5, 150, 105, 0.05)",
  },
}));

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

// Custom Step Progress bar
function FormStepProgress() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "nowrap",
        gap: { xs: 1, sm: 2.5 },
        mb: 5,
        userSelect: "none",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.600", fontSize: "12px", fontWeight: 700 }}>1</Avatar>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "neutral.800", fontSize: { xs: "12px", sm: "14px" } }}>
          Institution
        </Typography>
      </Box>
      <Box sx={{ flexGrow: { xs: 0.1, sm: 0.3 }, height: "2px", bgcolor: "neutral.200", minWidth: { xs: 20, sm: 50 } }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.600", fontSize: "12px", fontWeight: 700 }}>2</Avatar>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "neutral.800", fontSize: { xs: "12px", sm: "14px" } }}>
          Paper Details
        </Typography>
      </Box>
      <Box sx={{ flexGrow: { xs: 0.1, sm: 0.3 }, height: "2px", bgcolor: "neutral.200", minWidth: { xs: 20, sm: 50 } }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.600", fontSize: "12px", fontWeight: 700 }}>3</Avatar>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "neutral.800", fontSize: { xs: "12px", sm: "14px" } }}>
          Upload
        </Typography>
      </Box>
    </Box>
  );
}

function SubmitQuestionPage() {
  const [formData, setFormData] = useState({
    university: "",
    college: "",
    course: "",
    semester: "",
    subject: "",
    examType: "",
    year: "",
    questionsText: "",
  });
  const [paperFile, setPaperFile] = useState(null);
  const [isUniversityLevel, setIsUniversityLevel] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const { data } = await api.fetchUniversities();
        setUniversities(data);
      } catch {
        console.error("Failed to fetch universities");
      } finally {
        setLoadingUniversities(false);
      }
    };
    loadUniversities();
  }, []);

  const handleUniversityChange = async (e) => {
    const universityId = e.target.value;
    setFormData((prev) => ({ ...prev, university: universityId, college: "" }));
    setColleges([]);
    if (universityId) {
      setLoadingColleges(true);
      try {
        const { data } = await api.fetchCollegesByUniversity(universityId);
        setColleges(data);
      } catch {
        console.error("Failed to fetch colleges");
      } finally {
        setLoadingColleges(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPaperFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setPaperFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!paperFile) {
      setError("Please upload a question paper file (PDF or image).");
      toast.error("Please upload a question paper file (PDF or image).");
      return;
    }
    if (!isUniversityLevel && !formData.college) {
      setError("Please select a college or check the university-level exam option.");
      toast.error("Please select a college or check the university-level exam option.");
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    if (!isUniversityLevel && formData.college) fd.append("collegeId", formData.college);
    fd.append("course", formData.course);
    fd.append("subject", formData.subject);
    fd.append("semester", formData.semester);
    fd.append("year", formData.year);
    fd.append("examType", formData.examType);
    fd.append("questionsText", formData.questionsText);
    fd.append("paperFile", paperFile);

    try {
      const { data } = await api.createQuestion(fd);
      setSubmitSuccess(true);
      toast.success("Question paper submitted successfully. Thank you for contributing!");
      setTimeout(() => {
        navigate(`/questions/${data._id}`);
      }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit. Please try again.";
      setError(msg);
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
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
          Contribute a Paper
        </Typography>
        <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
          Help your peers by sharing an exam paper. All fields are required unless marked optional.
        </Typography>
      </Box>

      {/* Steps Progress Indicator */}
      <FormStepProgress />

      <Box component="form" onSubmit={handleSubmit}>
        {/* Animated Error Alert */}
        <Collapse in={!!error}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
            {error}
          </Alert>
        </Collapse>

        {/* Section 1 — Institution */}
        <Paper
          elevation={0}
          sx={{
            p: "28px",
            mb: 3,
            border: "1px solid",
            borderColor: "neutral.200",
            borderRadius: '16px',
            bgcolor: "neutral.0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.50" }}>
              <SchoolIcon sx={{ color: "primary.700", fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800" }}>
              Institution
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth required>
                <InputLabel id="select-university-label">University</InputLabel>
                <Select
                  labelId="select-university-label"
                  name="university"
                  value={formData.university}
                  label="University"
                  onChange={handleUniversityChange}
                  disabled={loadingUniversities}
                >
                  {loadingUniversities ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    universities.map((uni) => (
                      <MenuItem key={uni._id} value={uni._id}>
                        {uni.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isUniversityLevel}
                    onChange={(e) => {
                      setIsUniversityLevel(e.target.checked);
                      if (e.target.checked)
                        setFormData((prev) => ({ ...prev, college: "" }));
                    }}
                    sx={{
                      color: "neutral.300",
                      "&.Mui-checked": { color: "primary.500" },
                    }}
                  />
                }
                label={
                  <Box sx={{ ml: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "neutral.800" }}>
                      University-Level Exam
                    </Typography>
                    <Typography variant="caption" color="neutral.500" sx={{ display: "block" }}>
                      Check if this paper applies to the entire university, not a specific college
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {/* Conditionally reveal college select with Fade transition */}
            <Box sx={{ width: "100%", display: isUniversityLevel ? "none" : "block" }}>
              <Fade in={!isUniversityLevel} timeout={300} mountOnEnter unmountOnExit>
                <FormControl fullWidth required={!isUniversityLevel}>
                  <InputLabel id="select-college-label">College</InputLabel>
                  <Select
                    labelId="select-college-label"
                    name="college"
                    value={formData.college}
                    label="College"
                    onChange={handleChange}
                    disabled={!formData.university || loadingColleges}
                  >
                    {loadingColleges ? (
                      <MenuItem disabled>Loading...</MenuItem>
                    ) : colleges.length === 0 ? (
                      <MenuItem disabled>Select a university first</MenuItem>
                    ) : (
                      colleges.map((col) => (
                        <MenuItem key={col._id} value={col._id}>
                          {col.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Fade>
            </Box>
          </Box>
        </Paper>

        {/* Section 2 — Paper Details */}
        <Paper
          elevation={0}
          sx={{
            p: "28px",
            mb: 3,
            border: "1px solid",
            borderColor: "neutral.200",
            borderRadius: '16px',
            bgcolor: "neutral.0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.50" }}>
              <DescriptionIcon sx={{ color: "primary.700", fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800" }}>
              Paper Details
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 }}>
            <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <TextField
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g., B.Tech CSE"
                required
                fullWidth
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <TextField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Data Structures"
                required
                fullWidth
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "span 12", sm: "span 4" } }}>
              <FormControl fullWidth required>
                <InputLabel id="select-year-label">Year</InputLabel>
                <Select
                  labelId="select-year-label"
                  name="year"
                  value={formData.year}
                  label="Year"
                  onChange={handleChange}
                >
                  {YEARS.map((y) => (
                    <MenuItem key={y} value={String(y)}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: "span 12", sm: "span 4" } }}>
              <TextField
                label="Semester"
                name="semester"
                type="number"
                value={formData.semester}
                onChange={handleChange}
                placeholder="e.g., 5"
                required
                fullWidth
                inputProps={{ min: 1, max: 12 }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "span 12", sm: "span 4" } }}>
              <FormControl fullWidth required>
                <InputLabel id="select-examtype-label">Exam Type</InputLabel>
                <Select
                  labelId="select-examtype-label"
                  name="examType"
                  value={formData.examType}
                  label="Exam Type"
                  onChange={handleChange}
                >
                  <MenuItem value="Mid Sem">Mid Sem</MenuItem>
                  <MenuItem value="Final Sem">Final Sem</MenuItem>
                  <MenuItem value="Quiz">Quiz</MenuItem>
                  <MenuItem value="Assignment">Assignment</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: "span 12" }}>
              <TextField
                label="Topics / Notes (Optional)"
                name="questionsText"
                value={formData.questionsText}
                onChange={handleChange}
                placeholder="e.g., Linked Lists, Stacks & Queues, Graph Traversal"
                helperText="Add comma-separated topics to make this paper easier to find via search."
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </Box>
        </Paper>

        {/* Section 3 — Upload */}
        <Paper
          elevation={0}
          sx={{
            p: "28px",
            mb: 4,
            border: "1px solid",
            borderColor: "neutral.200",
            borderRadius: '16px',
            bgcolor: "neutral.0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.50" }}>
              <CloudUploadIcon sx={{ color: "primary.700", fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800" }}>
              Upload Paper
            </Typography>
          </Box>

          <input
            type="file"
            id="paperFileInput"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="paperFileInput">
            <UploadZone
              hasfile={paperFile ? "true" : "false"}
              isdragover={isDragOver ? "true" : "false"}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {paperFile ? (
                <Box sx={{ p: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 44, color: "primary.600", mb: 1.5 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "primary.700",
                      mb: 0.5,
                      maxWidth: "280px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {paperFile.name}
                  </Typography>
                  <Typography variant="caption" color="neutral.500" sx={{ fontWeight: 500 }}>
                    {(paperFile.size / (1024 * 1024)).toFixed(2)} MB — click to change file
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 2 }}>
                  <CloudUploadIcon sx={{ fontSize: 48, color: "neutral.400", mb: 1.5 }} />
                  <Typography variant="body1" sx={{ fontWeight: 700, color: "neutral.800", mb: 0.5 }}>
                    Drop your file here or click to browse
                  </Typography>
                  <Typography variant="caption" color="neutral.500" sx={{ fontWeight: 500 }}>
                    PDF, JPG, PNG — Max 10 MB
                  </Typography>
                </Box>
              )}
            </UploadZone>
          </label>
        </Paper>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            sx={{
              color: "neutral.500",
              fontWeight: 600,
              px: 3,
              '&:hover': { bgcolor: "neutral.100" }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || submitSuccess}
            startIcon={
              submitSuccess ? (
                <CheckCircleIcon />
              ) : isSubmitting ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <CloudUploadIcon />
              )
            }
            sx={{
              backgroundImage: submitSuccess
                ? "none"
                : "linear-gradient(135deg, #059669 0%, #047857 100%)",
              bgcolor: submitSuccess ? "success.main" : undefined,
              "&:hover": {
                backgroundImage: submitSuccess
                  ? "none"
                  : "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
              },
              "&.Mui-disabled": {
                bgcolor: submitSuccess ? "success.main" : "neutral.200",
                color: submitSuccess ? "white" : "neutral.400",
                opacity: 0.75,
              },
              minWidth: 160,
              px: 3.5,
              py: 1.25,
            }}
          >
            {submitSuccess ? "Submitted!" : isSubmitting ? "Submitting..." : "Submit Paper"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SubmitQuestionPage;
