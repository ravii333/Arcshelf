import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Fade,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import * as api from "../api";
import PaperBadge from "../components/common/PaperBadge";
import EmptyState from "../components/common/EmptyState";
import Toast from "../components/ui/Toast";

function DashboardPage() {
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem("profile")));
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  
  // Delete Dialog state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data } = await api.fetchMyQuestions();
      setContributions(data);
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile) {
      navigate("/login");
      return;
    }
    loadDashboardData();
  }, [profile]);

  const handleOpenDelete = (id) => {
    setDeleteId(id);
  };

  const handleCloseDelete = () => {
    setDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteQuestion(deleteId);
      setToast({
        open: true,
        message: "Question paper deleted successfully.",
        severity: "success",
      });
      setContributions((prev) => prev.filter((q) => q._id !== deleteId));
    } catch (err) {
      console.error("Delete error:", err);
      setToast({
        open: true,
        message: err.response?.data?.message || "Failed to delete paper.",
        severity: "error",
      });
    } finally {
      setIsDeleting(false);
      handleCloseDelete();
    }
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Compute statistics
  const totalContributions = contributions.length;
  const uniqueCourses = new Set(contributions.map((c) => c.course)).size;
  const uniqueColleges = new Set(
    contributions.map((c) => c.college?.name || "University-Level")
  ).size;

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Toast notifications */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />

      {/* Top Banner section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          mb: 4,
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f172a 100%)",
          color: "white",
          borderRadius: 6,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 32px rgba(6, 78, 59, 0.15)",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              mb: 1.5,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back, {profile?.result?.name}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: "600px", fontWeight: 500 }}>
            Here is your contributions dashboard. View the papers you have shared with the community, check your stats, or upload another exam paper to keep helping fellow students.
          </Typography>
        </Box>
        <Avatar
          sx={{
            position: "absolute",
            right: -20,
            bottom: -20,
            width: 180,
            height: 180,
            bgcolor: "rgba(255, 255, 255, 0.05)",
            fontSize: "120px",
            fontWeight: 800,
            color: "rgba(255, 255, 255, 0.03)",
          }}
        >
          {profile?.result?.name.charAt(0).toUpperCase()}
        </Avatar>
      </Paper>

      {/* Stats Cards Section */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3, mb: 5 }}>
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "neutral.200", p: 1 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Avatar sx={{ bgcolor: "primary.50", width: 48, height: 48 }}>
              <DescriptionIcon sx={{ color: "primary.700", fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "neutral.500", display: "block" }}>
                Papers Contributed
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "neutral.900" }}>
                {totalContributions}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: "1px solid", borderColor: "neutral.200", p: 1 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Avatar sx={{ bgcolor: "success.50", width: 48, height: 48 }}>
              <SchoolIcon sx={{ color: "primary.600", fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "neutral.500", display: "block" }}>
                Unique Courses
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "neutral.900" }}>
                {uniqueCourses}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: "1px solid", borderColor: "neutral.200", p: 1 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Avatar sx={{ bgcolor: "info.50", width: 48, height: 48 }}>
              <TrendingUpIcon sx={{ color: "info.700", fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "neutral.500", display: "block" }}>
                Institutions Covered
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "neutral.900" }}>
                {uniqueColleges}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content Area: Contributions list */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          color: "neutral.800",
          mb: 3,
        }}
      >
        Your Contributed Papers
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          {error}
        </Alert>
      ) : contributions.length === 0 ? (
        <EmptyState
          title="No contributions yet"
          description="You haven't uploaded any exam papers yet. Share your previous years' papers to help others prepare for their exams."
          actionText="Upload a Paper"
          actionLink="/submit"
        />
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "neutral.200",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="user contributions table">
            <TableHead sx={{ bgcolor: "neutral.50" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "neutral.700" }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "neutral.700" }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "neutral.700" }}>Institution</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "neutral.700" }}>Semester / Year</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "neutral.700" }}>Exam Type</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "neutral.700" }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contributions.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "rgba(5, 150, 105, 0.02)" },
                    transition: "background-color 150ms ease",
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: "neutral.900" }}>
                    {row.subject}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "neutral.700" }}>{row.course}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "neutral.600" }}>
                    {row.college ? (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.college.name}</Typography>
                        <Typography variant="caption" sx={{ color: "neutral.400" }}>
                          {row.college.university?.name}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "neutral.500" }}>
                        University-Level Exam
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "neutral.600" }}>
                    Sem {row.semester} ({row.year})
                  </TableCell>
                  <TableCell>
                    <PaperBadge type={row.examType} />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Tooltip title="View Paper" arrow>
                        <IconButton
                          component={Link}
                          to={`/questions/${row._id}`}
                          size="small"
                          sx={{
                            color: "primary.600",
                            bgcolor: "primary.50",
                            "&:hover": { bgcolor: "primary.100" },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Paper" arrow>
                        <IconButton
                          onClick={() => handleOpenDelete(row._id)}
                          size="small"
                          sx={{
                            color: "error.main",
                            bgcolor: "error.light",
                            opacity: 0.85,
                            "&:hover": { bgcolor: "#fee2e2", opacity: 1 },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={handleCloseDelete}
        aria-labelledby="delete-confirmation-dialog-title"
        aria-describedby="delete-confirmation-dialog-description"
        PaperProps={{
          sx: { borderRadius: 4, p: 1 }
        }}
      >
        <DialogTitle id="delete-confirmation-dialog-title" sx={{ fontWeight: 700, pb: 1 }}>
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-dialog-description" sx={{ color: "neutral.600" }}>
            Are you sure you want to delete this question paper? This action is permanent and cannot be undone. It will remove the paper catalog entry for all students.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
          <Button onClick={handleCloseDelete} variant="text" sx={{ color: "neutral.500", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={isDeleting}
            sx={{
              bgcolor: "error.main",
              "&:hover": { bgcolor: "error.dark" },
              minWidth: 100,
            }}
          >
            {isDeleting ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default DashboardPage;
