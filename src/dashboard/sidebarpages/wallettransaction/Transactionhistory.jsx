import React, { useState, useEffect, useCallback } from "react";
import {
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl, decryptText, encryptText } from "../../../encryptDecrypt";
import "./Transactionhistory.css";

const Transactionhistory = ({ darkMode }) => {
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/wallet/reports`, {
        headers: { authorization: token },
      });

      const dec = await decryptText(res.data.body);
      const transactionsData = JSON.parse(dec);

      const formattedTransactions = transactionsData.map((tx) => ({
        _id: tx._id || tx.id,
        date: new Date(tx.createdAt || tx.date).toLocaleString(),
        serviceId:
          tx.serviceId && tx.serviceId.trim() !== "" ? tx.serviceId : "N/A",
        referenceNo:
          tx.referenceNo && tx.referenceNo.trim() !== ""
            ? tx.referenceNo
            : "N/A",
        remark: tx.remark && tx.remark.trim() !== "" ? tx.remark : "N/A",
        amount: parseFloat(tx.amount || 0) * (tx.type === "debit" ? -1 : 1),
        openingBalance: parseFloat(tx.openingBalance || 0),
        closingBalance: parseFloat(tx.closingBalance || 0),
        status: tx.status === "1" ? "Completed" : "Pending",
      }));

      console.log(formattedTransactions);

      setTransactions(formattedTransactions);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter transactions based on search, date range, and type
  const filteredTransactions = transactions.filter((tx) => {
    const matchSearch =
      tx.serviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.remark.toLowerCase().includes(searchQuery.toLowerCase());

    const txDate = new Date(tx.date);
    const matchDate =
      (!startDate || txDate >= new Date(startDate)) &&
      (!endDate || txDate <= new Date(endDate));

    const matchFilter =
      activeFilter === "all" ||
      (activeFilter === "credit" && tx.amount > 0) ||
      (activeFilter === "debit" && tx.amount < 0);

    return matchSearch && matchDate && matchFilter;
  });

  // Pagination logic
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleCalendarClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateApply = () => {
    setShowDatePicker(false);
    setCurrentPage(1);
  };

  const handleDateClear = () => {
    setStartDate("");
    setEndDate("");
    setShowDatePicker(false);
    setCurrentPage(1);
  };

  const exportToCSV = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/transactions/export`, {
        headers: { authorization: token },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Export completed successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error exporting transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  // Pagination controls
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Mobile Transaction Card Component
  const MobileTransactionCard = ({ tx, index }) => (
    <div className={`tm-mobile-card ${darkMode ? "dark-mode" : ""}`}>
      <div className="tm-mobile-card-header">
        <span className="tm-mobile-card-srno">
          {indexOfFirstItem + index + 1}
        </span>
        <span className={`tm-status ${tx.status.toLowerCase()}`}>
          {tx.status}
        </span>
      </div>
      <div className="tm-mobile-card-body">
        <div className="tm-mobile-card-row">
          <span className="text-gray-500">Date & Time:</span>
          <span>{tx.date}</span>
        </div>
        <div className="tm-mobile-card-row flex flex-wrap">
          <span className="font-medium flex-shrink-0 text-gray-500">
            Service ID:
          </span>
          <span className="font-medium break-all">{tx.serviceId}</span>
        </div>

        <div className="tm-mobile-card-row">
          <span className="font-medium flex-shrink-0 text-gray-500">
            Reference No:
          </span>
          <span>{tx.referenceNo}</span>
        </div>
        <div className="tm-mobile-card-row">
          <span className="font-medium flex-shrink-0 text-gray-500">
            Remark:
          </span>
          <span>{tx.remark}</span>
        </div>
        <div className="tm-mobile-card-row">
          <span className="font-medium flex-shrink-0 text-gray-500">
            Amount:
          </span>
          <span style={{ color: tx.amount >= 0 ? "#2e7d32" : "#c62828" }}>
            {tx.amount >= 0
              ? `+₹${tx.amount.toFixed(2)}`
              : `-₹${Math.abs(tx.amount).toFixed(2)}`}
          </span>
        </div>
        <div className="tm-mobile-card-row">
          <span className="font-medium flex-shrink-0 text-gray-500">
            Balance:
          </span>
          <div className="tm-mobile-balance">
            <div>Open: ₹{tx.openingBalance.toFixed(2)}</div>
            <div>Close: ₹{tx.closingBalance.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`transaction-management ${darkMode ? "dark-mode" : ""}`}>
      <div className="tm-header">
        <div>
          <h1 className="tm-title">Transaction History</h1>
          <p className="tm-subtitle">
            View and analyze all transaction records
          </p>
        </div>
        <button
          className="tm-export-btn"
          onClick={exportToCSV}
          disabled={loading}
        >
          <FaDownload /> {loading ? "Exporting..." : "Export"}
        </button>
      </div>

      {/* Filters Section */}
      <div className="tm-filters-container">
        <div className="tm-search-container">
          <FaSearch className="tm-search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="tm-search"
            disabled={loading}
          />
        </div>

        <div className="tm-filter-buttons">
          <button
            className={`tm-filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => {
              setActiveFilter("all");
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            All Transactions
          </button>
          <button
            className={`tm-filter-btn ${activeFilter === "credit" ? "active" : ""}`}
            onClick={() => {
              setActiveFilter("credit");
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            Credits
          </button>
          <button
            className={`tm-filter-btn ${activeFilter === "debit" ? "active" : ""}`}
            onClick={() => {
              setActiveFilter("debit");
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            Debits
          </button>
        </div>

        <div className="tm-date-filter">
          <button
            className="tm-calendar-btn"
            onClick={handleCalendarClick}
            disabled={loading}
          >
            <FaCalendarAlt /> Date Filter
          </button>

          {showDatePicker && (
            <div className="tm-date-picker">
              <div className="tm-date-inputs">
                <div>
                  <label>From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label>To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="tm-date-actions">
                <button
                  className="tm-date-apply"
                  onClick={handleDateApply}
                  disabled={loading}
                >
                  Apply
                </button>
                <button
                  className="tm-date-clear"
                  onClick={handleDateClear}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="loading-indicator">Loading transactions...</div>
      ) : (
        <>
          <div className="tm-cards">
            <div className="tm-card">
              <div
                className="tm-card-icon"
                style={{ backgroundColor: "#e3f2fd" }}
              >
                <FaFilter />
              </div>
              <div>
                <p className={`text-gray-600 ${darkMode ? "text-white" : ""}`}>
                  Total Transactions
                </p>
                <h2 className={`text-gray-600 ${darkMode ? "text-white" : ""}`}>
                  {filteredTransactions.length}
                </h2>
              </div>
            </div>
            <div className="tm-card">
              <div
                className={`tm-card-icon ${darkMode ? "dark-mode" : ""}`}
                style={{
                  backgroundColor: darkMode ? "#1a2e22" : "#e8f5e9",
                  color: darkMode ? "#34d399" : "inherit",
                }}
              >
                ₹
              </div>
              <div>
                <p className={`text-gray-600 ${darkMode ? "text-white" : ""}`}>
                  Total Amount
                </p>
                <h2 className={`text-gray-600 ${darkMode ? "text-white" : ""}`}>
                  ₹
                  {filteredTransactions
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </h2>
              </div>
            </div>
            <div className="tm-card">
              <div
                className={`tm-card-icon ${darkMode ? "dark-mode" : ""}`}
                style={{
                  backgroundColor: darkMode ? "#1a2e22" : "#e8f5e9",
                  color: darkMode ? "#34d399" : "inherit",
                }}
              >
                ↑
              </div>
              <div>
                <p className={`text-gray-600 ${darkMode ? "text-white" : ""}`}>
                  Total Credited
                </p>
                <h2 style={{ color: "#2e7d32" }}>
                  ₹{" "}
                  {filteredTransactions
                    .filter((t) => t.amount > 0)
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </h2>
              </div>
            </div>
            <div className="tm-card">
              <div
                className="tm-card-icon"
                style={{ backgroundColor: "#ffebee" }}
              >
                ↓
              </div>
              <div>
                <p className={`text-gray-600 ${darkMode ? "text-white" : ""}`}>
                  Total Debited
                </p>
                <h2 style={{ color: "#c62828" }}>
                  ₹{" "}
                  {filteredTransactions
                    .filter((t) => t.amount < 0)
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                    .toFixed(2)}
                </h2>
              </div>
            </div>
          </div>

          {/* Transactions Display */}
          <div className="tm-table-container">
            <div className="tm-table-header">
              <h3 className="tm-table-header-h3">Recent Transactions</h3>
              <div className="tm-table-summary">
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, totalItems)} of {totalItems}{" "}
                transactions
                <div className="tm-items-per-page">
                  <label style={{ color: darkMode ? "#ff9800" : "inherit" }}>
                    Items per page:
                  </label>
                  <div className="tm-select-wrapper">
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      disabled={loading}
                      style={{
                        backgroundColor: darkMode ? "#1f2937" : "white",
                        color: darkMode ? "#e5e7eb" : "inherit",
                        borderColor: darkMode ? "#374151" : "#d1d5db",
                      }}
                      className={darkMode ? "dark-mode-select" : ""}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {isMobile ? (
              // Mobile View - Cards
              <div className="tm-mobile-transactions">
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((tx, index) => (
                    <MobileTransactionCard key={tx._id} tx={tx} index={index} />
                  ))
                ) : (
                  <div className="no-data">
                    {transactions.length === 0
                      ? "No transactions available"
                      : "No transactions found matching your criteria"}
                  </div>
                )}
              </div>
            ) : (
              // Desktop View - Table
              <div className="tm-table-wrapper">
                <div className="tm-table-scroll-container">
                  <table className="tm-table">
                    <thead>
                      <tr>
                        <th>SR.NO.</th>
                        <th>DATE & TIME</th>
                        <th>SERVICE ID</th>
                        <th>REFERENCE NO</th>
                        <th>REMARK</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th>BALANCE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTransactions.length > 0 ? (
                        currentTransactions.map((tx, index) => (
                          <tr key={tx._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{tx.date}</td>
                            <td>{tx.serviceId}</td>
                            <td>{tx.referenceNo}</td>
                            <td>{tx.remark}</td>
                            <td
                              style={{
                                color: tx.amount >= 0 ? "#2e7d32" : "#c62828",
                                fontWeight: 500,
                              }}
                            >
                              {tx.amount >= 0
                                ? `+₹${tx.amount.toFixed(2)}`
                                : `-₹${Math.abs(tx.amount).toFixed(2)}`}
                            </td>
                            <td>
                              <span
                                className={`tm-status ${tx.status.toLowerCase()}`}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td>
                              <div className="tm-balance">
                                <div>Open: ₹{tx.openingBalance.toFixed(2)}</div>
                                <div>
                                  Close: ₹{tx.closingBalance.toFixed(2)}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="no-data">
                            {transactions.length === 0
                              ? "No transactions available"
                              : "No transactions found matching your criteria"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {totalPages > 1 && (
  <div
    className={`flex items-center justify-between mt-4 px-4 py-3 border-t sm:px-6 rounded-b-lg ${
      darkMode
        ? 'dark:bg-gray-800 dark:border-gray-700'
        : 'bg-white border-gray-200'
    }`}
  >
    {/* Mobile view */}
    <div className="flex-1 flex justify-between sm:hidden">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
          currentPage === 1 || loading
            ? `${darkMode ? 'dark:bg-gray-500 dark:border-gray-700 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`
            : `${darkMode ? 'bg-[#3470b2] text-gray-100 hover:bg-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
        } border-gray-300`}
      >
        Prev
      </button>
      <div className={`flex items-center px-4 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
        Page {currentPage} of {totalPages}
      </div>
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
          currentPage === totalPages || loading
            ? `${darkMode ? 'dark:bg-gray-500 dark:border-gray-700 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`
            : `${darkMode ? 'dark:bg-gray-500 dark:border-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
        } border-gray-300`}
      >
        Next
      </button>
    </div>

    {/* Desktop view */}
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
          <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </p>
      </div>
      <div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {/* First */}
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1 || loading}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
              currentPage === 1 || loading
                ? `${darkMode ? 'bg-[#3470b2] text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`
                : `${darkMode ? 'bg-[#3470b2] text-gray-100 hover:bg-blue-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`
            } border-gray-300`}
          >
            <span className="sr-only">First</span>
            <FaAngleDoubleLeft className="h-4 w-4" />
          </button>

          {/* Previous */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
              currentPage === 1 || loading
                ? `${darkMode ? 'bg-[#3470b2] text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`
                : `${darkMode ? 'bg-[#3470b2] text-gray-100 hover:bg-blue-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`
            } border-gray-300`}
          >
            <span className="sr-only">Previous</span>
            <FaAngleLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          {(() => {
            const pages = [];
            const maxVisiblePages = 5;
            let startPage, endPage;

            if (totalPages <= maxVisiblePages) {
              startPage = 1;
              endPage = totalPages;
            } else {
              const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
              const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

              if (currentPage <= maxPagesBeforeCurrent) {
                startPage = 1;
                endPage = maxVisiblePages;
              } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
              } else {
                startPage = currentPage - maxPagesBeforeCurrent;
                endPage = currentPage + maxPagesAfterCurrent;
              }
            }

            if (startPage > 1) {
              pages.push(
                <button
                  key={1}
                  onClick={() => goToPage(1)}
                  disabled={loading}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    1 === currentPage
                      ? `${darkMode ? 'z-10 bg-blue-900 text-blue-100 border-blue-700' : 'z-10 bg-blue-50 border-blue-500 text-blue-600'}`
                      : `${darkMode ? 'bg-[#3470b2] text-gray-100 hover:bg-blue-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`
                  } border-gray-300`}
                >
                  1
                </button>
              );
              if (startPage > 2) {
                pages.push(
                  <span
                    key="start-ellipsis"
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      darkMode ? 'bg-[#3470b2] text-gray-100' : 'bg-white text-gray-700'
                    } border-gray-300`}
                  >
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
                  disabled={loading}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    i === currentPage
                      ? `${darkMode ? 'z-10 bg-blue-900 text-blue-100 border-blue-700' : 'z-10 bg-blue-50 border-blue-500 text-blue-600'}`
                      : `${darkMode ? 'bg-[#3470b2] text-gray-100 hover:bg-blue-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`
                  } border-gray-300`}
                >
                  {i}
                </button>
              );
            }

            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pages.push(
                  <span
                    key="end-ellipsis"
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      darkMode ? 'bg-[#3470b2] text-gray-100' : 'bg-white text-gray-700'
                    } border-gray-300`}
                  >
                    ...
                  </span>
                );
              }
              pages.push(
                <button
                  key={totalPages}
                  onClick={() => goToPage(totalPages)}
                  disabled={loading}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    totalPages === currentPage
                      ? `${darkMode ? 'z-10 bg-blue-900 text-blue-100 border-blue-700' : 'z-10 bg-blue-50 border-blue-500 text-blue-600'}`
                      : `${darkMode ? 'bg-[#3470b2] text-gray-100 hover:bg-blue-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`
                  } border-gray-300`}
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
              currentPage === totalPages || loading
                ? `${darkMode ? 'bg-[#3470b2] text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`
                : `${darkMode ? 'bg-[#3470b2] text-gray-100 hover:bg-blue-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`
            } border-gray-300`}
          >
            <span className="sr-only">Next</span>
            <FaAngleRight className="h-4 w-4" />
          </button>

          {/* Last */}
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages || loading}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
              currentPage === totalPages || loading
                ? `${darkMode ? 'bg-[#3470b2] text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`
                : `${darkMode ? 'bg-[#3470b2] text-gray-100 hover:bg-blue-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`
            } border-gray-300`}
          >
            <span className="sr-only">Last</span>
            <FaAngleDoubleRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </div>
  </div>
)}
      </div>
        </>
      )}
    </div>
  );
};

export default Transactionhistory;
