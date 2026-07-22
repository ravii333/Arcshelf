import { useState, useEffect, useMemo } from "react";
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
  Tabs,
  Tab,
  Grid,
  Chip,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
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
import ContributionCard from "../components/common/ContributionCard";
import PaginationBar from "../components/common/PaginationBar";
import { useSavedPapers } from "../context/SavedPapersContext";
import { useToast } from "../context/ToastContext";

// Moderation status shown to the uploader. Papers with no status (legacy) are live.
function ContributionStatus({ status, note }) {
  const styles = {
    pending: { label: "Pending review", bg: "#fef3c7", color: "#b45309" },
    approved: { label: "Approved", bg: "#d1fae5", color: "#047857" },
    rejected: { label: "Rejected", bg: "#fee2e2", color: "#b91c1c" },
  };
  const s = styles[status] || styles.approved;
  const chip = (
    <Chip
      label={s.label}
      size="small"
      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: "0.6875rem", height: 22 }}
    />
  );

  if (status === "rejected" && note) {
    return (
      <Box>
        <Tooltip title={note} arrow>
          {chip}
        </Tooltip>
        <Typography variant="caption" sx={{ display: "block", color: "#b91c1c", mt: 0.5, maxWidth: 220 }}>
          {note}
        </Typography>
      </Box>
    );
  }
  return chip;
}

// Both dashboard lists are fetched in full, so paging happens client-side.
const CONTRIBUTIONS_PER_PAGE = 10;
const SAVED_PER_PAGE = 8;

