import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// --- Dummy Data for Invitees (replace with your actual data) ---
const invitees = [
  { id: 1, name: "Alice Johnson", email: "alice.j@example.com" },
  { id: 2, name: "Bob Williams", email: "bob.w@example.com" },
  { id: 3, name: "Charlie Brown", email: "charlie.b@example.com" },
  { id: 4, name: "Diana Miller", email: "diana.m@example.com" },
];

const Approve = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch("/sample.pdf"); // File must be in public/
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();

    // Clean up the created URL when the component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  // Effect to disable body scroll when sidebar is open for better UX
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const navigate = useNavigate();

  const handleViewInvitees = () => {
    setIsSidebarOpen(true); // Open the sidebar
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false); // Close the sidebar
  };

  const handleSendToSign = () => {
    navigate("/maindashboard/allinvities");
  };

  return (
    <>
      {/* --- Sidebar and Overlay --- */}
      {isSidebarOpen && (
        <>
          {/* Overlay with smoother transition */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={handleCloseSidebar}
            aria-hidden="true"
          ></div>

          {/* Sidebar with blue accent theme */}
          <div
            className={`fixed top-0 right-0 h-full w-[300px] bg-white shadow-2xl z-[2200] p-5 transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidebar-title"
          >
            {/* Header with blue accent */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2
                id="sidebar-title"
                className="text-xl font-bold text-[#3470b2]"
              >
                Invitees
              </h2>
              <button
                onClick={handleCloseSidebar}
                className="text-gray-400 hover:text-[#3470b2] transition-colors duration-200"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Invitees List with hover effects */}
            <ul className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
              {invitees.map((invitee) => (
                <li
                  key={invitee.id}
                  className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-[#f5f9ff] hover:shadow-sm border border-gray-100"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#3470b2] flex items-center justify-center font-bold text-white">
                    {invitee.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {invitee.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {invitee.email}
                    </p>
                  </div>
                  <div className="">
                    <button >
                      <FaUserEdit />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Optional footer with blue accent */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-100">
              <button className="w-full py-2 px-4 bg-[#3470b2] hover:bg-[#2a5c9a] text-white font-medium rounded-md transition-colors duration-200">
                Send Invites
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- Main Page Content --- */}
      <div className="font-sans py-4">
        <div className="max-w-5xl mx-auto">
          {/* Progress Bar - Step 3 Active */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-1">
              <span className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                1
              </span>
              <span className="text-sm text-gray-500">Generate</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <span className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                2
              </span>
              <span className="text-sm text-gray-500">Request</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <span className="bg-[#2c5fa5] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span className="font-medium text-sm text-[#2c5fa5]">
                Approve
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
            <h1 className="text-xl font-bold mb-4">Document Approval</h1>
            <div className="border shadow-md p-4 max-w-4xl w-full">
              {pdfUrl ? (
                <Document file={pdfUrl} onLoadError={console.error}>
                  <Page pageNumber={1} />
                </Document>
              ) : (
                <p>Loading PDF...</p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleViewInvitees}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                View Invitees
              </button>
              <button
                onClick={handleSendToSign}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
              >
                Send to Sign
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Approve;
