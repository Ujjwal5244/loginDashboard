import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiCode, FiSettings} from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { MdDrafts} from "react-icons/md";

import "./Footer.css";

const Footer = ({ darkMode, onMenuToggle }) => {
  const navigate = useNavigate();

  const goToHome = () => navigate("/Maindashboard/home");
  const goToUsers = () => navigate("/Maindashboard/role-management");
  const goToDevTools = () => navigate("/Maindashboard/ip-whitelist");
  const goToSettings = () => navigate("/Maindashboard/setting");
  const goToDrafts = () => navigate("/Maindashboard/Email");
  
  const handleMobileMenu = () => {
    navigate("/Maindashboard/mobilemenu");
    onMenuToggle();
  };

  return (
    <div className={`footer-navigation ${darkMode ? "dark-mode" : ""}`}>
      <button className="footer-toggle-btn" onClick={handleMobileMenu}>
        <FaBars size='20px' />
      </button>
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
        <MdDrafts className="nav-icon" />
        <span>Email</span>
      </button>
    </div>
  );
};

export default Footer;