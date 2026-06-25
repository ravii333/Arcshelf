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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.register(formData);
      navigate("/login", { state: { message: "Registration successful! Please sign in." } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
            Join ArcShelf
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your free account and start contributing
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
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
              fullWidth
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
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              fullWidth
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
              fullWidth
            />

            <FormControlLabel
              control={<Checkbox required sx={{ color: "#16a34a" }} />}
              label={
                <Typography variant="body2">
                  I agree to the{" "}
                  <MuiLink href="#" sx={{ color: "#128c43", fontWeight: 600 }}>
                    Terms of Service
                  </MuiLink>{" "}
                  and{" "}
                  <MuiLink href="#" sx={{ color: "#128c43", fontWeight: 600 }}>
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
                py: 1.5,
                background: "linear-gradient(135deg, #16a34a 0%, #128c43 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #128c43 0%, #0f7a38 100%)",
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
                  Creating account...
                </Box>
              ) : (
                "Create Account"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?
            </Typography>
          </Divider>

          <Button
            component={Link}
            to="/login"
            variant="outlined"
            fullWidth
            sx={{
              py: 1.5,
              borderColor: "grey.300",
              color: "text.primary",
              "&:hover": {
                borderColor: "grey.400",
                backgroundColor: "grey.50",
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
