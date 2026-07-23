import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Collapse,
  Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as api from "../api";
import ContributionCard from "../components/common/ContributionCard";
import LoadingCard from "../components/common/LoadingCard";
import EmptyState from "../components/common/EmptyState";
import PaginationBar from "../components/common/PaginationBar";
import useDebounce from "../hooks/useDebounce";

const EXAM_TYPES = ["Mid Sem", "End Sem", "Sessional", "Practical", "Quiz", "Assignment"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);
const PER_PAGE = 10;

function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get("search") || "";
  const examType = searchParams.get("examType") || "";
  const year = searchParams.get("year") || "";
  const course = searchParams.get("course") || "";

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 300);
  const isFirstRender = useRef(true);

  // Sync url search to local search input state on navigation / back buttons
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Handle auto-searching when debounced input changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = {};
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (examType) params.examType = examType;
    if (year) params.year = year;
    if (course) params.course = course;
    setSearchParams(params);
  }, [debouncedSearch, examType, year, course, setSearchParams]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PER_PAGE };
      if (search) params.search = search;
      if (examType) params.examType = examType;
      if (year) params.year = year;
      if (course) params.course = course;
      const { data } = await api.fetchQuestions(params);
      setQuestions(data.items);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setQuestions([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, examType, year, course, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to the first page whenever the active filters change.
  useEffect(() => {
    setPage(1);
  }, [search, examType, year, course]);

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

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 }, py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }} className="animate-fadeInDown">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            color: "neutral.900",
            mb: 0.5,
          }}
        >
          Browse Papers
        </Typography>
        <Typography variant="body2" color="neutral.500" sx={{ fontWeight: 500 }}>
          {loading
            ? "Searching..."
            : `${total} paper${total !== 1 ? "s" : ""} found`}
          {activeFilterCount > 0 && ` — ${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""}`}
        </Typography>
      </Box>

      {/* Search + Filter Panel */}
      <Paper
        elevation={0}
        sx={{
          p: "20px 24px",
          mb: 4,
          border: "1px solid",
          borderColor: "neutral.200",
          borderRadius: "16px",
          bgcolor: "neutral.0",
        }}
      >
        {/* Search Row */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mb: showFilters ? 2.5 : 0 }}>
          <TextField
            fullWidth
            placeholder="Search by subject, course, topics..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 44,
                borderRadius: "10px",
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "neutral.400", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
            <Button
              variant="contained"
              onClick={() => {
                const params = {};
                if (localSearch.trim()) params.search = localSearch.trim();
                if (examType) params.examType = examType;
                if (year) params.year = year;
                if (course) params.course = course;
                setSearchParams(params);
              }}
              sx={{
                height: 44,
                minWidth: 110,
                backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                '&:hover': {
                  backgroundImage: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
                },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowFilters((v) => !v)}
              endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{
                height: 44,
                borderColor: activeFilterCount > 0 ? "primary.600" : "neutral.200",
                color: activeFilterCount > 0 ? "primary.700" : "neutral.600",
                "&:hover": {
                  borderColor: "primary.600",
                  bgcolor: "rgba(5, 150, 105, 0.04)",
                }
              }}
            >
              Filters
              {activeFilterCount > 0 && (
                <Chip
                  label={activeFilterCount}
                  size="small"
                  sx={{
                    ml: 1.25,
                    height: 18,
                    fontSize: "0.65rem",
                    bgcolor: "primary.600",
                    color: "white",
                    fontWeight: 700,
                  }}
                />
              )}
            </Button>
          </Box>
        </Box>

        {/* Collapsible Filter Row */}
        <Collapse in={showFilters}>
          <Divider sx={{ my: 2.5, borderColor: "neutral.200" }} />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1 }}>
              <FilterListIcon sx={{ color: "neutral.400", fontSize: 18 }} />
              <Typography variant="body2" color="neutral.700" sx={{ fontWeight: 600 }}>
                Filter by:
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="exam-type-filter-label">Exam Type</InputLabel>
              <Select
                labelId="exam-type-filter-label"
                value={examType}
                label="Exam Type"
                onChange={(e) => updateFilter("examType", e.target.value)}
                sx={{ borderRadius: "10px", height: 38 }}
              >
                <MenuItem value="">All Types</MenuItem>
                {EXAM_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="year-filter-label">Year</InputLabel>
              <Select
                labelId="year-filter-label"
                value={year}
                label="Year"
                onChange={(e) => updateFilter("year", e.target.value)}
                sx={{ borderRadius: "10px", height: 38 }}
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
                sx={{
                  color: "neutral.500",
                  ml: { xs: 0, sm: "auto" },
                  fontWeight: 600,
                  "&:hover": { color: "error.main", bgcolor: "transparent" }
                }}
              >
                Clear all
              </Button>
            )}
          </Box>
        </Collapse>

        {/* Active Filter Chips Row */}
        {activeFilterCount > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: showFilters ? 2 : 1.5 }}>
            {search && (
              <Chip
                label={`Search: "${search}"`}
                onDelete={() => {
                  setLocalSearch("");
                  updateFilter("search", "");
                }}
                size="small"
                sx={{
                  bgcolor: "primary.50",
                  color: "primary.700",
                  border: "1px solid",
                  borderColor: "primary.200",
                  height: 24,
                  fontWeight: 600,
                }}
              />
            )}
            {examType && (
              <Chip
                label={`Exam: ${examType}`}
                onDelete={() => updateFilter("examType", "")}
                size="small"
                sx={{
                  bgcolor: "primary.50",
                  color: "primary.700",
                  border: "1px solid",
                  borderColor: "primary.200",
                  height: 24,
                  fontWeight: 600,
                }}
              />
            )}
            {year && (
              <Chip
                label={`Year: ${year}`}
                onDelete={() => updateFilter("year", "")}
                size="small"
                sx={{
                  bgcolor: "primary.50",
                  color: "primary.700",
                  border: "1px solid",
                  borderColor: "primary.200",
                  height: 24,
                  fontWeight: 600,
                }}
              />
            )}
            {course && (
              <Chip
                label={`Course: ${course}`}
                onDelete={() => updateFilter("course", "")}
                size="small"
                sx={{
                  bgcolor: "primary.50",
                  color: "primary.700",
                  border: "1px solid",
                  borderColor: "primary.200",
                  height: 24,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Results grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 12 }).map((_, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
              <LoadingCard />
            </Grid>
          ))}
        </Grid>
      ) : questions.length === 0 ? (
        <EmptyState
          icon={<SearchIcon />}
          title="No papers found"
          description="Try adjusting your filters, searching for something else, or help the archive grow by contributing."
          action={{
            text: activeFilterCount > 0 ? "Clear Filters" : "Contribute a Paper",
            onClick: activeFilterCount > 0 ? clearAll : undefined,
            component: activeFilterCount > 0 ? undefined : Link,
            to: activeFilterCount > 0 ? undefined : "/submit",
            variant: "contained",
          }}
        />
      ) : (
        <>
          <Grid container spacing={3}>
            {questions.map((q, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                key={q._id}
                sx={{
                  animation: "fadeInUp 500ms var(--ease-out-quint) forwards",
                  animationDelay: index < 8 ? `${index * 50}ms` : "0ms",
                  opacity: 0,
                }}
              >
                <ContributionCard question={q} />
              </Grid>
            ))}
          </Grid>

          <PaginationBar
            page={page}
            count={totalPages}
            total={total}
            perPage={PER_PAGE}
            label="papers"
            onChange={(_, v) => setPage(v)}
          />
        </>
      )}

      {/* Floating contribute CTA */}
      {!loading && total > 0 && (
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            pt: 5,
            borderTop: "1px solid",
            borderColor: "neutral.200",
          }}
        >
          <Typography variant="body2" color="neutral.500" sx={{ mb: 2, fontWeight: 500 }}>
            Can't find the paper you need?
          </Typography>
          <Button
            component={Link}
            to="/submit"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              "&:hover": {
                backgroundImage: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
                boxShadow: "var(--shadow-brand)",
              },
            }}
          >
            Contribute a Paper
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default BrowsePage;
