import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  Avatar,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import BookIcon from "@mui/icons-material/Book";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PeopleIcon from "@mui/icons-material/People";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import * as api from "../api";
import ContributionCard from "../components/common/ContributionCard";
import FeatureCard from "../components/common/FeatureCard";

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const FloatingBox = styled(Box)(() => ({
  animation: `${floatAnimation} 6s ease-in-out infinite`,
}));

const FloatingBoxDelayed = styled(Box)(() => ({
  animation: `${floatAnimation} 6s ease-in-out infinite`,
  animationDelay: "2s",
}));

// --- Section 1: The Hero Section ---
function HeroSection({ searchQuery, onSearchChange, onSearch }) {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        textAlign: "center",
        pt: { xs: 3, md: 5 },
        pb: 10,
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <FloatingBox
          sx={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 320,
            height: 320,
            background: "linear-gradient(135deg, rgba(34, 197, 94, 1) 0%, rgba(168, 85, 247, 0.3) 100%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <FloatingBoxDelayed
          sx={{
            position: "absolute",
            bottom: -160,
            left: -160,
            width: 320,
            height: 320,
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
      </Box>

      <Chip
        icon={<AutoAwesomeIcon />}
        label="Empowering Student Success"
        sx={{
          mb: 5,
          background: "linear-gradient(135deg, #41eaa7 0%, #224e46 50%, #0d9e47 100%)",
          color: "white",
          fontWeight: 600,
          border: "1px solid rgba(22, 163, 74, 0.2)",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "3rem", md: "5rem" },
            fontWeight: 800,
            mb: 3,
            background: "linear-gradient(135deg, #0b1f17 0%, #15322d 50%, #128c43 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Learn, Grow, and
          <br />
          <Typography
            component="span"
            variant="h2"
            sx={{ fontSize: { xs: "3rem", md: "5rem" }, fontWeight: 800, color: "text.primary" }}
          >
            Achieve Your Goals
          </Typography>
        </Typography>

        <Typography
          variant="h6"
          sx={{ maxWidth: "48rem", mx: "auto", mb: 6, color: "text.secondary", lineHeight: 1.8 }}
        >
          ArcShelf is a collaborative, open-source archive of previous years&apos; university exam papers.{" "}
          <Typography component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
            Search, prepare, and contribute
          </Typography>{" "}
          to help students excel.
        </Typography>

        <Box sx={{ maxWidth: "42rem", mx: "auto", mt: 6 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Search for a subject, course, or college..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  "&:hover": { boxShadow: 3 },
                  "&.Mui-focused": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 4px rgba(22, 163, 74, 0.2)",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={onSearch}
              sx={{
                bgcolor: "#16a34a",
                "&:hover": { bgcolor: "#128c43", transform: "scale(1.05)" },
                minWidth: 120,
                px: 3,
              }}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2, gap: 1 }}>
            <InfoIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Or, browse the full archive in the sidebar
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4} sx={{ maxWidth: "42rem", mx: "auto", mt: 6, pt: 6 }}>
          <Grid item xs={12} sm={4}>
            <FloatingBox>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: "#2563eb", mb: 1 }}>
                  1K+
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Active Students
                </Typography>
              </Box>
            </FloatingBox>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ animation: `${floatAnimation} 6s ease-in-out infinite`, animationDelay: "0.3s" }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: "#9333ea", mb: 1 }}>
                  50+
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Resources
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ animation: `${floatAnimation} 6s ease-in-out infinite`, animationDelay: "0.6s" }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: "#e91e63", mb: 1 }}>
                  98%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Satisfaction
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

// --- Section 2: How It Works ---
function HowItWorksSection() {
  const features = [
    {
      icon: <BookIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Prepare & Practice",
      description:
        "Browse a vast collection of papers to understand exam patterns, important topics, and question styles for your specific course.",
      badgeText: "Step 1",
      iconBgColor: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    },
    {
      icon: <CloudUploadIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
      title: "Contribute & Collaborate",
      description:
        "Have a paper we're missing? Upload it in seconds and become a part of a community helping thousands of fellow students.",
      badgeText: "Step 2",
      iconBgColor: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
      gradient: "linear-gradient(135deg, #16a34a 0%, #128c43 100%)",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#9333ea" }} />,
      title: "Community Powered",
      description:
        "ArcShelf is built by students, for students. The more we all contribute, the more powerful this resource becomes.",
      badgeText: "Step 3",
      iconBgColor: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
      gradient: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
    },
  ];

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, position: "relative" }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 700, mb: 3 }}
          >
            A Simple, Powerful Tool for Students
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: "48rem", mx: "auto", color: "text.secondary" }}>
            Prepare for your exams and help others do the same. Join thousands of students building
            the future of education.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                badgeText={feature.badgeText}
                iconBgColor={feature.iconBgColor}
                gradient={feature.gradient}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function RecentContributionsSection({ questions, loading }) {
  return (
    <Box component="section" sx={{ position: "relative", py: { xs: 4, md: 6 }, overflow: "hidden" }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, mb: 1 }}
          >
            Latest Uploads
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: "42rem", mx: "auto", color: "text.secondary" }}>
            See what your peers have been sharing and discover new study materials.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#16a34a", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Loading recent papers...
              </Typography>
            </Box>
          ) : questions.length === 0 ? (
            <Paper
              elevation={2}
              sx={{
                textAlign: "center",
                p: 4,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                maxWidth: "36rem",
                mx: "auto",
              }}
            >
              <Avatar sx={{ width: 56, height: 56, bgcolor: "success.light", mx: "auto", mb: 2 }}>
                <BookIcon sx={{ color: "#16a34a" }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No papers yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Be the first to contribute and help build this amazing resource!
              </Typography>
              <Button
                component={Link}
                to="/submit"
                variant="contained"
                sx={{ bgcolor: "#16a34a", "&:hover": { bgcolor: "#128c43", transform: "scale(1.05)" } }}
              >
                Upload First Paper
              </Button>
            </Paper>
          ) : (
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  pb: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, width: "max-content", mx: "auto" }}>
                  {questions.map((q) => (
                    <Box key={q._id} sx={{ flexShrink: 0, width: 288 }}>
                      <ContributionCard question={q} />
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#16a34a" }} />
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "success.light" }} />
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "success.light" }} />
              </Box>

              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}
                >
                  <ArrowBackIcon sx={{ fontSize: 16 }} />
                  Scroll horizontally to see more
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Typography>
              </Box>
            </Box>
          )}

          {questions.length > 0 && (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button
                component={Link}
                to="/submit"
                variant="contained"
                size="large"
                startIcon={<CloudUploadIcon />}
                sx={{
                  background: "linear-gradient(135deg, #16a34a 0%, #128c43 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
                    transform: "scale(1.05)",
                  },
                  px: 4,
                  py: 1.5,
                }}
              >
                Have a paper? Contribute now
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

// --- Main HomePage Component ---
function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getRecentQuestions = async () => {
      try {
        const { data } = await api.fetchQuestions();
        setQuestions(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    getRecentQuestions();
  }, []);

  const handleSearch = () => {
    const q = searchQuery.trim();
    navigate(q ? `/browse?search=${encodeURIComponent(q)}` : "/browse");
  };

  return (
    <Box>
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />
      <HowItWorksSection />
      <RecentContributionsSection questions={questions} loading={loading} />
    </Box>
  );
}

export default HomePage;
