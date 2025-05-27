import React, { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import axios from "axios";
import {
  baseUrl,
  decryptText,
  encryptText,
} from "../../../../../encryptDecrypt";
import "./Rolemanagement.css";
import { toast } from "react-toastify";

const Rolemanagement = ({darkMode}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editRoleData, setEditRoleData] = useState({
    name: "",
    description: "",
  });

  const token = localStorage.getItem("userToken");

  // Fetch roles from API
  const fetchRoles = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${baseUrl}/api/role/all`, {
        headers: { authorization: token },
      });
      const dec = await decryptText(res.data.body);
      const data = JSON.parse(dec);

      const filterRoles = data.roles.filter(
        (role) => role.roleStatus != "delete"
      );
      // Map the API response to your expected format
      const formattedRoles = filterRoles.map((role) => ({
        id: role.id,
        name: role.roleName,
        description: role.roleDescription,
        status: role.roleStatus === "active", // Convert to boolean
      }));
      setRoles(formattedRoles);
      // console.log(formattedRoles, "formattedRoles");
      // console.log(filterRoles, "filterRoles");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // __________________Create new role_____________
  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!newRole.name.trim()) return;

    setLoading(true);
    try {
      const payload = {
        roleName: newRole.name,
        roleDescription: newRole.description || "",
      };

      const encryptedPayload = await encryptText(payload);

      const response = await axios.post(
        `${baseUrl}/api/role/create`,
        { body: encryptedPayload },
        {
          headers: { authorization: token },
        }
      );

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (response) {
        toast.success("Role created successfully");
        setShowAddModal(false);
        setNewRole({ name: "", description: "" });
        fetchRoles(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to create role");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Error creating role"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update existing role
  const handleUpdateRole = async (roleId) => {
    if (!editRoleData.name.trim()) return;

    setLoading(true);
    try {
      const payload = {
        roleName: editRoleData.name,
        roleDescription: editRoleData.description || "",
      };

      const encryptedPayload = await encryptText(payload);

      const response = await axios.put(
        `${baseUrl}/api/role/update/${editingRoleId}`,
        { body: encryptedPayload },
        {
          headers: { authorization: token },
        }
      );

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);
      console.log(data);

      if (data) {
        toast.success("Role updated successfully");
        setEditingRoleId(null);
        fetchRoles(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Error updating role"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete role
  const handleDeleteRole = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    setLoading(true);
    try {
      const payload = { roleId };
      const encryptedPayload = await encryptText(payload);

      const response = await axios.delete(`${baseUrl}/api/role/${roleId}`, {
        data: { body: encryptedPayload },
        headers: { authorization: token },
      });

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (response.data.success) {
        toast.success("Role deleted successfully");
        fetchRoles(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to delete role");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Error deleting role"
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle role status
  // Update toggleRoleStatus to match API expectations
  const toggleRoleStatus = async (roleId, currentStatus) => {
    setLoading(true);
    try {
      const payload = {
        roleStatus: currentStatus ? "inactive" : "active", // Match API status values
      };
      const encryptedPayload = await encryptText(payload);

      const response = await axios.put(
        `${baseUrl}/api/role/update/${roleId}`,
        { body: encryptedPayload },
        {
          headers: { authorization: token },
        }
      );

      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (response) {
        toast.success(
          `Role ${!currentStatus ? "activated" : "deactivated"} successfully`
        );
        fetchRoles(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to update role status");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error updating role status"
      );
    } finally {
      setLoading(false);
    }
  };
  // When starting to edit a role
  const startEditing = (role) => {
    setEditingRoleId(role.id);
    setEditRoleData({
      name: role.name,
      description: role.description,
    });
  };

  // another filed
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleAddRole = () => setShowAddModal(true);

  // Filter and paginate
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRoles.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={`main-rolemanagement ${darkMode ? "dark-mode" : ""}`}>
      {/* Header Section */}
      <div className={`rolemanagement-container1 p-2 ${darkMode ? "dark" : ""}`}>
        {/* <div className="rolemanagement-container1-left">
          <h1>Role Management</h1>
          <p>Manage and organize user roles and permissions</p>
        </div> */}
        <div className="rolemanagement-container1-right">
          <form
            className="rolemanagement-container1-right-search"
            onSubmit={handleSearch}
          >
            <FiSearch className="Rolemanagement-search-icon" />
            <input
              type="text"
              className='rolemanagement-container1-right-search-input'
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="rolemanagement-right-add-button">
            <button
              className="rolemanagement-container1-right-add-button"
              onClick={handleAddRole}
            >
              + Add Role
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rolemanagement-container2">
        <table className="role-table">
          <thead>
            <tr>
              <th>SR.NO.</th>
              <th>
                ROLENAME <span className="sort-icon">↑</span>
              </th>
              <th>
                ROLEDESCRIPTION <span className="sort-icon">⇅</span>
              </th>
              <th>
                ROLESTATUS <span className="sort-icon">⇅</span>
              </th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((role, index) => (
                <tr key={role.id}>
                  <td>{index + 1}</td>
                  {/* Use index instead of role.id for SR.NO */}
                  <td>
                    {editingRoleId === role.id ? (
                      <input
                        value={editRoleData.name}
                        onChange={(e) =>
                          setEditRoleData({
                            ...editRoleData,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      role.name
                    )}
                  </td>
                  <td>
                    {editingRoleId === role.id ? (
                      <input
                        value={editRoleData.description}
                        onChange={(e) =>
                          setEditRoleData({
                            ...editRoleData,
                            description: e.target.value,
                          })
                        }
                      />
                    ) : (
                      role.description || "—" // Show dash for empty descriptions
                    )}
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={role.status}
                        onChange={() => toggleRoleStatus(role.id, role.status)}
                        disabled={loading}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="status-text"></span>
                  </td>
                  <td className="actions">
                    {editingRoleId === role.id ? (
                      <button
                        className="edit-icon"
                        onClick={() => handleUpdateRole(role.id)}
                        disabled={loading} // Optional: Disable while loading
                      >
                        ✅
                      </button>
                    ) : (
                      <button
                        className="edit-icon"
                        onClick={() => {
                          setEditingRoleId(role.id);
                          setEditRoleData({
                            name: role.name,
                            description: role.description || "",
                          });
                        }}
                      >
                        <FiEdit2 />
                      </button>
                    )}

                    <button
                      className="delete-icon"
                      onClick={() => handleDeleteRole(role.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-results">
                <td colSpan="5">
                  {loading
                    ? "Loading..."
                    : "No roles found matching your search"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="Rolemanagement-table-footer-pagination-container">
          <div className="Rolemanagement-table-footer-pagination-rows-per-page">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="Rolemanagement-pagination-rows-per-page-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
          <span className="Rolemanagemen-table-footer-pagination-showing-entries">
            Showing {indexOfFirstRow + 1} to{" "}
            {Math.min(indexOfLastRow, filteredRoles.length)} of{" "}
            {filteredRoles.length} entries
          </span>
          <div className="Rolemanagement-table-footer-pagination">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="Rolemanagement-table-footer-pagination-button"
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
                  onClick={() => paginate(pageNum)}
                  className={`Rolemanagement-table-footer-pagination-button ${currentPage === pageNum ? "active" : ""}`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="pagination-ellipsis">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => paginate(totalPages)}
                className={`Rolemanagement-table-footer-pagination-button ${currentPage === totalPages ? "active" : ""}`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="Rolemanagement-table-footer-pagination-button"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-role-modal">
            <div className="modal-header">
              <h3>Add New Role</h3>
              <button
                className="close-modal"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveRole}>
              <div className="form-group">
                <label>Role Name</label>
                <input
                  type="text"
                  placeholder="Enter role name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  placeholder="Enter role description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rolemanagement;
