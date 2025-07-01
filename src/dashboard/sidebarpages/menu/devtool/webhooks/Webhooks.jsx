import React, { useState, useEffect, useCallback } from "react";
import "./Webhooks.css";
import axios from "axios";
import {
  baseUrl,
  decryptText,
  encryptText,
} from "../../../../../encryptDecrypt";
import { toast } from "react-toastify";

const Webhooks = ({darkMode}) => {
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

    // Check if response exists and has data
    if (!res || !res.data) {
      throw new Error("No response data received from server");
    }

    // If the endpoint might return a 200 with empty data
    if (res.status === 200 && !res.data.webhooks) {
      setWebhooks([]); // Set empty array if no webhooks
      return;
    }

    // Only proceed with decryption if webhooks data exists
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
    setCurrentPage(1);
  } catch (err) {
    console.error("Webhook fetch error:", err);
    // More specific error message
    toast.error(
      err.response?.status === 404
        ? "Webhook endpoint not found"
        : "Failed to fetch webhooks"
    );
    
    // Set empty array if error occurs
    setWebhooks([]);
  } finally {
    setLoading(false);
  }
}, [token]);

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
        setNewWebhook({ eventId: "", eventName: "", callbackUrl: "", status: "active" });
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
    if (!editData.eventId || !editData.callbackUrl) { // Check eventId instead of eventName
      toast.error("Event and Callback URL are required.");
      return;
    }

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
    const eventInList = eventList.find(ev => ev.eventName === webhook.eventName);
    setEditData({
      eventId: eventInList?._id || "",
      eventName: webhook.eventName,
      callbackUrl: webhook.callbackUrl,
      status: webhook.status.toLowerCase(),
    });
  };
  
  

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ eventId: "", eventName: "", callbackUrl: "", status: "active" });
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
<div className={`webhook-management-container ${darkMode ? 'dark-mode' : ''}`}>
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
            cancelEditing(); // Also cancel any editing if add form is opened
            setNewWebhook({ eventId: "", eventName: "", callbackUrl: "", status: "active" }); // Reset newWebhook form
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
              onClick={() => {
                setShowAddForm(false);
                setNewWebhook({ eventId: "", eventName: "", callbackUrl: "", status: "active" }); // Reset form on cancel
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="webhook-submit-btn"
              onClick={handleAddWebhook}
              disabled={loading || !newWebhook.eventId || !newWebhook.callbackUrl}
            >
              {loading ? "Adding..." : "Add Webhook"}
            </button>
          </div>
        </div>
      )}

      {loading && !showAddForm && webhooks.length === 0 && ( // Show loading only if no webhooks yet and not adding
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
                        value={editData.eventName} // Display eventName
                        onChange={(e) => {
                          const selectedEvent = eventList.find(ev => ev.eventName === e.target.value);
                          setEditData({
                            ...editData,
                            eventName: selectedEvent?.eventName || "",
                            eventId: selectedEvent?._id || "", // Set eventId as well
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
                    {/* Status is not directly editable in the row, it's managed by `editData.status` if needed elsewhere or preset */}
                    {item.status} 
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <>
                        <button
                          className="webhook-save-btn"
                          onClick={() => saveEdit(item._id)}
                          title="Save"
                          disabled={loading || !editData.eventId || !editData.callbackUrl}
                        >
                          {loading && editingId === item._id ? "..." : "✔️"}
                        </button>
                        <button
                          className="webhook-cancel-edit-btn"
                          onClick={cancelEditing}
                          title="Cancel"
                          disabled={loading && editingId === item._id}
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
                      disabled={loading || !editData.eventId || !editData.callbackUrl}
                    >
                      {loading && editingId === item._id ? "..." : "✔️"}
                    </button>
                    <button
                      className="webhook-cancel-edit-btn"
                      onClick={cancelEditing}
                      title="Cancel"
                      disabled={loading && editingId === item._id}
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
                      value={editData.eventName} // Display eventName
                      onChange={(e) => { // <<< --- THIS IS THE FIX APPLIED
                        const selectedEvent = eventList.find(ev => ev.eventName === e.target.value);
                        setEditData({
                          ...editData,
                          eventName: selectedEvent?.eventName || "",
                          eventId: selectedEvent?._id || "", // Set eventId as well
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
                  {item.status} 
                </div>
              </div>
            </div>
          </div>
        ))}
         {currentItems.length === 0 && !loading && (
          <div className="webhook-no-data-mobile">No Webhooks Found</div>
        )}
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
          Showing {filteredWebhooks.length > 0 ? indexOfFirstItem + 1 : 0}-
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
              let pageNumberToShow;
              if (totalPages <= 5) {
                pageNumberToShow = i + 1;
              } else if (currentPage <= 3) {
                pageNumberToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumberToShow = totalPages - 4 + i;
              } else {
                pageNumberToShow = currentPage - 2 + i;
              }
              if (pageNumberToShow > 0 && pageNumberToShow <= totalPages) {
                return (
                  <button
                    key={pageNumberToShow}
                    onClick={() => paginate(pageNumberToShow)}
                    className={`webhook-pagination-button ${currentPage === pageNumberToShow ? "active" : ""}`}
                    disabled={loading}
                  >
                    {pageNumberToShow}
                  </button>
                );
              }
              return null;
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
    </div>
  );
};

export default Webhooks;