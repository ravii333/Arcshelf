import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Typography, Paper, Alert, CircularProgress, IconButton, Tooltip } from '@mui/material';
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

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.5;
const DEFAULT_SCALE = 1.2;
const SCALE_STEP = 0.2;

function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [loadError, setLoadError] = useState(null);
  const scrollRef = useRef(null);

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

  const zoomIn = () => setScale((s) => Math.min(parseFloat((s + SCALE_STEP).toFixed(1)), MAX_SCALE));
  const zoomOut = () => setScale((s) => Math.max(parseFloat((s - SCALE_STEP).toFixed(1)), MIN_SCALE));
  const resetZoom = () => setScale(DEFAULT_SCALE);

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
  }, [numPages]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Controls Bar */}
      {!loadError && numPages && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            p: "8px 12px",
            mb: 3,
            bgcolor: 'neutral.100', // f1f5f9
            borderRadius: "10px",
            flexWrap: 'wrap',
          }}
        >
          {/* Page Navigation */}
          <Button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
            variant="contained"
            size="small"
            startIcon={<NavigateBeforeIcon />}
            sx={{
              bgcolor: 'primary.600',
              minHeight: { xs: 48, md: 36 }, // Touch targets sizing (48px on mobile)
              '&:hover': { bgcolor: 'primary.700' }
            }}
          >
            Prev
          </Button>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              minWidth: 80,
              textAlign: 'center',
              color: 'neutral.800'
            }}
          >
            {pageNumber} / {numPages}
          </Typography>

          <Button
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
            disabled={pageNumber >= numPages}
            variant="contained"
            size="small"
            endIcon={<NavigateNextIcon />}
            sx={{
              bgcolor: 'primary.600',
              minHeight: { xs: 48, md: 36 }, // Touch targets sizing
              '&:hover': { bgcolor: 'primary.700' }
            }}
          >
            Next
          </Button>

          {/* Thin Vertical Divider */}
          <Box sx={{ width: "1px", height: 20, bgcolor: 'neutral.300', mx: 1 }} />

          {/* Zoom Controls */}
          <Tooltip title="Zoom Out (-)">
            <span>
              <IconButton
                onClick={zoomOut}
                disabled={scale <= MIN_SCALE}
                size="large"
                sx={{
                  color: 'neutral.600',
                  width: { xs: 48, md: 40 },
                  height: { xs: 48, md: 40 }
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
              minWidth: 44,
              textAlign: 'center',
              color: 'neutral.800'
            }}
          >
            {Math.round(scale * 100)}%
          </Typography>

          <Tooltip title="Zoom In (+)">
            <span>
              <IconButton
                onClick={zoomIn}
                disabled={scale >= MAX_SCALE}
                size="large"
                sx={{
                  color: 'neutral.600',
                  width: { xs: 48, md: 40 },
                  height: { xs: 48, md: 40 }
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
                size="large"
                disabled={scale === DEFAULT_SCALE}
                sx={{
                  color: 'neutral.600',
                  width: { xs: 48, md: 40 },
                  height: { xs: 48, md: 40 }
                }}
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}

      {/* PDF Canvas Container */}
      <Paper
        ref={scrollRef}
        elevation={0}
        sx={{
          width: '100%',
          height: { xs: '60vh', sm: '70vh', md: '78vh' },
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
        }}
      >
        {loadError ? (
          <Alert severity="error" sx={{ width: '100%', m: 'auto', borderRadius: "10px" }}>
            {loadError}
          </Alert>
        ) : (
          <Box sx={{ m: 'auto', p: { xs: 1.5, md: 2 } }}>
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
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default PDFViewer;
