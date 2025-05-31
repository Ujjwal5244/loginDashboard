import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Ipwhitelist.css";
import {
  baseUrl,
  decryptText,
  encryptText,
} from "../../../../../encryptDecrypt";

const Ipwhitelist = ({ darkMode }) => {
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [ipList, setIpList] = useState([]);
  const [newIp, setNewIp] = useState({ ip: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ ip: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch IPs from API
  const fetchIps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/ipwhitelist/allowed-ips`, {
        headers: { authorization: token },
      });
      const dec = await decryptText(res.data.body);
      const data = JSON.parse(dec);

      const ips = data.allowedIPs || [];
      const filteredIps = ips.filter((ip) => ip.status !== "delete");

      const formattedIps = filteredIps.map((ip) => ({
        id: ip.id,
        ip: ip.ip,
        description: ip.description,
        status: ip.status === "active",
      }));

      setIpList(formattedIps);
      console.log(formattedIps);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch IP addresses");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchIps();
  }, [fetchIps]);

  // Add new IP
  const handleAddIp = async () => {
    if (!newIp.ip.trim()) return;

    setLoading(true);
    try {
      const payload = {
        ip: newIp.ip,
        description: newIp.description || "",
      };

      const encryptedPayload = await encryptText(payload);

      console.log("Payload:", payload);
      console.log("Encrypted payload:", encryptedPayload);

      const response = await axios.post(
        `${baseUrl}/api/ipwhitelist/add-ip`,
        { body: encryptedPayload },
        {
          headers: { authorization: token },
        }
      );

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (response) {
        toast.success("IP added successfully");
        setShowAddForm(false);
        setNewIp({ ip: "", description: "" });
        fetchIps(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to add IP");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Error adding IP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete IP
  const handleDeleteIp = async (id) => {
    if (window.confirm("Are you sure you want to delete this IP address?")) {
      setLoading(true);
      try {
        const response = await axios.delete(
          `${baseUrl}/api/ipwhitelist/remove/${id}`,
          {
            headers: { authorization: token },
          }
        );

        const decrypted = await decryptText(response.data.body);
        const data = JSON.parse(decrypted);

        if (data.message?.toLowerCase().includes("deleted")) {
          toast.success(data.message || "IP deleted successfully");
          fetchIps(); // Refresh the list
        } else {
          throw new Error(data.message || "Failed to delete IP");
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || error.message || "Error deleting IP"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Update IP
  const saveEdit = async (id) => {
    setLoading(true);
    try {
      const payload = {
        ip: editData.ip,
        description: editData.description || "",
      };

      const encryptedPayload = await encryptText(payload);

      const response = await axios.put(
        `${baseUrl}/api/ipwhitelist/update/${id}`,
        { body: encryptedPayload },
        {
          headers: { authorization: token },
        }
      );

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (response) {
        toast.success("IP updated successfully");
        setEditingId(null);
        fetchIps(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to update IP");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Error updating IP"
      );
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (ipItem) => {
    setEditingId(ipItem.id);
    setEditData({ ip: ipItem.ip, description: ipItem.description });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ ip: "", description: "" });
  };

  const filteredIps = ipList.filter(
    (ip) =>
      ip.ip.includes(searchTerm) ||
      ip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIps.length / itemsPerPage);

  return (
    <div className={`ip-management-container ${darkMode ? "dark" : ""}`}>
      {/* <h1 className="title">IP Whitelist Management</h1>
      <p className="subtitle">
        Secure your account by managing trusted IP addresses
      </p> */}

      <div className="top-bar">
        <div className="ip-search-container">
          <input
            type="text"
            placeholder="Search IPs or descriptions..."
            className="ip-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="ip-search-icon">🔍</span>
        </div>
        <button
          className="add-ip-btn"
          onClick={() => {
            setShowAddForm(!showAddForm);
            cancelEditing();
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "+ Add IP"}
        </button>
      </div>

      {showAddForm && (
        <div className="add-ip-form">
          <h3 className="add-ip-form-h3">Add New IP Address</h3>
          <div className="form-group">
            <label className='ipwhitelist-form-group-label'>IP Address:</label>
            <input
              type="text"
              placeholder="e.g., 192.168.1.1"
              value={newIp.ip}
              onChange={(e) => setNewIp({ ...newIp, ip: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className='ipwhitelist-form-group-label'>Description:</label>
            <input
              type="text"
              placeholder="e.g., Office network"
              value={newIp.description}
              onChange={(e) =>
                setNewIp({ ...newIp, description: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="form-actions">
            <button
              className="cancel-btn"
              onClick={() => setShowAddForm(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="submit-btn"
              onClick={handleAddIp}
              disabled={loading || !newIp.ip.trim()}
            >
              {loading ? "Adding..." : "Add IP"}
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP TABLE */}
      <div className="table-container">
        {loading && ipList.length === 0 ? (
          <div className="loading-indicator">Loading IP addresses...</div>
        ) : (
          <>
            <div className="ip-table-wrapper">
              <table className="ip-table">
                <thead>
                  <tr>
                    <th>SR.NO.</th>
                    <th>IP ADDRESS</th>
                    <th>DESCRIPTION</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editData.ip}
                            onChange={(e) =>
                              setEditData({ ...editData, ip: e.target.value })
                            }
                            className="edit-input"
                            disabled={loading}
                          />
                        ) : (
                          item.ip
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editData.description}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                description: e.target.value,
                              })
                            }
                            className="edit-input"
                            disabled={loading}
                          />
                        ) : (
                          item.description
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={() => saveEdit(item.id)}
                              title="Save"
                              disabled={loading}
                            >
                              {loading ? "..." : "✔️"}
                            </button>
                            <button
                              className="cancel-edit-btn"
                              onClick={cancelEditing}
                              title="Cancel"
                              disabled={loading}
                            >
                              ✖️
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() => startEditing(item)}
                              title="Edit"
                              disabled={loading}
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteIp(item.id)}
                              title="Delete"
                              disabled={loading}
                            >
                              {loading && editingId === item.id ? "..." : "🗑️"}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            <div className="ip-whitelist-table-footer">
              <div className="ip-whitelist-entries-info">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredIps.length)} of{" "}
                {filteredIps.length} entries
              </div>

              <div className="ip-whitelist-pagination-controls">
                <div className="ip-whitelist-items-per-page">
                  <span>Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <div className="ip-whitelist-page-navigation">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="ip-whitelist-page-navigation-button"
                  >
                    Previous
                  </button>

                  <span className="ip-whitelist-page-navigation-span">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="ip-whitelist-page-navigation-button-next"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MOBILE CARDS */}
      <div className="mobile-cards-container">
        {filteredIps.map((item, index) => (
          <div key={`mobile-${item.id}`} className="ip-card">
            <div className="ip-card-header">
              <div className="ip-card-title">IP #{index + 1}</div>
              <div className="ip-card-actions">
                {editingId === item.id ? (
                  <>
                    <button
                      className="save-btn"
                      onClick={() => saveEdit(item.id)}
                      title="Save"
                      disabled={loading}
                    >
                      {loading ? "..." : "✔️"}
                    </button>
                    <button
                      className="cancel-edit-btn"
                      onClick={cancelEditing}
                      title="Cancel"
                      disabled={loading}
                    >
                      ✖️
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => startEditing(item)}
                      title="Edit"
                      disabled={loading}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteIp(item.id)}
                      title="Delete"
                      disabled={loading}
                    >
                      {loading && editingId === item.id ? "..." : "🗑️"}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="ip-card-body">
              <div className="ip-card-row">
                <div className="ip-card-label">IP Address:</div>
                <div className="ip-card-value">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.ip}
                      onChange={(e) =>
                        setEditData({ ...editData, ip: e.target.value })
                      }
                      className="edit-input"
                      disabled={loading}
                    />
                  ) : (
                    item.ip
                  )}
                </div>
              </div>
              <div className="ip-card-row">
                <div className="ip-card-label">Description:</div>
                <div className="ip-card-value">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="edit-input"
                      disabled={loading}
                    />
                  ) : (
                    item.description
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ipwhitelist;
