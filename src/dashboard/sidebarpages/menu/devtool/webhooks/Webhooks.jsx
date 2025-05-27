import React, { useState, useEffect, useCallback } from "react";
import "./Webhooks.css";
import axios from "axios";
import {
  baseUrl,
  decryptText,
  encryptText,
} from "../../../../../encryptDecrypt";
import { toast } from "react-toastify";

const Webhooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [webhooks, setWebhooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    eventId: "",
    eventName: "",
    callbackUrl: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  const [eventList, setEventList] = useState([]);
  const [newWebhook, setNewWebhook] = useState({
    eventId: "",
    eventName: "",
    callbackUrl: "",
    status: "active",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Changed to state variable
  const itemsPerPageOptions = [10, 25, 50, 80, 100]; // Options for items per page

  const token = localStorage.getItem("userToken");

  // Fetch webhooks from API
  const fetchWebhooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/webhook`, {
        headers: { authorization: token },
      });

      if (!res.data?.webhooks) {
        throw new Error("No encrypted webhook data received");
      }

      const dec = await decryptText(res.data.webhooks);
      const data = JSON.parse(dec);

      const formattedWebhooks = Array.isArray(data)
        ? data
            .filter((webhook) => webhook.status !== "delete")
            .map((webhook) => ({
              _id: webhook._id,
              eventName: webhook.event?.eventName || "Unknown",
              callbackUrl: webhook.callbackURL,
              status: webhook.status === "active" ? "Active" : "Inactive",
              email: webhook.user?.email || "Unknown",
              name: webhook.user?.name || "Unknown",
            }))
        : [];

      setWebhooks(formattedWebhooks);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (err) {
      console.error("Webhook fetch error:", err);
      toast.error("Failed to fetch webhooks");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  // fetch events select list
  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/webhook/getevent`, {
        headers: { authorization: token },
      });

      const decrypted = await decryptText(res.data.body); // Assuming `res.data.body` is encrypted
      const parsed = JSON.parse(decrypted);

      if (Array.isArray(parsed.events)) {
        console.log(parsed.events);
        setEventList(parsed.events);
      } else {
        toast.error("Failed to load event list");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to fetch events");
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Add new webhook
  const handleAddWebhook = async (e) => {
    e.preventDefault();
    if (!newWebhook.eventId || !newWebhook.callbackUrl) return;

    setLoading(true);
    try {
      const payload = {
        event: newWebhook.eventId,
        callbackURL: newWebhook.callbackUrl,
        status: newWebhook?.status,
      };

      const encryptedPayload = await encryptText(payload);
      console.log(encryptedPayload);

      const response = await axios.post(
        `${baseUrl}/api/webhook/`,
        { body: encryptedPayload },
        { headers: { authorization: token } }
      );

      const decrypted = await decryptText(response.data.body);
      console.log(decrypted);
      const data = JSON.parse(decrypted);
      console.log(data);

      if (response) {
        toast.success("Webhook created successfully");
        setShowAddForm(false);
        setNewWebhook({ eventName: "", callbackUrl: "", status: "active" });
        fetchWebhooks();
      } else {
        throw new Error(data.message || "Failed to create webhook");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error creating webhook"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update existing webhook
  const saveEdit = async (id) => {
    if (!editData.eventName || !editData.callbackUrl) return;

    setLoading(true);
    try {
      const payload = {
        event: editData.eventId,
        callbackURL: editData.callbackUrl,
        status: editData.status.toLowerCase(),
      };

      const encryptedPayload = await encryptText(payload);

      const response = await axios.put(
        `${baseUrl}/api/webhook/${id}`,
        { body: encryptedPayload },
        { headers: { authorization: token } }
      );

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (response) {
        toast.success("Webhook updated successfully");
        setEditingId(null);
        fetchWebhooks();
      } else {
        throw new Error(data.message || "Failed to update webhook");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error updating webhook"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete webhook
  const handleDeleteWebhook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this webhook?"))
      return;

    setLoading(true);
    try {
      const payload = { webhookId: id };
      const encryptedPayload = await encryptText(payload);

      const response = await axios.delete(`${baseUrl}/api/webhook/${id}`, {
        data: { body: encryptedPayload },
        headers: { authorization: token },
      });

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (response.data.success) {
        toast.success("Webhook deleted successfully");
        fetchWebhooks();
      } else {
        throw new Error(data.message || "Failed to delete webhook");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error deleting webhook"
      );
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (webhook) => {
    setEditingId(webhook._id);
    setEditData({
      eventId: eventList.find(ev => ev.eventName === webhook.eventName)?._id || "",
      eventName: webhook.eventName,
      callbackUrl: webhook.callbackUrl,
      status: webhook.status.toLowerCase(),
    });
  };
  
  

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ eventName: "", callbackUrl: "", status: "active" });
  };

  // Filter webhooks based on search term
  const filteredWebhooks = webhooks.filter(
    (item) =>
      item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.callbackUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWebhooks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredWebhooks.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  return (
    <div className="webhook-management-container">
      {/* <h1 className="webhook-title">Webhook Management</h1>
      <p className="webhook-subtitle">
        Configure and manage your webhook integrations
      </p> */}

      <div className="webhook-top-bar">
        <div className="webhook-search-container">
          <input
            type="text"
            placeholder="Search Event Name or Callback URL..."
            className="webhook-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
          <span className="webhook-search-icon">🔍</span>
        </div>
        <button
          className="webhook-add-btn"
          onClick={() => {
            setShowAddForm(!showAddForm);
            cancelEditing();
          }}
          disabled={loading}
        >
          + Add Webhook
        </button>
      </div>

      {showAddForm && (
        <div className="webhook-add-form">
          <h3>Add New Webhook</h3>
          <div className="webhook-form-group">
            <label>Event :</label>
            <select
              value={newWebhook.eventId}
              onChange={(e) =>
                setNewWebhook({
                  ...newWebhook,
                  eventId: e.target.value,
                  eventName:
                    eventList.find((ev) => ev._id === e.target.value)
                      ?.eventName || "",
                })
              }
              disabled={loading}
            >
              <option value="">-- Select Event --</option>
              {eventList.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </div>

          <div className="webhook-form-group">
            <label>Callback URL :</label>
            <input
              type="text"
              placeholder="Enter Callback URL"
              value={newWebhook.callbackUrl}
              onChange={(e) =>
                setNewWebhook({ ...newWebhook, callbackUrl: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="webhook-form-actions">
            <button
              className="webhook-cancel-btn"
              onClick={() => setShowAddForm(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="webhook-submit-btn"
              onClick={handleAddWebhook}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Webhook"}
            </button>
          </div>
        </div>
      )}

      {loading && !showAddForm && (
        <div className="loading-indicator">Loading...</div>
      )}

      <div className="webhook-table-container">
        <table className="webhook-table">
          <thead>
            <tr>
              <th>SR.NO.</th>
              <th>EVENT NAME</th>
              <th>CALLBACK URL</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>
                    {editingId === item._id ? (
                      <select
                        value={editData.eventName}
                        onChange={(e) => {
                          const selectedEvent = eventList.find(ev => ev.eventName === e.target.value);
                          setEditData({
                            ...editData,
                            eventName: selectedEvent?.eventName || "",
                            eventId: selectedEvent?._id || "",
                          });
                        }}
                        
                        className="webhook-edit-input"
                        disabled={loading}
                      >
                        <option value="">-- Select Event --</option>
                        {eventList.map((event) => (
                          <option key={event._id} value={event.eventName}>
                            {event.eventName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.eventName
                    )}
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editData.callbackUrl}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            callbackUrl: e.target.value,
                          })
                        }
                        className="webhook-edit-input"
                        disabled={loading}
                      />
                    ) : (
                      item.callbackUrl
                    )}
                  </td>
                  <td>
                    {item.status} {/* Status is now always displayed as text */}
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <>
                        <button
                          className="webhook-save-btn"
                          onClick={() => saveEdit(item._id)}
                          title="Save"
                          disabled={loading}
                        >
                          {loading ? "..." : "✔️"}
                        </button>
                        <button
                          className="webhook-cancel-edit-btn"
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
                          className="webhook-edit-btn"
                          onClick={() => startEditing(item)}
                          title="Edit"
                          disabled={loading}
                        >
                          ✏️
                        </button>
                        <button
                          className="webhook-delete-btn"
                          onClick={() => handleDeleteWebhook(item._id)}
                          title="Delete"
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  {loading ? "Loading..." : "No Webhooks Found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="webhook-table-footer">
        <div className="webhook-items-per-page">
          <label>Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            disabled={loading}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="webhook-pagination-info">
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, filteredWebhooks.length)} of{" "}
          {filteredWebhooks.length} items
        </div>

        {totalPages > 1 && (
          <div className="webhook-pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="webhook-pagination-button"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show limited page numbers (max 5)
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`webhook-pagination-button ${currentPage === pageNumber ? "active" : ""}`}
                  disabled={loading}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="webhook-pagination-button"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="webhook-mobile-cards-container">
        {currentItems.map((item, index) => (
          <div key={`mobile-${item._id}`} className="webhook-card">
            <div className="webhook-card-header">
              <div className="webhook-card-title">
                Event #{indexOfFirstItem + index + 1}
              </div>
              <div className="webhook-card-actions">
                {editingId === item._id ? (
                  <>
                    <button
                      className="webhook-save-btn"
                      onClick={() => saveEdit(item._id)}
                      title="Save"
                      disabled={loading}
                    >
                      {loading ? "..." : "✔️"}
                    </button>
                    <button
                      className="webhook-cancel-edit-btn"
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
                      className="webhook-edit-btn"
                      onClick={() => startEditing(item)}
                      title="Edit"
                      disabled={loading}
                    >
                      ✏️
                    </button>
                    <button
                      className="webhook-delete-btn"
                      onClick={() => handleDeleteWebhook(item._id)}
                      title="Delete"
                      disabled={loading}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="webhook-card-body">
              <div className="webhook-card-row">
                <div className="webhook-card-label">Event Name:</div>
                <div className="webhook-card-value">
                  {editingId === item._id ? (
                    <select
                      value={editData.eventName}
                      onChange={(e) =>
                        setEditData({ ...editData, eventName: e.target.value })
                      }
                      className="webhook-edit-input"
                      disabled={loading}
                    >
                      <option value="">-- Select Event --</option>
                      {eventList.map((event) => (
                        <option key={event._id} value={event.eventName}>
                          {event.eventName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.eventName
                  )}
                </div>
              </div>
              <div className="webhook-card-row">
                <div className="webhook-card-label">Callback URL:</div>
                <div className="webhook-card-value">
                  {editingId === item._id ? (
                    <input
                      type="text"
                      value={editData.callbackUrl}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          callbackUrl: e.target.value,
                        })
                      }
                      className="webhook-edit-input"
                      disabled={loading}
                    />
                  ) : (
                    item.callbackUrl
                  )}
                </div>
              </div>
              <div className="webhook-card-row">
                <div className="webhook-card-label">Status:</div>
                <div className="webhook-card-value">
                  {item.status} {/* Status is now always displayed as text */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Webhooks;
