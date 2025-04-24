import React, { useState } from "react";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "./Rolemanagement.css";

const Rolemanagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [roles, setRoles] = useState([
    { id: 1, name: "api partner", description: "—", status: true },
    { id: 2, name: "baba", description: "life full enjoy", status: true },
    { id: 3, name: "ceo", description: "—", status: true },
    { id: 4, name: "IT developer", description: "—", status: true },
    { id: 5, name: "nice nice", description: "—", status: true },
    { id: 6, name: "reseller", description: "—", status: true },
    { id: 7, name: "admin", description: "System administrator", status: true },
    { id: 8, name: "manager", description: "Department manager", status: true },
    { id: 9, name: "support", description: "Customer support", status: true },
    { id: 10, name: "analyst", description: "Data analyst", status: true },
    { id: 11, name: "designer", description: "UI/UX designer", status: true },
    {
      id: 12,
      name: "marketing",
      description: "Marketing specialist",
      status: true,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddRole = () => {
    setShowAddModal(true);
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    if (newRole.name.trim() === "") return;

    const newRoleObj = {
      id: roles.length + 1,
      name: newRole.name,
      description: newRole.description || "—",
      status: true,
    };

    setRoles([...roles, newRoleObj]);
    setNewRole({ name: "", description: "" });
    setShowAddModal(false);
  };

  const toggleRoleStatus = (id) => {
    setRoles(
      roles.map((role) =>
        role.id === id ? { ...role, status: !role.status } : role
      )
    );
  };

  const [editingRoleId, setEditingRoleId] = useState(null);

  // Filter roles based on search query
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
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
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="main-rolemanagement">
      {/* Header Section */}
      <div className="rolemanagement-container1">
        <div className="rolemanagement-container1-left">
          <h1>Role Management</h1>
          <p>Manage and organize user roles and permissions</p>
        </div>
        <div className="rolemanagement-container1-right">
          <form
            className="rolemanagement-container1-right-search"
            onSubmit={handleSearch}
          >
            <FiSearch className="search-icon" />
            <input
              type="text"
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
              currentRows.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>
                    {editingRoleId === role.id ? (
                      <input
                        value={role.name}
                        onChange={(e) =>
                          setRoles((prev) =>
                            prev.map((r) =>
                              r.id === role.id
                                ? { ...r, name: e.target.value }
                                : r
                            )
                          )
                        }
                      />
                    ) : (
                      role.name
                    )}
                  </td>
                  <td>
                    {editingRoleId === role.id ? (
                      <input
                        value={role.description}
                        onChange={(e) =>
                          setRoles((prev) =>
                            prev.map((r) =>
                              r.id === role.id
                                ? { ...r, description: e.target.value }
                                : r
                            )
                          )
                        }
                      />
                    ) : (
                      role.description
                    )}
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={role.status}
                        onChange={() => toggleRoleStatus(role.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="actions">
                    {editingRoleId === role.id ? (
                      <button
                        className="edit-icon"
                        onClick={() => setEditingRoleId(null)}
                      >
                        ✅
                      </button>
                    ) : (
                      <button
                        className="edit-icon"
                        onClick={() => setEditingRoleId(role.id)}
                      >
                        <FiEdit2 />
                      </button>
                    )}
                    <button
                      className="delete-icon"
                      onClick={() =>
                        setRoles((prev) => prev.filter((r) => r.id !== role.id))
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-results">
                <td colSpan="5">No roles found matching your search</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <div className="rows-per-page">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="rows-per-page-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
          <span className="showing-entries">
            Showing {indexOfFirstRow + 1} to{" "}
            {Math.min(indexOfLastRow, filteredRoles.length)} of{" "}
            {filteredRoles.length} entries
          </span>
          <div className="pagination">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="pagination-button"
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
                  className={`pagination-button ${currentPage === pageNum ? "active" : ""}`}
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
                className={`pagination-button ${currentPage === totalPages ? "active" : ""}`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
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
