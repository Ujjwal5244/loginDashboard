import React, { use, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [active, setActive] = useState("Home");
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
    navigate('createfile'); 
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
    onMenuToggle();
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
    <header className="header">
      <div className="header-left">
        <button className="toggle-btn custom-toggle" onClick={toggleSidebar}>
          <FaBars size="20" color="white" />
        </button>
        <div className="nifi-logo-name">
          <span className="logo-text">Nifi</span>
          <span className="logo-text">Payments</span>
        </div>
        {/* this is mobile header toggle button when the screen size is less than 700px then show this */}
        <button className="mobile-header-toggle-btn" onClick={handleMobileMenu}>
          <FaBars size="22px" />
        </button>
        <div className="mobile-header-nifi-logo-name">
          <span className="mobile-header-logo-text">Nifi</span>
          <span className="mobile-header-logo-text">Payments</span>
        </div>
        {/* end of this is mobile header toggle button when the screen size is less than 700px then show this */}
      </div>
      <div className="header-center">{active}</div>

      {/* _______________________header right_____________________________ */}
      <div className="header-right">
       <div className='create-button-of-header'>
      <button 
        className='create-button-of-header-button' 
        onClick={handleClick}
      >
        + Create
      </button>
    </div>
        <div className="theme-toggle-wrapper">
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
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
                />
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
                />
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
                />
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
