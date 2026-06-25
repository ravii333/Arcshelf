import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import * as api from "../api";

const UploadZone = styled(Box)(({ theme, hasfile }) => ({
  border: `2px dashed ${hasfile === "true" ? "#16a34a" : theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: hasfile === "true" ? "rgba(22, 163, 74, 0.05)" : theme.palette.grey[50],
  "&:hover": {
    borderColor: "#16a34a",
    backgroundColor: "rgba(22, 163, 74, 0.05)",
  },
}));

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

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
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setPaperFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!paperFile) {
      setError("Please upload a question paper file (PDF or image).");
      return;
    }
    if (!isUniversityLevel && !formData.college) {
      setError("Please select a college or check the university-level exam option.");
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
      navigate(`/questions/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Contribute a Paper
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Help your peers by sharing an exam paper. All fields are required unless marked optional.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Institution Section */}
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "rgba(22, 163, 74, 0.1)" }}>
              <SchoolIcon sx={{ color: "#16a34a", fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Institution
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>University</InputLabel>
                <Select
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
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isUniversityLevel}
                    onChange={(e) => {
                      setIsUniversityLevel(e.target.checked);
                      if (e.target.checked)
                        setFormData((prev) => ({ ...prev, college: "" }));
                    }}
                    sx={{ color: "#16a34a", "&.Mui-checked": { color: "#16a34a" } }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      University-Level Exam
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Check if this paper applies to the entire university, not a specific college
                    </Typography>
                  </Box>
                }
              />
            </Grid>

            {!isUniversityLevel && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>College</InputLabel>
                  <Select
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
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Paper Details Section */}
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "rgba(22, 163, 74, 0.1)" }}>
              <DescriptionIcon sx={{ color: "#16a34a", fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Paper Details
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g., B.Tech CSE"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Data Structures"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Year</InputLabel>
                <Select
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
            </Grid>
            <Grid item xs={12} sm={4}>
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
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Exam Type</InputLabel>
                <Select
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
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </Paper>

        {/* File Upload Section */}
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 4, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "rgba(22, 163, 74, 0.1)" }}>
              <CloudUploadIcon sx={{ color: "#16a34a", fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {paperFile ? (
                <Box>
                  <CheckCircleIcon sx={{ fontSize: 44, color: "#16a34a", mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#16a34a", mb: 0.5 }}>
                    {paperFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(paperFile.size / (1024 * 1024)).toFixed(2)} MB — click to change
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 44, color: "text.secondary", mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Drop your file here, or click to browse
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF, JPG, PNG — max 10 MB
                  </Typography>
                </Box>
              )}
            </UploadZone>
          </label>
        </Paper>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ borderColor: "grey.300", color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <CloudUploadIcon />
              )
            }
            sx={{
              background: "linear-gradient(135deg, #16a34a 0%, #128c43 100%)",
              "&:hover": { background: "linear-gradient(135deg, #128c43 0%, #0f7036 100%)" },
              "&.Mui-disabled": { opacity: 0.7 },
              minWidth: 160,
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Paper"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SubmitQuestionPage;
