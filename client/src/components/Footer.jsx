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

const StyledFooter = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #0b1f17 0%, #15322d 50%, #128c43 100%)",
  color: "white",
  marginTop: "auto",
  paddingTop: "3.5rem",
  paddingBottom: "3rem",
  boxShadow: theme.shadows[8],
}));

const FooterHeading = styled(Typography)({
  fontWeight: 700,
  fontSize: "1.15rem",
  marginBottom: "1.2rem",
});

const FooterLink = ({ to, children }) => (
  <Link
    component={RouterLink}
    to={to}
    sx={{
      color: "rgba(255,255,255,0.78)",
      textDecoration: "none",
      fontSize: "0.95rem",
      marginBottom: "10px",
      display: "block",
      transition: "all 0.18s ease",
      "&:hover": { color: "#22c55e", transform: "translateX(4px)" },
    }}
  >
    {children}
  </Link>
);

export default function Footer() {
  return (
    <StyledFooter>
      <Container maxWidth="lg">

        {/* IMPORTANT: NO WRAPPING ON DESKTOP */}
        <Grid
          container
          spacing={6}
          wrap="nowrap"
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >

          {/* COLUMN 1 — ABOUT */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
          >
            <FooterHeading>About ArcShelf</FooterHeading>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.7,
                maxWidth: "100%",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              ArcShelf is your one-stop platform for accessing and sharing
              previous year university and college question papers — empowering
              students through open academic resources and collaboration.
            </Typography>
          </Grid>

          {/* COLUMN 2 — QUICK LINKS */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
          >
            <FooterHeading>Quick Links</FooterHeading>

            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/browse">Browse Papers</FooterLink>
            <FooterLink to="/submit">Upload Paper</FooterLink>
            <FooterLink to="/manage/colleges">Browse Colleges</FooterLink>
          </Grid>

          {/* COLUMN 3 — CONTACT */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
          >
            <FooterHeading>Contact</FooterHeading>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "0.7rem",
                lineHeight: 1.6,
              }}
            >
              Have a suggestion or question? We'd love to hear from you.
            </Typography>

            <Link
              href="mailto:contact@arcshelf.com"
              sx={{
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.95rem",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              contact@arcshelf.com
            </Link>
          </Grid>

          {/* COLUMN 4 — NEWSLETTER */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
          >
            <FooterHeading>Newsletter</FooterHeading>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "1rem",
                lineHeight: 1.6,
              }}
            >
              Stay updated with new paper uploads and platform improvements.
            </Typography>

            <TextField
              placeholder="Your email address"
              variant="outlined"
              size="small"
              sx={{
                background: "rgba(255, 255, 255, 0.12)",
                borderRadius: "6px",
                marginBottom: "0.8rem",
                input: { color: "white" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.35)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#34d399",
                },
              }}
            />

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#22c55e",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { backgroundColor: "#16a34a" },
              }}
            >
              Subscribe
            </Button>
          </Grid>

        </Grid>
      </Container>

      {/* DIVIDER */}
      <Box mt={5}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.22)" }} />
      </Box>

      {/* COPYRIGHT */}
      <Box sx={{ textAlign: "center", paddingTop: "1.25rem", pb: 2 }}>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.78)" }}>
          © {new Date().getFullYear()}{" "}
          <Typography component="span" sx={{ fontWeight: 700 }}>
            ArcShelf
          </Typography>{" "}
          — Built with 💚 for learners by learners.
        </Typography>
      </Box>
    </StyledFooter>
  );
}
