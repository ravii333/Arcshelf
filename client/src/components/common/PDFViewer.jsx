import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Typography, Paper, Alert, CircularProgress, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// Bundle the PDF.js worker locally via Vite (?url) — no CDN dependency, so it
// works offline and isn't broken by a CDN outage or CSP.
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// `scale` here is a zoom *multiplier* applied on top of a fit-to-width base, so
// 1.0 always means "fit the page to the available width" regardless of screen
// size. This is what keeps the viewer feeling right on mobile — the page never
// overflows the container horizontally at the default zoom.
const MIN_SCALE = 0.6;
const MAX_SCALE = 3;
const DEFAULT_SCALE = 1;
const SCALE_STEP = 0.2;

// Horizontal padding around the page inside the scroll container (matches the
// inner Box padding below). Used to compute the fit-to-width base width.
const PAGE_PADDING_X = { xs: 12, md: 16 };

function PDFViewer({ fileUrl }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [loadError, setLoadError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollRef = useRef(null);

  // Measure the scroll container so the page can be rendered to fit its width.
  // A ResizeObserver keeps this correct across rotation / window resizes.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Base width = container width minus the inner padding, so the page fits
  // snugly without triggering horizontal scroll at scale 1.0.
  const padX = (isMobile ? PAGE_PADDING_X.xs : PAGE_PADDING_X.md) * 2;
  const baseWidth = containerWidth > 0 ? containerWidth - padX : 0;
  const pageWidth = baseWidth > 0 ? baseWidth * scale : undefined;

  // On page change, scroll the viewer back to the top of the new page.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, left: 0 });
    }
  }, [pageNumber]);

  const onDocumentLoadSuccess = ({ numPages: n }) => {
    setNumPages(n);
    setLoadError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF Load Error:', error);
    if (error.message?.includes('CORS')) {
      setLoadError('Unable to preview PDF due to CORS restrictions. Please download the file instead.');
    } else {
      setLoadError(`Failed to load PDF: ${error.message}`);
    }
  };

  const zoomIn = useCallback(() => setScale((s) => Math.min(parseFloat((s + SCALE_STEP).toFixed(2)), MAX_SCALE)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(parseFloat((s - SCALE_STEP).toFixed(2)), MIN_SCALE)), []);
  const resetZoom = useCallback(() => setScale(DEFAULT_SCALE), []);

  // Keyboard Shortcuts (Arrow Left/Right for pages, +/- for zoom, 0 to reset)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPageNumber((p) => Math.max(p - 1, 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPageNumber((p) => (numPages ? Math.min(p + 1, numPages) : p));
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-") {
        e.preventDefault();
        zoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages, zoomIn, zoomOut, resetZoom]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Controls Bar */}
      {!loadError && numPages && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 0.5, sm: 1.5 },
            width: '100%',
            p: { xs: '6px 8px', sm: '8px 12px' },
            mb: { xs: 2, md: 3 },
            bgcolor: 'neutral.100', // f1f5f9
            borderRadius: "10px",
            flexWrap: { xs: 'nowrap', sm: 'wrap' },
          }}
        >
          {/* Page Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
            <Button
              onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
              disabled={pageNumber <= 1}
              variant="contained"
              size="small"
              sx={{
                bgcolor: 'primary.600',
                minWidth: { xs: 44, sm: 'auto' },
                px: { xs: 0, sm: 2 },
                minHeight: { xs: 44, md: 36 }, // Touch targets sizing
                '&:hover': { bgcolor: 'primary.700' },
                '& .MuiButton-startIcon': { m: { xs: 0, sm: undefined } },
              }}
              startIcon={<NavigateBeforeIcon />}
            >
              {/* Hide the label on mobile — the icon carries the meaning */}
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Prev</Box>
            </Button>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                minWidth: { xs: 52, sm: 80 },
                textAlign: 'center',
                color: 'neutral.800',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              {pageNumber} / {numPages}
            </Typography>

            <Button
              onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
              disabled={pageNumber >= numPages}
              variant="contained"
              size="small"
              sx={{
                bgcolor: 'primary.600',
                minWidth: { xs: 44, sm: 'auto' },
                px: { xs: 0, sm: 2 },
                minHeight: { xs: 44, md: 36 }, // Touch targets sizing
                '&:hover': { bgcolor: 'primary.700' },
                '& .MuiButton-endIcon': { m: { xs: 0, sm: undefined } },
              }}
              endIcon={<NavigateNextIcon />}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Next</Box>
            </Button>
          </Box>

          {/* Thin Vertical Divider (desktop only) */}
          <Box sx={{ display: { xs: 'none', sm: 'block' }, width: "1px", height: 20, bgcolor: 'neutral.300', mx: 1 }} />

          {/* Zoom Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 0.5 }, flexShrink: 0 }}>
            <Tooltip title="Zoom Out (-)">
              <span>
                <IconButton
                  onClick={zoomOut}
                  disabled={scale <= MIN_SCALE}
                  sx={{
                    color: 'neutral.600',
                    width: { xs: 44, md: 40 },
                    height: { xs: 44, md: 40 }
                  }}
                >
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                minWidth: { xs: 40, sm: 44 },
                textAlign: 'center',
                color: 'neutral.800',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {Math.round(scale * 100)}%
            </Typography>

            <Tooltip title="Zoom In (+)">
              <span>
                <IconButton
                  onClick={zoomIn}
                  disabled={scale >= MAX_SCALE}
                  sx={{
                    color: 'neutral.600',
                    width: { xs: 44, md: 40 },
                    height: { xs: 44, md: 40 }
                  }}
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Reset Zoom (0)">
              <span>
                <IconButton
                  onClick={resetZoom}
                  disabled={scale === DEFAULT_SCALE}
                  sx={{
                    color: 'neutral.600',
                    width: { xs: 44, md: 40 },
                    height: { xs: 44, md: 40 }
                  }}
                >
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* PDF Canvas Container */}
      <Paper
        ref={scrollRef}
        elevation={0}
        sx={{
          width: '100%',
          height: { xs: '70vh', sm: '72vh', md: '78vh' },
          display: 'flex',
          // Bounded height + auto overflow so the PDF scrolls *inside* the viewer.
          // margin:auto on the child (below) centers it when it fits and keeps both
          // edges reachable when zoomed — unlike justifyContent:center, which clips.
          overflow: 'auto',
          border: '1px solid',
          borderColor: 'neutral.200',
          borderRadius: "10px",
          bgcolor: 'neutral.100',
          // Smooth momentum scrolling on touch devices
          WebkitOverflowScrolling: 'touch',
          // Prevent horizontal rubber-banding on mobile when the page fits exactly
          overscrollBehaviorX: 'contain',
        }}
      >
        {loadError ? (
          <Alert severity="error" sx={{ width: '100%', m: 'auto', borderRadius: "10px" }}>
            {loadError}
          </Alert>
        ) : (
          <Box sx={{ m: 'auto', p: { xs: '12px', md: '16px' } }}>
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress sx={{ mb: 2, color: 'primary.600' }} />
                  <Typography color="neutral.500" variant="body2" sx={{ fontWeight: 500 }}>
                    Loading PDF...
                  </Typography>
                </Box>
              }
              error={
                <Alert severity="error" sx={{ m: 2, borderRadius: "10px" }}>
                  Failed to load PDF file.
                </Alert>
              }
            >
              {/* Render by explicit width (fit-to-width * zoom) rather than a raw
                  scale, so the page always fits the viewport at 100% on any device.
                  Only render once we know the width to avoid a flash at the wrong size. */}
              {pageWidth ? (
                <Page
                  pageNumber={pageNumber}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <CircularProgress size={24} sx={{ color: 'primary.600' }} />
                    </Box>
                  }
                />
              ) : null}
            </Document>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default PDFViewer;
