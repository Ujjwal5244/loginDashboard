import React, { useState } from 'react';
import './Ipwhitelist.css';

const Ipwhitelist = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [ipList, setIpList] = useState([
    { id: 1, ip: '196.135.1.50', description: 'new one to testing' },
    { id: 2, ip: '192.168.1.59', description: 'Updated Office Networksdvdfgfss...' }
  ]);
  const [newIp, setNewIp] = useState({ ip: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ ip: '', description: '' });

  const handleAddIp = () => {
    if (newIp.ip && newIp.description) {
      setIpList([...ipList, { 
        id: ipList.length + 1, 
        ip: newIp.ip, 
        description: newIp.description 
      }]);
      setNewIp({ ip: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteIp = (id) => {
    if (window.confirm('Are you sure you want to delete this IP address?')) {
      setIpList(ipList.filter(item => item.id !== id));
    }
  };

  const startEditing = (ipItem) => {
    setEditingId(ipItem.id);
    setEditData({ ip: ipItem.ip, description: ipItem.description });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ ip: '', description: '' });
  };

  const saveEdit = (id) => {
    setIpList(ipList.map(item => 
      item.id === id ? { ...item, ip: editData.ip, description: editData.description } : item
    ));
    setEditingId(null);
  };

  const filteredIps = ipList.filter(ip => 
    ip.ip.includes(searchTerm) || 
    ip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`ip-management-container ${darkMode ? 'dark' : ''}`}>
      <h1 className="title">IP Whitelist Management</h1>
      <p className="subtitle">Secure your account by managing trusted IP addresses</p>

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
        >
          + Add IP
        </button>
      </div>

      {showAddForm && (
        <div className="add-ip-form">
          <h3>Add New IP Address</h3>
          <div className="form-group">
            <label>IP Address:</label>
            <input 
              type="text" 
              placeholder="e.g., 192.168.1.1" 
              value={newIp.ip}
              onChange={(e) => setNewIp({...newIp, ip: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <input 
              type="text" 
              placeholder="e.g., Office network" 
              value={newIp.description}
              onChange={(e) => setNewIp({...newIp, description: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button className="submit-btn" onClick={handleAddIp}>
              Add IP
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP TABLE */}
      <div className="table-container">
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
            {filteredIps.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.ip}
                      onChange={(e) => setEditData({...editData, ip: e.target.value})}
                      className="edit-input"
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
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className="edit-input"
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
                      >
                        ✔️
                      </button>
                      <button 
                        className="cancel-edit-btn"
                        onClick={cancelEditing}
                        title="Cancel"
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
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteIp(item.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TABLE FOOTER */}
        <div className="table-footer">
          <div className="entries-select">
            <label>Show:</label>
            <select>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>entries</span>
          </div>
          <div className="entries-info">
            Showing 1 to {filteredIps.length} of {filteredIps.length} entries
          </div>
          <div className="pagination">
            <button disabled>&lt; Previous</button>
            <button className="active-page">1</button>
            <button>Next &gt;</button>
          </div>
        </div>
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
                    >
                      ✔️
                    </button>
                    <button 
                      className="cancel-edit-btn"
                      onClick={cancelEditing}
                      title="Cancel"
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
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteIp(item.id)}
                      title="Delete"
                    >
                      🗑️
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
                      onChange={(e) => setEditData({...editData, ip: e.target.value})}
                      className="edit-input"
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
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className="edit-input"
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