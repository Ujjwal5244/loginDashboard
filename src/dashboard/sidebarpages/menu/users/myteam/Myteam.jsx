import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPlus,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiUserCheck,
  FiClock,
  FiX,
} from "react-icons/fi";
import "./Myteam.css";

const Myteam = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "Manager",
    status: "Active",
    kycStatus: "Pending",
    joinDate: new Date().toISOString().split("T")[0],
  });

  // Sample data with KYC status
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      mobile: "+1234567890",
      role: "Admin",
      status: "Active",
      verified: true,
      kycStatus: "Completed",
      lastActive: "2 hours ago",
      joinDate: "2023-05-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      mobile: "+1987654321",
      role: "Manager",
      status: "Active",
      verified: true,
      kycStatus: "Pending",
      lastActive: "5 minutes ago",
      joinDate: "2023-06-20",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      mobile: "+1122334455",
      role: "Analyst",
      status: "Inactive",
      verified: false,
      kycStatus: "Rejected",
      lastActive: "3 days ago",
      joinDate: "2023-04-10",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      mobile: "+1567890123",
      role: "Support",
      status: "Active",
      verified: true,
      kycStatus: "Completed",
      lastActive: "1 hour ago",
      joinDate: "2023-07-05",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@example.com",
      mobile: "+1345678901",
      role: "Developer",
      status: "Active",
      verified: false,
      kycStatus: "In Progress",
      lastActive: "30 minutes ago",
      joinDate: "2023-08-12",
    },
  ]);

  // Handle input change for new member form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({
      ...newMember,
      [name]: value,
    });
  };

  // Add new team member
  const addTeamMember = () => {
    if (!newMember.name || !newMember.email || !newMember.mobile) {
      alert("Please fill in all required fields");
      return;
    }

    const newId = Math.max(...teamMembers.map((m) => m.id)) + 1;
    const memberToAdd = {
      ...newMember,
      id: newId,
      verified: newMember.kycStatus === "Completed",
      lastActive: "Just now",
    };

    setTeamMembers([...teamMembers, memberToAdd]);
    setShowAddModal(false);
    setNewMember({
      name: "",
      email: "",
      mobile: "",
      role: "Manager",
      status: "Active",
      kycStatus: "Pending",
      joinDate: new Date().toISOString().split("T")[0],
    });
  };

  // Filter team members based on search term
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile.includes(searchTerm)
  );

  // Sort team members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedMembers.length / rowsPerPage);
  const paginatedMembers = sortedMembers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Delete team member
  const deleteMember = (id) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  return (
    <div className="kyc-team-container">
      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="kyc-modal-overlay">
          <div className="kyc-modal">
            <div className="kyc-modal-header">
              <h3>Add New Team Member</h3>
              <button
                className="kyc-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="kyc-modal-body">
              <div className="kyc-form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newMember.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>
              <div className="kyc-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newMember.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="kyc-form-group">
                <label>Mobile Number *</label>
                <input
                  type="text"
                  name="mobile"
                  value={newMember.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="kyc-form-row">
                <div className="kyc-form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={newMember.role}
                    onChange={handleInputChange}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Support">Support</option>
                    <option value="Developer">Developer</option>
                  </select>
                </div>
                <div className="kyc-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={newMember.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="kyc-form-group">
                <label>KYC Status</label>
                <select
                  name="kycStatus"
                  value={newMember.kycStatus}
                  onChange={handleInputChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="kyc-form-group">
                <label>Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  value={newMember.joinDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="kyc-modal-footer">
              <button
                className="kyc-secondary-button"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="kyc-primary-button" onClick={addTeamMember}>
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="kyc-page-header">
        <div className="kyc-header-left">
          <h1 className="kyc-page-title">Team KYC Management</h1>
          <p className="kyc-page-description">
            Manage and verify your team members' KYC status with ease
          </p>
        </div>
        <div className="kyc-header-right">
          <div className="kyc-search-container">
            <FiSearch className="kyc-search-icon" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="kyc-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="kyc-filter-button">
              <FiFilter className="filter-icon" />
              Filters
            </button>
          </div>
          <button
            className="kyc-primary-button"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus className="plus-icon" />
            Add Team Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="kyc-stats-container">
        <div className="kyc-stat-card">
          <div className="stat-value">{teamMembers.length}</div>
          <div className="stat-label">Total Members</div>
        </div>
        <div className="kyc-stat-card">
          <div className="stat-value">
            {teamMembers.filter((m) => m.kycStatus === "Completed").length}
          </div>
          <div className="stat-label">KYC Verified</div>
        </div>
        <div className="kyc-stat-card">
          <div className="stat-value">
            {
              teamMembers.filter(
                (m) =>
                  m.kycStatus === "Pending" || m.kycStatus === "In Progress"
              ).length
            }
          </div>
          <div className="stat-label">Pending KYC</div>
        </div>
        <div className="kyc-stat-card">
          <div className="stat-value">
            {teamMembers.filter((m) => m.status === "Active").length}
          </div>
          <div className="stat-label">Active Members</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="kyc-table-wrapper">
        {/* Desktop Table */}
        <table className="kyc-data-table">
          <thead>
            <tr>
              <th>SR.NO.</th>
              <th className="kyc-sortable" onClick={() => requestSort("name")}>
                NAME
                <span
                  className={`kyc-sort-icon ${sortConfig.key === "name" ? "active" : ""}`}
                >
                  {sortConfig.key === "name" &&
                  sortConfig.direction === "ascending"
                    ? "↑"
                    : "↓"}
                </span>
              </th>
              <th>CONTACT</th>
              <th className="kyc-sortable" onClick={() => requestSort("role")}>
                ROLE
                <span
                  className={`kyc-sort-icon ${sortConfig.key === "role" ? "active" : ""}`}
                >
                  {sortConfig.key === "role" &&
                  sortConfig.direction === "ascending"
                    ? "↑"
                    : "↓"}
                </span>
              </th>
              <th
                className="kyc-sortable"
                onClick={() => requestSort("status")}
              >
                STATUS
                <span
                  className={`kyc-sort-icon ${sortConfig.key === "status" ? "active" : ""}`}
                >
                  {sortConfig.key === "status" &&
                  sortConfig.direction === "ascending"
                    ? "↑"
                    : "↓"}
                </span>
              </th>
              <th
                className="kyc-sortable"
                onClick={() => requestSort("kycStatus")}
              >
                KYC STATUS
                <span
                  className={`kyc-sort-icon ${sortConfig.key === "kycStatus" ? "active" : ""}`}
                >
                  {sortConfig.key === "kycStatus" &&
                  sortConfig.direction === "ascending"
                    ? "↑"
                    : "↓"}
                </span>
              </th>
              <th>LAST ACTIVE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.length === 0 ? (
              <tr className="kyc-no-data-row">
                <td colSpan="8">
                  <div className="kyc-no-data-message">
                    <img
                      src="/images/no-data.svg"
                      alt="No data found"
                      className="no-data-image"
                    />
                    <p>No team members found matching your search</p>
                    <button className="kyc-secondary-button">
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedMembers.map((member, index) => (
                <tr key={member.id} className="kyc-data-row">
                  <td data-label="SR.NO.">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td data-label="NAME">
                    <div className="kyc-member-info">
                      <div className="kyc-avatar">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="kyc-member-name">{member.name}</div>
                        <div className="kyc-member-email">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="CONTACT">
                    <div className="kyc-contact-info">
                      <div>{member.mobile}</div>
                      <div className="kyc-join-date">
                        Joined: {member.joinDate}
                      </div>
                    </div>
                  </td>
                  <td data-label="ROLE">
                    <span
                      className={`kyc-role-badge ${member.role.toLowerCase()}`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td data-label="STATUS">
                    <span
                      className={`kyc-status-badge ${member.status.toLowerCase()}`}
                    >
                      {member.status === "Active" ? (
                        <FiCheckCircle className="status-icon" />
                      ) : (
                        <FiXCircle className="status-icon" />
                      )}
                      {member.status}
                    </span>
                  </td>
                  <td data-label="KYC STATUS">
                    <span
                      className={`kyc-kyc-badge ${member.kycStatus.toLowerCase().replace(" ", "-")}`}
                    >
                      {member.kycStatus === "Completed" ? (
                        <FiUserCheck className="kyc-icon" />
                      ) : member.kycStatus === "Pending" ? (
                        <FiClock className="kyc-icon" />
                      ) : null}
                      {member.kycStatus}
                    </span>
                  </td>
                  <td data-label="LAST ACTIVE">
                    <div className="kyc-last-active">{member.lastActive}</div>
                  </td>
                  <td data-label="ACTIONS">
                    <div className="kyc-action-buttons">
                      <button
                        className="kyc-action-btn kyc-view-btn"
                        title="View KYC Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="kyc-action-btn kyc-edit-btn"
                        title="Edit Member"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="kyc-action-btn kyc-delete-btn"
                        title="Delete Member"
                        onClick={() => deleteMember(member.id)}
                      >
                        <FiTrash2 style={{ color: "red" }}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="kyc-mobile-cards">
          {paginatedMembers.length === 0 ? (
            <div className="kyc-no-data-message">
              <img
                src="/images/no-data.svg"
                alt="No data found"
                className="no-data-image"
              />
              <p>No team members found matching your search</p>
              <button className="kyc-secondary-button">Clear Filters</button>
            </div>
          ) : (
            paginatedMembers.map((member, index) => (
              <div key={member.id} className="kyc-mobile-card">
                <div className="kyc-card-header">
                  <div className="kyc-avatar">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="kyc-member-name">{member.name}</div>
                    <div className="kyc-member-email">{member.email}</div>
                  </div>
                </div>

                <div className="kyc-card-row">
                  <span className="kyc-card-label">Contact:</span>
                  <span>{member.mobile}</span>
                </div>

                <div className="kyc-card-row">
                  <span className="kyc-card-label">Joined:</span>
                  <span>{member.joinDate}</span>
                </div>

                <div className="kyc-card-row">
                  <span className="kyc-card-label">Role:</span>
                  <span
                    className={`kyc-role-badge ${member.role.toLowerCase()}`}
                  >
                    {member.role}
                  </span>
                </div>

                <div className="kyc-card-row">
                  <span className="kyc-card-label">Status:</span>
                  <span
                    className={`kyc-status-badge ${member.status.toLowerCase()}`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="kyc-card-row">
                  <span className="kyc-card-label">KYC:</span>
                  <span
                    className={`kyc-kyc-badge ${member.kycStatus.toLowerCase().replace(" ", "-")}`}
                  >
                    {member.kycStatus}
                  </span>
                </div>

                <div className="kyc-card-row">
                  <span className="kyc-card-label">Last Active:</span>
                  <span>{member.lastActive}</span>
                </div>

                <div className="kyc-card-actions">
                  <button className="kyc-action-btn kyc-view-btn" title="View">
                    <FiEye />
                  </button>
                  <button className="kyc-action-btn kyc-edit-btn" title="Edit">
                    <FiEdit2 />
                  </button>
                  <button
                    className="kyc-action-btn kyc-delete-btn"
                    title="Delete"
                    onClick={() => deleteMember(member.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Table Footer */}
        <div className="kyc-table-footer">
          <div className="kyc-rows-per-page">
            <span>Rows per page:</span>
            <div className="kyc-dropdown">
              <button className="kyc-dropdown-toggle">
                {rowsPerPage} <FiChevronDown className="kyc-dropdown-icon" />
              </button>
              <div className="kyc-dropdown-menu">
                {[5, 10, 25, 50, 100].map((option) => (
                  <div
                    key={option}
                    className={`kyc-dropdown-item ${
                      rowsPerPage === option ? "selected" : ""
                    }`}
                    onClick={() => handleRowsPerPageChange(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="kyc-pagination-info">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, filteredMembers.length)} of{" "}
            {filteredMembers.length} entries
          </div>
          <div className="kyc-pagination-controls">
            <button
              className="kyc-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FiChevronLeft />
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
                  className={`kyc-pagination-btn ${
                    currentPage === pageNum ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="kyc-pagination-ellipsis">...</span>
            )}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                className={`kyc-pagination-btn ${
                  currentPage === totalPages ? "active" : ""
                }`}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            )}
            <button
              className="kyc-pagination-btn"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myteam;
