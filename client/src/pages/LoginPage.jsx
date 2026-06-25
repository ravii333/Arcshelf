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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as api from "../api";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[8],
}));

const GradientAvatar = styled(Avatar)(({ theme }) => ({
  background: "linear-gradient(135deg, #0b1f17 0%, #15322d 50%, #128c43 100%)",
  width: 64,
  height: 64,
  margin: "0 auto",
  marginBottom: theme.spacing(3),
}));

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log("Attempting login with:", formData);
      const { data } = await api.login(formData);
      console.log("Login successful:", data);
      localStorage.setItem("profile", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
        background: "linear-gradient(135deg, #f1f8f4 0%, #ffffff 50%, #e8f5e9 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <GradientAvatar>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "white" }}>
              A
            </Typography>
          </GradientAvatar>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your ArcShelf account
          </Typography>
        </Box>

        <StyledPaper>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
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
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <FormControlLabel
                control={<Checkbox sx={{ color: "#16a34a" }} />}
                label="Remember me"
              />
              <Button
                component="a"
                href="#"
                sx={{
                  color: "#16a34a",
                  textTransform: "none",
                  "&:hover": {
                    color: "#128c43",
                    backgroundColor: "transparent",
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
                py: 1.5,
                background: "linear-gradient(135deg, #16a34a 0%, #128c43 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #128c43 0%, #0f7036 100%)",
                  transform: "scale(1.02)",
                },
                "&:disabled": {
                  background: "linear-gradient(135deg, #16a34a 0%, #128c43 100%)",
                  opacity: 0.5,
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  Signing in...
                </Box>
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              New to ArcShelf?
            </Typography>
          </Divider>

          <Button
            component={Link}
            to="/register"
            variant="outlined"
            fullWidth
            sx={{
              py: 1.5,
              borderColor: "#16a34a",
              color: "#128c43",
              "&:hover": {
                borderColor: "#16a34a",
                backgroundColor: "#16a34a",
                color: "white",
              },
            }}
          >
            Create your free account
          </Button>
        </StyledPaper>
      </Container>
    </Box>
  );
}

export default LoginPage;
