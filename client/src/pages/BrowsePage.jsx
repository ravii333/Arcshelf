import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Pagination,
  IconButton,
  Collapse,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as api from "../api";
import ContributionCard from "../components/common/ContributionCard";

const EXAM_TYPES = ["Mid Sem", "Final Sem", "Quiz", "Assignment"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);
const PER_PAGE = 12;

function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get("search") || "";
  const examType = searchParams.get("examType") || "";
  const year = searchParams.get("year") || "";
  const course = searchParams.get("course") || "";

  const [localSearch, setLocalSearch] = useState(search);

  const applySearch = useCallback(() => {
    const params = {};
    if (localSearch.trim()) params.search = localSearch.trim();
    if (examType) params.examType = examType;
    if (year) params.year = year;
    if (course) params.course = course;
    setSearchParams(params);
  }, [localSearch, examType, year, course, setSearchParams]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (examType) params.examType = examType;
      if (year) params.year = year;
      if (course) params.course = course;
      const { data } = await api.fetchQuestions(params);
      setQuestions(data);
      setPage(1);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [search, examType, year, course]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilter = (key, value) => {
    const params = {};
    if (localSearch.trim()) params.search = localSearch.trim();
    if (examType) params.examType = examType;
    if (year) params.year = year;
    if (course) params.course = course;
    if (value) params[key] = value;
    else delete params[key];
    setSearchParams(params);
  };

  const clearAll = () => {
    setLocalSearch("");
    setSearchParams({});
  };

  const activeFilterCount = [search, examType, year, course].filter(Boolean).length;
  const paginatedQuestions = questions.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(questions.length / PER_PAGE);

  return (
    <Box sx={{ py: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Browse Papers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {loading
            ? "Searching..."
            : `${questions.length} paper${questions.length !== 1 ? "s" : ""} found`}
          {activeFilterCount > 0 && ` — ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`}
        </Typography>
      </Box>

      {/* Search + Filter Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        {/* Search Row */}
        <Box sx={{ display: "flex", gap: 1.5, mb: showFilters ? 3 : 0 }}>
          <TextField
            fullWidth
            placeholder="Search by subject, course, topics..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applySearch()}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={applySearch}
            sx={{
              minWidth: 100,
              bgcolor: "#16a34a",
              "&:hover": { bgcolor: "#128c43" },
              flexShrink: 0,
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowFilters((v) => !v)}
            endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              borderColor: activeFilterCount > 0 ? "#16a34a" : "grey.300",
              color: activeFilterCount > 0 ? "#16a34a" : "text.secondary",
              flexShrink: 0,
            }}
          >
            Filters
            {activeFilterCount > 0 && (
              <Chip
                label={activeFilterCount}
                size="small"
                sx={{
                  ml: 1,
                  height: 18,
                  fontSize: "0.65rem",
                  bgcolor: "#16a34a",
                  color: "white",
                }}
              />
            )}
          </Button>
        </Box>

        {/* Collapsible Filter Row */}
        <Collapse in={showFilters}>
          <Divider sx={{ mb: 3 }} />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FilterListIcon sx={{ color: "text.secondary", fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Filter by:
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Exam Type</InputLabel>
              <Select
                value={examType}
                label="Exam Type"
                onChange={(e) => updateFilter("examType", e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {EXAM_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                label="Year"
                onChange={(e) => updateFilter("year", e.target.value)}
              >
                <MenuItem value="">All Years</MenuItem>
                {YEARS.map((y) => (
                  <MenuItem key={y} value={String(y)}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {activeFilterCount > 0 && (
              <Button
                size="small"
                onClick={clearAll}
                startIcon={<ClearIcon />}
                sx={{ color: "text.secondary", ml: "auto" }}
              >
                Clear all
              </Button>
            )}
          </Box>

          {/* Active Filter Chips */}
          {(search || course) && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {search && (
                <Chip
                  label={`Search: "${search}"`}
                  onDelete={() => {
                    setLocalSearch("");
                    updateFilter("search", "");
                  }}
                  size="small"
                  sx={{ bgcolor: "rgba(22, 163, 74, 0.1)", color: "#128c43" }}
                />
              )}
              {course && (
                <Chip
                  label={`Course: ${course}`}
                  onDelete={() => updateFilter("course", "")}
                  size="small"
                  sx={{ bgcolor: "rgba(22, 163, 74, 0.1)", color: "#128c43" }}
                />
              )}
            </Box>
          )}
        </Collapse>
      </Paper>

      {/* Results */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ color: "#16a34a", mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Searching papers...
            </Typography>
          </Box>
        </Box>
      ) : paginatedQuestions.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            py: 10,
            px: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No papers found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try different keywords or adjust your filters, or{" "}
            <Link to="/submit" style={{ color: "#16a34a", fontWeight: 600 }}>
              contribute the first one
            </Link>
            .
          </Typography>
          {activeFilterCount > 0 && (
            <Button
              onClick={clearAll}
              variant="outlined"
              sx={{ borderColor: "#16a34a", color: "#128c43" }}
            >
              Clear Filters
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedQuestions.map((q) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={q._id}>
                <ContributionCard question={q} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => {
                  setPage(v);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                sx={{
                  "& .MuiPaginationItem-root.Mui-selected": {
                    bgcolor: "#16a34a",
                    color: "white",
                    "&:hover": { bgcolor: "#128c43" },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Floating contribute CTA */}
      {!loading && questions.length > 0 && (
        <Box sx={{ textAlign: "center", mt: 6, pt: 4, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Can't find what you're looking for?
          </Typography>
          <Button
            component={Link}
            to="/submit"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              background: "linear-gradient(135deg, #16a34a 0%, #128c43 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #128c43 0%, #0f7036 100%)",
              },
            }}
          >
            Contribute a Paper
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default BrowsePage;
