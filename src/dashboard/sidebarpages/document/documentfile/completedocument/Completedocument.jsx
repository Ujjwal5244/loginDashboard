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

  const formatApiDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

const Completedocument = () => {
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
    // Basic email validation
    if (!shareEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shareEmail)) {
      setShareError("Please enter a valid email address.");
      return;
    }

    setIsSendingShare(true);
    setShareError("");

    try {
      // 1. Construct the simple payload with only the email
      const payload = {
        email: shareEmail,
        type: "string",
      };

      // 2. Encrypt the payload object
      const encryptedPayload = await encryptText(payload);

      // 3. Make the API POST request
      await axios.post(
        `${baseUrl}/api/document/send-document-for-view?documentId=${docToShare.id}`,
        { body: encryptedPayload },
        {
          headers: {
            authorization: token,
          },
        }
      );

      // 4. Handle success
      alert(`Successfully shared "${docToShare.name}" with ${shareEmail}.`);
      handleCloseShareModal();
    } catch (err) {
      console.error("Failed to share document:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      setShareError(errorMessage);
    } finally {
      setIsSendingShare(false);
    }
  };

  const handleDownloadDocument = async (doc) => {
    if (!doc || !doc.url) {
      alert("Document URL not found. Cannot download.");
      return;
    }

    try {
      // Use axios to fetch the document as a blob
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
      alert(
        "Could not download the document. Please check the console for more details."
      );
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
      console.log(`Attempting to delete document with ID: ${docId}`);
      const response = await axios.delete(
        `${baseUrl}/api/document/delete?documentId=${docId}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log("Delete successful, server response:", response);
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== docId)
      );
      alert(`Document "${docName}" has been marked for deletion.`);
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

      alert(`Error: ${errorMessage}`);
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

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className={`px-3 py-1 rounded ${1 === currentPage ? "bg-[#3470b2] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 py-1">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded ${i === currentPage ? "bg-[#3470b2] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 py-1">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`px-3 py-1 rounded ${totalPages === currentPage ? "bg-[#3470b2] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };
  
  const handleAction = (action, docId) => {
    setActiveDropdown(null);

    // Find the document for the action
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
          alert("Preview is not available for this document.");
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

  // Array of date filter options for easier mapping
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
    return <div className="p-4 text-center">Loading documents...</div>;
  if (error)
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-2 sm:p-4 bg-gray-50 h-[100%]">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-shrink-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3470b2]">
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
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3470b2] focus:border-transparent"
            />
          </form>
          <div className="relative w-full sm:w-auto" ref={dateFilterRef}>
            <button
              onClick={() => setShowDateFilters(!showDateFilters)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <RiCalendarLine className="text-[#3470b2]" />
                <span className="text-sm font-medium text-gray-700">
                  {dateFilterOptions.find((opt) => opt.value === selectedOption)
                    ?.label || "Select Date"}
                </span>
              </div>
              <RiFilterLine className="text-gray-500 text-xs" />
            </button>
            {showDateFilters && (
              <div className="absolute right-0 z-20 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                <div className="space-y-1">
                  {dateFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionChange(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                        selectedOption === option.value
                          ? "bg-blue-100 text-[#3470b2]"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Show DatePickers only when 'Custom Range' is selected */}
                {selectedOption === "custom" && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="mb-2">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        maxDate={new Date()} // Prevents selecting future dates
                        placeholderText="Start Date"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
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
                        maxDate={new Date()} // Prevents selecting future dates
                        placeholderText="End Date"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
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
        className="hidden md:block bg-white rounded-lg shadow-sm overflow-auto"
        style={{ maxHeight: "calc(100vh - 14rem)" }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#3470b2] sticky top-0 z-10">
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
          <tbody className="bg-white divide-y divide-gray-200">
  {paginatedDocuments.length > 0 ? (
    paginatedDocuments.map((doc, index) => (
      // --- THE MAIN FIX IS HERE ---
      <tr
        key={doc.id}
        className={`hover:bg-gray-50 transition-colors ${
          activeDropdown === doc.id ? "relative z-20" : "" // Lifts the active row
        }`}
      >
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
          {startIndex + index + 1}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
          {doc.name}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
          {doc.createdOn}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
          {doc.updatedAt}
        </td>
        <td className="px-6 py-3 whitespace-nowrap">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {doc.status}
          </span>
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
          {/* The parent container for the button and dropdown */}
          <div className="relative flex justify-center">
            <button
              onClick={(e) => toggleActionDropdown(e, doc.id)}
              className="flex items-center gap-1 text-[#3470b2] hover:text-[#2c5d9a] p-1 rounded hover:bg-gray-100"
              title="Actions"
            >
              <RiMoreFill className="w-5 h-5" />
            </button>
            {activeDropdown === doc.id && (
              // This part is already good, with a high z-index
              <div
                data-menu="action-dropdown"
                className={`absolute right-0 w-48 bg-white rounded-md shadow-lg z-[10000] border border-gray-200
                ${dropdownPosition === "up" ? "bottom-full mb-1" : "mt-1"}`}
              >
                <div className="py-1">
                  {/* ... your action buttons ... */}
                  <button
                    onClick={() => handleAction("details", doc.id)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <RiInformationLine className="mr-2" /> Details
                  </button>
                  <button
                    onClick={() => handleAction("preview", doc.id)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <RiEyeLine className="mr-2" /> Preview
                  </button>
                  <button
                    onClick={() => handleAction("share", doc.id)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <RiShareLine className="mr-2" /> Share
                  </button>
                  <button
                    onClick={() => handleAction("download", doc.id)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <RiDownloadLine className="mr-2" /> Download
                  </button>
                  <button
                    onClick={() => handleAction("delete", doc.id)}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
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
        className="px-4 py-6 text-center text-sm text-gray-500"
      >
        No completed documents found.
      </td>
    </tr>
  )}
</tbody>
        </table>

        {/* Desktop Pagination Controls - now inside the scrollable container */}
        {filteredDocuments.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sticky bottom-0">
            <div className="flex items-center space-x-2 mb-3 sm:mb-0">
              <span className="text-sm text-gray-700">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredDocuments.length)} of{" "}
                {filteredDocuments.length} entries
              </span>
            </div>

            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              >
                <RiArrowLeftSLine className="w-5 h-5" />
              </button>

              {renderPageNumbers()}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
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
            <div key={doc.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Created:</span>{" "}
                      {doc.createdOn}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Updated:</span>{" "}
                      {doc.updatedAt}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    // Pass the event object to the handler
                    onClick={(e) => toggleActionDropdown(e, doc.id)}
                    className="text-[#3470b2] hover:text-[#2c5d9a] p-1"
                    title="Actions"
                  >
                    <RiMoreFill className="w-5 h-5" />
                  </button>
                  {activeDropdown === doc.id && (
                    <div
                      data-menu="action-dropdown"
                      // These classes dynamically change the position
                      className={`absolute right-0 w-48 bg-white rounded-md shadow-lg z-[10000] border border-gray-200
        ${dropdownPosition === "up" ? "bottom-full mb-1" : "mt-1"}`}
                    >
                      <div className="py-1">
                        {/* ... your buttons (details, preview, etc) are here ... */}
                        <button
                          onClick={() => handleAction("details", doc.id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <RiInformationLine className="mr-2" /> Details
                        </button>
                        <button
                          onClick={() => handleAction("preview", doc.id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <RiEyeLine className="mr-2" /> Preview
                        </button>
                        <button
                          onClick={() => handleAction("share", doc.id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <RiShareLine className="mr-2" /> Share
                        </button>
                        <button
                          onClick={() => handleAction("download", doc.id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <RiDownloadLine className="mr-2" /> Download
                        </button>
                        <button
                          onClick={() => handleAction("delete", doc.id)}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          <RiDeleteBinLine className="mr-2" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">
                  #{startIndex + index + 1}
                </span>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {doc.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-sm text-gray-500">
            No completed documents found.
          </div>
        )}

        {/* Mobile Pagination Controls */}
        {filteredDocuments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredDocuments.length)} of{" "}
                  {filteredDocuments.length}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Items:</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border flex items-center ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                >
                  <RiArrowLeftSLine className="mr-1" />
                  <span>Previous</span>
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border flex items-center ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                >
                  <span>Next</span>
                  <RiArrowRightSLine className="ml-1" />
                </button>
              </div>
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
            className="bg-white rounded-lg shadow-2xl md:ml-[200px]  w-[500px] h-[600px] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                Document Preview
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <RiCloseLine className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-grow p-1 bg-gray-200">
              <iframe
                src={previewUrl}
                title="Document Preview"
                className="w-full h-full border-0"
                allow="fullscreen"
                onError={(e) => {
                  console.error("Error loading iframe:", e);
                  alert(
                    "Failed to load document preview. It may be blocked by security policies. Please try downloading the document instead."
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
            className="bg-white rounded-lg shadow-2xl md:ml-[200px] w-full max-w-md flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-purple-800">
                Share Document
              </h3>
              <button
                onClick={handleCloseShareModal}
                disabled={isSendingShare}
                className="text-red-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RiCloseLine className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 text-center mb-6">
                You are sharing the document:{" "}
                <span className="font-semibold text-orange-800">
                  {docToShare.name}
                </span>
              </p>
              <div>
                <label
                  htmlFor="share-email"
                  className="block text-sm font-bold text-gray-700 mb-1"
                >
                  Recipient's Email
                </label>
                <input
                  type="email"
                  id="share-email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3470b2] focus:border-transparent"
                  disabled={isSendingShare}
                />
              </div>
              {/* --- ERROR MESSAGE DISPLAY --- */}
              {shareError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">
                  <p>{shareError}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg space-x-3">
              <button
                onClick={handleCloseShareModal}
                disabled={isSendingShare}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSendShare}
                disabled={isSendingShare}
                className="px-4 py-2 text-sm font-medium text-white bg-[#3470b2] rounded-lg hover:bg-[#2c5d9a] disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
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
