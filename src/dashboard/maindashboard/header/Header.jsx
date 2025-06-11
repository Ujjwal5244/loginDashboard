import React, { use, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaBars, FaUserCircle } from "react-icons/fa";
import ThemeToggle from "../ThemToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoIosNotifications } from "react-icons/io";

import {
  faUser,
  faCheckCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { baseUrl } from "../../../encryptDecrypt";
import NotificationSidebar from "../../headerpages/notification/NotificationSidebar";

const Header = ({ toggleSidebar, darkMode, toggleDarkMode, sidebarOpen }) => {
  const [active, setActive] = useState("Home");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const pathMap = {
    home: "Home",
    analytics: "Analytics",
    "role-management": "Role-Management",
    "my-team": "Team KYC Management",
    "ip-whitelist": "Ip-Whitelist Management",
    webhooks: "Webhook Management",
    logs: "Logs",
    "api-credential": "Api-Credential",
    kycstudio: "Verification Portal",
    transactionhistory: "Transaction History",
    "signed-agreement": "Signed-Agreement",
    yourkyc: "yourkyc",
    Email: "Email",
    completed: "Completed",
    setting: "Setting",
    myprofile: "My Profile",
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClick = () => {
    navigate("createfile");
  };

  const nifiPaymentClick = () => {
    navigate("/Nifipayment"); // Replace with your target path
  };

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

  const handleMobileMenu = () => {
    navigate("/Maindashboard/mobilemenu");
    // onMenuToggle();
  };

  useEffect(() => {
    Object.keys(pathMap).forEach((key) => {
      if (location.pathname.includes(key)) {
        console.log(pathMap[key], key);
        setActive(pathMap[key]);
      }
    });
  }, [location]);
  return (
    <>
      <header className={`header ${darkMode ? "dark-mode" : ""}`}>
        <div className="header-left">
          <button className="toggle-btn custom-toggle" onClick={toggleSidebar}>
            <FaBars size="20" color="white" />
          </button>
          <div
            className="nifi-logo-name cursor-pointer transition duration-300 hover:bg-[rgba(100,149,237,0.3)] hover:backdrop-blur-sm rounded-[20px] p-2"
            onClick={nifiPaymentClick}
          >
            <span className="logo-text">Nifi</span>
            <span className="logo-text">Payments</span>
          </div>
          {/* this is mobile header toggle button when the screen size is less than 700px then show this */}
          <button
            className="mobile-header-toggle-btn"
            onClick={handleMobileMenu}
          >
            <FaBars size="22px" />
          </button>
          <div
            className="mobile-header-nifi-logo-name"
            onClick={nifiPaymentClick}
          >
            <span className="mobile-header-logo-text">Nifi</span>
            <span className="mobile-header-logo-text">Payments</span>
          </div>
          {/* end of this is mobile header toggle button when the screen size is less than 700px then show this */}
        </div>
        <div className="header-center">{active}</div>

        {/* _______________________header right_____________________________ */}
        <div className="header-right">
          <div className="create-button-of-header">
            <button
              className="create-button-of-header-button"
              onClick={handleClick}
            >
              + Create
            </button>
          </div>
          <div className="theme-toggle-wrapper">
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>
          {/* ________profile header___________ */}
          <div className="profile-dropdown">
            <div className="header-notification-icon-wrapper">
              <button
                className="header-notification-btn"
                onClick={() => setNotificationOpen(true)}
              >
                <IoIosNotifications />
              </button>
            </div>
            <div className="profile-of-header">
              <button className="profile-btn" onClick={toggleDropdown}>
                <FaUserCircle
                  color="white"
                  style={{ width: "26px", height: "26px" }}
                />
              </button>
              {dropdownOpen && (
                <div className="dropdown-content" onMouseLeave={closeDropdown}>
                  <Link
                    to="/Maindashboard/myprofile"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    <FontAwesomeIcon icon={faUser} className="dropdown-icon" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/Maindashboard/kycstatus"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="dropdown-icon"
                      style={{ color: "green" }}
                    />
                    <span>KYC Status</span>
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="dropdown-icon"
                      style={{ color: "red" }}
                    />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {notificationOpen && (
        <NotificationSidebar
          onClose={() => setNotificationOpen(false)}
          darkMode={darkMode}
        />
      )}
    </>
  );
};

export default Header;
