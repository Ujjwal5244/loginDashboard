import React, { useState } from 'react';
import './Webhooks.css';

const Webhooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [webhooks, setWebhooks] = useState([]);
  const [newWebhook, setNewWebhook] = useState({ eventName: '', callbackUrl: '', status: 'Active' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ eventName: '', callbackUrl: '', status: 'Active' });

  const handleAddWebhook = () => {
    if (newWebhook.eventName && newWebhook.callbackUrl) {
      setWebhooks([...webhooks, {
        id: webhooks.length + 1,
        ...newWebhook
      }]);
      setNewWebhook({ eventName: '', callbackUrl: '', status: 'Active' });
      setShowAddForm(false);
    }
  };

  const handleDeleteWebhook = (id) => {
    if (window.confirm('Are you sure you want to delete this webhook?')) {
      setWebhooks(webhooks.filter(item => item.id !== id));
    }
  };

  const startEditing = (webhook) => {
    setEditingId(webhook.id);
    setEditData({ eventName: webhook.eventName, callbackUrl: webhook.callbackUrl, status: webhook.status });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ eventName: '', callbackUrl: '', status: 'Active' });
  };

  const saveEdit = (id) => {
    setWebhooks(webhooks.map(item =>
      item.id === id ? { ...item, ...editData } : item
    ));
    setEditingId(null);
  };

  const filteredWebhooks = webhooks.filter(item =>
    item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.callbackUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="webhook-management-container">
      <h1 className="webhook-title">Webhook Management</h1>
      <p className="webhook-subtitle">Configure and manage your webhook integrations</p>

      <div className="webhook-top-bar">
        <div className="webhook-search-container">
          <input
            type="text"
            placeholder="Search Event Name or Callback URL..."
            className="webhook-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="webhook-search-icon">🔍</span>
        </div>
        <button
          className="webhook-add-btn"
          onClick={() => {
            setShowAddForm(!showAddForm);
            cancelEditing();
          }}
        >
          + Add Webhook
        </button>
      </div>

      {showAddForm && (
        <div className="webhook-add-form">
          <h3>Add New Webhook</h3>
          <div className="webhook-form-group">
            <label>Event Name :</label>
            <input
              type="text"
              placeholder="Enter Event Name"
              value={newWebhook.eventName}
              onChange={(e) => setNewWebhook({ ...newWebhook, eventName: e.target.value })}
            />
          </div>
          <div className="webhook-form-group">
            <label>Callback URL :</label>
            <input
              type="text"
              placeholder="Enter Callback URL"
              value={newWebhook.callbackUrl}
              onChange={(e) => setNewWebhook({ ...newWebhook, callbackUrl: e.target.value })}
            />
          </div>
          <div className="webhook-form-actions">
            <button className="webhook-cancel-btn" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button className="webhook-submit-btn" onClick={handleAddWebhook}>
              Add Webhook
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP TABLE */}
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
            {filteredWebhooks.length > 0 ? (
              filteredWebhooks.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editData.eventName}
                        onChange={(e) => setEditData({ ...editData, eventName: e.target.value })}
                        className="webhook-edit-input"
                      />
                    ) : (
                      item.eventName
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editData.callbackUrl}
                        onChange={(e) => setEditData({ ...editData, callbackUrl: e.target.value })}
                        className="webhook-edit-input"
                      />
                    ) : (
                      item.callbackUrl
                    )}
                  </td>
                  <td>{item.status}</td>
                  <td>
                    {editingId === item.id ? (
                      <>
                        <button
                          className="webhook-save-btn"
                          onClick={() => saveEdit(item.id)}
                          title="Save"
                        >
                          ✔️
                        </button>
                        <button
                          className="webhook-cancel-edit-btn"
                          onClick={cancelEditing}
                          title="Cancel"
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
                        >
                          ✏️
                        </button>
                        <button
                          className="webhook-delete-btn"
                          onClick={() => handleDeleteWebhook(item.id)}
                          title="Delete"
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
                <td colSpan="5" style={{ textAlign: 'center' }}>No Webhooks Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="webhook-mobile-cards-container">
        {filteredWebhooks.map((item, index) => (
          <div key={`mobile-${item.id}`} className="webhook-card">
            <div className="webhook-card-header">
              <div className="webhook-card-title">Event #{index + 1}</div>
              <div className="webhook-card-actions">
                {editingId === item.id ? (
                  <>
                    <button
                      className="webhook-save-btn"
                      onClick={() => saveEdit(item.id)}
                      title="Save"
                    >
                      ✔️
                    </button>
                    <button
                      className="webhook-cancel-edit-btn"
                      onClick={cancelEditing}
                      title="Cancel"
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
                    >
                      ✏️
                    </button>
                    <button
                      className="webhook-delete-btn"
                      onClick={() => handleDeleteWebhook(item.id)}
                      title="Delete"
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
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.eventName}
                      onChange={(e) => setEditData({ ...editData, eventName: e.target.value })}
                      className="webhook-edit-input"
                    />
                  ) : (
                    item.eventName
                  )}
                </div>
              </div>
              <div className="webhook-card-row">
                <div className="webhook-card-label">Callback URL:</div>
                <div className="webhook-card-value">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.callbackUrl}
                      onChange={(e) => setEditData({ ...editData, callbackUrl: e.target.value })}
                      className="webhook-edit-input"
                    />
                  ) : (
                    item.callbackUrl
                  )}
                </div>
              </div>
              <div className="webhook-card-row">
                <div className="webhook-card-label">Status:</div>
                <div className="webhook-card-value">{item.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Webhooks;