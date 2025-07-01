import React, { useState, useEffect, useRef } from "react";
import {
  RiDownloadLine,
  RiSearchLine,
  RiCalendarLine,
  RiFilterLine,
} from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const allDocuments = [
  {
    id: 1,
    name: "Annual Report",
    createdOn: "24/06/2025, 18:29:33",
    status: "Completed",
  },
  {
    id: 2,
    name: "Project Proposal",
    createdOn: "24/06/2025, 15:36:45",
    status: "Completed",
  },
  {
    id: 3,
    name: "frontend.pdf",
    createdOn: "24/06/2025, 15:29:55",
    status: "Completed",
  },
  {
    id: 4,
    name: "User Manual",
    createdOn: "24/06/2025, 14:57:34",
    status: "Completed",
  },
  {
    id: 5,
    name: "Meeting Minutes",
    createdOn: "24/06/2025, 14:33:26",
    status: "Completed",
  },
  {
    id: 6,
    name: "Budget Plan",
    createdOn: "24/06/2025, 10:34:28",
    status: "Completed",
  },
  {
    id: 7,
    name: "Marketing Strategy",
    createdOn: "23/06/2025, 14:55:34",
    status: "Completed",
  },
  {
    id: 8,
    name: "frontend.pdf",
    createdOn: "23/06/2025, 14:39:44",
    status: "Completed",
  },
  {
    id: 9,
    name: "Contract Draft",
    createdOn: "23/06/2025, 14:16:25",
    status: "Completed",
  },
  {
    id: 10,
    name: "Survey Results",
    createdOn: "23/06/2025, 13:54:07",
    status: "Completed",
  },
  {
    id: 11,
    name: "Performance Review",
    createdOn: "23/06/2025, 13:47:17",
    status: "Completed",
  },
  {
    id: 12,
    name: "Training Material",
    createdOn: "23/06/2025, 13:15:53",
    status: "Completed",
  },
];

const Completedocument = () => {
  // FIX: Use lazy initializer to set initial state to the start and end of today
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDateFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // FIX: Corrected date range logic to be immutable and logically sound
  const handleOptionChange = (option) => {
    setSelectedOption(option);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

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
    // Search is handled reactively in the filteredDocuments calculation
  };

  // Parse date string from document to Date object
  const parseDocumentDate = (dateStr) => {
    const [datePart, timePart] = dateStr.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes, seconds] = timePart.split(":");
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  // Filter documents based on search query and date range
  const filteredDocuments = allDocuments.filter((doc) => {
    // Filter by search query (case insensitive)
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by date range
    let matchesDate = true;
    if (startDate && endDate) {
      const docDate = parseDocumentDate(doc.createdOn);
      matchesDate = docDate >= startDate && docDate <= endDate;
    }

    return matchesSearch && matchesDate;
  });

  // FIX: Moved pagination logic here, after filteredDocuments is calculated
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  return (
    <div className="p-4 bg-gray-50" style={{ height: "calc(100% - 32px)" }}>
      {/* Header Section */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#3470b2]">
            Completed Documents
          </h1>
        </div>
        {/* Filters and Search Section */}
        <div className="p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDateFilters(!showDateFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
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
                <RiFilterLine className="text-gray-500 text-xs" />
              </button>

              {showDateFilters && (
                <div className="absolute z-10 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
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

            {/* Search Box */}
            <form onSubmit={handleSearch} className="flex-1 relative">
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
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
        style={{ height: "calc(100% - 100px)" }}
      >
        <div className="overflow-y-auto flex-grow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3470b2] sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Created On
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDocuments.length > 0 ? (
                paginatedDocuments.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doc.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {doc.createdOn}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="flex items-center gap-1 text-[#3470b2] hover:text-[#2c5d9a] p-1 rounded hover:bg-gray-100"
                        title="Download"
                      >
                        <RiDownloadLine className="w-4 h-4" />
                      </button>
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
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-white sticky bottom-0">
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
            of <span className="font-medium">{filteredDocuments.length}</span>{" "}
            entries
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-xs border border-gray-300 rounded-md font-medium ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              // FIX: Handle disabled state when no results
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 text-xs border border-gray-300 rounded-md font-medium ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completedocument;
