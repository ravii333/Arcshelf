import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useToast } from "../context/ToastContext";

const StyledFooter = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f172a 100%)',
  color: "rgba(255, 255, 255, 0.6)",
  marginTop: "auto",
  paddingTop: "3.5rem",
  paddingBottom: "2rem",
  boxShadow: theme.shadows[4],
}));

const FooterHeading = styled(Typography)({
  fontWeight: 700,
  fontSize: "0.65rem",
  color: "rgba(255, 255, 255, 0.4)",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  marginBottom: "1rem",
});

const FooterLink = ({ to, children }) => (
  <Link
    component={RouterLink}
    to={to}
    sx={{
      color: "rgba(255, 255, 255, 0.65)",
      textDecoration: "none",
      fontSize: "0.8125rem",
      fontWeight: 500,
      marginBottom: "8px",
      display: "block",
      transition: "transform 150ms var(--ease-out-quint), color 150ms var(--ease-out-quint)",
      "&:hover": {
        color: "#10b981", // primary.500
        transform: "translateX(2px)",
      },
    }}
  >
    {children}
  </Link>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed to newsletter successfully!");
    setEmail("");
  };

  return (
    <StyledFooter>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Grid container spacing={{ xs: 3.5, sm: 4, md: 5 }}>
          {/* COLUMN 1 — ABOUT */}
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            {/* Brand Logo & Title */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "5px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(16, 185, 129, 0.2)",
                  mr: 1.25,
                  flexShrink: 0,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 22H6.5L12 9.5L17.5 22H22L12 2Z" fill="white" />
                </svg>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                  fontSize: "1.0625rem",
                  lineHeight: 1,
                }}
              >
                ArcShelf
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                lineHeight: 1.6,
                fontSize: "0.8125rem",
                mb: 1.5,
              }}
            >
              ArcShelf is a community-powered, open-source archive of previous-year university exam papers. Search, prepare, and contribute to help students excel.
            </Typography>

            {/* Open-source GitHub link */}
            <Button
              component="a"
              href="https://github.com/ravii333/Arcshelf"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<GitHubIcon sx={{ fontSize: 18 }} />}
              sx={{
                alignSelf: "flex-start",
                mt: "auto",
                color: "rgba(255, 255, 255, 0.85)",
                fontWeight: 600,
                fontSize: "0.75rem",
                textTransform: "none",
                borderRadius: "8px",
                px: 1.5,
                py: 0.6,
                border: "1.5px solid rgba(255, 255, 255, 0.12)",
                transition: "all 150ms ease",
                "&:hover": {
                  color: "#10b981",
                  borderColor: "#10b981",
                  background: "rgba(16, 185, 129, 0.06)",
                },
              }}
            >
              View on GitHub
            </Button>
          </Grid>

          {/* COLUMN 2 — QUICK LINKS */}
          <Grid
            size={{ xs: 12, sm: 6, md: 2 }}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <FooterHeading variant="overline">Quick Links</FooterHeading>
            <Box>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/browse">Browse Papers</FooterLink>
              <FooterLink to="/submit">Upload Paper</FooterLink>
              <FooterLink to="/manage/colleges">Manage Colleges</FooterLink>
            </Box>
          </Grid>

          {/* COLUMN 3 — CONTACT */}
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <FooterHeading variant="overline">Contact</FooterHeading>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                marginBottom: "0.75rem",
                lineHeight: 1.55,
                fontSize: "0.8125rem",
              }}
            >
              Have suggestions or questions? Get in touch with our team.
            </Typography>
            <Link
              href="mailto:kumar.ravi.tech01@gmail.com"
              sx={{
                color: "#10b981", // primary.500 highlight
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.8125rem",
                transition: "color 150ms ease",
                "&:hover": { textDecoration: "underline", color: "#34d399" },
              }}
            >
              kumar.ravi.tech01@gmail.com
            </Link>
          </Grid>

          {/* COLUMN 4 — NEWSLETTER & SOCIAL */}
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <FooterHeading variant="overline">Stay Updated</FooterHeading>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                marginBottom: "1rem",
                lineHeight: 1.55,
                fontSize: "0.8125rem",
              }}
            >
              Subscribe to get notified about new features and paper additions.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <TextField
                placeholder="Your email address"
                variant="outlined"
                size="small"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  background: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "8px",
                  input: { color: "rgba(255, 255, 255, 0.95)", fontSize: "0.8125rem", py: "8px" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    borderWidth: "1.5px",
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#10b981",
                    borderWidth: "2px",
                  },
                }}
              />

              <Button
                variant="contained"
                type="submit"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  borderRadius: "8px",
                  height: 36,
                  backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  "&:hover": {
                    backgroundImage: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)",
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>

          </Grid>
        </Grid>

        {/* DIVIDER */}
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 3 }} />

        {/* BOTTOM BAR */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
            textAlign: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.35)", fontSize: "0.7rem" }}>
            © {new Date().getFullYear()} ArcShelf — MIT License
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.35)", fontSize: "0.7rem" }}>
            Built with 💚 by students, for students
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
}
