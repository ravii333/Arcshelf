// client/src/components/common/PDFViewer.jsx
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Fix for CSS imports in Vite
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Fix for worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadError, setLoadError] = useState(null); // <-- NEW state for errors

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoadError(null); // Clear any previous errors on success
  }

  function onDocumentLoadError(error) {
    console.error('PDF Load Error:', error);
    // Set a user-friendly error message
    if (error.message.includes('CORS')) {
      setLoadError("Failed to load PDF due to security (CORS) policy. The direct download link should still work.");
    } else {
      setLoadError(`Error loading PDF: ${error.message}`);
    }
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));

  return (
    <div className="pdf-container">
      {/* The navigation is only shown if the document loaded successfully */}
      {!loadError && numPages && (
        <nav className="flex items-center justify-center p-2 bg-gray-100 rounded-md mb-4">
          <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">Prev</button>
          <p className="mx-4 font-semibold">Page {pageNumber} of {numPages}</p>
          <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">Next</button>
        </nav>
      )}
      
      <div className="flex justify-center border rounded-md overflow-hidden bg-gray-200">
        {/* If there's an error, display it */}
        {loadError ? (
          <div className="p-8 text-red-600 bg-red-50">{loadError}</div>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="p-8 text-gray-600">Loading PDF preview...</div>}
            error={<div className="p-8 text-red-600">Failed to load PDF file.</div>}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        )}
      </div>
    </div>
  );
}

export default PDFViewer;