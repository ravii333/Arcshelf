import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Typography, Paper, Alert, CircularProgress, IconButton, Tooltip } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.5;
const DEFAULT_SCALE = 1.2;
const SCALE_STEP = 0.2;

function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [loadError, setLoadError] = useState(null);

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

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Controls */}
      {!loadError && numPages && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 1,
            mb: 2,
            bgcolor: 'grey.100',
            borderRadius: 2,
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
            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#128c43' } }}
          >
            Prev
          </Button>
          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80, textAlign: 'center' }}>
            {pageNumber} / {numPages}
          </Typography>
          <Button
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
            disabled={pageNumber >= numPages}
            variant="contained"
            size="small"
            endIcon={<NavigateNextIcon />}
            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#128c43' } }}
          >
            Next
          </Button>

          <Box sx={{ width: 1, height: 24, bgcolor: 'grey.300', mx: 0.5 }} />

          {/* Zoom Controls */}
          <Tooltip title="Zoom out">
            <span>
              <IconButton onClick={zoomOut} disabled={scale <= MIN_SCALE} size="small">
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 44, textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </Typography>
          <Tooltip title="Zoom in">
            <span>
              <IconButton onClick={zoomIn} disabled={scale >= MAX_SCALE} size="small">
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reset zoom">
            <IconButton onClick={resetZoom} size="small" disabled={scale === DEFAULT_SCALE}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* PDF Display */}
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          maxWidth: '56rem',
          display: 'flex',
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'auto',
          bgcolor: 'grey.50',
        }}
      >
        {loadError ? (
          <Alert severity="error" sx={{ width: '100%', m: 2 }}>
            {loadError}
          </Alert>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress sx={{ mb: 2, color: '#16a34a' }} />
                <Typography color="text.secondary">Loading PDF preview...</Typography>
              </Box>
            }
            error={
              <Alert severity="error" sx={{ m: 2 }}>
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
        )}
      </Paper>
    </Box>
  );
}

export default PDFViewer;
