import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SecurityIcon from "@mui/icons-material/Security";
import SaveIcon from "@mui/icons-material/Save";
import DescriptionIcon from "@mui/icons-material/Description";
import * as api from "../api";
import Toast from "../components/ui/Toast";

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
  width: 96,
  height: 96,
  fontSize: "40px",
  fontWeight: 800,
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  boxShadow: "0 8px 24px rgba(5, 150, 105, 0.2)",
  margin: "0 auto",
  marginBottom: theme.spacing(2.5),
}));

function ProfilePage() {
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem("profile")));
  const [formData, setFormData] = useState({
    name: profile?.result?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [stats, setStats] = useState({ count: 0, loading: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate("/login");
      return;
    }

    const loadContributionsCount = async () => {
      try {
        const { data } = await api.fetchMyQuestions();
        setStats({ count: data.length, loading: false });
      } catch (err) {
        console.error("Failed to load contributions count", err);
        setStats({ count: 0, loading: false });
      }
    };
    loadContributionsCount();
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "neutral.200" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const labels = ["Very Weak", "Weak", "Medium", "Strong"];
    const colors = ["#ef4444", "#f59e0b", "#34d399", "#059669"];
    return {
      score,
      label: labels[score - 1] || "Very Weak",
      color: colors[score - 1] || "#ef4444",
    };
  };

  const newPasswordStrength = getPasswordStrength(formData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validations
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        setError("New password must be at least 8 characters long.");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!formData.currentPassword) {
        setError("Please enter your current password to set a new password.");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = { name: formData.name };
      if (formData.newPassword) {
        payload.password = formData.newPassword;
      }

      const { data } = await api.updateProfile(payload);
      
      // Update local storage and app state
      localStorage.setItem("profile", JSON.stringify(data));
      setProfile(data);
      
      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setToast({
        open: true,
        message: "Profile updated successfully.",
        severity: "success",
      });

      // Dispatch storage event so layout header updates name instantly
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3, md: 4 } }}>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            color: "neutral.900",
            mb: 0.5,
          }}
        >
          My Profile
        </Typography>
        <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
          Manage your personal information and account security.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Summary Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              border: "1px solid",
              borderColor: "neutral.200",
              borderRadius: '16px',
              bgcolor: "neutral.0",
            }}
          >
            <ProfileAvatar>
              {profile?.result?.name.charAt(0).toUpperCase()}
            </ProfileAvatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800", mb: 0.5 }}>
              {profile?.result?.name}
            </Typography>
            <Typography variant="body2" color="neutral.500" sx={{ mb: 3, fontWeight: 500 }}>
              {profile?.result?.email}
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, py: 1 }}>
              <Avatar sx={{ bgcolor: "primary.50", width: 40, height: 40 }}>
                <DescriptionIcon sx={{ color: "primary.700", fontSize: 20 }} />
              </Avatar>
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "neutral.400", display: "block" }}>
                  Papers Contributed
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "neutral.800", lineHeight: 1 }}>
                  {stats.loading ? <CircularProgress size={16} /> : stats.count}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Edit Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid",
              borderColor: "neutral.200",
              borderRadius: '16px',
              bgcolor: "neutral.0",
            }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
                  {error}
                </Alert>
              )}

              {/* Section: Account Details */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.50" }}>
                  <AccountCircleIcon sx={{ color: "primary.700", fontSize: 20 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800" }}>
                  Profile Information
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Display Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email Address"
                    value={profile?.result?.email}
                    disabled
                    fullWidth
                    helperText="Email address cannot be changed."
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Section: Password Update */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.50" }}>
                  <SecurityIcon sx={{ color: "primary.700", fontSize: 20 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800" }}>
                  Security Details
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password if setting a new one"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    fullWidth
                  />

                  {formData.newPassword && (
                    <Box sx={{ mt: 1.5, mb: 0.5 }}>
                      <Box sx={{ display: "flex", gap: 0.5, mb: 0.75 }}>
                        {[1, 2, 3, 4].map((seg) => (
                          <Box
                            key={seg}
                            sx={{
                              flex: 1,
                              height: 4,
                              borderRadius: 2,
                              bgcolor: seg <= newPasswordStrength.score ? newPasswordStrength.color : "neutral.200",
                              transition: "background-color 200ms ease",
                            }}
                          />
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: newPasswordStrength.color }}>
                        Password strength: {newPasswordStrength.label}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} sx={{ color: "white" }} /> : <SaveIcon />}
                  sx={{
                    px: 4,
                    py: 1.25,
                    backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    "&:hover": {
                      backgroundImage: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
                      boxShadow: "var(--shadow-brand)",
                    },
                    minWidth: 160,
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfilePage;
