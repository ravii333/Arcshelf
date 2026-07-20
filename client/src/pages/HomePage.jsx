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
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BookIcon from "@mui/icons-material/Book";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedIcon from "@mui/icons-material/Verified";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import * as api from "../api";
import heroImage from "../assets/hero-bookshelf.png";
import ContributionCard from "../components/common/ContributionCard";
import FeatureCard from "../components/common/FeatureCard";
import StatCard from "../components/common/StatCard";
import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import DashboardPage from "./DashboardPage";

// --- Hero Section ---
function HeroSection({ searchQuery, onSearchChange, onSearch }) {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        textAlign: "center",
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
        overflow: "hidden",
        backgroundImage: {
          xs: "linear-gradient(160deg, #d1fae5 0%, #ecfdf5 35%, #eff6ff 70%, #e0e7ff 100%)",
          md: "linear-gradient(120deg, #d1fae5 0%, #ecfdf5 32%, #eff6ff 68%, #dbeafe 100%)",
        },
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 }, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            position: "relative",
            maxWidth: 840,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* Text Column */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 720,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              mx: "auto",
            }}
          >
            {/* Announcement Chip */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                px: 2,
                py: 0.75,
                mb: 4,
                background: "linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)",
                border: "1px solid rgba(5, 150, 105, 0.2)",
                borderRadius: "9999px",
                color: "primary.700",
                boxShadow: "0 2px 8px rgba(5, 150, 105, 0.05)",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "primary.600",
                }}
                className="animate-pulse-dot"
              />
              <AutoAwesomeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.02em" }}>
                Empowering 1000+ Students
              </Typography>
            </Box>

            {/* Title + Subtitle over a compact bookshelf backdrop */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 600,
                mx: "auto",
                mb: 5,
                // The panel height follows the text (plus this padding), so the
                // headline/subtitle are NEVER clipped. The image fills behind as a
                // snug backdrop — `py` controls how much shelf shows above/below.
                px: { xs: 3, sm: 5 },
                py: { xs: 5, md: 7 },
                borderRadius: "28px",
                overflow: "hidden",
                // A light wash keeps the text readable while the shelves stay visible.
                backgroundImage: `linear-gradient(180deg, rgba(248,250,252,0.42) 0%, rgba(248,250,252,0.26) 50%, rgba(248,250,252,0.50) 100%), url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* H1 Title */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                  fontWeight: 800,
                  mb: 2.5,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "block",
                    mb: 0.5,
                    animation: "fadeInUp 500ms var(--ease-out-quint) forwards",
                  }}
                >
                  Learn, Grow, and
                </Box>
                <Box
                  component="span"
                  sx={{
                    color: "neutral.900",
                    animation: "fadeInUp 700ms var(--ease-out-quint) forwards",
                    display: "block",
                  }}
                >
                  Achieve Your Goals
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 520,
                  mx: "auto",
                  mb: 0,
                  color: "neutral.600",
                  fontSize: { xs: "0.9375rem", md: "1rem" },
                  lineHeight: 1.65,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                ArcShelf is a collaborative open-source archive of previous years' university exam papers.{" "}
                <Box component="span" sx={{ fontWeight: 700, color: "neutral.900" }}>
                  Search, prepare, and contribute
                </Box>{" "}
                to help students excel.
              </Typography>
            </Box>

            {/* Search Input Container */}
            <Box
              sx={{
                width: "100%",
                maxWidth: 600,
                mx: "auto",
                mb: 3,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                justifyContent: "center",
              }}
            >
              <TextField
                fullWidth
                placeholder="Search subjects, courses, colleges..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 52,
                    bgcolor: "neutral.0",
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.08)",
                    transition: "all 200ms ease",
                    '& fieldset': { borderColor: "neutral.200", borderWidth: "1.5px" },
                    '&:hover fieldset': { borderColor: "neutral.300" },
                    '&.Mui-focused': {
                      boxShadow: "0 0 0 4px rgba(5,150,105,0.15)",
                      '& fieldset': { borderColor: "primary.500", borderWidth: "2px" },
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "neutral.400", ml: 0.5 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" sx={{ display: { xs: "none", sm: "flex" } }}>
                      <Box
                        sx={{
                          border: "1px solid",
                          borderColor: "neutral.200",
                          bgcolor: "neutral.50",
                          borderRadius: "6px",
                          px: 1,
                          py: 0.25,
                          color: "neutral.400",
                          fontSize: "11px",
                          fontWeight: 700,
                          userSelect: "none",
                        }}
                      >
                        ⏎
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={onSearch}
                sx={{
                  height: 52,
                  px: 4,
                  borderRadius: "12px",
                  bgcolor: "primary.600",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  flexShrink: 0,
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Search
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, alignItems: "center", width: "100%" }}>
              <Typography variant="body2" color="neutral.500" sx={{ fontSize: "13px" }}>
                or
              </Typography>
              <Link
                to="/browse"
                style={{
                  color: "#047857",
                  fontWeight: 600,
                  fontSize: "13px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                Browse all papers
                <ArrowForwardIcon sx={{ fontSize: 13 }} />
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// --- Stats Bar Component ---
function StatsBar() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .fetchStats()
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const fmt = (n) => (n == null ? "—" : n >= 1000 ? `${(n / 1000).toFixed(1)}K+` : `${n}`);

  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        bgcolor: "neutral.50",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "neutral.200",
        width: "100%",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            width: "100%",
            gap: { xs: 3, md: 0 },
          }}
        >
          {/* Stat 1 */}
          <Box
            sx={{
              px: { xs: 2, md: 3, lg: 4 },
              py: { xs: 2, md: 0.5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StatCard value={fmt(stats?.students)} label="Students Registered" color="#3b82f6" />
          </Box>

          {/* Stat 2 */}
          <Box
            sx={{
              px: { xs: 2, md: 3, lg: 4 },
              py: { xs: 2, md: 0.5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StatCard value={fmt(stats?.papers)} label="Exam Papers" color="#059669" />
          </Box>

          {/* Stat 3 */}
          <Box
            sx={{
              px: { xs: 2, md: 3, lg: 4 },
              py: { xs: 2, md: 0.5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StatCard value={fmt(stats?.colleges)} label="Colleges Listed" color="#8b5cf6" />
          </Box>

          {/* Stat 4 */}
          <Box
            sx={{
              px: { xs: 2, md: 3, lg: 4 },
              py: { xs: 2, md: 0.5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StatCard value={fmt(stats?.universities)} label="Universities" color="#14b8a6" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// --- How It Works Section ---
function HowItWorksSection() {
  const steps = [
    {
      icon: <BookIcon />,
      title: "Prepare & Practice",
      description:
        "Browse a vast collection of papers to understand exam patterns, important topics, and question styles for your specific course.",
      badgeText: "01",
      iconBgColor: "rgba(59, 130, 246, 0.08)", // accent.blue tint
      stepColor: "#3b82f6",
    },
    {
      icon: <CloudUploadIcon />,
      title: "Contribute & Collaborate",
      description:
        "Have a paper we're missing? Upload it in seconds and become a part of a community helping thousands of fellow students.",
      badgeText: "02",
      iconBgColor: "rgba(5, 150, 105, 0.08)", // primary.600 tint
      stepColor: "#059669",
    },
    {
      icon: <VerifiedIcon />,
      title: "Reviewed & Verified",
      description:
        "Every submission is reviewed by our moderators before it's published, so you always study from accurate, high-quality papers.",
      badgeText: "03",
      iconBgColor: "rgba(245, 158, 11, 0.08)", // accent.amber tint
      stepColor: "#f59e0b",
    },
    {
      icon: <PeopleIcon />,
      title: "Community Powered",
      description:
        "ArcShelf is built by students, for students. The more we all contribute, the more powerful this resource becomes.",
      badgeText: "04",
      iconBgColor: "rgba(139, 92, 246, 0.08)", // accent.purple tint
      stepColor: "#8b5cf6",
    },
  ];

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <SectionHeader
          overline="HOW IT WORKS"
          title="Simple for students, powerful for everyone"
          subtitle="Prepare for your exams and help others do the same. Join thousands of students building the future of education."
          align="center"
        />

        <Box
          sx={{
            // fit-content + maxWidth:100% + mx:auto → the row is centered when all
            // cards fit, and becomes a horizontal scroller (from the first card)
            // whenever they don't — at any breakpoint, no cards ever get clipped.
            width: "fit-content",
            maxWidth: "100%",
            mx: "auto",
            display: "flex",
            gap: { xs: 2.5, md: 4 },
            flexDirection: "row",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            pb: 3,
            pt: 1,
            px: 0.5,
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            mt: 4,
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                // On phones each card fills the viewport (one card per swipe, with a
                // small peek of the next); fixed widths kick in from sm upward.
                width: { xs: "min(85vw, 340px)", sm: 260, md: 280 },
                flexShrink: 0,
                scrollSnapAlign: "start",
                height: "auto",
              }}
            >
              <FeatureCard
                icon={step.icon}
                title={step.title}
                description={step.description}
                badgeText={step.badgeText}
                stepColor={step.stepColor}
                iconBgColor={step.iconBgColor}
              />
            </Box>
          ))}
        </Box>

        {/* Scroll affordance — only shown on narrow screens where the row scrolls */}
        <Typography
          variant="caption"
          color="neutral.400"
          sx={{
            display: { xs: "flex", lg: "none" },
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mt: 1,
            fontWeight: 500,
          }}
        >
          ← Scroll to view more →
        </Typography>
      </Container>
    </Box>
  );
}

// --- Recent Contributions Section ---
function RecentContributionsSection({ questions, loading }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <SectionHeader
          title="Latest Uploads"
          subtitle="See what your peers have been sharing and discover new study materials."
          align="center"
          action={
            <Button
              component={Link}
              to="/browse"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: "primary.700", fontWeight: 600, fontSize: "0.875rem", p: 0 }}
            >
              See all papers
            </Button>
          }
        />

        <Box sx={{ mt: 1 }}>
          {loading ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
              <CircularProgress sx={{ color: "primary.main", mb: 2 }} />
              <Typography variant="body2" color="neutral.500">
                Loading recent papers...
              </Typography>
            </Box>
          ) : questions.length === 0 ? (
            <EmptyState
              icon={<BookIcon />}
              title="No papers uploaded yet"
              description="Be the first to contribute and help build this amazing academic repository!"
              action={{
                text: "Upload First Paper",
                component: Link,
                to: "/submit",
                variant: "contained",
              }}
            />
          ) : (
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  overflowX: "auto",
                  display: "flex",
                  gap: "16px",
                  pb: 3,
                  pt: 1,
                  px: 1,
                  mx: -1,
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {questions.map((q) => (
                  <Box
                    key={q._id}
                    sx={{
                      flexShrink: 0,
                      // One card per view on phones (matches the How It Works carousel).
                      width: { xs: "min(85vw, 340px)", sm: 280 },
                      scrollSnapAlign: "start",
                    }}
                  >
                    <ContributionCard question={q} />
                  </Box>
                ))}
                {/* Visual spacer to suggest horizontal scrollability */}
                <Box sx={{ flexShrink: 0, width: 40 }} />
              </Box>

              <Typography
                variant="caption"
                color="neutral.400"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mt: 1,
                  fontWeight: 500,
                }}
              >
                ← Scroll horizontally to view more →
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

// --- CTA Banner Component ---
function CtaBanner() {
  return (
    <Box component="section" sx={{ mb: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 3, md: 4, lg: 5 } }}>
        <Box
          sx={{
            py: { xs: 8, md: 10 },
            px: { xs: 3, sm: 6, md: 8 },
            borderRadius: { xs: 0, md: 6 },
            background: "linear-gradient(135deg, #064e3b 0%, #059669 50%, #065f46 100%)",
            color: "white",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(5, 150, 105, 0.15)",
          }}
        >
          <Box sx={{ maxWidth: 640, mx: "auto" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.75rem" },
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: "rgba(255, 255, 255, 0.95)",
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Have a paper to share?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.75)",
                fontSize: { xs: "0.9375rem", md: "1.0625rem" },
                mb: 5,
                lineHeight: 1.6,
              }}
            >
              Join 1000+ students and grow the archive. Your contribution helps your peers succeed.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
                gap: 2.5,
              }}
            >
              <Button
                component={Link}
                to="/submit"
                variant="contained"
                sx={{
                  bgcolor: "#ffffff",
                  color: "primary.700",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "&:hover": {
                    bgcolor: "neutral.50",
                    transform: "translateY(-1.5px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Upload a Paper
              </Button>
              <Button
                component={Link}
                to="/browse"
                variant="outlined"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  borderWidth: "1.5px",
                  color: "#ffffff",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "10px",
                  "&:hover": {
                    borderColor: "#ffffff",
                    bgcolor: "rgba(255,255,255,0.08)",
                    transform: "translateY(-1.5px)",
                  },
                }}
              >
                Browse Archive
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// --- Main LandingPage Component (Public) ---
function LandingPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getRecentQuestions = async () => {
      try {
        const { data } = await api.fetchQuestions({ limit: 6 });
        setQuestions(data.items);
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
    <Box sx={{ pb: 4, width: "100%" }}>
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />
      {/*<StatsBar /> for temporarly*/}
      <HowItWorksSection />
      <RecentContributionsSection questions={questions} loading={loading} />
      <CtaBanner />
    </Box>
  );
}

// --- Main HomePage Wrapper ---
function HomePage() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("profile")));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("profile")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (user) {
    return <DashboardPage />;
  }

  return <LandingPage />;
}

export default HomePage;
