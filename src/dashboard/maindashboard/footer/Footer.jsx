import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiCode, FiSettings, FiFileText } from "react-icons/fi";

import "./Footer.css";

const Footer = ({ darkMode }) => {
  const navigate = useNavigate();

  const goToHome = () => navigate("/maindashboard/home");
  const goToUsers = () => navigate("/maindashboard/role-management");
  const goToDevTools = () => navigate("/maindashboard/ip-whitelist");
  const goToSettings = () => navigate("/maindashboard/setting");
  const goToDrafts = () => navigate("/maindashboard/drafts");

  return (
    <div className={`footer-navigation ${darkMode ? "dark-mode" : ""}`}>
      <button className="nav-btn" onClick={goToHome}>
        <FiHome className="nav-icon" />
        <span>Home</span>
      </button>
      <button className="nav-btn" onClick={goToUsers}>
        <FiUser className="nav-icon" />
        <span>Users</span>
      </button>
      <button className="nav-btn" onClick={goToDevTools}>
        <FiCode className="nav-icon" />
        <span>DevTools</span>
      </button>
      <button className="nav-btn" onClick={goToSettings}>
        <FiSettings className="nav-icon" />
        <span>Settings</span>
      </button>
      <button className="nav-btn" onClick={goToDrafts}>
        <FiFileText className="nav-icon" />
        <span>Drafts</span>
      </button>
    </div>
  );
};

export default Footer;