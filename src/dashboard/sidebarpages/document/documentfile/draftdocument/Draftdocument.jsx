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
} from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// --- (Your allDocuments array and helper functions remain the same) ---
const allDocuments = [
  {
    id: "158458h4ty54355h4t3847a",
    name: "Annual Report",
    createdOn: "24/06/2025, 18:29:33",
  },
  {
    id: "158458h4ty54355h4t3847b", // Made ID unique for demo
    name: "Project Proposal",
    createdOn: "24/06/2025, 15:36:45",
  },
  {
    id: "158458h4ty54355h4t3847c", // Made ID unique for demo
    name: "frontend.pdf",
    createdOn: "24/06/2025, 15:29:55",
  },
  {
    id: "158458h4ty54355h4t3847d", // Made ID unique for demo
    name: "User Manual",
    createdOn: "24/06/2025, 14:57:34",
  },
  {
    id: "158458h4ty54355h4t3847e", // Made ID unique for demo
    name: "Meeting Minutes",
    createdOn: "24/06/2025, 14:33:26",
    status: "Completed",
  },
  {
    id: "158458h4ty54355h4t3847f",
    name: "Budget Plan",
    createdOn: "24/06/2025, 10:34:28",
  },
  {
    id: "158458h4ty54355h4t3847g",
    name: "Marketing Strategy",
    createdOn: "23/06/2025, 14:55:34",
  },
  {
    id: "158458h4ty54355h4t3847h",
    name: "frontend.pdf",
    createdOn: "23/06/2025, 14:39:44",
  },
  {
    id: "158458h4ty54355h4t3847i",
    name: "Contract Draft",
    createdOn: "23/06/2025, 14:16:25",
  },
  {
    id: "158458h4ty54355h4t3847j",
    name: "Survey Results",
    createdOn: "23/06/2025, 13:54:07",
  },
  {
    id: "158458h4ty54355h4t3847k",
    name: "Performance Review",
    createdOn: "23/06/2025, 13:47:17",
  },
  {
    id: "158458h4ty54355h4t3847l",
    name: "Training Material",
    createdOn: "23/06/2025, 13:15:53",
  },
];

