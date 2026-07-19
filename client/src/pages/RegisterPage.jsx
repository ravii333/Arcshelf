import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as api from "../api";
import { useToast } from "../context/ToastContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '40px',
  borderRadius: 20,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: "none",
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
  }
}));

const MonogramAvatar = styled(Avatar)({
  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
  width: 48,
  height: 48,
  margin: "0 auto",
  marginBottom: '16px',
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
  fontSize: "22px",
  boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)",
});

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      color: colors[score - 1] || "#ef4444"
    };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.register(formData);
      toast.success("Registration successful! Please sign in.");
      navigate("/login", { state: { message: "Registration successful! Please sign in." } });
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
        bgcolor: "neutral.50",
      }}
    >
      <Container maxWidth="xs" sx={{ p: 0 }}>
        {/* Header Block */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <MonogramAvatar>A</MonogramAvatar>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.75,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              color: "neutral.900",
            }}
          >
            Join ArcShelf
          </Typography>
          <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
            Create your free account and start contributing
          </Typography>
        </Box>

        {/* Form Card */}
        <StyledPaper elevation={0}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: "10px" }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': { height: 48 }
              }}
            />

            <TextField
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': { height: 48 }
              }}
            />

            <Box>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { height: 48 },
                  mb: 1
                }}
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <Box sx={{ mt: 1, mb: 0.5 }}>
                  <Box sx={{ display: "flex", gap: 0.5, mb: 0.75 }}>
                    {[1, 2, 3, 4].map((seg) => (
                      <Box
                        key={seg}
                        sx={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          bgcolor: seg <= strength.score ? strength.color : "neutral.200",
                          transition: "background-color 200ms ease",
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: strength.color }}>
                    Password strength: {strength.label}
                  </Typography>
                </Box>
              )}
            </Box>

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': { height: 48 }
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  required
                  sx={{
                    color: "neutral.300",
                    "&.Mui-checked": { color: "primary.500" }
                  }}
                />
              }
              label={
                <Typography variant="body2" color="neutral.600">
                  I agree to the{" "}
                  <MuiLink href="#" sx={{ color: "primary.700", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                    Terms of Service
                  </MuiLink>{" "}
                  and{" "}
                  <MuiLink href="#" sx={{ color: "primary.700", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                    Privacy Policy
                  </MuiLink>
                </Typography>
              }
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                height: 48,
                backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                "&:hover": {
                  backgroundImage: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
                  boxShadow: "var(--shadow-brand)",
                },
                "&.Mui-disabled": {
                  backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  opacity: 0.6,
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  Creating account...
                </Box>
              ) : (
                "Create Account"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3.5 }}>
            <Typography variant="caption" color="neutral.400" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Already have an account?
            </Typography>
          </Divider>

          <Button
            component={Link}
            to="/login"
            variant="outlined"
            fullWidth
            sx={{
              height: 44,
              borderColor: "neutral.200",
              color: "neutral.700",
              "&:hover": {
                borderColor: "primary.600",
                bgcolor: "neutral.50",
                color: "primary.700",
              },
            }}
          >
            Sign in to your account
          </Button>
        </StyledPaper>
      </Container>
    </Box>
  );
}

export default RegisterPage;
