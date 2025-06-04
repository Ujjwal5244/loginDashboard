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
import {
  baseUrl,
  decryptText,
  encryptText,
} from "../../../../../encryptDecrypt";
import { toast } from "react-toastify";

// Helper function for email validation
const isValidEmail = (email) => {
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function for mobile number validation (basic 10-digit)
const isValidMobile = (mobile) => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
};

// Helper function for name validation
const isValidName = (name) => {
  // Name should not be too long and avoid numbers or too many special chars
  const nameRegex = /^[a-zA-Z\s'-]{2,50}$/; // Allows letters, spaces, hyphens, apostrophes, 2-50 chars
  return nameRegex.test(name);
};

const Myteam = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
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
      const activeRoles = data.roles.filter(
        (role) => role.roleStatus !== "delete"
      );
      // console.log(activeRoles)
      setRoles(activeRoles);

      // console.log("ededed",activeRoles  )
    } catch (err) {
      console.error("Failed to fetch roles", err);
      // toast.error("Failed to load roles. Please try again."); // Optionally notify user
    }
  }, [token]);
  // console.log("Roles:", roles); // Keep for debugging if needed, but can be removed

  // Fetch and transform team members from API
  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/api/team/employees`, {
        headers: { authorization: token },
      });

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (data.status !== "200")
        throw new Error("Failed to fetch team members");

      const activeMembers = data.teamMembers
        .filter((member) => member.userStatus !== "delete")
        .map((member) => ({
          id: member.id,
          name: member.name,
          email: member.email,
          mobile: member.mobile,
          roleId: member.role?._id,
          role: member.role?.roleName || "No Role",
          status: "Active", // Assuming active if not deleted
          verified: member.isVerified === "true",
          kycStatus: member.isVerified === "true" ? "Completed" : "Pending",
          joinDate: member.createdAt
            ? new Date(member.createdAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0], // Use createdAt if available
          review: member.review || "No review yet",
        }));

      setTeamMembers(activeMembers);

      // Optional: Informative toast if no team members yet
      if (activeMembers.length === 0 && !searchTerm) {
        // Only show if not searching
        // toast.info("No team members yet. Add someone to get started!"); // This can be annoying, consider removing
      }
    } catch (err) {
      console.error("Error fetching team members:", err);

      if (err.response && err.response.status === 404) {
        setTeamMembers([]); // Set to empty array if no members found
      } else {
        toast.error(
          err?.response?.data?.message ||
            err.message ||
            "Something went wrong while fetching team members."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [token, searchTerm]); // Added searchTerm to dependencies

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
    setNewMember((prev) => ({ ...prev, [name]: value.trimStart() })); // Trim leading spaces
  };

  // _____________________Add new member______________________-
  const addTeamMember = async (e) => {
    e.preventDefault();
    const { name, email, mobile, role: memberRole } = newMember;
    if (!name || !email || !mobile || !memberRole) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!isValidName(name.trim())) {
      toast.error(
        "Please enter a valid name (2-50 letters, spaces, hyphens, apostrophes allowed)."
      );
      return;
    }
    if (!isValidEmail(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!isValidMobile(mobile.trim())) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (
      teamMembers.some(
        (member) => member.email.toLowerCase() === email.trim().toLowerCase()
      )
    ) {
      toast.error("A team member with this email already exists.");
      return;
    }
    setLoading(true);
    try {
      const selectedRole = roles.find((r) => r.roleName === memberRole);
      if (!selectedRole) {
        toast.error("Invalid role selected. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        role: selectedRole.roleName,
        userStatus: "active",
      };
      const encryptedPayload = await encryptText(payload); // NO JSON.stringify() HERE

      console.log("Sending payload to add:", { body: encryptedPayload });

      const response = await axios.post(
        `${baseUrl}/api/team/add`,
        { body: encryptedPayload },
        { headers: { authorization: token } }
      );

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);
      if (data.status === "200") {
        toast.success(
          data.message ||
            "Team member added successfully. Verification email sent!"
        );
        setShowAddModal(false);
        setNewMember({ name: "", email: "", mobile: "", role: "" });
        fetchTeamMembers();
      } else if (data.message === "Verification email sent!") {
        toast.success("Verification email sent!");
        setShowAddModal(false);
        setNewMember({ name: "", email: "", mobile: "", role: "" });
        fetchTeamMembers();
      } else {
        throw new Error(data.message || "Failed to add team member");
      }
    } catch (err) {
  console.error("Error adding team member:", err);
  if (err.response) { // This block is executed for a 400 error
    console.error("Backend Response Data (Add):", err.response.data); 
      } else {
        toast.error(err.message || "Error adding team member.");
      }
    } finally {
      setLoading(false);
    }
  };
  // _____________________Delete member______________________-
  const deleteMember = async (memberId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this member? This action cannot be undone."
      )
    )
      return;

    setLoading(true);
    try {
      const response = await axios.delete(
        `${baseUrl}/api/team/remove/${memberId}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      // Simpler check if no encrypted body for delete
      if (
        response.status === 200 ||
        response.data?.status === "200" ||
        response.data?.message === "Team member removed successfully."
      ) {
        toast.success(response.data?.message || "Member deleted successfully.");
        fetchTeamMembers(); // Refresh list
      } else {
        const errorData = response.data; // Assuming error might not be encrypted or structure is different
        throw new Error(errorData?.message || "Failed to delete member.");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error(
        error.message || "An error occurred while deleting the member."
      );
    } finally {
      setLoading(false);
    }
  };

  // _____________________edit member______________________-

  const saveEditedMember = async () => {
    const { name, email, mobile, role: memberRole } = editedMember;

    // --- VALIDATIONS START (these are good to keep) ---
    if (!name || !email || !mobile || !memberRole) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!isValidName(name.trim())) {
      toast.error(
        "Please enter a valid name (2-50 letters, spaces, hyphens, apostrophes allowed)."
      );
      return;
    }
    if (!isValidEmail(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!isValidMobile(mobile.trim())) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (
      teamMembers.some(
        (member) =>
          member.id !== editingMemberId &&
          member.email.toLowerCase() === email.trim().toLowerCase()
      )
    ) {
      toast.error("Another team member with this email already exists.");
      return;
    }
    // --- VALIDATIONS END ---

    setLoading(true);
    try {
      const selectedRole = roles.find((r) => r.roleName === memberRole);
      if (!selectedRole) {
        toast.error("Invalid role selected. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        role: selectedRole.roleName,
      };

      const encryptedPayload = await encryptText(payload); // NO JSON.stringify() HERE
      console.log("Sending payload to update:", { body: encryptedPayload });

      const response = await axios.put(
        `${baseUrl}/api/team/update/${editingMemberId}`,
        { body: encryptedPayload },
        { headers: { authorization: token } }
      );

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (data.status === "200") {
        toast.success(data.message || "Member updated successfully");
        setEditingMemberId(null);
        setEditedMember({ name: "", email: "", mobile: "", role: "" });
        fetchTeamMembers();
      } else {
        throw new Error(data.message || "Failed to update member");
      }
    } catch (err) {
      console.error("Error updating member:", err);
      if (err.response) {
        console.error("Backend Response Data (Update):", err.response.data);
        toast.error(
          err.response.data?.message || err.message || "Error updating member."
        );
      } else {
        toast.error(err.message || "Error updating member.");
      }
    } finally {
      setLoading(false);
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
      // Handle undefined or null values gracefully for sorting
      const valA =
        a[sortConfig.key] === null || a[sortConfig.key] === undefined
          ? ""
          : String(a[sortConfig.key]).toLowerCase();
      const valB =
        b[sortConfig.key] === null || b[sortConfig.key] === undefined
          ? ""
          : String(b[sortConfig.key]).toLowerCase();

      if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
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

  const clearSearchAndFilters = () => {
    setSearchTerm("");
    // Add any other filter state resets here if you implement more filters
    setCurrentPage(1); // Reset to first page
    // fetchTeamMembers(); // Refetch might be needed if filters affect API call, otherwise filtering is client-side
  };

  if (loading && teamMembers.length === 0) {
    // Show full page loader only on initial load
    return (
      <div className={`loading-spinner ${darkMode ? "dark" : ""}`}>
        Loading team members...
      </div>
    );
  }

  return (
    <div className={`kyc-team-container ${darkMode ? "dark-mode" : ""}`}>
      {showAddModal && (
        <div className="kyc-modal-overlay">
          <div className="kyc-modal">
            <div className="kyc-modal-header">
              <h3 className="kyc-modal-header-h3">Add New Team Member</h3>
              <button
                className="kyc-modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setNewMember({ name: "", email: "", mobile: "", role: "" }); // Reset form on close
                }}
              >
                <FiX />
              </button>
            </div>
            {/* Use a form element for better accessibility and native validation hints */}
            <form onSubmit={addTeamMember}>
              <div className="kyc-modal-body">
                <div className="kyc-form-group">
                  <label htmlFor="add-name">Full Name *</label>
                  <input
                    id="add-name"
                    type="text"
                    name="name"
                    value={newMember.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                    maxLength={50}
                  />
                </div>
                <div className="kyc-form-group">
                  <label htmlFor="add-email">Email *</label>
                  <input
                    id="add-email"
                    type="email" // Use type="email" for basic browser validation
                    name="email"
                    value={newMember.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="kyc-form-group">
                  <label htmlFor="add-mobile">Mobile Number *</label>
                  <input
                    id="add-mobile"
                    type="tel" // Use type="tel"
                    name="mobile"
                    value={newMember.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    required
                    pattern="\d{10}" // Basic pattern for 10 digits
                    title="Mobile number must be 10 digits."
                  />
                </div>
                <div className="kyc-form-row">
                  <div className="kyc-form-group">
                    <label htmlFor="add-role">Role *</label>
                    <select
                      id="add-role"
                      name="role"
                      value={newMember.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select role</option>
                      {roles.map((role) => (
                        <option key={role?._id} value={role.roleName}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="kyc-modal-footer">
                <button
                  type="button" // Prevent form submission
                  className="kyc-secondary-button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMember({ name: "", email: "", mobile: "", role: "" }); // Reset form on cancel
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="kyc-primary-button"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="kyc-page-header">
        <div className="team-kyc-header-right">
          <div className="team-kyc-search-container">
            <FiSearch className="team-kyc-search-icon" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="kyc-search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
            {/* Filter button can be enhanced later */}
            {/* <button className="kyc-filter-button">
              <FiFilter className="filter-icon" />
              Filters
            </button> */}
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
          <div className="stat-value">{teamMembers?.length || 0}</div>
          <div className="stat-label">Total Members</div>
        </div>
        <div className="kyc-stat-card">
          <div className="stat-value">
            {teamMembers?.filter((m) => m?.verified).length || 0}
          </div>
          <div className="stat-label">Verified Members</div>
        </div>
        <div className="kyc-stat-card">
          <div className="stat-value">
            {teamMembers?.filter((m) => !m?.verified).length || 0}
          </div>
          <div className="stat-label">Unverified Members</div>
        </div>
        <div className="kyc-stat-card">
          <div className="stat-value">
            {teamMembers?.filter((m) => m?.status === "Active").length || 0}
          </div>
          <div className="stat-label">Active Members</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="kyc-table-wrapper">
        {/* Desktop Table */}
        <div className="kyc-table-scroll-container">
          <table className="kyc-data-table">
            <thead>
              <tr>
                <th>SR.NO.</th>
                <th
                  className="kyc-sortable"
                  onClick={() => requestSort("name")}
                >
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
                <th
                  className="kyc-sortable"
                  onClick={() => requestSort("role")}
                >
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
                  onClick={() => requestSort("verified")}
                >
                  VERIFIED
                  <span
                    className={`kyc-sort-icon ${sortConfig.key === "verified" ? "active" : ""}`}
                  >
                    {sortConfig.key === "verified" &&
                    sortConfig.direction === "ascending"
                      ? "↑"
                      : "↓"}
                  </span>
                </th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                paginatedMembers.length > 0 && ( // Inline loading indicator for table refresh
                  <tr className="kyc-loading-row">
                    <td colSpan="7">Refreshing data...</td>
                  </tr>
                )}
              {!loading && paginatedMembers.length === 0 ? (
                <tr className="kyc-no-data-row">
                  <td colSpan="7">
                    <div className="kyc-no-data-message">
                      <img
                        src="/images/no-data.svg" // Ensure this image path is correct
                        alt="No data found"
                        className="no-data-image"
                      />
                      <p>
                        {searchTerm
                          ? "No team members found matching your search."
                          : "No team members yet. Click 'Add Team Member' to start."}
                      </p>
                      {searchTerm && (
                        <button
                          className="kyc-secondary-button"
                          onClick={clearSearchAndFilters}
                        >
                          Clear Search
                        </button>
                      )}
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
                            maxLength={50}
                          />
                          <input
                            type="email"
                            name="email"
                            value={editedMember.email}
                            onChange={handleEditInputChange}
                            className="kyc-edit-input"
                            style={{ marginTop: "5px" }}
                          />
                        </div>
                      ) : (
                        <div className="kyc-member-info">
                          <div className="kyc-avatar">
                            {member.name?.charAt(0).toUpperCase() || "N"}
                          </div>
                          <div>
                            <div className="kyc-member-name">{member.name}</div>
                            <div className="kyc-member-email">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td data-label="CONTACT">
                      {editingMemberId === member.id ? (
                        <input
                          type="tel"
                          name="mobile"
                          value={editedMember.mobile}
                          onChange={handleEditInputChange}
                          className="kyc-edit-input"
                          pattern="\d{10}"
                          title="Mobile number must be 10 digits."
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
                            // Use role._id for key and role.roleName for value if API returns _id
                            <option
                              key={role?._id || role.roleName}
                              value={role.roleName}
                            >
                              {role.roleName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`kyc-role-badge ${member.role?.toLowerCase().replace(/\s+/g, "-") || "no-role"}`}
                        >
                          {member.role}
                        </span>
                      )}
                    </td>
                    <td data-label="STATUS">
                      <span
                        className={`kyc-status-badge ${member.status?.toLowerCase()}`}
                      >
                        {member.status === "Active" ? (
                          <FiCheckCircle className="status-icon" />
                        ) : (
                          <FiXCircle className="status-icon" /> // Or another icon for inactive
                        )}
                        {member.status}
                      </span>
                    </td>
                    <td data-label="VERIFIED">
                      <span
                        className={`kyc-status-badge ${member.verified ? "verified" : "unverified"}`}
                      >
                        {member.verified ? (
                          <FiUserCheck
                            style={{ color: "green" }}
                            className="verified-icon"
                          />
                        ) : (
                          <FiXCircle
                            style={{ color: "red" }}
                            className="verified-icon"
                          />
                        )}
                        {member.verified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td data-label="ACTIONS">
                      <div className="kyc-action-buttons">
                        {editingMemberId === member.id ? (
                          <>
                            <button
                              className="kyc-action-btn kyc-save-btn" // More semantic class
                              title="Save Changes"
                              onClick={saveEditedMember}
                              disabled={loading}
                            >
                              <FiCheckCircle style={{ color: "green" }} />
                            </button>
                            <button
                              className="kyc-action-btn kyc-cancel-btn" // More semantic class
                              title="Cancel Editing"
                              onClick={cancelEdit}
                              disabled={loading}
                            >
                              <FiX style={{ color: "red" }} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="kyc-action-btn kyc-edit-btn"
                              title="Edit Member"
                              onClick={() => handleEditClick(member)}
                              disabled={loading}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              className="kyc-action-btn kyc-delete-btn"
                              title="Delete Member"
                              onClick={() => deleteMember(member.id)}
                              disabled={loading}
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
        </div>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="kyc-mobile-cards">
          {loading &&
            paginatedMembers.length === 0 && ( // For initial mobile load
              <div className="kyc-no-data-message">
                <p>Loading members...</p>
              </div>
            )}
          {!loading && paginatedMembers.length === 0 ? (
            <div className="kyc-no-data-message">
              <img
                src="/images/no-data.svg" // Ensure this image path is correct
                alt="No data found"
                className="no-data-image"
              />
              <p>
                {searchTerm ? "No team members found." : "No team members yet."}
              </p>
              {searchTerm && (
                <button
                  className="kyc-secondary-button"
                  onClick={clearSearchAndFilters}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            paginatedMembers.map((member, index) => (
              <div key={member.id} className="kyc-mobile-card">
                <div className="kyc-card-header">
                  <div className="kyc-avatar">
                    {member.name?.charAt(0).toUpperCase() || "N"}
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
                          maxLength={50}
                        />
                        <input
                          type="email"
                          name="email"
                          value={editedMember.email}
                          onChange={handleEditInputChange}
                          className="kyc-edit-input"
                          placeholder="Email"
                          style={{ marginTop: "5px" }}
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
                      type="tel"
                      name="mobile"
                      value={editedMember.mobile}
                      onChange={handleEditInputChange}
                      className="kyc-edit-input"
                      pattern="\d{10}"
                      title="Mobile number must be 10 digits"
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
                        <option
                          key={role._id || role.roleName}
                          value={role.roleName}
                        >
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`kyc-role-badge ${member.role?.toLowerCase().replace(/\s+/g, "-") || "no-role"}`}
                    >
                      {member.role}
                    </span>
                  )}
                </div>

                <div className="kyc-card-row">
                  <span className="kyc-card-label">Status:</span>
                  <span
                    className={`kyc-status-badge ${member.status?.toLowerCase()}`}
                  >
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
                  <span
                    className={`kyc-verified-badge ${member.verified ? "verified" : "unverified"}`}
                  >
                    {member.verified ? (
                      <FiUserCheck
                        style={{ color: "green" }}
                        className="verified-icon"
                      />
                    ) : (
                      <FiXCircle
                        style={{ color: "red" }}
                        className="verified-icon"
                      />
                    )}
                    {member.verified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <div className="kyc-card-actions">
                  {editingMemberId === member.id ? (
                    <>
                      <button
                        className="kyc-action-btn kyc-save-btn"
                        title="Save Changes"
                        onClick={saveEditedMember}
                        disabled={loading}
                      >
                        <FiCheckCircle style={{ color: "green" }} />
                      </button>
                      <button
                        className="kyc-action-btn kyc-cancel-btn"
                        title="Cancel Editing"
                        onClick={cancelEdit}
                        disabled={loading}
                      >
                        <FiX style={{ color: "red" }} />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* <button
                        className="kyc-action-btn kyc-view-btn"
                        title="View"
                      >
                        <FiEye /> 
                      </button> */}
                      <button
                        className="kyc-action-btn kyc-edit-btn"
                        title="Edit"
                        onClick={() => handleEditClick(member)}
                        disabled={loading}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="kyc-action-btn kyc-delete-btn"
                        title="Delete"
                        onClick={() => deleteMember(member.id)}
                        disabled={loading}
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
        {totalPages > 0 && (
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
              {Math.min(currentPage * rowsPerPage, sortedMembers.length)} of{" "}
              {sortedMembers.length} entries
            </div>
            <div className="kyc-pagination-controls">
              <button
                className="kyc-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <FiChevronLeft />
              </button>
              {/* Smart Pagination Button Logic */}
              {(() => {
                const pageButtons = [];
                const maxButtons = 3; // Max buttons to show around current page
                let startPage = Math.max(
                  1,
                  currentPage - Math.floor(maxButtons / 2)
                );
                let endPage = Math.min(
                  totalPages,
                  currentPage + Math.floor(maxButtons / 2)
                );

                if (totalPages <= maxButtons + 2) {
                  // If total pages is small, show all
                  startPage = 1;
                  endPage = totalPages;
                } else {
                  if (currentPage <= Math.ceil(maxButtons / 2) + 1) {
                    // Near the start
                    endPage =
                      maxButtons + (totalPages > maxButtons + 1 ? 0 : 1);
                  } else if (
                    currentPage >=
                    totalPages - Math.floor(maxButtons / 2) - 1
                  ) {
                    // Near the end
                    startPage =
                      totalPages -
                      maxButtons +
                      (totalPages > maxButtons + 1 ? -0 : 0);
                  }
                }

                if (startPage > 1) {
                  pageButtons.push(
                    <button
                      key={1}
                      className={`kyc-pagination-btn ${currentPage === 1 ? "active" : ""}`}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pageButtons.push(
                      <span
                        key="start-ellipsis"
                        className="kyc-pagination-ellipsis"
                      >
                        ...
                      </span>
                    );
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  pageButtons.push(
                    <button
                      key={i}
                      className={`kyc-pagination-btn ${currentPage === i ? "active" : ""}`}
                      onClick={() => handlePageChange(i)}
                    >
                      {i}
                    </button>
                  );
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pageButtons.push(
                      <span
                        key="end-ellipsis"
                        className="kyc-pagination-ellipsis"
                      >
                        ...
                      </span>
                    );
                  }
                  pageButtons.push(
                    <button
                      key={totalPages}
                      className={`kyc-pagination-btn ${currentPage === totalPages ? "active" : ""}`}
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  );
                }
                return pageButtons;
              })()}
              <button
                className="kyc-pagination-btn"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Myteam;