const Draftdocument = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState("down");
  const tableBodyRef = useRef(null);
  const dateFilterRef = useRef(null);
  const actionDropdownRefs = useRef({});

  // Close dropdowns when clicking outside
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
    const [datePart, timePart] = dateStr.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes, seconds] = timePart.split(":");
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const filteredDocuments = allDocuments.filter((doc) => {
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

  // Replace your existing toggleActionDropdown function with this one

  const toggleActionDropdown = (docId, event) => {
    // If we are closing the dropdown, just reset and return
    if (activeDropdown === docId) {
      setActiveDropdown(null);
      return;
    }

    // Define the approximate height of the dropdown menu
    const DROPDOWN_HEIGHT = 180; // Adjust if you change the menu items

    // Get the scroll container and the clicked button elements
    const container = tableBodyRef.current;
    const button = event.currentTarget;

    if (container && button) {
      // Get the positions relative to the viewport
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      // Calculate space below the button *within the scrollable container*
      const spaceBelow = containerRect.bottom - buttonRect.bottom;

      // Decide the direction
      if (spaceBelow < DROPDOWN_HEIGHT) {
        setDropdownPosition("up"); // Not enough space below, open upwards
      } else {
        setDropdownPosition("down"); // Enough space, open downwards
      }
    }

    // Set the active dropdown
    setActiveDropdown(docId);
  };

  const handleAction = (action, docId) => {
    console.log(`${action} document with id ${docId}`);
    setActiveDropdown(null);
    // Here you would implement the actual action logic
  };

  // Helper function to truncate long IDs for better mobile display
  const truncateId = (id, startLength = 6, endLength = 6) => {
    const strId = String(id);
    if (strId.length <= startLength + endLength + 3) {
      // +3 for "..."
      return strId;
    }
    return `${strId.substring(0, startLength)}...${strId.substring(strId.length - endLength)}`;
  };

  return (
    <div className="p-2 sm:p-4 bg-gray-50 h-[100%] flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-shrink-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3470b2]">
            Draft Documents
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
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <RiCalendarLine className="text-[#3470b2]" />
                <span className="text-sm font-medium text-gray-700">
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
              <RiFilterLine className="text-gray-500 text-xs" />
            </button>

            {showDateFilters && (
              <div className="absolute right-0 z-20 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
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
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        From
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        maxDate={endDate || new Date()}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        To
                      </label>
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
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
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

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <div className="hidden md:flex flex-col h-full bg-white rounded-lg shadow-sm">
          {/* Table container with fixed header and footer */}
          <div className="flex flex-col h-full">
            {/* Table header - sticky at the top */}
            <div className="sticky top-0 z-10">
              <table className="min-w-full">
                <thead className="bg-[#3470b2]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="px-1 py-3 text-left text-xs  font-medium text-white uppercase tracking-wider">
                      Created On
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Document ID
                    </th>
                    <th className="px-8 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Scrollable table body */}
            <div className="flex-1 overflow-y-auto" ref={tableBodyRef}>
              {" "}
              {/* <<< ATTACH REF HERE */}
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedDocuments.length > 0 ? (
                    paginatedDocuments.map((doc, index) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                          {doc.name}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                          {doc.createdOn}
                        </td>
                        <td
                          className="px-6 py-3 whitespace-nowrap text-sm  text-gray-500 font-mono"
                          title={doc.id}
                        >
                          {truncateId(doc.id, 10, 10)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div
                            className="relative flex justify-center"
                            ref={(el) =>
                              (actionDropdownRefs.current[doc.id] = el)
                            }
                          >
                            <button
                              // Pass the event to our updated handler
                              onClick={(e) => toggleActionDropdown(doc.id, e)}
                              className="flex items-center gap-1 text-[#3470b2] hover:text-[#2c5d9a] p-1 rounded hover:bg-gray-100"
                              title="Actions"
                            >
                              <RiMoreFill className="w-5 h-5" />
                            </button>

                            {activeDropdown === doc.id && (
                              // Conditionally apply classes based on the dropdownPosition state
                              <div
                                className={`absolute right-0 w-48 bg-white rounded-md shadow-lg z-30 border border-gray-200 ${
                                  dropdownPosition === "up"
                                    ? "bottom-full mb-2" // Opens Up
                                    : "top-full mt-2" // Opens Down
                                }`}
                              >
                                <div className="py-1">
                                  {/* ... your button actions remain the same ... */}
                                  <button
                                    onClick={() =>
                                      handleAction("details", doc.id)
                                    }
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <RiInformationLine className="mr-2" />{" "}
                                    Details
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction("preview", doc.id)
                                    }
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <RiEyeLine className="mr-2" /> Preview
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction("share", doc.id)
                                    }
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <RiShareLine className="mr-2" /> Share
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction("download", doc.id)
                                    }
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <RiDownloadLine className="mr-2" /> Download
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction("delete", doc.id)
                                    }
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
                        colSpan="5"
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No documents found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer - sticky at the bottom */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200">
              {/* --- FIX #3: Changed `sm:flex-row` to `md:flex-row` for consistency --- */}
              <div className="px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 rounded-b-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="text-xs border border-gray-300 rounded-md px-2 py-1"
                  >
                    {[10, 20, 30, 50, 80, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-500">entries</span>
                </div>

                <div className="text-xs text-gray-500">
                  Showing{" "}
                  <span className="font-medium">
                    {filteredDocuments.length > 0 ? startIndex + 1 : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredDocuments.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredDocuments.length}
                  </span>{" "}
                  entries
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-xs border border-gray-300 rounded-md font-medium ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 text-xs border border-gray-300 rounded-md font-medium ${currentPage === totalPages || totalPages === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card Layout (visible on screens smaller than 768px) */}
        <div className="md:hidden space-y-3 h-full overflow-y-auto pb-4">
          {paginatedDocuments.length > 0 ? (
            paginatedDocuments.map((doc, index) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-3"
              >
                {/* Top row: Main Title and Actions Menu */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <p className="text-xs font-semibold text-gray-400">
                      #{startIndex + index + 1}
                    </p>
                    <h3 className="font-semibold text-gray-800 break-words mt-1">
                      {doc.name}
                    </h3>
                  </div>
                  <div
                    className="relative flex-shrink-0"
                    ref={(el) => (actionDropdownRefs.current[doc.id] = el)}
                  >
                    <button
                      onClick={() => toggleActionDropdown(doc.id)}
                      className="text-[#3470b2] hover:text-[#2c5d9a] p-1 -mr-1"
                      title="Actions"
                    >
                      <RiMoreFill className="w-5 h-5" />
                    </button>
                    {activeDropdown === doc.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                        <div className="py-1">
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

                {/* Details Section */}
                <div className="text-xs text-gray-600 border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">
                      Created On:
                    </span>
                    <span className="text-right">{doc.createdOn}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium text-gray-500 flex-shrink-0">
                      Document ID:
                    </span>
                    <span
                      className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 text-right truncate"
                      title={String(doc.id)}
                    >
                      {truncateId(doc.id)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-sm text-gray-500">
              No documents found matching your criteria
            </div>
          )}

          {/* Mobile Pagination */}
          {paginatedDocuments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="text-xs border border-gray-300 rounded-md px-2 py-1"
                >
                  {[5, 10, 20].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">entries</span>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Showing{" "}
                <span className="font-medium">
                  {filteredDocuments.length > 0 ? startIndex + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, filteredDocuments.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredDocuments.length}</span>{" "}
                entries
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-xs border border-gray-300 rounded-md font-medium ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 text-xs border border-gray-300 rounded-md font-medium ${currentPage === totalPages || totalPages === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Draftdocument;
