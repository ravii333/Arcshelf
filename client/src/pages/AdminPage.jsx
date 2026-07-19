import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Chip,
  Button,
  Paper,
  CircularProgress,
  Pagination,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import * as api from "../api";
import { useToast } from "../context/ToastContext";
import EmptyState from "../components/common/EmptyState";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

const STATUS_STYLE = {
  pending: { label: "Pending", bg: "#fef3c7", color: "#b45309" },
  approved: { label: "Approved", bg: "#d1fae5", color: "#047857" },
  rejected: { label: "Rejected", bg: "#fee2e2", color: "#b91c1c" },
};

function StatusChip({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.approved;
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: "0.6875rem", height: 22 }}
    />
  );
}

function AdminPage() {
  const toast = useToast();
  const [tab, setTab] = useState("pending");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], pages: 1, total: 0, counts: {} });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null); // paper being rejected
  const [rejectNote, setRejectNote] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.fetchAdminQuestions({ status: tab, page, limit: 20 });
      setData(res);
    } catch (error) {
      console.error("Failed to load papers:", error);
      toast.error("Failed to load papers.");
      setData({ items: [], pages: 1, total: 0, counts: {} });
    } finally {
      setLoading(false);
    }
  }, [tab, page, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [tab]);

  const setStatus = async (id, status, note) => {
    setBusyId(id);
    try {
      await api.updateQuestionStatus(id, status, note);
      toast.success(`Paper ${status}.`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.");
    } finally {
      setBusyId(null);
    }
  };

  const openReject = (paper) => {
    setRejectNote(paper.moderationNote || "");
    setRejectTarget(paper);
  };

  const confirmReject = async () => {
    const id = rejectTarget._id;
    setRejectTarget(null);
    await setStatus(id, "rejected", rejectNote.trim());
    setRejectNote("");
  };

  const remove = async (id) => {
    if (!window.confirm("Permanently delete this paper and its file? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await api.deleteQuestion(id);
      toast.success("Paper deleted.");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const counts = data.counts || {};

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "neutral.900", mb: 0.5, fontSize: { xs: "1.75rem", md: "2rem" } }}>
          Moderation
        </Typography>
        <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
          Review, approve, reject, or remove contributed papers.
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          borderBottom: "1px solid",
          borderColor: "neutral.200",
          "& .MuiTab-root": { fontWeight: 600, textTransform: "none", minHeight: 44 },
          "& .Mui-selected": { color: "primary.700" },
          "& .MuiTabs-indicator": { backgroundColor: "primary.600" },
        }}
      >
        {TABS.map((t) => {
          const count = t.key === "all" ? counts.total : counts[t.key];
          return (
            <Tab
              key={t.key}
              value={t.key}
              label={count != null ? `${t.label} (${count})` : t.label}
            />
          );
        })}
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "primary.main" }} />
        </Box>
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={<CheckCircleIcon />}
          title="Nothing here"
          description={tab === "pending" ? "No papers are waiting for review." : "No papers in this category."}
        />
      ) : (
        <>
          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "neutral.200", borderRadius: "14px", overflow: "hidden" }}>
            {data.items.map((q, i) => (
              <Box key={q._id}>
                {i > 0 && <Divider />}
                <Box
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    alignItems: { xs: "stretch", md: "center" },
                  }}
                >
                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                      <Typography sx={{ fontWeight: 700, color: "neutral.900", fontSize: "0.95rem" }}>
                        {q.subject}
                      </Typography>
                      <StatusChip status={q.status || "approved"} />
                    </Box>
                    <Typography variant="body2" color="neutral.500" sx={{ fontSize: "0.8125rem" }}>
                      {q.course} · {q.examType} · {q.year}
                      {q.college?.name && ` · ${q.college.name}`}
                    </Typography>
                    <Typography variant="caption" color="neutral.400" sx={{ display: "block" }}>
                      by {q.createdBy?.name || "Unknown"} · {new Date(q.createdAt).toLocaleDateString()}
                    </Typography>
                    {q.status === "rejected" && q.moderationNote && (
                      <Typography variant="caption" sx={{ color: "#b91c1c", display: "block", mt: 0.5, fontStyle: "italic" }}>
                        Reason: {q.moderationNote}
                      </Typography>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: "flex", gap: 1, flexShrink: 0, flexWrap: "wrap" }}>
                    <Button
                      component={Link}
                      to={`/questions/${q._id}`}
                      target="_blank"
                      size="small"
                      startIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                      sx={{ color: "neutral.600", minWidth: 0 }}
                    >
                      View
                    </Button>
                    {q.status !== "approved" && (
                      <Button
                        size="small"
                        variant="contained"
                        disabled={busyId === q._id}
                        startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                        onClick={() => setStatus(q._id, "approved")}
                        sx={{ bgcolor: "#059669", "&:hover": { bgcolor: "#047857" }, boxShadow: "none" }}
                      >
                        Approve
                      </Button>
                    )}
                    {q.status !== "rejected" && (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={busyId === q._id}
                        startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
                        onClick={() => openReject(q)}
                        sx={{ color: "#b45309", borderColor: "#fcd34d", "&:hover": { borderColor: "#f59e0b", bgcolor: "#fffbeb" } }}
                      >
                        Reject
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={busyId === q._id}
                      startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                      onClick={() => remove(q._id)}
                      sx={{ color: "error.main", borderColor: "#fecaca", "&:hover": { borderColor: "error.main", bgcolor: "#fef2f2" } }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>

          {data.pages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={data.pages}
                page={page}
                onChange={(_, v) => {
                  setPage(v);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                sx={{
                  "& .MuiPaginationItem-root.Mui-selected": {
                    bgcolor: "primary.600",
                    color: "white",
                    "&:hover": { bgcolor: "primary.700" },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Reject reason dialog */}
      <Dialog
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>Reject paper</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="neutral.500" sx={{ mb: 2 }}>
            The uploader will see this reason on their dashboard. Be clear so they can fix and re-upload.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label="Reason for rejection"
            placeholder="e.g. Blurry scan / wrong subject / duplicate of an existing paper"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRejectTarget(null)} sx={{ color: "neutral.600" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmReject}
            sx={{ bgcolor: "#b91c1c", "&:hover": { bgcolor: "#991b1b" }, boxShadow: "none" }}
          >
            Reject paper
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminPage;
