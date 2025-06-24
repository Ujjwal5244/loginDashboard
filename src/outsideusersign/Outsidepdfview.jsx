import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import { baseUrl, token, decryptText } from "../encryptDecrypt";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  FiEdit,
  FiCheckCircle,
  FiShield,
  FiFileText,
  FiDownload,
  FiChevronRight,
} from "react-icons/fi";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const sidebarItems = [
  { text: "Document View", icon: <FiEdit size={18} />, active: true },
  { text: "Verification", icon: <FiCheckCircle size={18} /> },
  { text: "Security Question", icon: <FiShield size={18} /> },
  { text: "Document Sign", icon: <FiFileText size={18} /> },
  { text: "Signed Document", icon: <FiDownload size={18} /> },
];

const DocumentSigningFlow = () => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [inviteeDetail, setInviteeDetail] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [info, setInfo] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const query = useQuery();
  const searchTerm = query.get("t") || "";

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 700) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!inviteeDetail || !info) return;
    async function fetchInviteeDetail() {
      try {
        const response = await axios.get(
          `${baseUrl}/api/document/getdocument/${inviteeDetail.documentId}`,
          {
            ip: info?.ip || "",
            machine: info?.machine || "",
            browser: info?.browser || "",
            os: info?.os || "",
            location: {
              latitude: info?.latitude || "",
              longitude: info?.longitude || "",
              city: info?.city || "",
              country: info?.country || "",
            },
          }
        );
        if (response.status === 200) {
          const decrypted = await decryptText(response.data.body);
          const parsed = JSON.parse(decrypted);
          setDocumentUrl(parsed.document.documentUrl);
        } else {
          console.error("Failed to fetch document URL:", response.data);
        }
      } catch (error) {
        console.error("Error fetching invitee detail:", error);
      }
    }
    fetchInviteeDetail();
  }, [inviteeDetail, info]);

  useEffect(() => {
    async function inviteeByTOken() {
      try {
        const response = await axios.get(
          `${baseUrl}/api/document/inviteeBytoken?t=${searchTerm}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          const decrypted = await decryptText(response.data.body);
          const parsed = JSON.parse(decrypted);
          setInviteeDetail(parsed.invitee);
        } else {
          console.error("Failed to fetch invitee data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching invitee by token:", error);
      }
    }
    if (searchTerm) inviteeByTOken();
  }, [searchTerm]);

  useEffect(() => {
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => setInfo(data))
      .catch((err) => console.error("Error fetching IP/location:", err));
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleContinue = () => {
    setShowPdfViewer(true);
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  const handleDownload = async () => {
    if (!documentUrl) {
      console.error("No document URL available to download.");
      return;
    }
    setIsDownloading(true);
    try {
      const response = await axios.get(documentUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = documentUrl.split("/").pop() || "document.pdf";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleProceedToSign = async () => {
    if (!inviteeDetail || !searchTerm || !inviteeDetail.documentId) {
      console.error("Missing required information to proceed.");
      return;
    }

    try {
      await axios.post(`${baseUrl}/api/document/invite/send-otp`, null, {
        params: { t: searchTerm },
        headers: { authorization: token },
      });
      console.log("OTP sent successfully (API call completed).");

      const destinationUrl = `/invitee/verify?t=${searchTerm}&email=${encodeURIComponent(
        inviteeDetail.email
      )}&documentId=${inviteeDetail.documentId}`;

      console.log("Navigating to:", destinationUrl);
      navigate(destinationUrl);
    } catch (error) {
      console.error(
        "Error during OTP API call:",
        error.response?.data?.message || error.message || error
      );
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gray-50">
      <div
        className={`flex flex-col h-full transition-filter duration-500 ${
          showPdfViewer ? "" : "blur-sm"
        }`}
      >
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2a5a99] to-[#3470b2] border-b text-white xs:p-2 sm:p-2 md:p-4 shadow-lg z-50 sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center md:space-x-2 sm:space-x-0">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-1 rounded-md hover:bg-white/10"
              >
                {showSidebar ? (
                  <XMarkIcon className="w-6 h-8" />
                ) : (
                  <Bars3Icon className="w-6 h-8" />
                )}
              </button>
              <div
                className="p-1 bg-white/10 rounded-lg backdrop-blur-sm"
                style={{ display: window.innerWidth < 768 ? "none" : "block" }}
              >
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
              <h1 className="text-2xl font-bold xs:text-[20px] tracking-tight">
                Nifi <span className="font-bold  text-white/80">Payments</span>
              </h1>
            </div>
            <button
              onClick={handleClick}
              className="relative overflow-hidden bg-white text-[#3470b2] px-6 py-2 xs:py-1 xs:px-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#3470b2]/30 group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-0"></span>
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Hidden on mobile unless toggled */}
          {(showSidebar || windowWidth >= 700) && (
            <aside
              className={`w-[315px] bg-white p-5 pt-8 flex-col border-r border-gray-200 fixed md:relative h-[calc(100vh-68px)] md:h-auto z-40 md:z-auto transition-transform duration-300 ${
                showSidebar
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 pt-5 pb-2">
                  Document Actions
                </h2>
                <ul className="divide-y divide-gray-100 flex-1 overflow-y-auto">
                  {sidebarItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className={`flex items-center justify-between px-6 py-4 transition-all duration-200 ${
                          item.active
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <span
                            className={`p-2 rounded-lg ${
                              item.active
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="ml-4 font-medium">{item.text}</span>
                        </div>
                        <FiChevronRight
                          size={18}
                          className={`${
                            item.active ? "text-blue-400" : "text-gray-400"
                          }`}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 p-4">
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <img
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    {inviteeDetail && (
                      <div className="ml-3">
                        <p className="font-semibold text-gray-800">
                          {inviteeDetail.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {inviteeDetail.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main
            className={`flex-1 p-6 bg-gray-50 flex flex-col overflow-hidden ${
              showSidebar && windowWidth < 700 ? "ml-0" : ""
            }`}
          >
            {showPdfViewer && (
              <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
                <div className="md:p-6 xs:p-2 xs:px-3 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
                  <h1 className="md:text-[20px] xs:text-[15px]   font-bold text-gray-800">
                    Document Preview
                  </h1>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || !documentUrl}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 md:px-4 md:py-2 xs:px-1 xs:py-1 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FiDownload className="h-5 w-5" />
                    )}
                    <span>{isDownloading ? "Downloading..." : "Download"}</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-100">
                  <Document
                    file={documentUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center p-4"
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={Math.min(800, windowWidth - 40)}
                        className="my-4 shadow-md"
                      />
                    ))}
                  </Document>
                </div>

                <div className="md:p-8 xs:p-3 border-t border-gray-200 flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-700">
                      Ready to sign this document?
                    </p>
                    <p className="md:text-sm xs:text-[10px] text-center text-gray-500 mt-1">
                      Review all pages carefully before you proceed.
                    </p>
                  </div>
                  <button
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center w-full sm:w-auto justify-center"
                    onClick={handleProceedToSign}
                  >
                    Proceed to Sign
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* --- FOREGROUND OVERLAY (Welcome Screen) --- */}
      {!showPdfViewer && inviteeDetail && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-md">
          <div className="w-full max-w-md mx-auto overflow-hidden transform transition-all">
            <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl"></div>
              <div className="p-8 sm:p-10">
                <div className="text-center">
                  <h2 className="text-xl font-medium tracking-tight text-white sm:text-4xl">
                    Welcome, {inviteeDetail.name}!
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Let's get your document signed.
                  </p>
                </div>
                <div className="mt-10 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <DocumentMagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Document Preview
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Carefully review all pages before proceeding to sign.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <ShieldCheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Secure Signing Process
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        You'll need to verify your identity before signing.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <button
                    onClick={handleContinue}
                    type="button"
                    className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg shadow-indigo-500/10 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-800 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                  >
                    Continue to Document
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
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