function DashboardPage() {
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem("profile")));
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();

  // Tabs: 0 = contributions, 1 = saved/wishlist
  const [tab, setTab] = useState(0);
  const { isSaved } = useSavedPapers();
  const [savedPapers, setSavedPapers] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState("");
  const [savedLoaded, setSavedLoaded] = useState(false);
  
  // Pagination (client-side, one page counter per tab)
  const [contribPage, setContribPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);

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

  const loadSavedPapers = async () => {
    setSavedLoading(true);
    setSavedError("");
    try {
      const { data } = await api.fetchSavedPapers();
      setSavedPapers(data);
      setSavedLoaded(true);
    } catch (err) {
      console.error("Saved papers load error:", err);
      setSavedError("Failed to load your saved papers. Please try again.");
    } finally {
      setSavedLoading(false);
    }
  };

  const handleTabChange = (_e, newTab) => {
    setTab(newTab);
    if (newTab === 1 && !savedLoaded) {
      loadSavedPapers();
    }
  };

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
      toast.success("Question paper deleted successfully.");
      setContributions((prev) => prev.filter((q) => q._id !== deleteId));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete paper.");
    } finally {
      setIsDeleting(false);
      handleCloseDelete();
    }
  };

  // Compute statistics
  const totalContributions = contributions.length;
  const uniqueCourses = new Set(contributions.map((c) => c.course)).size;
  const uniqueColleges = new Set(
    contributions.map((c) => c.college?.name || "University-Level")
  ).size;

  // --- Paging: contributions ---
  const contribPageCount = Math.max(1, Math.ceil(totalContributions / CONTRIBUTIONS_PER_PAGE));
  // A delete can shrink the list past the current page — pull back into range.
  useEffect(() => {
    if (contribPage > contribPageCount) setContribPage(contribPageCount);
  }, [contribPage, contribPageCount]);
  const pagedContributions = useMemo(
    () =>
      contributions.slice(
        (contribPage - 1) * CONTRIBUTIONS_PER_PAGE,
        contribPage * CONTRIBUTIONS_PER_PAGE
      ),
    [contributions, contribPage]
  );

  // --- Paging: saved papers (hide any unsaved this session via the card toggle) ---
  const visibleSaved = useMemo(
    () => savedPapers.filter((p) => isSaved(p._id)),
    [savedPapers, isSaved]
  );
  const savedPageCount = Math.max(1, Math.ceil(visibleSaved.length / SAVED_PER_PAGE));
  useEffect(() => {
    if (savedPage > savedPageCount) setSavedPage(savedPageCount);
  }, [savedPage, savedPageCount]);
  const pagedSaved = useMemo(
    () => visibleSaved.slice((savedPage - 1) * SAVED_PER_PAGE, savedPage * SAVED_PER_PAGE),
    [visibleSaved, savedPage]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Top Banner section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          mb: 4,
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f172a 100%)",
          color: "white",
          borderRadius: '20px',
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

      {/* Main Content Area: tabbed — contributions vs saved */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          borderBottom: "1px solid",
          borderColor: "neutral.200",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 700,
            fontSize: "1rem",
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          },
        }}
      >
        <Tab label="Your Contributed Papers" />
        <Tab
          icon={<BookmarkIcon fontSize="small" />}
          iconPosition="start"
          label="Saved Papers"
        />
      </Tabs>

      {tab === 0 && (loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>
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
        <>
        {/* Mobile: stacked cards (the wide table is unusable on phones) */}
        <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 2 }}>
          {pagedContributions.map((row) => (
            <Card
              key={row._id}
              elevation={0}
              sx={{ border: "1px solid", borderColor: "neutral.200", borderRadius: "16px" }}
            >
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: "neutral.900", lineHeight: 1.3 }}>
                      {row.subject}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "neutral.500", fontWeight: 500 }}>
                      {row.course}
                    </Typography>
                  </Box>
                  <Box sx={{ flexShrink: 0 }}>
                    <ContributionStatus status={row.status} note={row.moderationNote} />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
                  <PaperBadge label={row.examType} />
                  <Typography variant="caption" sx={{ color: "neutral.500", fontWeight: 600 }}>
                    Sem {row.semester} · {row.year}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: "neutral.600", fontWeight: 500 }}>
                  {row.college ? row.college.name : "University-Level Exam"}
                </Typography>
                {row.college?.university?.name && (
                  <Typography variant="caption" sx={{ color: "neutral.400", display: "block" }}>
                    {row.college.university.name}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 2,
                    pt: 1.5,
                    borderTop: "1px solid",
                    borderColor: "neutral.100",
                  }}
                >
                  <Button
                    component={Link}
                    to={`/questions/${row._id}`}
                    size="small"
                    startIcon={<VisibilityIcon fontSize="small" />}
                    sx={{ color: "primary.700", fontWeight: 600, bgcolor: "primary.50", "&:hover": { bgcolor: "primary.100" } }}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleOpenDelete(row._id)}
                    size="small"
                    startIcon={<DeleteIcon fontSize="small" />}
                    sx={{ color: "error.main", fontWeight: 600, ml: "auto", "&:hover": { bgcolor: "#fef2f2" } }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Desktop: full table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            display: { xs: "none", md: "block" },
            border: "1px solid",
            borderColor: "neutral.200",
            borderRadius: '16px',
            overflowX: "auto",
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
                <TableCell sx={{ fontWeight: 700, color: "neutral.700" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "neutral.700" }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedContributions.map((row) => (
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
                    <PaperBadge label={row.examType} />
                  </TableCell>
                  <TableCell>
                    <ContributionStatus status={row.status} note={row.moderationNote} />
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

        <PaginationBar
          page={contribPage}
          count={contribPageCount}
          total={totalContributions}
          perPage={CONTRIBUTIONS_PER_PAGE}
          label="papers"
          scrollToTop={false}
          onChange={(_, v) => setContribPage(v)}
        />
        </>
      ))}

      {tab === 1 && (
        savedLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : savedError ? (
          <Alert severity="error" sx={{ borderRadius: "10px" }}>
            {savedError}
          </Alert>
        ) : visibleSaved.length === 0 ? (
          <EmptyState
            title="No saved papers yet"
            description="Bookmark papers while browsing to build your exam wishlist. Tap the bookmark icon on any paper to save it here for quick access later."
            actionText="Browse Papers"
            actionLink="/browse"
          />
        ) : (
          <>
            <Grid container spacing={3}>
              {pagedSaved.map((paper) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={paper._id}>
                  <ContributionCard question={paper} />
                </Grid>
              ))}
            </Grid>

            <PaginationBar
              page={savedPage}
              count={savedPageCount}
              total={visibleSaved.length}
              perPage={SAVED_PER_PAGE}
              label="saved papers"
              scrollToTop={false}
              onChange={(_, v) => setSavedPage(v)}
            />
          </>
        )
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={handleCloseDelete}
        aria-labelledby="delete-confirmation-dialog-title"
        aria-describedby="delete-confirmation-dialog-description"
        PaperProps={{
          sx: { borderRadius: '20px', p: 1 }
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
