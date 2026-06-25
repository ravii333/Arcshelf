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
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Card,
  CardContent,
  CardActionArea,
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

const GradientHeader = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #0b1f17 0%, #15322d 50%, #128c43 100%)",
  color: "white",
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[8],
}));

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
  "linear-gradient(135deg, #16a34a 0%, #0d9488 100%)",
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
    <CardActionArea component={Link} to={`/questions/${question._id}`} sx={{ borderRadius: 2 }}>
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Box
          sx={{
            height: 6,
            background: cardGradient(question._id || question.subject),
            borderRadius: "8px 8px 0 0",
          }}
        />
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {question.subject}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            {question.course} — {question.year}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            <Chip label={question.examType} size="small" sx={{ fontSize: "0.65rem", height: 20 }} />
            {question.semester && (
              <Chip
                label={`Sem ${question.semester}`}
                size="small"
                sx={{ fontSize: "0.65rem", height: 20 }}
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
      try {
        const { data } = await api.fetchQuestion(id);
        setQuestion(data);
        // Fetch related in parallel after we have the main question
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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 16 }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#128c43", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Loading Paper...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!question) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 12 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Paper Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The question paper you&apos;re looking for doesn&apos;t exist or has been removed.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{
              background: "linear-gradient(135deg, #16a34a 0%, #128c43 100%)",
            }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  const isPdf = question.fileUrl && question.fileUrl.toLowerCase().endsWith(".pdf");
  const isImage = question.fileUrl && /\.(jpe?g|png|gif)$/i.test(question.fileUrl);
  const proxyUrl = isPdf
    ? `${apiBase}/pdf/proxy?url=${encodeURIComponent(question.fileUrl)}`
    : question.fileUrl;

  return (
    <Box>
      {/* Header */}
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ width: 52, height: 52, bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                <DescriptionIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {question.subject}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.25 }}>
                  {question.year}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", mb: 2 }}>
              {question.college?.university?.name}
              {question.college?.name && ` — ${question.college.name}`}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                icon={<DescriptionIcon />}
                label={question.examType}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}
              />
              <Chip
                icon={<PersonIcon />}
                label={question.createdBy?.name || "Anonymous"}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}
              />
              <Chip
                icon={<SchoolIcon />}
                label={`Semester ${question.semester}`}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}
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
                bgcolor: "white",
                color: "#128c43",
                fontWeight: 700,
                flexShrink: 0,
                "&:hover": { bgcolor: "grey.50" },
              }}
            >
              Download Paper
            </Button>
          )}
        </Box>
      </GradientHeader>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Notes */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "rgba(22,163,74,0.1)", mr: 1.5 }}>
                  <DescriptionIcon sx={{ color: "#16a34a", fontSize: 18 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notes &amp; Topics
                </Typography>
              </Box>
              {question.questionsText ? (
                <Box sx={{ "& p": { mb: 1.5 }, "& ul": { pl: 3 } }}>
                  <ReactMarkdown>{question.questionsText}</ReactMarkdown>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No additional notes were provided for this paper.
                </Typography>
              )}
            </Paper>

            {/* PDF / Image Preview */}
            {question.fileUrl && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "rgba(22,163,74,0.1)", mr: 1.5 }}>
                    <VisibilityIcon sx={{ color: "#16a34a", fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Paper Preview
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                  {isPdf && <PDFViewer fileUrl={proxyUrl} />}
                  {isImage && (
                    <Box sx={{ textAlign: "center" }}>
                      <img
                        src={question.fileUrl}
                        alt={`${question.subject} ${question.year}`}
                        style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
                      />
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, position: { lg: "sticky" }, top: { lg: 80 } }}>
            {/* Quick Info */}
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Info
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    ["Course", question.course],
                    ["Subject", question.subject],
                    ["Year", question.year],
                    ["Semester", question.semester],
                    ["Exam Type", question.examType],
                  ].map(([label, value], i, arr) => (
                    <Box key={label}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.25 }}>
                        <Typography variant="body2" color="text.secondary">
                          {label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {value}
                        </Typography>
                      </Box>
                      {i < arr.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Related Papers */}
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Related Papers
                </Typography>
                {related.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No related papers found for this course and subject.
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {related.map((r) => (
                      <RelatedPaperCard key={r._id} question={r} />
                    ))}
                    <Button
                      component={Link}
                      to={`/browse?course=${encodeURIComponent(question.course)}`}
                      endIcon={<ArrowForwardIcon />}
                      size="small"
                      sx={{ color: "#16a34a", justifyContent: "flex-start", pl: 0, mt: 0.5 }}
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
    </Box>
  );
}

export default QuestionDetailPage;
