import React, { useState, useEffect, useRef } from "react";
import {
  RiDownloadLine,
  RiSearchLine,
  RiCalendarLine,
  RiFilterLine,
  RiEyeLine,
  RiInformationLine,
  RiDeleteBinLine,
  RiMoreFill,
  RiCloseLine,
} from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decryptText, baseUrl } from "../../../../../encryptDecrypt";
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
`;

const Draftdocument = ({ darkMode }) => {
  // --- STATE MANAGEMENT ---
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState("down");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const tableBodyRef = useRef(null);
  const dateFilterRef = useRef(null);
  const actionDropdownRefs = useRef({});

  const [previewDocument, setPreviewDocument] = useState(null);

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
          `${baseUrl}/api/document/get-draft-doc`,
          {
            headers: {
              authorization: token,
            },
          }
        );

        const dcrypt = await decryptText(response.data.body);
        const parsed = JSON.parse(dcrypt);

        const documentsData = parsed.doucument.map((doc) => ({
          id: doc._id,
          name: doc.name,
          createdOn: formatApiDate(doc.createdAt),
          rawStatus: doc.status,

          status: "Draft",
          url: doc.documentUrl,
        }));

        const activeDocuments = documentsData.filter(
          (doc) => doc.rawStatus?.toUpperCase() !== "DELETED"
        );
        setDocuments(activeDocuments);
      } catch (e) {
        console.error("Failed to fetch draft documents:", e);
        setError(
          e.message || "Could not load documents. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [token]);

  // --- UTILITY FUNCTIONS ---
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateFilterRef.current &&
        !dateFilterRef.current.contains(event.target)
      ) {
        setShowDateFilters(false);
      }
      let isClickInsideActionDropdown = false;
      for (const id in actionDropdownRefs.current) {
        if (
          actionDropdownRefs.current[id] &&
          actionDropdownRefs.current[id].contains(event.target)
        ) {
          isClickInsideActionDropdown = true;
          break;
        }
      }
      if (!isClickInsideActionDropdown) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- FILTER & PAGINATION LOGIC ---
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
        break;
      }
      case "today": {
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        setStartDate(today);
        setEndDate(todayEnd);
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
        break;
      }
      case "all":
        setStartDate(null);
        setEndDate(null);
        break;
      case "custom":
        setShowDateFilters(true);
        break;
      default:
        break;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const parseDocumentDate = (dateStr) => {
    if (!dateStr || !dateStr.includes(",")) return new Date(0);
    const [datePart, timePart] = dateStr.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes, seconds] = timePart.split(":");
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    let matchesDate = true;
    if (startDate && endDate) {
      const docDate = parseDocumentDate(doc.createdOn);
      matchesDate = docDate >= startDate && docDate <= endDate;
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

  const toggleActionDropdown = (docId, event) => {
    if (activeDropdown === docId) {
      setActiveDropdown(null);
      return;
    }
    const DROPDOWN_HEIGHT = 180;
    const container = tableBodyRef.current;
    const button = event.currentTarget;
    if (container && button) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const spaceBelow = containerRect.bottom - buttonRect.bottom;
      if (spaceBelow < DROPDOWN_HEIGHT) {
        setDropdownPosition("up");
      } else {
        setDropdownPosition("down");
      }
    }
    setActiveDropdown(docId);
  };

  // --- ACTION HANDLER ---
  const handleAction = async (action, docId) => {
    setActiveDropdown(null);

    const doc = documents.find((d) => d.id === docId);
    if (!doc) {
      console.error("Document not found for action:", action, docId);
      toast.error("Could not find the selected document.");
      return;
    }

    if (action === "preview") {
      if (doc && doc.url) {
        setPreviewDocument(doc);
      } else {
        console.error("Document or document URL not found for preview.");
        toast.error("Sorry, the document could not be loaded for preview.");
      }
    } else if (action === "download") {
      // --- START: CORRECTED AND ROBUST DOWNLOAD LOGIC ---
      toast.info("Preparing your download...");

      try {
        // 1. Fetch the document as a blob
        const response = await axios.get(doc.url, {
          responseType: "blob",
        });

        // 2. Determine the correct filename with extension
        let filename = doc.name;
        // Check if the name from the API already has an extension
        const hasExtension = /\.[^/.]+$/.test(filename);

        if (!hasExtension) {
          // If not, try to get it from the URL
          const urlFilename = doc.url.split("/").pop().split("?")[0];
          const extensionMatch = urlFilename.match(/\.[^/.]+$/);
          if (extensionMatch) {
            filename += extensionMatch[0];
          }
        }

        // 3. Get the file's MIME type from the response headers
        const contentType = response.headers["content-type"];

        // 4. Create a Blob with the correct data AND type
        const blob = new Blob([response.data], { type: contentType });
        const blobUrl = window.URL.createObjectURL(blob);

        // 5. Create a temporary link to trigger the download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", filename); // Use the corrected filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 6. Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download failed:", error);
        toast.error(
          "Could not download the file. The file may not be accessible or a network error occurred."
        );
      }
      // --- END: CORRECTED AND ROBUST DOWNLOAD LOGIC ---
    } else if (action === "delete") {
      if (
        window.confirm(
          `Are you sure you want to delete "${doc.name}"? This action cannot be undone.`
        )
      ) {
        try {
          await axios.delete(
            `${baseUrl}/api/document/delete?documentId=${doc.id}`,
            {
              headers: {
                authorization: token,
              },
            }
          );
          setDocuments((prevDocs) => prevDocs.filter((d) => d.id !== doc.id));
          toast.success("Document deleted successfully.");
        } catch (e) {
          console.error("Failed to delete document:", e);
          toast.error(
            "An error occurred while deleting the document. Please try again."
          );
        }
      }
    } else if (action === "details") {
      toast.info("Details functionality is not yet implemented.");
      console.log(`Action: ${action} on docId: ${docId}`);
    }
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };

  const truncateId = (id, startLength = 6, endLength = 6) => {
    const strId = String(id);
    if (strId.length <= startLength + endLength + 3) {
      return strId;
    }
    return `${strId.substring(0, startLength)}...${strId.substring(
      strId.length - endLength
    )}`;
  };

  if (isLoading)
    return (
      <div className={`p-4 text-center ${darkMode ? "text-gray-300" : ""}`}>
        Loading documents...
      </div>
    );
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div
      className={`p-2 sm:p-4 h-[100%] flex flex-col ${
        darkMode ? "bg-[#111827]" : "bg-white"
      }`}
    >
      {darkMode && <style>{datePickerCustomStyle}</style>}

      {/* Header and Filters */}
      <div className="flex-shrink-0 mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-shrink-0">
          <h1
            className={`text-lg sm:text-xl md:text-2xl font-bold ${
              darkMode ? "text-blue-400" : "text-[#3470b2]"
            }`}
          >
            Draft Documents
          </h1>
        </div>
        <div className="w-full flex sm:flex-col md:flex-row sm:justify-end sm:items-end gap-3">
          <form
            onSubmit={handleSearch}
            className="relative w-full sm:w-64 md:w-80"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine
                className={darkMode ? "text-gray-400" : "text-gray-400"}
              />
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
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <RiCalendarLine
                  className={darkMode ? "text-green-400" : "text-[#3470b2]"}
                />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {selectedOption === "today" && "Today"}
                  {selectedOption === "yesterday" && "Yesterday"}
                  {selectedOption === "7days" && "Last 7 Days"}
                  {selectedOption === "30days" && "Last 30 Days"}
                  {selectedOption === "lastMonth" && "Last Month"}
                  {selectedOption === "thisMonth" && "This Month"}
                  {selectedOption === "all" && "All Time"}
                  {selectedOption === "custom" && "Custom Range"}
                </span>
              </div>
              <RiFilterLine
                className={darkMode ? "text-orange-400" : "text-gray-500"}
              />
            </button>
            {showDateFilters && (
              <div
                className={`absolute right-0 z-20 mt-2 w-56 rounded-lg shadow-lg p-2 ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="space-y-1">
                  {[
                    { label: "Yesterday", value: "yesterday" },
                    { label: "Today", value: "today" },
                    { label: "Last 7 Days", value: "7days" },
                    { label: "Last 30 Days", value: "30days" },
                    { label: "Last Month", value: "lastMonth" },
                    { label: "This Month", value: "thisMonth" },
                    { label: "All Time", value: "all" },
                    { label: "Custom Range", value: "custom" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all ${
                        selectedOption === option.value
                          ? "bg-[#3470b2] text-white"
                          : darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        handleOptionChange(option.value);
                        if (option.value !== "custom")
                          setShowDateFilters(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {selectedOption === "custom" && (
                  <div
                    className={`mt-2 pt-2 ${
                      darkMode ? "border-t border-gray-700" : "border-t"
                    }`}
                  >
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      maxDate={endDate || new Date()}
                      className={`w-full px-3 py-1 text-sm rounded-md ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "border border-gray-300"
                      }`}
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        const newEndDate = new Date(date);
                        newEndDate.setHours(23, 59, 59, 999);
                        setEndDate(newEndDate);
                      }}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      maxDate={new Date()}
                      className={`w-full px-3 py-1 text-sm rounded-md mt-2 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "border border-gray-300"
                      }`}
                    />
                    <button
                      onClick={() => setShowDateFilters(false)}
                      className="mt-2 w-full py-1 bg-[#3470b2] text-white text-sm rounded-md hover:bg-[#2c5d9a]"
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
      <div className="flex-1 overflow-hidden">
        {/* --- DESKTOP TABLE VIEW --- */}
        <div
          className={`hidden md:flex flex-col h-full rounded-lg shadow-sm ${
            darkMode ? "bg-gray-700" : "bg-white"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="sticky top-0 z-10">
              <table className="min-w-full">
<thead className={darkMode ? "bg-[#f88600]" : "bg-[#3470b2]"}>                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs  font-medium text-white uppercase tracking-wider">
                      Created On
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Document ID
                    </th>
                    <th className="px-8 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="flex-1 overflow-y-auto" ref={tableBodyRef}>
              <table className="min-w-full">
                <tbody
                  className={`${
                    darkMode
                      ? "bg-gray-700 divide-gray-600"
                      : "bg-white divide-y divide-gray-200"
                  }`}
                >
                  {paginatedDocuments.length > 0 ? (
                    paginatedDocuments.map((doc, index) => (
                      <tr
                        key={doc.id}
                        className={`transition-colors cursor-pointer ${
                          darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                        }`}
                        title="Click to continue"
                        onClick={() =>
                          navigate(`/Maindashboard/requestfile/${doc.id}`)
                        }
                      >
                        <td
                          className={`px-5 py-3 whitespace-nowrap text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {startIndex + index + 1}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap text-left text-sm font-medium ${
                            darkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {doc.name}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap text-sm md:text-right lg:text-center ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {doc.createdOn}
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap text-sm text-center font-mono ${
                            darkMode ? "text-gray-200" : "text-gray-500"
                          }`}
                          title={doc.id}
                        >
                          {truncateId(doc.id, 10, 10)}
                        </td>
                        <td
                          className="px-6 py-3 whitespace-nowrap text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            className="relative flex justify-center"
                            ref={(el) =>
                              (actionDropdownRefs.current[doc.id] = el)
                            }
                          >
                            <button
                              onClick={(e) => toggleActionDropdown(doc.id, e)}
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
                                className={`absolute right-0 w-48 rounded-md shadow-lg z-30 ${
                                  dropdownPosition === "up"
                                    ? "bottom-full mb-2"
                                    : "top-full mt-2"
                                } ${
                                  darkMode
                                    ? "bg-gray-800 border border-gray-600"
                                    : "bg-white border border-gray-200"
                                }`}
                              >
                                <div className="py-1">
                                  <button
                                    onMouseDown={() =>
                                      handleAction("preview", doc.id)
                                    }
                                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                      darkMode
                                        ? "text-gray-300 hover:bg-gray-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <RiEyeLine className="mr-2" /> Preview
                                  </button>
                                  <button
                                    onMouseDown={() =>
                                      handleAction("details", doc.id)
                                    }
                                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                      darkMode
                                        ? "text-gray-300 hover:bg-gray-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <RiInformationLine className="mr-2" />{" "}
                                    Details
                                  </button>
                                  <button
                                    onMouseDown={() =>
                                      handleAction("download", doc.id)
                                    }
                                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                      darkMode
                                        ? "text-gray-300 hover:bg-gray-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <RiDownloadLine className="mr-2" /> Download
                                  </button>
                                  <button
                                    onMouseDown={() =>
                                      handleAction("delete", doc.id)
                                    }
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
                        colSpan="5"
                        className={`px-4 py-6 text-center text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No documents found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div
              className={`sticky bottom-0 border-t ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 rounded-b-lg">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-orange-400" : "text-gray-700"
                      }`}
                    >
                      Items per page:
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className={`text-sm rounded px-2 py-1 ${
                        darkMode
                          ? "bg-gray-600 border-gray-500 text-gray-200"
                          : "border border-gray-300"
                      }`}
                    >
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded border ${
                        currentPage === 1
                          ? darkMode
                            ? "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : darkMode
                            ? "bg-gray-800 text-gray-300 hover:bg-[#fe4500] border-gray-600"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-orange-400" : "text-gray-700"
                      }`}
                    >
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`px-3 py-1 rounded border ${
                        currentPage === totalPages || totalPages === 0
                          ? darkMode
                            ? "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : darkMode
                            ? "bg-gray-800 text-gray-300 hover:bg-[#fe4500] border-gray-600"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MOBILE CARD VIEW --- */}
        <div className="md:hidden space-y-4 h-full overflow-y-auto pb-4">
          {paginatedDocuments.length > 0 ? (
            paginatedDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-lg shadow-sm flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border border-gray-200"
                }`}
                title="Click to continue"
                onClick={() => navigate(`/Maindashboard/requestfile/${doc.id}`)}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start w-full">
                  <h3
                    className={`font-bold text-base pr-2 break-words ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {doc.name}
                  </h3>
                  <div
                    className="relative flex-shrink-0"
                    ref={(el) => (actionDropdownRefs.current[doc.id] = el)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => toggleActionDropdown(doc.id, e)}
                      className={`p-1 ${
                        darkMode
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-[#3470b2] hover:text-[#2c5d9a]"
                      }`}
                    >
                      <RiMoreFill className="w-5 h-5" />
                    </button>
                    {activeDropdown === doc.id && (
                      <div
                        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                          darkMode
                            ? "bg-gray-800 border border-gray-600"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <div className="py-1">
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
                </div>

                {/* Card Body */}
                <div
                  className={`space-y-2 text-sm border-t pt-3 ${
                    darkMode ? "border-gray-600" : "border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-semibold ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Created On:
                    </span>
                    <span
                      className={`text-right ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {doc.createdOn}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-semibold ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Document ID:
                    </span>
                    <span
                      className={`font-mono text-right ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                      title={doc.id}
                    >
                      {truncateId(doc.id, 6, 6)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`p-4 rounded-lg shadow-sm text-center text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-400"
                  : "bg-white border border-gray-200 text-gray-500"
              }`}
            >
              No documents found matching your criteria
            </div>
          )}
        </div>
      </div>
      {/* Mobile Pagination Controls */}
      {paginatedDocuments.length > 0 && (
        <div
          className={`md:hidden mt-4 p-4 rounded-lg shadow-sm ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Items:
              </span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className={`text-sm rounded px-2 py-1 ${
                  darkMode
                    ? "bg-gray-600 border-gray-500 text-gray-200"
                    : "border border-gray-300"
                }`}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? darkMode
                      ? "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-900 border-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Prev
              </button>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages || totalPages === 0
                    ? darkMode
                      ? "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-900 border-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PREVIEW MODAL --- */}
      {previewDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div
            className={`rounded-lg ml-0 md:ml-[200px] w-[500px] md:h-[600px] xs:h-[520px] flex flex-col ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex justify-between items-center p-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-bold truncate ${
                  darkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                {previewDocument.name}
              </h3>
              <button
                onClick={closePreview}
                className={`p-1 rounded-full transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <RiCloseLine size={24} />
              </button>
            </div>
            <div
              className={`flex-grow p-1 ${
                darkMode ? "bg-gray-900" : "bg-gray-200"
              }`}
            >
              <iframe
                src={previewDocument.url}
                title={previewDocument.name}
                className="w-full h-full border-0"
                allowFullScreen
                onError={() => {
                  toast.error(
                    "Failed to load document preview. This can happen due to security policies on the document's server. Please try downloading the file instead."
                  );
                  closePreview();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Draftdocument;
