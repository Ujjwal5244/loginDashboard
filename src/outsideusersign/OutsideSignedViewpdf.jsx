import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import {
  FiEdit,
  FiCheckCircle,
  FiShield,
  FiFileText,
  FiDownload,
  FiChevronRight,
} from "react-icons/fi";
import { baseUrl, encryptText, decryptText } from "../encryptDecrypt";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Updated sidebarItems to highlight "Signed Document"
const sidebarItems = [
  { text: "Document Sign", icon: <FiEdit size={18} /> },
  { text: "Verification", icon: <FiCheckCircle size={18} /> },
  { text: "Security Question", icon: <FiShield size={18} /> },
  { text: "Document View", icon: <FiFileText size={18} /> },
  { text: "Signed Document", icon: <FiDownload size={18} />, active: true },
];

const OutsideSignedViewpdf = () => {
  const [token, setToken] = useState("");
  const [invitee, setInvitee] = useState({ name: "Loading...", email: "..." });
  const [allowedSignatureTypes, setAllowedSignatureTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numPages, setNumPages] = React.useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  // --- Refs and state for responsive PDF width ---
  const pdfContainerRef = useRef(null);
  const [pdfContainerWidth, setPdfContainerWidth] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // --- Hooks ---
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("documentId");
  const navigate = useNavigate();

  // --- Effect to get the signUrl from URL parameters ---
  useEffect(() => {
    const signedPdfUrl = searchParams.get("signUrl");
    if (signedPdfUrl) {
      setPdfUrl(signedPdfUrl);
    } else {
      console.error("signUrl is missing from the URL parameters.");
    }
  }, [searchParams]);

  // Effect to get token from URL
  useEffect(() => {
    const tokenFromParams = searchParams.get("t");
    if (tokenFromParams) {
      setToken(tokenFromParams);
    } else {
      console.error(
        "Token is missing from URL parameters. Redirecting to home."
      );
      navigate("/");
    }
  }, [searchParams, navigate]);

  // --- Effect to calculate responsive PDF width ---
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        // Subtract a small amount for padding/margin to prevent horizontal scrollbar
        setPdfContainerWidth(width > 24 ? width - 24 : width);
      }
    });

    if (pdfContainerRef.current) {
      resizeObserver.observe(pdfContainerRef.current);
    }

    return () => {
      if (pdfContainerRef.current) {
        // Use a local variable to prevent issues during unmount
        const ref = pdfContainerRef.current;
        resizeObserver.unobserve(ref);
      }
    };
  }, []); // Run only once on mount

  // ------------------profile api---------------------
  useEffect(() => {
    async function fetchInviteeData() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/api/document/inviteeBytoken?t=${token}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const encryptedBody = response.data.body;
        const decryptedJsonString = await decryptText(encryptedBody);
        const decryptedPayload = JSON.parse(decryptedJsonString);

        console.log("Decrypted and parsed payload:", decryptedPayload);

        const inviteeData = decryptedPayload.invitee;

        if (inviteeData) {
          setInvitee({
            name: inviteeData.name || "Unknown User",
            email: inviteeData.email || "Not Provided",
          });
          setAllowedSignatureTypes(inviteeData.signatureType || []);
        } else {
          console.warn("Decryption success, but no invitee object in payload.");
          setInvitee({
            name: "Not Found",
            email: "Data missing post-decryption",
          });
        }
      } catch (error) {
        console.error("Failed to fetch or decrypt invitee data.", error);
        setInvitee({ name: "Error", email: "Could not load user data" });
      } finally {
        setIsLoading(false);
      }
    }

    fetchInviteeData();
  }, [token]);

  // --- Function to handle the download button click ---
  const handleDownload = () => {
    if (!pdfUrl) {
      alert("Document URL not found. Cannot download.");
      return;
    }
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", `signed-document-${documentId}.pdf`);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
<header className="bg-gradient-to-r from-[#2a5a99] to-[#3470b2] border-b text-white p-4 shadow-lg z-50 sticky top-0">        <div className="flex items-center justify-between">
          <div className="flex items-center md:space-x-3 xs:space-x-1">
            <div className="md:p-2 xs:p-1 bg-white/10 rounded-lg backdrop-blur-sm">
              <svg
                className="md:w-6 md:h-6 xs:w-4 xs:h-4 text-white"
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
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Nifi <span className="font-bold text-white/80">Payments</span>
            </h1>
          </div>
          <button className="relative overflow-hidden bg-white text-[#3470b2] xs:px-3 xs:py-1 md:px-6 md:py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#3470b2]/30 group">
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-0"></span>
          </button>
        </div>
      </header>

      {/* --- RESPONSIVE CHANGE: This container is now a flexbox only on medium screens and up --- */}
      <div className="md:flex flex-1">
        {/* --- RESPONSIVE CHANGE: Sidebar is hidden on small screens, visible as flex on medium+ --- */}
 <aside className="hidden md:flex w-[315px] flex-shrink-0 bg-white p-5 pt-8 flex-col border-r border-gray-200">          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
          <div className="mt-auto pt-6 p-4">
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <img
                src={`https://i.pravatar.cc/150?u=${invitee.email}`}
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-800">{invitee.name}</p>
                <p className="text-xs text-gray-500">{invitee.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
       <main className="flex-1 p-2 md:p-3 bg-gray-50 overflow-auto">
          <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-6 rounded-xl">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row  sm:items-center justify-between mb-4 gap-4">
              <h1 className="text-xl font-bold text-center text-gray-800">Signed Document</h1>
              <button
                onClick={handleDownload}
                disabled={!pdfUrl}
                className="w-full sm:w-auto text-gray-600 px-6 py-3 font-medium transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed border rounded-lg hover:bg-gray-100"
              >
                <FiDownload size={18} />
                <span>Download Document</span>
              </button>
            </div>

            {/* PDF Container - Fixed scrolling */}
            <div
              ref={pdfContainerRef}
              className="border rounded-lg shadow-inner bg-gray-100 min-h-[300px] md:max-h-[calc(100vh-350px)] xs:max-h-[calc(100vh-380px)] overflow-y-auto"
            >
              {pdfUrl && pdfContainerWidth > 0 ? (
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="p-4 flex justify-center items-center h-full text-gray-500">
                      Loading PDF...
                    </div>
                  }
                  error={
                    <div className="p-4 text-red-500 flex justify-center items-center h-full">
                      Failed to load PDF. Please check the URL.
                    </div>
                  }
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="flex justify-center my-4">
                      <Page
                        pageNumber={index + 1}
                        width={pdfContainerWidth}
                        className="shadow-md"
                      />
                    </div>
                  ))}
                </Document>
              ) : (
                <div className="flex justify-center items-center h-full py-20">
                  <p className="text-gray-500">
                    {pdfUrl ? "Calculating viewer size..." : "Waiting for document URL..."}
                  </p>
                </div>
              )}
            </div>

            {/* Footer section */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="font-semibold md:text-[17px] xs:text-[12px] text-gray-700">
                  This document has been successfully signed.
                </p>
                <p className="md:text-[13px] xs:text-[12px] text-gray-500 mt-1">
                  You can now download the final version for your records.
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                disabled={!pdfUrl}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span>Finish</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OutsideSignedViewpdf;