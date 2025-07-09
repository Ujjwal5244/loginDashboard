import React, { useState, useEffect, useRef } from "react";
import {
  RiDownloadLine,
  RiSearchLine,
  RiCalendarLine,
  RiFilterLine,
  RiEyeLine,
  RiShareLine,
  RiDeleteBinLine,
  RiInformationLine,
  RiMoreFill,
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  decryptText,
  encryptText,
  baseUrl,
} from "../../../../../encryptDecrypt";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Custom styles for react-datepicker in dark mode
const datePickerCustomStyle = `
  .react-datepicker {
    background-color: #374151 !important;
    border-color: #4b5563 !important;
  }
  .react-datepicker__header {
    background-color: #1f2937 !important;
    border-bottom-color: #4b5563 !important;
  }
  .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
    color: #d1d5db !important;
  }
  .react-datepicker__day-name, .react-datepicker__day {
    color: #d1d5db !important;
  }
  .react-datepicker__day:hover {
    background-color: #4b5563 !important;
  }
  .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
    background-color: #3470b2 !important;
    color: #ffffff !important;
  }
   .react-datepicker__day--keyboard-selected {
    background-color: #4b5563 !important;
  }
  .react-datepicker__navigation-icon::before {
     border-color: #d1d5db !important;
  }
  .react-datepicker__input-container input {
    background-color: #1f2937 !important;
    color: #d1d5db !important;
  }
`;

const formatApiDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

