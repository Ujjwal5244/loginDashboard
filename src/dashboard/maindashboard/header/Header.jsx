import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaBars, FaUserCircle } from "react-icons/fa";
import ThemeToggle from "../ThemToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCheckCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { baseUrl } from "../../../encryptDecrypt";

const Header = ({ toggleSidebar, darkMode, toggleDarkMode, sidebarOpen }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

    // logout api
  const handleLogout = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.post(
        `${baseUrl}/api/user/logout`,
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );

    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);


  return (
    <header className="header">
      <div className="header-left">
        <button className="toggle-btn custom-toggle" onClick={toggleSidebar}>
          <FaBars size="20" color="white" />
        </button>
        <div className="nifi-logo-name">
          <span className="logo-text">Nifi</span>
          <span className="logo-text">Payments</span>
        </div>
      </div>
      <div className="header-center">SECURE KYC PORTAL</div>
      <div className="header-right">
        <div className="theme-toggle-wrapper">
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>{" "}
        <div className="profile-dropdown">
          <button className="profile-btn" onClick={toggleDropdown}>
            <FaUserCircle color="white" />
          </button>
          {dropdownOpen && (
            <div className="dropdown-content" onMouseLeave={closeDropdown}>
              <Link
                to="/Maindashboard/myprofile"
                className="My-profile-dropdown-header"
                onClick={closeDropdown}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="dropdown-icon-right"
                />{" "}
                My Profile
              </Link>
              <Link
                to="/Maindashboard/kycstatus"
                className="My-profile-dropdown-header"
                onClick={closeDropdown}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="dropdown-icon-right"
                  color="green"
                />{" "}
                KYC Status
              </Link>
              <button
                onClick={handleLogout}
                className="My-profile-dropdown-header"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="dropdown-icon-right"
                  color="red"
                />{" "}
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
