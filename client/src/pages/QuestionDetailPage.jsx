import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  Avatar,
  Grid,
  Divider,
  Card,
  CardContent,
  CardActionArea,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import * as api from "../api";
import PDFViewer from "../components/common/PDFViewer";
import PaperBadge from "../components/common/PaperBadge";

const GradientHeader = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f172a 100%)',
  color: "white",
  padding: theme.spacing(4),
  borderRadius: 20,
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  border: 'none',
}));

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
  "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)",
];

function cardGradient(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CARD_GRADIENTS[Math.abs(hash) % CARD_GRADIENTS.length];
}

function RelatedPaperCard({ question }) {
  return (
    <CardActionArea
      component={Link}
      to={`/questions/${question._id}`}
      sx={{
        borderRadius: '16px',
        display: "block",
        mb: 1.5,
        '&:hover .related-card': {
          borderColor: "primary.300",
          bgcolor: "primary.50",
        }
      }}
    >
      <Card
        className="related-card"
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "neutral.200",
          borderRadius: '16px',
          transition: "all 200ms ease",
          bgcolor: "neutral.0",
          '&:hover': {
            transform: "none",
            boxShadow: "none",
          }
        }}
      >
        <Box
          sx={{
            height: 5,
            background: cardGradient(question._id || question.subject),
          }}
        />
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              color: "neutral.800",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.4,
            }}
          >
            {question.subject}
          </Typography>
          <Typography variant="caption" color="neutral.400" sx={{ display: "block", mb: 1, fontWeight: 500 }}>
            {question.course} — {question.year}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", alignItems: "center" }}>
            <PaperBadge label={question.examType} size="small" />
            {question.semester && (
              <Chip
                label={`Sem ${question.semester}`}
                size="small"
                sx={{
                  fontSize: "0.6875rem",
                  height: 20,
                  bgcolor: "neutral.100",
                  color: "neutral.600",
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </CardActionArea>
  );
}

function QuestionDetailPage() {
  const [question, setQuestion] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const apiBase = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const getQuestion = async () => {
      setLoading(true);
      try {
        const { data } = await api.fetchQuestion(id);
        setQuestion(data);
        // Fetch related questions
        api.fetchRelatedQuestions(id).then(({ data: rel }) => setRelated(rel)).catch(() => {});
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getQuestion();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 }, py: 4 }}>
        {/* Header Skeleton */}
        <Skeleton
          variant="rectangular"
          height={170}
          sx={{ borderRadius: "20px", mb: 4, bgcolor: "neutral.200" }}
          animation="wave"
        />

        <Grid container spacing={3}>
          {/* Content Skeleton */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: "16px", mb: 3, bgcolor: "neutral.200" }}
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              height={450}
              sx={{ borderRadius: "16px", bgcolor: "neutral.200" }}
              animation="wave"
            />
          </Grid>

          {/* Sidebar Skeleton */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Skeleton
              variant="rectangular"
              height={260}
              sx={{ borderRadius: "16px", mb: 3, bgcolor: "neutral.200" }}
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              height={350}
              sx={{ borderRadius: "16px", bgcolor: "neutral.200" }}
              animation="wave"
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 }, py: 12 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Paper Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The question paper you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{
              backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              "&:hover": {
                backgroundImage: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
              }
            }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  const isPdf = question.fileUrl && question.fileUrl.toLowerCase().endsWith(".pdf");
  const isImage = question.fileUrl && /\.(jpe?g|png|gif)$/i.test(question.fileUrl);
  const proxyUrl = isPdf
    ? `${apiBase}/pdf/proxy?url=${encodeURIComponent(question.fileUrl)}`
    : question.fileUrl;

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 }, py: 4 }}>
      {/* Header Card */}
      <GradientHeader>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { lg: "center" },
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "rgba(255,255,255,0.15)",
                  mr: 2.5,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <DescriptionIcon sx={{ fontSize: 28, color: "#ffffff" }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                  }}
                >
                  {question.subject}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", mt: 0.25, fontWeight: 500 }}>
                  Year: {question.year}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", mb: 2.5, fontWeight: 500 }}>
              {question.college?.university?.name}
              {question.college?.name && ` — ${question.college.name}`}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                label={question.examType}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<PersonIcon style={{ color: "rgba(255,255,255,0.8)" }} />}
                label={question.createdBy?.name || "Anonymous"}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<SchoolIcon style={{ color: "rgba(255,255,255,0.8)" }} />}
                label={`Semester ${question.semester}`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>

          {question.fileUrl && (
            <Button
              component="a"
              href={question.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                bgcolor: "#ffffff",
                color: "primary.700",
                fontWeight: 700,
                borderRadius: "10px",
                flexShrink: 0,
                px: 3.5,
                py: 1.25,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                "&:hover": {
                  bgcolor: "neutral.50",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                },
              }}
            >
              Download Paper
            </Button>
          )}
        </Box>
      </GradientHeader>

      <Grid container spacing={4}>
        {/* Main Content (PDF viewer, Notes) */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Notes & Topics */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                border: "1px solid",
                borderColor: "neutral.200",
                boxShadow: "none",
                bgcolor: "neutral.0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.50", mr: 1.5 }}>
                  <DescriptionIcon sx={{ color: "primary.700", fontSize: 18 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800" }}>
                  Notes &amp; Topics
                </Typography>
              </Box>
              <Divider sx={{ mb: 2.5, borderColor: "neutral.100" }} />

              {question.questionsText ? (
                <Box
                  sx={{
                    color: "neutral.700",
                    lineHeight: 1.7,
                    fontSize: "0.9375rem",
                    "& p": { mb: 1.5 },
                    "& ul": { pl: 3, mb: 1.5 },
                    "& li": { mb: 0.5 }
                  }}
                >
                  <ReactMarkdown>{question.questionsText}</ReactMarkdown>
                </Box>
              ) : (
                <Typography variant="body2" color="neutral.500" sx={{ py: 1, fontStyle: "italic" }}>
                  No additional notes were provided for this paper.
                </Typography>
              )}
            </Paper>

            {/* Paper Preview */}
            {question.fileUrl && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: "1px solid",
                  borderColor: "neutral.200",
                  boxShadow: "none",
                  bgcolor: "neutral.0",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.50", mr: 1.5 }}>
                    <VisibilityIcon sx={{ color: "primary.700", fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800" }}>
                    Paper Preview
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2.5, borderColor: "neutral.100" }} />

                <Box sx={{ bgcolor: "neutral.50", p: { xs: 1.5, md: 2 }, borderRadius: 2.5, border: "1px solid", borderColor: "neutral.100" }}>
                  {isPdf && <PDFViewer fileUrl={proxyUrl} />}
                  {isImage && (
                    <Box sx={{ textAlign: "center" }}>
                      <img
                        src={question.fileUrl}
                        alt={`${question.subject} ${question.year}`}
                        style={{ maxWidth: "100%", height: "auto", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
                      />
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* Sidebar (Quick Info, Related Papers) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              position: { lg: "sticky" },
              top: { lg: 80 },
            }}
          >
            {/* Quick Info Card */}
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "neutral.200",
                borderRadius: '16px',
                bgcolor: "neutral.0",
                boxShadow: "none",
                '&:hover': {
                  transform: "none",
                  boxShadow: "none",
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800", mb: 2 }}>
                  Quick Info
                </Typography>
                <Divider sx={{ borderColor: "neutral.100", mb: 1 }} />

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {[
                    ["Course", question.course],
                    ["Subject", question.subject],
                    ["Year", question.year],
                    ["Semester", question.semester ? `Semester ${question.semester}` : ""],
                    ["Exam Type", question.examType],
                  ].map(([label, value], i, arr) => (
                    value && (
                      <Box key={label}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                          <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
                            {label}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "neutral.800" }}>
                            {value}
                          </Typography>
                        </Box>
                        {i < arr.length - 1 && <Divider sx={{ borderColor: "neutral.100" }} />}
                      </Box>
                    )
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Related Papers Card */}
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "neutral.200",
                borderRadius: '16px',
                bgcolor: "neutral.0",
                boxShadow: "none",
                '&:hover': {
                  transform: "none",
                  boxShadow: "none",
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "neutral.800", mb: 2.5 }}>
                  Related Papers
                </Typography>
                {related.length === 0 ? (
                  <Typography variant="body2" color="neutral.400" sx={{ py: 1, fontStyle: "italic" }}>
                    No related papers found for this course and subject.
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {related.map((r) => (
                      <RelatedPaperCard key={r._id} question={r} />
                    ))}
                    
                    <Button
                      component={Link}
                      to={`/browse?course=${encodeURIComponent(question.course)}`}
                      endIcon={<ArrowForwardIcon />}
                      size="small"
                      sx={{
                        color: "primary.700",
                        justifyContent: "flex-start",
                        pl: 0,
                        mt: 1,
                        fontWeight: 600,
                        backgroundColor: "transparent !important",
                        "&:hover": { color: "primary.800" }
                      }}
                    >
                      Browse all {question.course} papers
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default QuestionDetailPage;
