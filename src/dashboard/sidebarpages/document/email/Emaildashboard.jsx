import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiMail,
  FiInbox,
  FiStar,
  FiSend,
  FiFileText,
  FiTrash2,
} from "react-icons/fi";
import "./Emaildashboard.css"; // Make sure to import the CSS

const Emaildashboard = ({ sidebarOpen, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active folder based on current route
  const getActiveFolder = () => {
    if (location.pathname.includes("compose")) return "compose";
    // Add other folder logic if needed
    return "inbox";
  };

  const [activeFolder, setActiveFolder] = React.useState(getActiveFolder());

  return (
    <div className={`email-app ${darkMode ? "dark-mode" : ""}`}>
      {/* Sidebar - always visible */}
      <div className="email-sidebar">
  <button
    className="compose-button"
    onClick={() => navigate("/Maindashboard/Email/compose")}
  >
    <FiMail /> Compose
  </button>

  <ul className="folder-list">
    <li
      className={activeFolder === "inbox" ? "active" : ""}
      onClick={() => {
        setActiveFolder("inbox");
        navigate("/Maindashboard/Email");
      }}
    >
      <FiInbox /> Inbox
    </li>
    <li
      className={activeFolder === "starred" ? "active" : ""}
      onClick={() => {
        setActiveFolder("starred");
        navigate("/Maindashboard/Email/starred");
      }}
    >
      <FiStar /> Starred
    </li>
    <li
      className={activeFolder === "sent" ? "active" : ""}
      onClick={() => {
        setActiveFolder("sent");
        navigate("/Maindashboard/Email/sent");
      }}
    >
      <FiSend /> Sent
    </li>
    <li
      className={activeFolder === "drafts" ? "active" : ""}
      onClick={() => {
        setActiveFolder("drafts");
        navigate("/Maindashboard/Email/drafts");
      }}
    >
      <FiFileText /> Drafts
    </li>
    <li
      className={activeFolder === "trash" ? "active" : ""}
      onClick={() => {
        setActiveFolder("trash");
        navigate("/Maindashboard/Email/trash");
      }}
    >
      <FiTrash2 /> Trash
    </li>
  </ul>
</div>

      {/* Main content area */}
      <div
        className="email-content-area"
        style={{
          height: "calc(100vh - 68px)",
          width: "100%",
          overflowY: "auto",
        }}
      >
        {" "}
        <Outlet />
      </div>
    </div>
  );
};

export default Emaildashboard;
