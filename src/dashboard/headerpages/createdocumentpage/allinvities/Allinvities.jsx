import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaDownload,
  FaCopy,
  FaFilePdf,
  FaPlus,
  FaLink,
  FaPaperPlane,
  FaTrashAlt,
  FaGlobe,
  FaDesktop,
  FaCalendarAlt,
  FaNetworkWired,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaEllipsisV,
  FaCheck,
  FaTimes,
  FaHourglassHalf,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { baseUrl, decryptText } from "../../../../encryptDecrypt";

// Custom hook for detecting clicks outside an element
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// Helper functions moved outside the component for purity and performance
const getLocationString = (location) => {
  if (!location) return "Not available";
  const { city, country } = location;
  return city && city !== "Unknown" ? `${city}, ${country}` : country || "Not available";
};

const getDeviceString = (log) => {
  if (!log || !log.browser || !log.os) return "Not available";
  const { browser, os } = log;
  return os && os !== "Unknown" ? `${browser} on ${os}` : "Not available";
};

const formatDate = (dateString) => {
  if (!dateString) return "Not available";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Status badge component with consistent styling
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Signed: { bg: "bg-green-100", text: "text-green-800", icon: <FaCheck /> },
    Declined: { bg: "bg-red-100", text: "text-red-800", icon: <FaTimes /> },
    Pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: <FaHourglassHalf /> },
    Active: { bg: "bg-blue-100", text: "text-blue-800", icon: <FaHourglassHalf /> },
    Completed: { bg: "bg-green-100", text: "text-green-800", icon: <FaCheck /> }, // Added for docStatus
  };
  
  const formattedStatus = status ? 
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 
    "Pending";
  
  const { bg, text, icon } = statusStyles[formattedStatus] || statusStyles.Pending;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${bg} ${text}`}>
      {icon} {formattedStatus}
    </span>
  );
};

const AllInvites = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("documentId");
  const dropdownRef = useRef(null);

  // State management
  const [activeTab, setActiveTab] = useState("invitees");
  const [copiedStates, setCopiedStates] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [invitees, setInvitees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    const loadAllData = async () => {
      if (!documentId) {
        setError("Document ID is missing from the URL.");
        setIsLoading(false);
        return;
      }
      if (!token) {
        setError("Authorization token not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const headers = { headers: { authorization: token } };

        // Step 1: Fetch Document Details
        const docResponse = await axios.get(`${baseUrl}/api/document/getdocument/${documentId}`, headers);
        const decryptedDoc = await decryptText(docResponse.data.body);
        const documentData = JSON.parse(decryptedDoc);
        if (!documentData?.document) throw new Error("Invalid document data received");
        setDocumentDetails(documentData.document);

        // Step 2: Fetch Invitees
        const inviteesResponse = await axios.get(`${baseUrl}/api/document/getInvitees/${documentId}`, headers);
        const decryptedInvitees = await decryptText(inviteesResponse.data.body);
        const inviteesData = JSON.parse(decryptedInvitees);
        const rawInvitees = inviteesData?.invitees || [];
        if (!Array.isArray(rawInvitees)) throw new Error("Invalid invitees data format");
        
        // Step 3: Fetch Notification Logs
        const logsResponse = await axios.get(`${baseUrl}/api/log/notiflogs/${documentId}`, headers);
        const decryptedLogs = await decryptText(logsResponse.data.body);
        const logsData = JSON.parse(decryptedLogs);
        const notificationLogs = logsData?.logs || [];
        
        // Step 4: Process and combine invitee and log data
        const logsMap = new Map();
        notificationLogs.forEach(log => {
          if (log?.inviteeId) {
            const existingLog = logsMap.get(log.inviteeId);
            if (!existingLog || new Date(log.timestamp) > new Date(existingLog.timestamp)) {
              logsMap.set(log.inviteeId, log);
            }
          }
        });

        const formattedInvitees = rawInvitees.map(invitee => ({
          id: invitee.id,
          name: invitee.name,
          email: invitee.email,
          status: invitee.signStatus
            ? invitee.signStatus.charAt(0).toUpperCase() + invitee.signStatus.slice(1).toLowerCase()
            : 'Pending',
          avatar: invitee.name?.split(" ").map(n => n[0] || "").join("").toUpperCase() || 'NA',
          signingLink: invitee.verifyUrl,
          lastSent: logsMap.get(invitee.id)?.timestamp || null,
          ip: logsMap.get(invitee.id)?.ip || "Not available",
          location: getLocationString(logsMap.get(invitee.id)?.location),
          device: getDeviceString(logsMap.get(invitee.id)),
        }));

        setInvitees(formattedInvitees);

      } catch (err) {
        console.error("Data loading error:", err);
        setError(err.message || "Failed to load document data. Please check the console for details.");
        setInvitees([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAllData();
  }, [documentId]);

  useOnClickOutside(dropdownRef, () => setShowDropdown(null));

  const handleCopy = (id, textToCopy) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
  };

  const handleResend = (email) => {
    console.log(`Resending invitation to ${email}`);
  };

  const handleRemove = (email) => {
    console.log(`Removing invitee ${email}`);
  };

  const toggleDropdown = (id) => {
    setShowDropdown(prev => prev === id ? null : id);
  };

  const signedCount = invitees.filter(p => p.status === "Signed").length;
  const totalCount = invitees.length;
  const completionPercentage = totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-slate-200/80 text-slate-700 flex flex-col"
    >
      {/* Header section */}
      <div className="flex-shrink-0">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
              <FaFilePdf size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isLoading ? "Loading..." : documentDetails?.name || "Untitled Document"}
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                {documentDetails?.createdAt ? 
                  `Created on ${formatDate(documentDetails.createdAt)}` : 
                  "..."}
              </p>
            </div>
          </div>
          {documentDetails?.docStatus && (
            <StatusBadge status={documentDetails.docStatus} />
          )}
        </div>

        {/* Document info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Doc ID", value: documentId || "N/A" },
            { label: "Reference No.", value: documentDetails?.refNo || "N/A" },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-500 text-xs font-medium mb-1">{item.label}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-slate-900 text-xs truncate">
                  {isLoading ? "..." : item.value}
                </span>
                <button
                  onClick={() => handleCopy(item.label, item.value)}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                  aria-label={`Copy ${item.label}`}
                >
                  {copiedStates[item.label] ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaCopy size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
          
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-500 text-xs font-medium mb-1">Completion</p>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-slate-900 text-sm font-bold">
                {isLoading ? "..." : signedCount}
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600 text-sm">
                {isLoading ? "..." : totalCount}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="border border-slate-200 rounded-xl bg-slate-50 flex flex-col flex-grow h-[490px]">
        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 bg-white/50 flex-shrink-0">
          {["invitees", "document"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 px-4 text-sm font-semibold text-center capitalize transition-colors relative ${
                activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "invitees" ? "Invitees List" : "Document View"}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  layoutId="tabIndicator"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-grow overflow-y-auto">
          <div className="p-2 sm:p-4">
            <AnimatePresence mode="wait">
              {activeTab === "invitees" ? (
                <motion.div
                  key="invitees"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex  items-center justify-between mb-4 px-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Invitees ({isLoading ? "..." : totalCount})
                    </h3>
                    <button className="text-sm text-blue-600 font-medium flex items-center gap-1.5 hover:bg-blue-100/50 px-3 py-1.5 rounded-lg transition-colors">
                      <FaPlus size={12} /> Add Invitee
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center h-64 text-slate-500">
                      Loading invitees...
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center h-64 text-red-500 bg-red-50 p-4 rounded-lg text-center">
                      {error}
                    </div>
                  ) : invitees.length === 0 ? (
                    <div className="flex justify-center items-center h-64 text-slate-500 bg-slate-100 p-4 rounded-lg">
                      No invitees found for this document.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {invitees.map((person) => (
                        <InviteeCard
                          key={person.id}
                          person={person}
                          showDropdown={showDropdown}
                          dropdownRef={dropdownRef}
                          toggleDropdown={toggleDropdown}
                          handleCopy={handleCopy}
                          handleResend={handleResend}
                          handleRemove={handleRemove}
                          setShowDropdown={setShowDropdown}
                          copiedStates={copiedStates}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <DocumentPreviewTab
                  document={documentDetails}
                  isLoading={isLoading}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const InviteeCard = ({
  person,
  showDropdown,
  dropdownRef,
  toggleDropdown,
  handleCopy,
  handleResend,
  handleRemove,
  setShowDropdown,
  copiedStates,
}) => (
  <motion.div
    layout
    className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-3">
        <div className="md:w-10 md:h-10 xs:w-6 xs:h-6 xs:rounded-full md:rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 md:text-sm xs:text-[8px] font-bold shadow-sm">
          {person.avatar}
        </div>
        <div className="min-w-0 md:w-full xs:w-[100px] overflow-hidden">
          <p className="font-semibold xs:text-[14px] md:text-[20px] text-slate-800 truncate">{person.name}</p>
          <p className="md:text-[16px] xs:text-[10px] text-slate-500 truncate">{person.email}</p>
        </div>
      </div>
      <div className="flex items-center">
        <StatusBadge status={person.status} />
        <div className="relative" ref={showDropdown === person.id ? dropdownRef : null}>
          <button
            onClick={() => toggleDropdown(person.id)}
            className="ml-2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="More options"
          >
            <FaEllipsisV size={14} />
          </button>
          <AnimatePresence>
            {showDropdown === person.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-slate-200 origin-top-right"
              >
                <div className="py-1">
                  {[
                    {
                      icon: <FaLink />,
                      text: "Copy Signing Link",
                      onClick: () => handleCopy(`link-${person.id}`, person.signingLink),
                    },
                    {
                      icon: <FaPaperPlane />,
                      text: "Resend Invitation",
                      onClick: () => handleResend(person.email),
                    },
                    {
                      icon: <FaTrashAlt />,
                      text: "Remove Invitee",
                      onClick: () => handleRemove(person.email),
                      color: "text-red-600",
                    },
                  ].map((item) => (
                    <button
                      key={item.text}
                      onClick={() => {
                        item.onClick();
                        setShowDropdown(null);
                      }}
                      className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left transition-colors ${
                        item.color || "text-slate-700"
                      } hover:bg-slate-100`}
                    >
                      {item.icon} {item.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

    <div className="space-y-3 p-3 bg-slate-50/70 rounded-md border border-slate-200/80 mb-4">
      {[
        { icon: <FaCalendarAlt />, label: "Last Sent", value: formatDate(person.lastSent) },
        { icon: <FaNetworkWired />, label: "IP Address", value: person.ip, isMono: true },
        { 
          icon: <FaGlobe />, 
          label: "Location & Device", 
          value: person.device !== "Not available" ? `${person.location} (${person.device})` : person.location 
        },
      ].map((detail) => (
        <div key={detail.label} className="flex items-center justify-between text-xs">
          <p className="flex items-center gap-1.5 font-medium text-slate-500">
            {detail.icon} {detail.label}
          </p>
          <p className={`font-medium text-slate-700 ${detail.isMono ? "font-mono" : ""}`}>
            {detail.value}
          </p>
        </div>
      ))}
    </div>

    <div className="flex gap-3 items-center justify-between pt-3 border-t border-slate-200">
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <FaInfoCircle />
        <span>
          {person.status === "Signed"
            ? "Signed successfully"
            : person.status === "Declined"
              ? "Declined invitation"
              : "Awaiting response"}
        </span>
      </div>
      {person.status !== "Signed" && (
        <button
          onClick={() => handleResend(person.email)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
        >
          <FaPaperPlane size={10} /> RESEND
        </button>
      )}
    </div>
  </motion.div>
);

// **FIXED**: Rewritten Document Preview component to be dynamic
const DocumentPreviewTab = ({ document, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        key="doc-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]"
      >
        <p className="text-slate-500">Loading document preview...</p>
      </motion.div>
    );
  }

  if (document && document.documentUrl) {
    return (
      <motion.div
        key="document"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <iframe
          src={document.documentUrl}
          title={document.name || "Document Preview"}
          className="w-full h-[400px] md:h-[600px] border rounded-lg border-slate-200 bg-slate-100"
        />
        <div className="text-center mt-4">
          <a
            href={document.documentUrl}
            download={document.name ? `${document.name}.pdf` : "document.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            <FaDownload size={14} /> Download Document
          </a>
        </div>
      </motion.div>
    );
  }

  // Fallback if no document URL is available after loading
  return (
    <motion.div
      key="doc-error"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-slate-200 text-center min-h-[300px]"
    >
      <FaFilePdf size={48} className="text-slate-300 mb-4" />
      <h4 className="text-lg font-semibold text-slate-800 mb-1">
        Document Preview Not Available
      </h4>
      <p className="text-sm text-slate-500">
        The document URL could not be found or is invalid.
      </p>
    </motion.div>
  );
};

export default AllInvites;