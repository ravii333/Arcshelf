import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadError, setLoadError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoadError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF Load Error:', error);
    if (error.message?.includes('CORS')) {
      setLoadError("Unable to preview PDF due to CORS restrictions. Please try downloading the file instead.");
    } else {
      setLoadError(`Failed to load PDF: ${error.message}`);
    }
  };

  const goToPrevPage = () => setPageNumber((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setPageNumber((p) => Math.min(p + 1, numPages));

  return (
    <div className="pdf-container w-full flex flex-col items-center">
      {/* Navigation */}
      {!loadError && numPages && (
        <nav className="flex items-center justify-center gap-3 p-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-sm mb-4">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-[#16a34a] text-white rounded-md disabled:opacity-50 hover:bg-bg-[#128c43] transition"
          >
            Prev
          </button>
          <p className="mx-4 text-gray-800 font-semibold">
            Page {pageNumber} of {numPages}
          </p>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-[#16a34a] text-white rounded-md disabled:opacity-50 hover:bg-[#128c43] transition"
          >
            Next
          </button>
        </nav>
      )}

      {/* PDF Display */}
      <div className="w-full max-w-4xl flex justify-center border rounded-lg overflow-hidden bg-gray-50 shadow-inner">
        {loadError ? (
          <div className="p-8 text-center text-red-600 bg-red-50 w-full">
            {loadError}
          </div>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="p-8 text-gray-600">Loading PDF preview...</div>}
            error={<div className="p-8 text-red-600">Failed to load PDF file.</div>}
          >
            <Page
              pageNumber={pageNumber}
              scale={1.2}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        )}
      </div>
    </div>
  );
}

export default PDFViewer;
