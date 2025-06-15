import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Required for annotation layer
import "react-pdf/dist/esm/Page/TextLayer.css"; // Required for text layer
import {
  FiEdit,
  FiCheckCircle,
  FiShield,
  FiFileText,
  FiDownload,
  FiChevronRight,
} from "react-icons/fi";

// Setup for PDF.js worker. This is essential for react-pdf to work.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const sidebarItems = [
  { text: "Document Sign", icon: <FiEdit size={18} />, active: true },
  { text: "Verification", icon: <FiCheckCircle size={18} /> },
  { text: "Security Question", icon: <FiShield size={18} /> },
  { text: "Document View", icon: <FiFileText size={18} /> },
  { text: "Signed Document", icon: <FiDownload size={18} /> },
];

const DocumentSigningFlow = () => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleContinue = () => {
    setShowPdfViewer(true);
  };

  return (
    // Parent container needs to be `relative` to position the overlay correctly.
    <div className="relative h-screen overflow-hidden bg-gray-50">
      <div
        className={`flex flex-col h-full transition-filter duration-500 ${
          !showPdfViewer ? "blur-sm" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2a5a99] to-[#3470b2] border-b text-white p-4 shadow-lg z-50 sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Nifi <span className="font-bold text-white/80">Payments</span>
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="relative group font-medium">
                Features
                <span className="absolute left-0 bottom-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="relative group font-medium">
                Pricing
                <span className="absolute left-0 bottom-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="relative group font-medium">
                Solutions
                <span className="absolute left-0 bottom-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="relative group font-medium">
                Contact
                <span className="absolute left-0 bottom-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>
            <button className="relative overflow-hidden bg-white text-[#3470b2] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#3470b2]/30 group">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-0"></span>
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Enhanced Sidebar */}
          <aside className="w-[315px] bg-white p-5 pt-8 flex-col border-r border-gray-200 hidden md:flex">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 pt-5 pb-2">
                Document Actions
              </h2>
              <ul className="divide-y divide-gray-100">
                {sidebarItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className={`flex items-center justify-between px-6 py-4 transition-all duration-200 ${item.active ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-700"}`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`p-2 rounded-lg ${item.active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
                        >
                          {item.icon}
                        </span>
                        <span className="ml-4 font-medium">{item.text}</span>
                      </div>
                      <FiChevronRight
                        size={18}
                        className={`${item.active ? "text-blue-400" : "text-gray-400"}`}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-6">
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">Alex Doe</p>
                  <p className="text-xs text-gray-500">alex.doe@example.com</p>
                </div>
              </div>
            </div>
          </aside>

          {/* --- MODIFIED MAIN CONTENT --- */}
          {/* Changed: This is now a flex container that holds the content card */}
          <main className="flex-1 p-6 bg-gray-50 flex flex-col overflow-hidden">
            {showPdfViewer && (
              // Changed: This card is now a flex container that fills the parent <main>
              <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
                {/* Header inside the card - it will not shrink */}
                <div className="p-8 pb-6 border-b border-gray-200 flex-shrink-0">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Document Preview
                  </h1>
                </div>

                {/* Changed: This is the dedicated scrollable container for the PDF */}
                <div className="flex-1 overflow-y-auto bg-gray-100">
                  <Document
                    file="/sample.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    // This className centers the pages inside the scrollable container
                    className="flex flex-col items-center p-4"
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={800}
                        className="my-4 shadow-md"
                      />
                    ))}
                  </Document>
                </div>

                {/* Footer inside the card - it will not shrink */}
                <div className="p-8 border-t border-gray-200 flex-shrink-0 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-700">
                      Ready to sign this document?
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Review all pages carefully before you proceed.
                    </p>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                    Proceed to Sign →
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* --- FOREGROUND OVERLAY (Welcome Screen) --- */}
      {!showPdfViewer && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-gray-800/20 backdrop-blur-sm">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white/90 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Welcome, Alex
              </h2>
              <div className="mt-8">
                <div className="mb-8 space-y-4">
                  <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
                    <h3 className="text-lg font-medium text-gray-900">
                      Document Preview
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Carefully review all pages before proceeding to sign.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
                    <h3 className="text-lg font-medium text-gray-900">
                      Secure Signing Process
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      You'll need to verify your identity before signing.
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleContinue}
                    type="button"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-105"
                  >
                    Continue to Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSigningFlow;
