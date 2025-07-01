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
  FaSpinner,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { baseUrl, decryptText, encryptText } from "../../../../encryptDecrypt";

// for getting user's geolocation
const useGeolocation = () => {
  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(
          new Error("Geolocation is not supported by your browser.")
        );
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
          });
        },
        (err) => {
          // Default to a placeholder if user denies permission
          console.warn(
            "Geolocation permission denied. Using placeholder.",
            err.message
          );
          resolve({ latitude: "0", longitude: "0" });
        }
      );
    });
  }, []);
  return { getLocation };
};

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
  return city && city !== "Unknown"
    ? `${city}, ${country}`
    : country || "Not available";
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
const StatusBadge = ({ status, darkMode }) => {
  const statusStyles = {
    Signed: { 
      bg: darkMode ? "bg-green-900" : "bg-green-100", 
      text: darkMode ? "text-green-200" : "text-green-800", 
      icon: <FaCheck /> 
    },
    Declined: { 
      bg: darkMode ? "bg-red-900" : "bg-red-100", 
      text: darkMode ? "text-red-200" : "text-red-800", 
      icon: <FaTimes /> 
    },
    Pending: {
      bg: darkMode ? "bg-yellow-900" : "bg-yellow-100",
      text: darkMode ? "text-yellow-200" : "text-yellow-800",
      icon: <FaHourglassHalf />,
    },
    Active: {
      bg: darkMode ? "bg-blue-900" : "bg-blue-100",
      text: darkMode ? "text-blue-200" : "text-blue-800",
      icon: <FaHourglassHalf />,
    },
    Completed: {
      bg: darkMode ? "bg-green-900" : "bg-green-100",
      text: darkMode ? "text-green-200" : "text-green-800",
      icon: <FaCheck />,
    },
  };

  const formattedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "Pending";

  const { bg, text, icon } =
    statusStyles[formattedStatus] || statusStyles.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${bg} ${text}`}
    >
      {icon} {formattedStatus}
    </span>
  );
};

const AllInvites = ({ darkMode }) => {
  const { getLocation } = useGeolocation();
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
  const [isResending, setIsResending] = useState(null);
  const [resendStatus, setResendStatus] = useState({
    message: null,
    type: null,
  });

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
        const docResponse = await axios.get(
          `${baseUrl}/api/document/getdocument/${documentId}`,
          headers
        );
        const decryptedDoc = await decryptText(docResponse.data.body);
        const documentData = JSON.parse(decryptedDoc);
        if (!documentData?.document)
          throw new Error("Invalid document data received");
        setDocumentDetails(documentData.document);

        // Step 2: Fetch Invitees
        const inviteesResponse = await axios.get(
          `${baseUrl}/api/document/getInvitees/${documentId}`,
          headers
        );
        const decryptedInvitees = await decryptText(inviteesResponse.data.body);
        const inviteesData = JSON.parse(decryptedInvitees);
        const rawInvitees = inviteesData?.invitees || [];
        if (!Array.isArray(rawInvitees))
          throw new Error("Invalid invitees data format");

        // Step 3: Fetch Notification Logs
        const logsResponse = await axios.get(
          `${baseUrl}/api/log/notiflogs/${documentId}`,
          headers
        );
        const decryptedLogs = await decryptText(logsResponse.data.body);
        const logsData = JSON.parse(decryptedLogs);
        const notificationLogs = logsData?.logs || [];

        // Step 4: Process and combine invitee and log data
        const logsMap = new Map();
        notificationLogs.forEach((log) => {
          if (log?.inviteeId) {
            const existingLog = logsMap.get(log.inviteeId);
            if (
              !existingLog ||
              new Date(log.timestamp) > new Date(existingLog.timestamp)
            ) {
              logsMap.set(log.inviteeId, log);
            }
          }
        });

        const formattedInvitees = rawInvitees.map((invitee) => ({
          id: invitee.id,
          name: invitee.name,
          email: invitee.email,
          status: invitee.signStatus
            ? invitee.signStatus.charAt(0).toUpperCase() +
              invitee.signStatus.slice(1).toLowerCase()
            : "Pending",
          avatar:
            invitee.name
              ?.split(" ")
              .map((n) => n[0] || "")
              .join("")
              .toUpperCase() || "NA",
          signingLink: invitee.verifyUrl,
          lastSent: logsMap.get(invitee.id)?.timestamp || null,
          ip: logsMap.get(invitee.id)?.ip || "Not available",
          location: getLocationString(logsMap.get(invitee.id)?.location),
          device: getDeviceString(logsMap.get(invitee.id)),
        }));

        setInvitees(formattedInvitees);
      } catch (err) {
        console.error("Data loading error:", err);
        setError(
          err.message ||
            "Failed to load document data. Please check the console for details."
        );
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
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(
      () => setCopiedStates((prev) => ({ ...prev, [id]: false })),
      2000
    );
  };

  const handleResend = async (inviteeId, inviteeName) => {
    setIsResending(inviteeId);
    setResendStatus({ message: null, type: null });
    const token = localStorage.getItem("userToken");

    if (!token) {
      setResendStatus({ message: "Authorization failed. Please log in.", type: "error" });
      setIsResending(null);
      return;
    }

    try {
      const location = await getLocation();
      const payloadToEncrypt = {
        decrypted: { location },
        type: "string",
      };
      
      const encryptedBody = await encryptText(JSON.stringify(payloadToEncrypt));

      await axios.post(
        `${baseUrl}/api/document/resend/${inviteeId}`,
        { body: encryptedBody },
        { headers: { authorization: token } }
      );

      setResendStatus({ message: `Invitation successfully resent to ${inviteeName}.`, type: "success" });
      
      setInvitees(prev => prev.map(p => 
        p.id === inviteeId ? { ...p, lastSent: new Date().toISOString() } : p
      ));

    } catch (err) {
      console.error("Resend error:", err);
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
      setResendStatus({ message: `Failed to resend: ${errorMessage}`, type: "error" });
    } finally {
      setIsResending(null);
      setTimeout(() => setResendStatus({ message: null, type: null }), 5000);
    }
  };

  const handleRemove = (email) => {
    console.log(`Removing invitee ${email}`);
  };

  const toggleDropdown = (id) => {
    setShowDropdown((prev) => (prev === id ? null : id));
  };

  const signedCount = invitees.filter((p) => p.status === "Signed").length;
  const totalCount = invitees.length;
  const completionPercentage =
    totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-7xl mx-auto p-4 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-slate-200/80'} ${darkMode ? 'text-gray-200' : 'text-slate-700'} flex flex-col`}
    >
      {/* Header section */}
      <div className="flex-shrink-0">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl shadow-sm ${darkMode ? 'bg-orange-600 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>
              <FaFilePdf size={24} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-slate-800'}`}>
                {isLoading
                  ? "Loading..."
                  : documentDetails?.name || "Untitled Document"}
              </h2>
              <p className={`${darkMode ? 'text-purple-400' : 'text-slate-500'} text-xs mt-1`}>
                {documentDetails?.createdAt
                  ? `Created on ${formatDate(documentDetails.createdAt)}`
                  : "..."}
              </p>
            </div>
          </div>
          {documentDetails?.docStatus && (
            <StatusBadge status={documentDetails.docStatus} darkMode={darkMode} />
          )}
        </div>

        {/* Document info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Doc ID", value: documentId || "N/A" },
            { label: "Reference No.", value: documentDetails?.refNo || "N/A" },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-slate-200'}`}
            >
              <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-green-400' : 'text-slate-500'}`}>
                {item.label}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className={`font-mono text-xs truncate ${darkMode ? 'text-gray-200' : 'text-slate-900'}`}>
                  {isLoading ? "..." : item.value}
                </span>
                <button
                  onClick={() => handleCopy(item.label, item.value)}
                  className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'} transition-colors`}
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

          <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-slate-200'}`}>
            <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-green-400' : 'text-slate-500'}`}>
              Completion
            </p>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-slate-900'}`}>
                {isLoading ? "..." : signedCount}
              </span>
              <span className={darkMode ? "text-gray-500" : "text-slate-400"}>/</span>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                {isLoading ? "..." : totalCount}
              </span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-slate-200'}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${darkMode ? 'bg-blue-500' : 'bg-blue-500'}`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification area for resend status */}
      <AnimatePresence>
        {resendStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-3 mb-4 rounded-lg text-sm font-medium text-center ${
              resendStatus.type === 'success' 
                ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
            }`}
          >
            {resendStatus.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className={`border rounded-xl flex flex-col flex-grow h-[490px] ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-slate-200 bg-slate-50'}`}>
        {/* Tab navigation */}
        <div className={`flex border-b flex-shrink-0 ${darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-slate-200 bg-white/50'}`}>
          {["invitees", "document"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 px-4 text-sm font-semibold text-center capitalize transition-colors relative ${
                activeTab === tab
                  ? darkMode ? "text-blue-400" : "text-blue-600"
                  : darkMode ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700" : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "invitees" ? "Invitees List" : "Document View"}
              {activeTab === tab && (
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}
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
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      Invitees ({isLoading ? "..." : totalCount})
                    </h3>
                    <button className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-100/50'}`}>
                      <FaPlus size={12} /> Add Invitee
                    </button>
                  </div>

                  {isLoading ? (
                    <div className={`flex justify-center items-center h-64 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      Loading invitees...
                    </div>
                  ) : error ? (
                    <div className={`flex justify-center items-center h-64 p-4 rounded-lg text-center ${darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-500'}`}>
                      {error}
                    </div>
                  ) : invitees.length === 0 ? (
                    <div className={`flex justify-center items-center h-64 p-4 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-500'}`}>
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
                          isResending={isResending === person.id}
                          darkMode={darkMode}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <DocumentPreviewTab
                  document={documentDetails}
                  isLoading={isLoading}
                  darkMode={darkMode}
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
  isResending,
  darkMode,
}) => (
  <motion.div
    layout
    className={`p-4 rounded-lg border transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-700 border-gray-600 hover:border-blue-400 hover:shadow-lg' 
        : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-md'
    } ${
      isResending ? "opacity-60 pointer-events-none" : ""
    }`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-3">
        <div className={`md:w-10 md:h-10 xs:w-6 xs:h-6 xs:rounded-full md:rounded-xl flex items-center justify-center md:text-sm xs:text-[8px] font-bold shadow-sm ${
          darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'
        }`}>
          {person.avatar}
        </div>
        <div className="min-w-0 md:w-full xs:w-[100px] overflow-hidden">
          <p className={`font-semibold xs:text-[14px] md:text-[20px] ${darkMode ? 'text-gray-200' : 'text-slate-800'} truncate`}>
            {person.name}
          </p>
          <p className={`md:text-[16px] xs:text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-500'} truncate`}>
            {person.email}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <StatusBadge status={person.status} darkMode={darkMode} />
        <div
          className="relative"
          ref={showDropdown === person.id ? dropdownRef : null}
        >
          <button
            onClick={() => toggleDropdown(person.id)}
            className={`ml-2 p-1 rounded-full transition-colors ${
              darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
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
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-20 border origin-top-right ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-slate-200'
                }`}
              >
                <div className="py-1">
                  {[
                    {
                      icon: <FaLink />,
                      text: "Copy Signing Link",
                      onClick: () =>
                        handleCopy(`link-${person.id}`, person.signingLink),
                    },
                    {
                      icon: isResending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />,
                      text: isResending ? "Resending..." : "Resend Invitation",
                      onClick: () => handleResend(person.id, person.name),
                      disabled: isResending,
                    },
                    {
                      icon: <FaTrashAlt />,
                      text: "Remove Invitee",
                      onClick: () => handleRemove(person.email),
                      color: darkMode ? "text-red-400" : "text-red-600",
                    },
                  ].map((item) => (
                    <button
                      key={item.text}
                      onClick={() => {
                        if (item.onClick) item.onClick();
                        setShowDropdown(null);
                      }}
                      disabled={item.disabled}
                      className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left transition-colors ${
                        item.color || (darkMode ? "text-gray-200" : "text-slate-700")
                      } ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
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

    <div className={`space-y-3 p-3 rounded-md border mb-4 ${
      darkMode ? 'bg-gray-600/30 border-gray-600' : 'bg-slate-50/70 border-slate-200/80'
    }`}>
      {[
        {
          icon: <FaCalendarAlt />,
          label: "Last Sent",
          value: formatDate(person.lastSent),
        },
        {
          icon: <FaNetworkWired />,
          label: "IP Address",
          value: person.ip,
          isMono: true,
        },
        {
          icon: <FaGlobe />,
          label: "Location & Device",
          value:
            person.device !== "Not available"
              ? `${person.location} (${person.device})`
              : person.location,
        },
      ].map((detail) => (
        <div
          key={detail.label}
          className="flex items-center justify-between text-xs"
        >
          <p className={`flex items-center gap-1.5 font-medium ${
            darkMode ? 'text-gray-400' : 'text-slate-500'
          }`}>
            {detail.icon} {detail.label}
          </p>
          <p
            className={`font-medium ${detail.isMono ? "font-mono" : ""} ${
              darkMode ? 'text-gray-200' : 'text-slate-700'
            }`}
          >
            {detail.value}
          </p>
        </div>
      ))}
    </div>

    <div className={`flex gap-3 items-center justify-between pt-3 border-t ${
      darkMode ? 'border-gray-600' : 'border-slate-200'
    }`}>
      <div className={`flex items-center gap-1.5 text-xs ${
        darkMode ? 'text-[#ff4500]' : 'text-slate-500'
      }`}>
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
          onClick={() => handleResend(person.id, person.name)}
          disabled={isResending}
          className={`text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-wait ${
            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          {isResending ? (
            <>
              <FaSpinner size={10} className="animate-spin" /> RESENDING...
            </>
          ) : (
            <>
              <FaPaperPlane size={10} /> RESEND
            </>
          )}
        </button>
      )}
    </div>
  </motion.div>
);

const DocumentPreviewTab = ({ document, isLoading, darkMode }) => {
  if (isLoading) {
    return (
      <motion.div
        key="doc-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex flex-col items-center justify-center p-8 text-center min-h-[300px] ${
          darkMode ? 'text-gray-400' : 'text-slate-500'
        }`}
      >
        <p>Loading document preview...</p>
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
          className={`w-full h-[400px] md:h-[600px] border rounded-lg ${
            darkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-100'
          }`}
        />
        <div className="text-center mt-4">
          <a
            href={document.documentUrl}
            download={document.name ? `${document.name}.pdf` : "document.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 shadow-md hover:shadow-lg focus:ring-4 focus:outline-none ${
              darkMode 
                ? 'bg-blue-700 text-white hover:bg-blue-600 focus:ring-blue-800' 
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300'
            }`}
          >
            <FaDownload size={14} /> Download Document
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="doc-error"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center p-8 rounded-lg border text-center min-h-[300px] ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-slate-200'
      }`}
    >
      <FaFilePdf size={48} className={`mb-4 ${darkMode ? 'text-gray-600' : 'text-slate-300'}`} />
      <h4 className={`text-lg font-semibold mb-1 ${
        darkMode ? 'text-gray-200' : 'text-slate-800'
      }`}>
        Document Preview Not Available
      </h4>
      <p className={`text-sm ${
        darkMode ? 'text-gray-400' : 'text-slate-500'
      }`}>
        The document URL could not be found or is invalid.
      </p>
    </motion.div>
  );
};

export default AllInvites;