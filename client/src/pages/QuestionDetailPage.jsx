import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import * as api from "../api";
import PDFViewer from "../components/common/PDFViewer";

function QuestionDetailPage() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const getQuestion = async () => {
      try {
        const { data } = await api.fetchQuestion(id);
        setQuestion(data);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-200 mx-auto mb-6"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Paper</h3>
          <p className="text-lg text-gray-600">Please wait while we fetch the question paper...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.5 19h13a1.5 1.5 0 001.3-2.3L13.3 4.7a1.5 1.5 0 00-2.6 0L4.2 16.7A1.5 1.5 0 005.5 19z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Paper Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">The question paper you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isPdf = question.fileUrl && question.fileUrl.toLowerCase().endsWith(".pdf");
  const isImage = question.fileUrl && /\.(jpe?g|png|gif)$/i.test(question.fileUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#0b1f17] via-[#15322d] to-[#128c43] w-full mt-auto shadow-lg shadow-green-900/20 transition-all duration-500 rounded-xl p-3 mb-4 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-medium mb-1">{question.subject}</h1>
                  <p className="text-sm text-green-100 font-normal">{question.year}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xl text-green-100">
                  {question.college?.university?.name} — {question.college?.name}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { icon: "📄", label: question.examType },
                    { icon: "👤", label: question.createdBy?.name || "Anonymous" },
                    { icon: "🎓", label: `${question.semester} Semester` },
                  ].map((item, idx) => (
                    <span key={idx} className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {question.fileUrl && (
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <a
                  href={question.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-white text-green-700 font-bold rounded-xl shadow-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Paper
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0b1f17] via-[#15322d] to-[#128c43] rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-900">Notes & Topics</h2>
              </div>

              <div className="prose lg:prose-lg max-w-none">
                {question.questionsText ? (
                  <ReactMarkdown>{question.questionsText}</ReactMarkdown>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No additional notes were provided for this paper.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Paper Preview Section */}
            {question.fileUrl && (
              <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0b1f17] via-[#15322d] to-[#128c43] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium text-gray-900">Paper Preview</h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  {isPdf && <PDFViewer fileUrl={question.fileUrl} />}
                  {isImage && (
                    <img
                      src={question.fileUrl}
                      alt={`${question.subject} ${question.year} Paper`}
                      className="max-w-full h-auto mx-auto rounded-xl shadow-lg"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-100">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-4">
                {[
                  ["Course", question.course],
                  ["Subject", question.subject],
                  ["Year", question.year],
                  ["Semester", question.semester],
                  ["Exam Type", question.examType],
                ].map(([label, value], i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600 font-normal">{label}</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-100">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Related Papers</h3>
              <p className="text-gray-600 text-sm">More papers from the same course and subject will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetailPage;
