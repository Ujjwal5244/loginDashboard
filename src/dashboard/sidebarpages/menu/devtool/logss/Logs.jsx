import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Logs.css';
import { baseUrl, decryptText } from "../../../../../encryptDecrypt";

const Logs = ({ darkMode }) => {
  const token = localStorage.getItem("userToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [logList, setLogList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch logs from API
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/log/logs`, {
        headers: { authorization: token },
      });
  
      const decrypted = await decryptText(res.data.body);
      const data = JSON.parse(decrypted);
  
      const logs = data.logs || data.decrypted?.logs;
  
      if (!logs || !Array.isArray(logs)) {
        setError("No logs found or invalid log format.");
        setLogList([]);
        return;
      }
  
      const transformedLogs = logs.map((log, index) => ({
        id: index + 1,
        event: log.event,
        latitude: log.location.latitude === "Unknown" ? "N/A" : log.location.latitude,
        longitude: log.location.longitude === "Unknown" ? "N/A" : log.location.longitude,
        city: log.location.city === "Unknown" ? "N/A" : log.location.city,
        ip: log.ip === "Unknown" ? "N/A" : log.ip,
        browser: log.browser === "Unknown" ? "N/A" : log.browser,
        machine: log.os === "Unknown" ? "N/A" : log.os,
        timestamp: log.timestamp
      }));
  
      const sortedLogs = transformedLogs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
  
      setLogList(sortedLogs);
    } catch (err) {
      console.error("Fetch logs error:", err);
      setError("Failed to fetch logs");
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Filter logs based on search term
  const filteredLogs = logList.filter(
    (log) =>
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.city && log.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.ip && log.ip.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  if (loading) {
    return <div className={`logs-ip-management-container ${darkMode ? "dark" : ""}`}>Loading logs...</div>;
  }

  if (error) {
    return <div className={`logs-ip-management-container ${darkMode ? "dark" : ""}`}>{error}</div>;
  }

  return (
    <div className={`logs-ip-management-container ${darkMode ? "dark" : ""}`}>
      <div className="logs-top-bar">
        {/* <div>
          <h1 className="logs-title">Logs</h1>
          <p className="logs-subtitle">Monitor and analyze all logs activities</p>
        </div> */}
        <div className="logs-search-container">
          <input
            type="text"
            placeholder="Search logs by event, city, or IP..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>

      {/* Items per page selector */}
      <div className={`logs-pagination-controls ${darkMode ? "dark" : ""}`}>
        <div className="items-per-page-selector">
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className={darkMode ? "dark" : ""}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="logs-table-container">
        <table className="logs-ip-table">
          <thead>
            <tr>
              <th>SR.NO.</th>
              <th>EVENT</th>
              <th>LATITUDE</th>
              <th>LONGITUDE</th>
              <th>CITY</th>
              <th>IP</th>
              <th>BROWSER</th>
              <th>MACHINE</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{item.event}</td>
                <td>{item.latitude}</td>
                <td>{item.longitude}</td>
                <td>{item.city}</td>
                <td>{item.ip}</td>
                <td>{item.browser}</td>
                <td>{item.machine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View Cards */}
      <div className="logs-mobile-cards-container">
        {currentItems.map((item) => (
          <div className="logs-ip-card" key={item.id}>
            <div className="logs-ip-card-header">
              <h3 className="logs-ip-card-title">{item.event}</h3>
            </div>
            <div className="logs-ip-card-body">
              <div className="logs-ip-card-row">
                <span className="logs-ip-card-label">Latitude:</span>
                <span className="logs-ip-card-value">{item.latitude}</span>
              </div>
              <div className="logs-ip-card-row">
                <span className="logs-ip-card-label">Longitude:</span>
                <span className="logs-ip-card-value">{item.longitude}</span>
              </div>
              <div className="logs-ip-card-row">
                <span className="logs-ip-card-label">City:</span>
                <span className="logs-ip-card-value">{item.city}</span>
              </div>
              <div className="logs-ip-card-row">
                <span className="logs-ip-card-label">IP:</span>
                <span className="logs-ip-card-value">{item.ip}</span>
              </div>
              <div className="logs-ip-card-row">
                <span className="logs-ip-card-label">Browser:</span>
                <span className="logs-ip-card-value">{item.browser}</span>
              </div>
              <div className="logs-ip-card-row">
                <span className="logs-ip-card-label">Machine:</span>
                <span className="logs-ip-card-value">{item.machine}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="logs-footer-wrapper">
{filteredLogs.length > itemsPerPage && (
  <div className={`logs-pagination-wrapper ${darkMode ? "logs-dark" : ""}`}>
    <button
      onClick={() => paginate(1)}
      disabled={currentPage === 1}
      className={`logs-button logs-first ${darkMode ? "logs-dark" : ""}`}
    >
      First
    </button>
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className={`logs-button logs-prev ${darkMode ? "logs-dark" : ""}`}
    >
      Previous
    </button>

    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      let pageNum;
      if (totalPages <= 5) {
        pageNum = i + 1;
      } else if (currentPage <= 3) {
        pageNum = i + 1;
      } else if (currentPage >= totalPages - 2) {
        pageNum = totalPages - 4 + i;
      } else {
        pageNum = currentPage - 2 + i;
      }

      return (
        <button
          key={pageNum}
          onClick={() => paginate(pageNum)}
          className={`logs-button logs-page ${currentPage === pageNum ? "logs-active" : ""} ${darkMode ? "logs-dark" : ""}`}
        >
          {pageNum}
        </button>
      );
    })}

    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`logs-button logs-next ${darkMode ? "logs-dark" : ""}`}
    >
      Next
    </button>
    <button
      onClick={() => paginate(totalPages)}
      disabled={currentPage === totalPages}
      className={`logs-button logs-last ${darkMode ? "logs-dark" : ""}`}
    >
      Last
    </button>
  </div>
)}

{/* Page info */}
<div className={`logs-page-info ${darkMode ? "logs-dark" : ""}`}>
  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} entries
</div>
  </div>
  </div>
  );
};

export default Logs;