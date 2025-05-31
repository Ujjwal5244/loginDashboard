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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    setCurrentPage(1); // Reset to first page when date filter changes
  };

  const handleDateClear = () => {
    setStartDate("");
    setEndDate("");
    setShowDatePicker(false);
    setCurrentPage(1); // Reset to first page when date filter is cleared
  };

  const exportToCSV = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/transactions/export`, {
        headers: { authorization: token },
        responseType: "blob", // Important for file downloads
      });

      // Create a download link and trigger it
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
    setCurrentPage(1); // Reset to first page when items per page changes
  };

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
              setCurrentPage(1); // Reset to first page when search changes
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
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            disabled={loading}
          >
            All Transactions
          </button>
          <button
            className={`tm-filter-btn ${activeFilter === "credit" ? "active" : ""}`}
            onClick={() => {
              setActiveFilter("credit");
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            disabled={loading}
          >
            Credits
          </button>
          <button
            className={`tm-filter-btn ${activeFilter === "debit" ? "active" : ""}`}
            onClick={() => {
              setActiveFilter("debit");
              setCurrentPage(1); // Reset to first page when filter changes
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

          {/* Transactions Table */}
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

            <div className="tm-table-wrapper">
              <table className="tm-table">
                <thead >
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
                            <div>Close: ₹{tx.closingBalance.toFixed(2)}</div>
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="tm-pagination">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1 || loading}
                    className="tm-page-btn"
                  >
                    <FaAngleDoubleLeft />
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="tm-page-btn"
                  >
                    <FaAngleLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        disabled={loading}
                        className={`tm-page-btn ${currentPage === page ? "active" : ""}`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="tm-page-btn"
                  >
                    <FaAngleRight />
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    className="tm-page-btn"
                  >
                    <FaAngleDoubleRight />
                  </button>
                </div>
              )}

              {currentTransactions.length > 0 && (
                <div className="tm-transaction-cards">
                  {currentTransactions.map((tx, index) => (
                    <div
                      className="tm-transaction-card"
                      key={`card-${tx._id || tx.id}`}
                    >
                      <div className="tm-transaction-card-row">
                        <span className="tm-transaction-card-label">
                          Date & Time
                        </span>
                        <span className="tm-transaction-card-value">
                          {tx.date}
                        </span>
                      </div>
                      <div className="tm-transaction-card-row">
                        <span className="tm-transaction-card-label">
                          Service ID
                        </span>
                        <span className="tm-transaction-card-value">
                          {tx.serviceId}
                        </span>
                      </div>
                      <div className="tm-transaction-card-row">
                        <span className="tm-transaction-card-label">
                          Reference No
                        </span>
                        <span className="tm-transaction-card-value">
                          {tx.referenceNo}
                        </span>
                      </div>
                      <div className="tm-transaction-card-row">
                        <span className="tm-transaction-card-label">
                          Remark
                        </span>
                        <span className="tm-transaction-card-value">
                          {tx.remark}
                        </span>
                      </div>
                      <div className="tm-transaction-card-row">
                        <span className="tm-transaction-card-label">
                          Amount
                        </span>
                        <span
                          className="tm-transaction-card-value tm-transaction-card-amount"
                          style={{
                            color: tx.amount >= 0 ? "#2e7d32" : "#c62828",
                          }}
                        >
                          {tx.amount >= 0
                            ? `+₹${tx.amount.toFixed(2)}`
                            : `-₹${Math.abs(tx.amount).toFixed(2)}`}
                        </span>
                      </div>
                      <div className="tm-transaction-card-row">
                        <span className="tm-transaction-card-label">
                          Status
                        </span>
                        <span
                          className={`tm-transaction-card-value tm-transaction-card-status ${tx.status.toLowerCase()}`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <div className="tm-transaction-card-row">
                        <span className="tm-transaction-card-label">
                          Opening Balance
                        </span>
                        <span className="tm-transaction-card-value">
                          ₹{tx.openingBalance.toFixed(2)}
                        </span>
                      </div>
                      <div className="tm-transaction-card-row">
                        <span className="tm-transaction-card-label">
                          Closing Balance
                        </span>
                        <span className="tm-transaction-card-value">
                          ₹{tx.closingBalance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Transactionhistory;