const Completedocument = ({ darkMode }) => {
  // --- STATE MANAGEMENT ---
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState("down");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dateFilterRef = useRef(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [docToShare, setDocToShare] = useState(null);
  const [isSendingShare, setIsSendingShare] = useState(false);
  const [shareError, setShareError] = useState("");

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);

      if (!token) {
        setError("Authentication error. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${baseUrl}/api/document/get-complete-doc`,
          {
            headers: {
              authorization: token,
            },
          }
        );

        const dcrypt = await decryptText(response.data.body);
        const parsed = JSON.parse(dcrypt);

        let documentsData = [];
        const processDocs = (docs) =>
          (docs || []).map((doc) => ({
            id: doc._id,
            name: doc.name,
            createdOn: formatApiDate(doc.createdAt),
            updatedAt: formatApiDate(doc.updatedAt),
            rawStatus: doc.status,
            status: "Completed",
            url: doc.documentUrl,
          }));

        if (Array.isArray(parsed)) {
          documentsData = parsed.flatMap((item) =>
            processDocs(item?.invitee?.decryptedDocs)
          );
        } else if (parsed.invitee) {
          const inviteeData = Array.isArray(parsed.invitee)
            ? parsed.invitee
            : [parsed.invitee];
          documentsData = inviteeData.flatMap((invitee) =>
            processDocs(invitee?.decryptedDocs)
          );
        }

        const activeDocuments = documentsData.filter(
          (doc) => doc.rawStatus?.toUpperCase() !== "DELETED"
        );

        setDocuments(activeDocuments);
      } catch (e) {
        console.error("Failed to fetch documents:", e);
        if (
          e.response &&
          (e.response.status === 401 || e.response.status === 403)
        ) {
          setError("You are not authorized to view this data.");
        } else {
          setError(
            e.message || "Could not load documents. Please try again later."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [token]);

  // --- Handlers for the Share Modal ---
  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setShareEmail("");
    setDocToShare(null);
    setShareError("");
    setIsSendingShare(false);
  };

  const handleSendShare = async () => {
    if (!shareEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shareEmail)) {
      setShareError("Please enter a valid email address.");
      return;
    }

    setIsSendingShare(true);
    setShareError("");

    try {
      const payload = {
        email: shareEmail,
        type: "string",
      };

      const encryptedPayload = await encryptText(payload);

      await axios.post(
        `${baseUrl}/api/document/send-document-for-view?documentId=${docToShare.id}`,
        { body: encryptedPayload },
        {
          headers: {
            authorization: token,
          },
        }
      );

      toast.success(
        `Successfully shared "${docToShare.name}" with ${shareEmail}.`
      );
      handleCloseShareModal();
    } catch (err) {
      console.error("Failed to share document:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      setShareError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSendingShare(false);
    }
  };

  const handleDownloadDocument = async (doc) => {
    if (!doc || !doc.url) {
      toast.error("Document URL not found. Cannot download.");
      return;
    }

    try {
      const response = await axios.get(doc.url, {
        headers: {
          authorization: token,
        },
        responseType: "blob",
      });
      let filename = doc.name || "document";
      if (!filename.toLowerCase().endsWith(".pdf")) {
        filename += ".pdf";
      }
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = blobUrl;

      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Could not download the document. Please try again.");
    }
  };
  const handleDeleteDocument = async (docId, docName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${docName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${baseUrl}/api/document/delete?documentId=${docId}`, {
        headers: {
          authorization: token,
        },
      });

      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== docId)
      );
      toast.success(`Document "${docName}" has been successfully deleted.`);
    } catch (err) {
      console.error("Failed to delete document. Full error:", err);
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      let errorMessage = "An unexpected error occurred while deleting.";

      if (status === 404) {
        errorMessage =
          "Document not found on the server. It might have been already deleted.";
      } else if (status === 403) {
        errorMessage = "You do not have permission to delete this document.";
      } else if (serverMessage) {
        errorMessage = serverMessage;
      }
      toast.error(`Error: ${errorMessage}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateFilterRef.current &&
        !dateFilterRef.current.contains(event.target)
      ) {
        setShowDateFilters(false);
      }
      if (
        !event.target.closest('button[title="Actions"]') &&
        !event.target.closest('[data-menu="action-dropdown"]')
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (option) {
      case "yesterday": {
        const yesterdayStart = new Date(today);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const yesterdayEnd = new Date(yesterdayStart);
        yesterdayEnd.setHours(23, 59, 59, 999);
        setStartDate(yesterdayStart);
        setEndDate(yesterdayEnd);
        setShowDateFilters(false);
        break;
      }
      case "today": {
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        setStartDate(today);
        setEndDate(todayEnd);
        setShowDateFilters(false);
        break;
      }
      case "7days": {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        setStartDate(start);
        setEndDate(end);
        setShowDateFilters(false);
        break;
      }
      case "30days": {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date(end);
        start.setDate(start.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        setStartDate(start);
        setEndDate(end);
        setShowDateFilters(false);
        break;
      }
      case "lastMonth": {
        const firstDayLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastDayLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        lastDayLastMonth.setHours(23, 59, 59, 999);
        setStartDate(firstDayLastMonth);
        setEndDate(lastDayLastMonth);
        setShowDateFilters(false);
        break;
      }
      case "thisMonth": {
        const firstDayThisMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        setStartDate(firstDayThisMonth);
        setEndDate(todayEnd);
        setShowDateFilters(false);
        break;
      }
      case "all":
        setStartDate(null);
        setEndDate(null);
        setShowDateFilters(false);
        break;
      case "custom":
        break;
      default:
        setShowDateFilters(false);
        break;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const parseDocumentDate = (dateStr) => {
    if (dateStr === "N/A") return null;
    const [datePart, timePart] = dateStr.split(", ");
    if (!datePart || !timePart) return null;
    const [day, month, year] = datePart.split("/");
    const [hours, minutes, seconds] = timePart.split(":");
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = (doc.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    let matchesDate = true;
    if (startDate && endDate) {
      const docDate = parseDocumentDate(doc.createdOn);
      if (docDate) {
        matchesDate = docDate >= startDate && docDate <= endDate;
      } else {
        matchesDate = false;
      }
    }
    return matchesSearch && matchesDate;
  });

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const toggleActionDropdown = (event, docId) => {
    if (activeDropdown === docId) {
      setActiveDropdown(null);
      return;
    }
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const dropdownHeight = 210;
    if (spaceBelow < dropdownHeight) {
      setDropdownPosition("up");
    } else {
      setDropdownPosition("down");
    }
    setActiveDropdown(docId);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      if (currentPage <= half + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - half) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    const buttonClass = (page) =>
      `px-3 py-1 rounded ${
        page === currentPage
          ? "bg-[#3470b2] text-white"
          : darkMode
            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
            : "bg-white text-gray-700 hover:bg-gray-100"
      }`;

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => goToPage(1)} className={buttonClass(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span
            key="start-ellipsis"
            className={`px-2 py-1 ${darkMode ? "text-gray-400" : ""}`}
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => goToPage(i)} className={buttonClass(i)}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="end-ellipsis"
            className={`px-2 py-1 ${darkMode ? "text-gray-400" : ""}`}
          >
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={buttonClass(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };

  const handleAction = (action, docId) => {
    setActiveDropdown(null);
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    switch (action) {
      case "details":
        navigate(`/maindashboard/allinvities?documentId=${docId}`);
        break;
      case "preview":
        if (doc.url) {
          setPreviewUrl(doc.url);
          setIsPreviewOpen(true);
        } else {
          toast.warn("Preview is not available for this document.");
        }
        break;
      case "share":
        setDocToShare(doc);
        setIsShareModalOpen(true);
        break;
      case "download":
        handleDownloadDocument(doc);
        break;
      case "delete":
        handleDeleteDocument(doc.id, doc.name);
        break;
      default:
        console.log(`Unknown action "${action}" for document ID: ${docId}`);
    }
  };

  const dateFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "custom", label: "Custom Range" },
  ];

  if (isLoading)
    return (
      <div
        className={`p-4 text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}
      >
        Loading documents...
      </div>
    );
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div
      className={`p-2 sm:p-4 md:h-[100%] sm:h-[100%] ${
        darkMode ? "bg-[#111827]" : "bg-gray-50"
      }`}
    >
      {darkMode && <style>{datePickerCustomStyle}</style>}
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-shrink-0">
          <h1
            className={`text-lg sm:text-xl md:text-2xl font-bold ${
              darkMode ? "text-blue-400" : "text-[#3470b2]"
            }`}
          >
            Completed Documents
          </h1>
        </div>
        <div className="w-full flex sm:flex-col md:flex-row sm:justify-end sm:items-end gap-3">
          <form
            onSubmit={handleSearch}
            className="relative w-full sm:w-64 md:w-80"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#3470b2] focus:border-transparent ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "border border-gray-300"
              }`}
            />
          </form>
          <div className="relative w-full sm:w-auto" ref={dateFilterRef}>
            <button
              onClick={() => setShowDateFilters(!showDateFilters)}
              className={`w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <RiCalendarLine
                  className={darkMode ? "text-blue-400" : "text-[#3470b2]"}
                />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {dateFilterOptions.find((opt) => opt.value === selectedOption)
                    ?.label || "Select Date"}
                </span>
              </div>
              <RiFilterLine
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
            </button>
            {showDateFilters && (
              <div
                className={`absolute right-0 z-20 mt-2 w-64 rounded-lg shadow-lg p-2 ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="space-y-1">
                  {dateFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionChange(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                        selectedOption === option.value
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {selectedOption === "custom" && (
                  <div
                    className={`mt-3 pt-3 ${
                      darkMode
                        ? "border-t border-gray-700"
                        : "border-t border-gray-200"
                    }`}
                  >
                    <div className="mb-2">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        maxDate={new Date()}
                        placeholderText="Start Date"
                        className={`w-full px-3 py-2 text-sm rounded-md ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "border border-gray-300"
                        }`}
                      />
                    </div>
                    <div className="mb-2">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        maxDate={new Date()}
                        placeholderText="End Date"
                        className={`w-full px-3 py-2 text-sm rounded-md ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "border border-gray-300"
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => setShowDateFilters(false)}
                      className="w-full mt-2 px-3 py-2 text-sm bg-[#3470b2] text-white rounded-md hover:bg-[#2c5d9a]"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div
        className={`hidden md:block rounded-lg shadow-sm overflow-auto ${
          darkMode ? "bg-gray-700" : "bg-white"
        }`}
        style={{ maxHeight: "calc(100vh - 14rem)" }}
      >
        <table className="min-w-full">
          <thead
            className={`sticky top-0 z-10 ${
              darkMode ? "bg-[#f98600]" : "bg-[#3470b2]"
            }`}
          >
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Document Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Created On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Updated At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`${
              darkMode ? "divide-y divide-gray-600" : "divide-y divide-gray-200"
            }`}
          >
            {paginatedDocuments.length > 0 ? (
              paginatedDocuments.map((doc, index) => (
                <tr
                  key={doc.id}
                  className={`transition-colors ${
                    darkMode ? "hover:bg-gray-600" : "hover:bg-gray-50"
                  } ${activeDropdown === doc.id ? "relative z-20" : ""}`}
                >
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {startIndex + index + 1}
                  </td>
                  <td
                    className={`px-6 py-3 whitespace-nowrap text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {doc.name}
                  </td>
                  <td
                    className={`px-6 py-3 whitespace-nowrap text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {doc.createdOn}
                  </td>
                  <td
                    className={`px-6 py-3 whitespace-nowrap text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {doc.updatedAt}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        darkMode
                          ? "bg-green-900 bg-opacity-70 text-green-300"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <div className="relative flex justify-center">
                      <button
                        onClick={(e) => toggleActionDropdown(e, doc.id)}
                        className={`flex items-center gap-1 p-1 rounded ${
                          darkMode
                            ? "text-blue-400 hover:text-blue-300 hover:bg-gray-600"
                            : "text-[#3470b2] hover:text-[#2c5d9a] hover:bg-gray-100"
                        }`}
                        title="Actions"
                      >
                        <RiMoreFill className="w-5 h-5" />
                      </button>
                      {activeDropdown === doc.id && (
                        <div
                          data-menu="action-dropdown"
                          className={`absolute right-0 w-48 rounded-md shadow-lg z-[10000] ${
                            dropdownPosition === "up"
                              ? "bottom-full mb-1"
                              : "mt-1"
                          } ${
                            darkMode
                              ? "bg-gray-800 border border-gray-600"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleAction("details", doc.id)}
                              className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                darkMode
                                  ? "text-gray-300 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <RiInformationLine className="mr-2" /> Details
                            </button>
                            <button
                              onClick={() => handleAction("preview", doc.id)}
                              className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                darkMode
                                  ? "text-gray-300 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <RiEyeLine className="mr-2" /> Preview
                            </button>
                            <button
                              onClick={() => handleAction("share", doc.id)}
                              className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                darkMode
                                  ? "text-gray-300 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <RiShareLine className="mr-2" /> Share
                            </button>
                            <button
                              onClick={() => handleAction("download", doc.id)}
                              className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                darkMode
                                  ? "text-gray-300 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <RiDownloadLine className="mr-2" /> Download
                            </button>
                            <button
                              onClick={() => handleAction("delete", doc.id)}
                              className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                darkMode
                                  ? "text-red-500 hover:bg-gray-700"
                                  : "text-red-600 hover:bg-gray-100"
                              }`}
                            >
                              <RiDeleteBinLine className="mr-2" /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className={`px-4 py-6 text-center text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No completed documents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredDocuments.length > 0 && (
          <div
            className={`flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t sticky bottom-0 ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2 mb-3 sm:mb-0">
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Items per page:
              </span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className={`rounded-md px-2 py-1 text-sm ${
                  darkMode
                    ? "bg-gray-600 border border-gray-500 text-gray-200"
                    : "border border-gray-300"
                }`}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-sm ${
                  darkMode ? "text-[#e35c5c]" : "text-gray-700"
                }`}
              >
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredDocuments.length)} of{" "}
                {filteredDocuments.length} entries
              </span>
            </div>

            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? darkMode
                      ? "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-900 border-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <RiArrowLeftSLine className="w-5 h-5" />
              </button>

              {renderPageNumbers()}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? darkMode
                      ? "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-900 border-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <RiArrowRightSLine className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* mobile view */}
      <div className="md:hidden space-y-3">
        {paginatedDocuments.length > 0 ? (
          paginatedDocuments.map((doc, index) => (
            <div
              key={doc.id}
              className={`rounded-lg shadow-sm p-4 ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`font-medium ${
                      darkMode ? "text-orange-500" : "text-gray-900"
                    }`}
                  >
                    {doc.name}
                  </h3>
                  <div className="mt-1 space-y-1">
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <span className="font-medium">Created:</span>{" "}
                      {doc.createdOn}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <span className="font-medium">Updated:</span>{" "}
                      {doc.updatedAt}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => toggleActionDropdown(e, doc.id)}
                    className={`p-1 ${
                      darkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-[#3470b2] hover:text-[#2c5d9a]"
                    }`}
                    title="Actions"
                  >
                    <RiMoreFill className="w-5 h-5" />
                  </button>
                  {activeDropdown === doc.id && (
                    <div
                      data-menu="action-dropdown"
                      className={`absolute right-0 w-48 rounded-md shadow-lg z-[10000] ${
                        dropdownPosition === "up" ? "bottom-full mb-1" : "mt-1"
                      } ${
                        darkMode
                          ? "bg-gray-800 border border-gray-600"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="py-1">
                        {/* Action buttons with dark mode styles */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  #{startIndex + index + 1}
                </span>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    darkMode
                      ? "bg-green-900 bg-opacity-70 text-green-300"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div
            className={`rounded-lg shadow-sm p-6 text-center text-sm ${
              darkMode ? "bg-gray-700 text-gray-400" : "bg-white text-gray-500"
            }`}
          >
            No completed documents found.
          </div>
        )}

        {filteredDocuments.length > 0 && (
          <div
            className={`rounded-lg shadow-sm p-4 mt-4 ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            <div className="flex flex-col">
  {/* Mobile Pagination Controls */}
{filteredDocuments.length > 0 && (
  <div
    className={`mt-4 rounded-lg p-4 shadow-md ring-1 ${
      darkMode
        ? 'bg-slate-800 ring-slate-700'
        : 'bg-white ring-slate-200'
    }`}
  >
    <div className="flex flex-col gap-4">
      {/* Top Row: Info & Items per Page */}
      <div className="flex items-center justify-between text-sm">
        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
          Showing{' '}
          <span
            className={`font-semibold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {startIndex + 1}
          </span>{' '}
          to{' '}
          <span
            className={`font-semibold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {Math.min(endIndex, filteredDocuments.length)}
          </span>{' '}
          of{' '}
          <span
            className={`font-semibold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {filteredDocuments.length}
          </span>
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`hidden sm:inline ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Items:
          </span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className={`rounded-md px-2 py-1 text-sm ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? 'border-slate-600 bg-slate-700 text-slate-200 ring-slate-600'
                : 'border-slate-300 bg-slate-50 text-slate-900 ring-slate-300'
            }`}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ring-1 ring-inset transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            darkMode
              ? 'bg-slate-800 text-slate-200 ring-slate-600 hover:bg-slate-700'
              : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'
          }`}
        >
          <RiArrowLeftSLine className="h-5 w-5" />
          <span>Prev</span>
        </button>

        <span
          className={`text-sm font-medium ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Page {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ring-1 ring-inset transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            darkMode
              ? 'bg-slate-800 text-slate-200 ring-slate-600 hover:bg-slate-700'
              : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'
          }`}
        >
          <span>Next</span>
          <RiArrowRightSLine className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
)}
</div>
          </div>
        )}
      </div>

      {/* --- DOCUMENT PREVIEW MODAL --- */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className={`rounded-lg shadow-2xl md:ml-[200px] w-full max-w-lg h-[80vh] max-h-[700px] flex flex-col ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex justify-between items-center p-3 border-b rounded-t-lg ${
                darkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Document Preview
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className={`p-1 rounded-full transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <RiCloseLine className="w-6 h-6" />
              </button>
            </div>
            <div
              className={`flex-grow p-1 ${
                darkMode ? "bg-gray-900" : "bg-gray-200"
              }`}
            >
              <iframe
                src={previewUrl}
                title="Document Preview"
                className="w-full h-full border-0"
                allow="fullscreen"
                onError={(e) => {
                  toast.error(
                    "Failed to load document preview. Try downloading instead."
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* --- SHARE DOCUMENT MODAL --- */}
      {isShareModalOpen && docToShare && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          onClick={!isSendingShare ? handleCloseShareModal : undefined}
        >
          <div
            className={`rounded-lg shadow-2xl md:ml-[200px] w-full max-w-md flex flex-col ${
              darkMode ? "bg-gray-700" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex justify-between items-center p-4 border-b ${
                darkMode ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-purple-400" : "text-purple-800"
                }`}
              >
                Share Document
              </h3>
              <button
                onClick={handleCloseShareModal}
                disabled={isSendingShare}
                className="text-gray-500 hover:text-gray-300 p-1 rounded-full hover:bg-gray-600 disabled:opacity-50"
              >
                <RiCloseLine className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p
                className={`text-sm text-center mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                You are sharing the document:{" "}
                <span
                  className={`font-semibold ${
                    darkMode ? "text-orange-400" : "text-orange-800"
                  }`}
                >
                  {docToShare.name}
                </span>
              </p>
              <div>
                <label
                  htmlFor="share-email"
                  className={`block text-sm font-bold mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Recipient's Email
                </label>
                <input
                  type="email"
                  id="share-email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className={`w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#3470b2] focus:border-transparent ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400"
                      : "border border-gray-300"
                  }`}
                  disabled={isSendingShare}
                />
              </div>
              {shareError && (
                <div
                  className={`border-l-4 p-3 rounded-md text-sm ${
                    darkMode
                      ? "bg-red-900 bg-opacity-50 border-red-500 text-red-400"
                      : "bg-red-100 border-red-500 text-red-700"
                  }`}
                >
                  <p>{shareError}</p>
                </div>
              )}
            </div>
            <div
              className={`flex justify-end items-center p-4 border-t rounded-b-lg space-x-3 ${
                darkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <button
                onClick={handleCloseShareModal}
                disabled={isSendingShare}
                className={`px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode
                    ? "text-gray-300 bg-gray-600 border border-gray-500 hover:bg-gray-500"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSendShare}
                disabled={isSendingShare}
                className="px-4 py-2 text-sm font-medium text-white bg-[#3470b2] rounded-lg hover:bg-[#2c5d9a] disabled:bg-blue-400 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
              >
                {isSendingShare ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Completedocument;
