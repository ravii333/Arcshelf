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
  IconButton,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import * as api from "../api";

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

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.login(formData);
      localStorage.setItem("profile", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
            Welcome back
          </Typography>
          <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
            Sign in to your ArcShelf account
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

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': { height: 48 }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="small"
                      sx={{ color: "neutral.400" }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "neutral.300",
                      "&.Mui-checked": { color: "primary.500" }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "neutral.600" }}>
                    Remember me
                  </Typography>
                }
              />
              <Button
                variant="text"
                component={Link}
                to="#"
                sx={{
                  color: "primary.700",
                  textTransform: "none",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  p: 0,
                  backgroundColor: "transparent !important",
                  "&:hover": {
                    color: "primary.800",
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot password?
              </Button>
            </Box>

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
                  Signing in...
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3.5 }}>
            <Typography variant="caption" color="neutral.400" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              New to ArcShelf?
            </Typography>
          </Divider>

          <Button
            component={Link}
            to="/register"
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
            Create free account
          </Button>
        </StyledPaper>
      </Container>
    </Box>
  );
}

export default LoginPage;
