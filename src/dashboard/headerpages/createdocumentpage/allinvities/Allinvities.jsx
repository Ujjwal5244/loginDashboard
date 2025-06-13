import React, { useState, useRef, useEffect } from "react";
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

// A custom hook to detect clicks outside of a specified element
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
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

// Moved StatusBadge outside the main component for better performance and organization.
// It's a pure component that doesn't need to be redefined on every render.
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Signed: { bg: "bg-green-100", text: "text-green-800", icon: <FaCheck /> },
    Declined: { bg: "bg-red-100", text: "text-red-800", icon: <FaTimes /> },
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <FaHourglassHalf />,
    },
  };
  const { bg, text, icon } = statusStyles[status] || statusStyles.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${bg} ${text}`}
    >
      {icon} {status}
    </span>
  );
};

const AllInvitations = () => {
  const [activeTab, setActiveTab] = useState("invitees");
  const [copiedStates, setCopiedStates] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const invitees = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "Pending",
      avatar: "JD",
      lastSent: "2023-06-15T14:30:00Z",
      ip: "192.168.1.45",
      location: "New York, US",
      device: "MacOS Chrome",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Signed",
      avatar: "JS",
      signedAt: "2023-06-14T09:15:00Z",
      ip: "203.0.113.22",
      location: "London, UK",
      device: "Windows Firefox",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      status: "Pending",
      avatar: "RJ",
      lastSent: "2023-06-12T16:45:00Z",
      ip: "Not available",
      location: "Not available",
      device: "Not available",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      status: "Declined",
      avatar: "ED",
      declinedAt: "2023-06-08T11:20:00Z",
      ip: "198.51.100.34",
      location: "Sydney, AU",
      device: "iOS Safari",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com",
      status: "Pending",
      avatar: "MB",
      lastSent: "2023-06-18T10:00:00Z",
      ip: "172.16.0.1",
      location: "Chicago, US",
      device: "Android Chrome",
    },
    {
      id: 6,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      status: "Pending",
      avatar: "SW",
      lastSent: "2023-06-18T11:30:00Z",
      ip: "10.0.0.5",
      location: "Toronto, CA",
      device: "Windows Edge",
    },
  ];

  useOnClickOutside(dropdownRef, () => setShowDropdown(null));

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCopy = (id, textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(
      () => setCopiedStates((prev) => ({ ...prev, [id]: false })),
      2000
    );
  };

  const handleResend = (email) =>
    console.log(`Resending invitation to ${email}`);
  const handleRemove = (email) => console.log(`Removing invitee ${email}`);
  const toggleDropdown = (id) =>
    setShowDropdown(showDropdown === id ? null : id);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-slate-200/80 text-slate-700 flex flex-col"
    >
      {/* --- HEADER --- */}
      <div className="flex-shrink-0">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
              <FaFilePdf size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">frontend.pdf</h2>
              <p className="text-slate-500 text-xs mt-1">
                Created on 15 May 2023 • 4.2 MB
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
            Pending
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Doc ID", value: "683af35e501ec84d69e8b2c0" },
            { label: "Reference No.", value: "uytyugtuy" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200"
            >
              <p className="text-slate-500 text-xs font-medium mb-1">
                {item.label}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-slate-900 text-xs truncate">
                  {item.value}
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
            <p className="text-slate-500 text-xs font-medium mb-1">
              Completion
            </p>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-slate-900 text-sm font-bold">0</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600 text-sm">{invitees.length}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: "0%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TAB CONTAINER --- */}
      <div className="border border-slate-200 rounded-xl bg-slate-50 flex flex-col flex-grow h-[490px] ">
        <div className="flex border-b border-slate-200 bg-white/50 flex-shrink-0">
          {["invitees", "document"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 px-4 text-sm font-semibold text-center capitalize transition-colors relative ${activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"}`}
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

        {/* --- SCROLLABLE CONTENT AREA --- */}
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
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-4 px-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Invitees ({invitees.length})
                    </h3>
                    <button className="text-sm text-blue-600 font-medium flex items-center gap-1.5 hover:bg-blue-100/50 px-3 py-1.5 rounded-lg transition-colors">
                      <FaPlus size={12} /> Add Invitee
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {invitees.map((person) => (
                      <motion.div
                        key={person.id}
                        layout
                        className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shadow-sm">
                              {person.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {person.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {person.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <StatusBadge status={person.status} />
                            <div
                              className="relative"
                              ref={
                                showDropdown === person.id ? dropdownRef : null
                              }
                            >
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
                                          onClick: () =>
                                            handleCopy(
                                              `link-${person.id}`,
                                              `https://sign.example.com/invite/${person.email}`
                                            ),
                                        },
                                        {
                                          icon: <FaPaperPlane />,
                                          text: "Resend Invitation",
                                          onClick: () =>
                                            handleResend(person.email),
                                        },
                                        {
                                          icon: <FaTrashAlt />,
                                          text: "Remove Invitee",
                                          onClick: () =>
                                            handleRemove(person.email),
                                          color: "text-red-600",
                                        },
                                      ].map((item) => (
                                        <button
                                          key={item.text}
                                          onClick={() => {
                                            item.onClick();
                                            setShowDropdown(null);
                                          }}
                                          className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left transition-colors ${item.color || "text-slate-700"} hover:bg-slate-100`}
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
                            {
                              icon: <FaCalendarAlt />,
                              label:
                                person.status === "Signed"
                                  ? "Signed Date"
                                  : person.status === "Declined"
                                    ? "Declined Date"
                                    : "Last Sent",
                              value: formatDate(
                                person.signedAt ||
                                  person.declinedAt ||
                                  person.lastSent
                              ),
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
                              value: `${person.location} • ${person.device}`,
                            },
                          ].map((detail) => (
                            <div
                              key={detail.label}
                              className="flex items-center justify-between text-xs"
                            >
                              <p className="flex items-center gap-1.5 font-medium text-slate-500">
                                {detail.icon} {detail.label}
                              </p>
                              <p
                                className={`font-medium text-slate-700 ${detail.isMono ? "font-mono" : ""}`}
                              >
                                {detail.value}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-slate-100">
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
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="document"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-slate-200 text-center min-h-[300px]"
                >
                  <FaFilePdf size={48} className="text-slate-300 mb-4" />
                  <h4 className="text-lg font-semibold text-slate-800 mb-1">
                    Document Preview
                  </h4>
                  <p className="text-sm text-slate-500 mb-6">
                    A preview of your document will appear here.
                  </p>
                  <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none">
                    <FaDownload size={14} /> Download Document
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AllInvitations;
