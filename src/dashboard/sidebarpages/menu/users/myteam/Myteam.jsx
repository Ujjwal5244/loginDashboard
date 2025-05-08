import React, { useState, useEffect, useCallback, act } from "react";
import axios from "axios";
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
import { baseUrl, decryptText, encryptText } from "../../../../../encryptDecrypt";
import { toast } from "react-toastify";

const Myteam = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", mobile: "", role: "" });
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editedMember, setEditedMember] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
  });


  const token = localStorage.getItem("userToken");

  // Fetch roles from API
  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/role/all`, {
        headers: { authorization: token },
      });
      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);
      // console.log(data)
      const activeRoles = data.roles.filter(role => role.roleStatus !== "delete");
      // console.log(activeRoles)
      setRoles(activeRoles);

      // console.log("ededed",activeRoles  )
    } catch (err) {
      console.error("Failed to fetch roles", err);
      toast.error("Failed to fetch roles");
    }
  }, [token]);

  // Fetch and transform team members from API
  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/team/employees`, {
        headers: { authorization: token },
      });

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (data.status !== "200") throw new Error("Failed to fetch team members");

      // Filter out deleted users and transform data
      const activeMembers = data.teamMembers
        .filter(member => member.userStatus !== "delete")
        .map(member => ({
          id: member.id,
          name: member.name,
          email: member.email,
          mobile: member.mobile,
          roleId: member.role?._id,
          role: member.role?.roleName || "No Role",
          status: "Active",
          verified: member.isVerified === "true",
          kycStatus: member.isVerified === "true" ? "Completed" : "Pending",
          joinDate: new Date().toISOString().split("T")[0], // Replace with actual date if available
          review: member.review || "No review yet",
        }));


      setTeamMembers(activeMembers);
      // console.log(activeMembers)
    } catch (err) {
      console.error("Error fetching team members:", err);
      toast.error(err.message || "Error fetching team members");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial fetch on mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchRoles();
      await fetchTeamMembers();
    };
    fetchData();
  }, [fetchRoles, fetchTeamMembers]);

  // Handle input change for add form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  // _____________________Add new member______________________-
  const addTeamMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email || !newMember.mobile || !newMember.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const selectedRole = roles.find(r => r.roleName === newMember.role);
      // console.log(selectedRole)
      if (!selectedRole) throw new Error("Invalid role selected");

      const payload = {
        name: newMember.name,
        email: newMember.email,
        mobile: newMember.mobile,
        role: selectedRole.roleName,
        userStatus: "active",
      };

      const encryptedPayload = await encryptText(payload);

      const response = await axios.post(
        `${baseUrl}/api/team/add`,
        { body: encryptedPayload },
        { headers: { authorization: token } }
      );

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (data.status === "200") {
        toast.success("Team member added successfully");
        setShowAddModal(false);
        setNewMember({ name: "", email: "", mobile: "", role: "" });
        fetchTeamMembers();
      } else {
        throw new Error(data.message || "Failed to add team member");
      }
    } catch (err) {
      console.error("Error adding team member:", err);
      toast.error(err.message || "Error adding team member");
    } finally {
      setLoading(false);
    }
  };

  // _____________________Delete member______________________-
  const deleteMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
  
    try {
      const response = await fetch(`${baseUrl}/api/team/remove/${memberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
           authorization: token
          // "Authorization": `Bearer ${yourToken}`
        },
      });
  
      if (response.ok) {
        // Optionally update UI or refetch data
        alert("Member deleted successfully.");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete member: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("An error occurred while deleting the member.");
    }
  };
  

    // _____________________edit member______________________-

    const handleEditClick = (member) => {
      setEditingMemberId(member.id);
      setEditedMember({
        name: member.name,
        email: member.email,
        mobile: member.mobile,
        role: member.role,
      });
    };

    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
      setEditedMember((prev) => ({ ...prev, [name]: value }));
    };

    const cancelEdit = () => {
      setEditingMemberId(null);
      setEditedMember({});
    };
    
    
    
    const saveEditedMember = async () => {
      try {
        const selectedRole = roles.find(r => r.roleName === editedMember.role);
        if (!selectedRole) {
          toast.error("Invalid role selected");
          return;
        }
    
        const payload = {
          name: editedMember.name,
          email: editedMember.email,
          mobile: editedMember.mobile,
          role: selectedRole.roleName,
        };
    
    
        const encryptedPayload = await encryptText(payload);
    
        const response = await axios.put(
          `${baseUrl}/api/team/update/${editingMemberId}`,
          { body: encryptedPayload },
          { headers: { authorization: token } }
        );
    
        const decrypted = await decryptText(response.data.body);
        const data = JSON.parse(decrypted);

        console.log(data)
    
        if (data.status === "200") {
          toast.success("Member updated successfully");
          setEditingMemberId(null);
          fetchTeamMembers();
        } else {
          throw new Error(data.message || "Failed to update member");
        }
      } catch (err) {
        console.error("Error updating member:", err);
        toast.error(err.message || "Error updating member");
      }
    };
    


  // Search, sort and paginate
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile?.includes(searchTerm)
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

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

  if (loading) return <div className="kyc-team-container">Loading team members...</div>;


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
                  required
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
                  required
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
                  required
                />
              </div>
              <div className="kyc-form-row">
                <div className="kyc-form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={newMember.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select role</option>
                    {roles.map((role) => (  
                      <option key={role?._id} value={role.roleName}>{role.roleName}</option>
                    ))}
                  </select>
                </div>
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
          <div className="stat-value">{teamMembers?.length}</div>
          <div className="stat-label">Total Members</div>
        </div>
        <div className="kyc-stat-card">
          <div className="stat-value">
            {teamMembers?.filter((m) => m?.verified).length}
          </div>
          <div className="stat-label">Verified Members</div>
        </div>
        <div className="kyc-stat-card">
          <div className="stat-value">
            {teamMembers?.filter((m) => !m?.verified).length}
          </div>
          <div className="stat-label">Unverified Members</div>
        </div>
        <div className="kyc-stat-card">
          <div className="stat-value">
            {teamMembers?.filter((m) => m?.status === "Active").length}
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
            <span className={`kyc-sort-icon ${sortConfig.key === "name" ? "active" : ""}`}>
              {sortConfig.key === "name" && sortConfig.direction === "ascending" ? "↑" : "↓"}
            </span>
          </th>
          <th>CONTACT</th>
          <th className="kyc-sortable" onClick={() => requestSort("role")}>
            ROLE
            <span className={`kyc-sort-icon ${sortConfig.key === "role" ? "active" : ""}`}>
              {sortConfig.key === "role" && sortConfig.direction === "ascending" ? "↑" : "↓"}
            </span>
          </th>
          <th className="kyc-sortable" onClick={() => requestSort("status")}>
            STATUS
            <span className={`kyc-sort-icon ${sortConfig.key === "status" ? "active" : ""}`}>
              {sortConfig.key === "status" && sortConfig.direction === "ascending" ? "↑" : "↓"}
            </span>
          </th>
          <th className="kyc-sortable" onClick={() => requestSort("verified")}>
            VERIFIED
            <span className={`kyc-sort-icon ${sortConfig.key === "verified" ? "active" : ""}`}>
              {sortConfig.key === "verified" && sortConfig.direction === "ascending" ? "↑" : "↓"}
            </span>
          </th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {paginatedMembers.length === 0 ? (
          <tr className="kyc-no-data-row">
            <td colSpan="7">
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
                {editingMemberId === member.id ? (
                  <div className="kyc-edit-field">
                    <input
                      type="text"
                      name="name"
                      value={editedMember.name}
                      onChange={handleEditInputChange}
                      className="kyc-edit-input"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editedMember.email}
                      onChange={handleEditInputChange}
                      className="kyc-edit-input"
                      style={{ marginTop: '5px' }}
                    />
                  </div>
                ) : (
                  <div className="kyc-member-info">
                    <div className="kyc-avatar">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="kyc-member-name">{member.name}</div>
                      <div className="kyc-member-email">{member.email}</div>
                    </div>
                  </div>
                )}
              </td>
              <td data-label="CONTACT">
                {editingMemberId === member.id ? (
                  <input
                    type="text"
                    name="mobile"
                    value={editedMember.mobile}
                    onChange={handleEditInputChange}
                    className="kyc-edit-input"
                  />
                ) : (
                  <div className="kyc-contact-info">
                    <div>{member.mobile}</div>
                    <div className="kyc-join-date">
                      Joined: {member.joinDate}
                    </div>
                  </div>
                )}
              </td>
              <td data-label="ROLE">
                {editingMemberId === member.id ? (
                  <select
                    name="role"
                    value={editedMember.role}
                    onChange={handleEditInputChange}
                    className="kyc-edit-select"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.roleName}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`kyc-role-badge ${member.role.toLowerCase()}`}>
                    {member.role}
                  </span>
                )}
              </td>
              <td data-label="STATUS">
                <span className={`kyc-status-badge ${member.status.toLowerCase()}`}>
                  {member.status === "Active" ? (
                    <FiCheckCircle className="status-icon" />
                  ) : (
                    <FiXCircle className="status-icon" />
                  )}
                  {member.status}
                </span>
              </td>
              <td data-label="VERIFIED">
                <span className={`kyc-status-badge ${member.verified ? "verified" : "unverified"}`}>
                  {member.verified ? (
                    <FiUserCheck style={{ color: "green" }} className="verified-icon" />
                  ) : (
                    <FiXCircle style={{ color: "red" }} className="verified-icon" />
                  )}
                  {member.verified ? "Verified" : "Unverified"}
                </span>
              </td>
              <td data-label="ACTIONS">
                <div className="kyc-action-buttons">
                  {editingMemberId === member.id ? (
                    <>
                      <button
                        className="kyc-action-btn kyc-edit-btn"
                        title="Save Changes"
                        onClick={saveEditedMember}
                      >
                        <FiCheckCircle style={{ color: "green" }} />
                      </button>
                      <button
                        className="kyc-action-btn kyc-delete-btn"
                        title="Cancel Editing"
                        onClick={cancelEdit}
                      >
                        <FiXCircle style={{ color: "red" }} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="kyc-action-btn kyc-edit-btn"
                        title="Edit Member"
                        onClick={() => handleEditClick(member)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="kyc-action-btn kyc-delete-btn"
                        title="Delete Member"
                        onClick={() => deleteMember(member.id)}
                      >
                        <FiTrash2 style={{ color: "red" }} />
                      </button>
                    </>
                  )}
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
                  {editingMemberId === member.id ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={editedMember.name}
                        onChange={handleEditInputChange}
                        className="kyc-edit-input"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={editedMember.email}
                        onChange={handleEditInputChange}
                        className="kyc-edit-input"
                        placeholder="Email"
                        style={{ marginTop: '5px' }}
                      />
                    </>
                  ) : (
                    <>
                      <div className="kyc-member-name">{member.name}</div>
                      <div className="kyc-member-email">{member.email}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="kyc-card-row">
                <span className="kyc-card-label">Contact:</span>
                {editingMemberId === member.id ? (
                  <input
                    type="text"
                    name="mobile"
                    value={editedMember.mobile}
                    onChange={handleEditInputChange}
                    className="kyc-edit-input"
                  />
                ) : (
                  <span>{member.mobile}</span>
                )}
              </div>

              <div className="kyc-card-row">
                <span className="kyc-card-label">Joined:</span>
                <span>{member.joinDate}</span>
              </div>

              <div className="kyc-card-row">
                <span className="kyc-card-label">Role:</span>
                {editingMemberId === member.id ? (
                  <select
                    name="role"
                    value={editedMember.role}
                    onChange={handleEditInputChange}
                    className="kyc-edit-select"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.roleName}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`kyc-role-badge ${member.role.toLowerCase()}`}>
                    {member.role}
                  </span>
                )}
              </div>

              <div className="kyc-card-row">
                <span className="kyc-card-label">Status:</span>
                <span className={`kyc-status-badge ${member.status.toLowerCase()}`}>
                  {member.status === "Active" ? (
                    <FiCheckCircle className="status-icon" />
                  ) : (
                    <FiXCircle className="status-icon" />
                  )}
                  {member.status}
                </span>
              </div>

              <div className="kyc-card-row">
                <span className="kyc-card-label">Verified:</span>
                <span className={`kyc-verified-badge ${member.verified ? "verified" : "unverified"}`}>
                  {member.verified ? (
                    <FiUserCheck style={{ color: "green" }} className="verified-icon" />
                  ) : (
                    <FiXCircle style={{ color: "red" }} className="verified-icon" />
                  )}
                  {member.verified ? "Verified" : "Unverified"}
                </span>
              </div>

              <div className="kyc-card-actions">
                {editingMemberId === member.id ? (
                  <>
                    <button
                      className="kyc-action-btn kyc-edit-btn"
                      title="Save Changes"
                      onClick={saveEditedMember}
                    >
                      <FiCheckCircle style={{ color: "green" }} />
                    </button>
                    <button
                      className="kyc-action-btn kyc-delete-btn"
                      title="Cancel Editing"
                      onClick={cancelEdit}
                    >
                      <FiXCircle style={{ color: "red" }} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="kyc-action-btn kyc-view-btn" title="View">
                      <FiEye />
                    </button>
                    <button
                      className="kyc-action-btn kyc-edit-btn"
                      title="Edit"
                      onClick={() => handleEditClick(member)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="kyc-action-btn kyc-delete-btn"
                      title="Delete"
                      onClick={() => deleteMember(member.id)}
                    >
                      <FiTrash2 style={{ color: "red" }} />
                    </button>
                  </>
                )}
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