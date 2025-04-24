import React from "react";
import { FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import "./Myteam.css";

const Myteam = () => {
  // Sample data - replace with your actual data
  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      mobile: "+1234567890",
      role: "Admin",
      status: "Active",
      verified: true
    },
    // Add more team members as needed
  ];

  return (
    <div className="my-team-container">
      {/* Header Section - matching role management style */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Team Management</h1>
          <p className="page-description">Manage your organization's team members</p>
        </div>
        <div className="header-right">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search team members..."
              className="search-input"
            />
          </div>
          <button className="primary-button">
            + Add Team Member
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>SR.NO.</th>
              <th className="sortable">
                NAME <span className="sort-icon">⇅</span>
              </th>
              <th className="sortable">
                EMAIL <span className="sort-icon">⇅</span>
              </th>
              <th className="sortable">
                MOBILE <span className="sort-icon">⇅</span>
              </th>
              <th className="sortable">
                ROLE <span className="sort-icon">⇅</span>
              </th>
              <th className="sortable">
                STATUS <span className="sort-icon">⇅</span>
              </th>
              <th>VERIFIED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.length === 0 ? (
              <tr className="no-data-row">
                <td colSpan="8">
                  <div className="no-data-message">
                    No team members found
                  </div>
                </td>
              </tr>
            ) : (
              teamMembers.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.mobile}</td>
                  <td>
                    <span className={`role-badge ${member.role.toLowerCase()}`}>
                      {member.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${member.status.toLowerCase()}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    {member.verified ? (
                      <span className="verified-badge">Verified</span>
                    ) : (
                      <span className="not-verified-badge">Not Verified</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view-btn" title="View">
                        <FiEye />
                      </button>
                      <button className="action-btn edit-btn" title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="action-btn delete-btn" title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer */}
        <div className="table-footer">
          <div className="rows-per-page">
            <span>Rows per page:</span>
            <div className="dropdown">
              <button className="dropdown-toggle">
                25 <FiChevronDown className="dropdown-icon" />
              </button>
            </div>
          </div>
          <div className="pagination-info">
            Showing 1 to 0 of 0 entries
          </div>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>
              <FiChevronLeft />
            </button>
            <button className="pagination-btn" disabled>
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myteam;