import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MobileMenu.css";
import {
  FiHome,
  FiPieChart,
  FiUsers,
  FiTool,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiDollarSign,
  FiUser,
  FiLock,
  FiFilePlus,
  FiClipboard,
  FiGlobe,
  FiList,
  FiArrowLeft, // Added for back button
} from "react-icons/fi";
import { FcApproval } from "react-icons/fc";
import { SiMonkeytie } from "react-icons/si";
import { MdDrafts } from "react-icons/md";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import axios from "axios";
import { encryptText, decryptText, baseUrl } from "../../../../encryptDecrypt";

const MobileMenu = ({ isOpen, onClose, darkMode }) => {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/user/profile`, {
        headers: { authorization: token },
      });
      const decrypted = await decryptText(res.data.body);
      const parsed = JSON.parse(decrypted);
      if (parsed.status === "success") {
        setUserProfile({
          name: parsed.data.name,
          email: parsed.data.email,
          profile: parsed.data.profile,
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !e.target.closest(".mobile-app-menu") &&
        !e.target.closest(".header")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setOpenDropdown(null);
    }
  }, [isOpen]);

  const handleNavigation = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
    // onClose();
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
    // onClose();
  };

  const toggleDropdown = (name, e) => {
    e.stopPropagation();
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  const isActive = (path) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  if (!isOpen) return null;

  const MenuItem = ({
    icon,
    label,
    path,
    indent = false,
    active = false,
    onClick,
  }) => {
    return (
      <div
        className={`mobile-app-menu-item ${indent ? "indent" : ""} ${active ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onClick(path);
        }}
      >
        {icon && <div className="mobile-app-menu-icon">{icon}</div>}
        <span>{label}</span>
        <FiChevronRight className="mobile-app-arrow-icon" />
      </div>
    );
  };

  const Dropdown = ({ name, icon, label, children, isOpen, onToggle }) => {
    return (
      <div className={`mobile-app-dropdown ${isOpen ? "open" : ""}`}>
        <div
          className="mobile-app-menu-item"
          onClick={(e) => onToggle(name, e)}
        >
          <div className="mobile-app-menu-icon">{icon}</div>
          <span>{label}</span>
          <FiChevronRight
            className={`mobile-app-arrow-icon ${isOpen ? "rotate-90" : ""}`}
          />
        </div>
        <div
          className="mobile-app-dropdown-content"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`mobile-app-menu ${isOpen ? "open" : ""} ${darkMode ? "dark-mode" : ""}`}
    >
      <section className={`profile-section ${darkMode ? "dark-mode" : ""}`}>
        {/* ===== BACK BUTTON ===== */}
        <div
          className={`mobile-app-back-button ${darkMode ? "dark-mode" : ""}`}
          onClick={handleGoBack}
        >
          <FiArrowLeft className="back-icon" />
          {/* <span>Back</span> */}
        </div>

        <div className="profile-content-wrapper">
          <div className="profile-avatar">
            <img
              src="https://as1.ftcdn.net/v2/jpg/03/10/45/72/1000_F_310457273_U26ukZnb2joxc3itZFUwpiJDwCwc7ewR.jpg"
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <h3 className="mobile-app-profile-name">
              {userProfile?.name || "Person Name"}
            </h3>
            <p className="mobile-app-profile-email">
              {userProfile?.email || "person@example.com"}
            </p>
            <button
              className={`mobile-app-profile-view-btn ${darkMode ? "dark-mode" : ""}`}
              onClick={() => handleNavigation("/Maindashboard/myprofile")}
            >
              View Profile
              <FiChevronRight className="mobile-app-btn-icon" />
            </button>
          </div>
        </div>
      </section>

      <div className="profile-section-divider"></div>

      <div className="mobile-app-menu-scrollable">
        <div className="mobile-app-menu-grid">
          <div className="mobile-app-menu-group">
            <h3 className="mobile-app-group-title">MENU</h3>
            <MenuItem
              icon={<FiHome />}
              label="Home"
              path="/Maindashboard/home"
              active={isActive("/Maindashboard/home")}
              onClick={handleNavigation}
            />
            <MenuItem
              icon={<FiPieChart />}
              label="Analytics"
              path="/Maindashboard/analytics"
              active={isActive("/Maindashboard/analytics")}
              onClick={handleNavigation}
            />

            <MenuItem
              icon={<VscGitPullRequestCreate />}
              label="Create"
              path="/maindashboard/createfile"
              active={isActive("/maindashboard/createfile")}
              onClick={handleNavigation}
            />

            <Dropdown
              name="users"
              icon={<FiUsers />}
              label="Users"
              isOpen={openDropdown === "users"}
              onToggle={toggleDropdown}
            >
              <MenuItem
                icon={<FiTool />}
                label="Role Management"
                path="/Maindashboard/role-management"
                indent
                active={isActive("/Maindashboard/role-management")}
                onClick={handleNavigation}
              />
              <MenuItem
                icon={<FiUsers />}
                label="My Team"
                path="/Maindashboard/my-team"
                indent
                active={isActive("/Maindashboard/my-team")}
                onClick={handleNavigation}
              />
            </Dropdown>

            <Dropdown
              name="dev-tools"
              icon={<FiTool />}
              label="Dev Tools"
              isOpen={openDropdown === "dev-tools"}
              onToggle={toggleDropdown}
            >
              <MenuItem
                icon={<FiGlobe />}
                label="IP Whitelist"
                path="/Maindashboard/ip-whitelist"
                indent
                active={isActive("/Maindashboard/ip-whitelist")}
                onClick={handleNavigation}
              />
              <MenuItem
                icon={<FiGlobe />}
                label="Webhooks"
                path="/Maindashboard/webhooks"
                indent
                active={isActive("/Maindashboard/webhooks")}
                onClick={handleNavigation}
              />
              <MenuItem
                icon={<FiList />}
                label="Logs"
                path="/Maindashboard/logs"
                indent
                active={isActive("/Maindashboard/logs")}
                onClick={handleNavigation}
              />
              <MenuItem
                icon={<SiMonkeytie />}
                label="Api-Credential"
                path="/Maindashboard/api-credential"
                indent
                active={isActive("/Maindashboard/api-credential")}
                onClick={handleNavigation}
              />
            </Dropdown>

            <MenuItem
              icon={<FcApproval />}
              label="Kycstudio"
              path="/Maindashboard/kycstudio"
              active={isActive("/Maindashboard/kycstudio")}
              onClick={handleNavigation}
            />
          </div>

          <div className="mobile-app-menu-group">
            <h3 className="mobile-app-group-title">WALLET TRANSACTION</h3>
            <MenuItem
              icon={<FiDollarSign />}
              label="Transaction History"
              path="/Maindashboard/transactionhistory"
              active={isActive("/Maindashboard/transactionhistory")}
              onClick={handleNavigation}
            />
          </div>

          <div className="mobile-app-menu-group">
            <h3 className="mobile-app-group-title">DOCUMENTS</h3>
            <Dropdown
              name="documents"
              icon={<FiFileText />}
              label="Document"
              isOpen={openDropdown === "documents"}
              onToggle={toggleDropdown}
            >
              <MenuItem
                icon={<FiFilePlus />}
                label="Signed Agreement"
                path="/Maindashboard/signed-agreement"
                indent
                active={isActive("/Maindashboard/signed-agreement")}
                onClick={handleNavigation}
              />
            </Dropdown>
            <MenuItem
              icon={<FiLock />}
              label="Your KYC"
              path="/Maindashboard/yourkyc"
              active={isActive("/Maindashboard/yourkyc")}
              onClick={handleNavigation}
            />
            <MenuItem
              icon={<MdDrafts />}
              label="Email Box"
              path="/Maindashboard/email"
              active={isActive("/Maindashboard/email")}
              onClick={handleNavigation}
            />
            <MenuItem
              icon={<FiClipboard />}
              label="Completed"
              path="/Maindashboard/completed"
              active={isActive("/Maindashboard/completed")}
              onClick={handleNavigation}
            />
          </div>
        </div>

        <div className="mobile-app-menu-footer">
          <div
            className="mobile-app-footer-item"
            onClick={() => handleNavigation("/Maindashboard/setting")}
          >
            <FiSettings className="mobile-app-footer-icon" />
            <span>Settings</span>
          </div>
          <div
            className="mobile-app-footer-item logout"
            onClick={() => handleNavigation("/")}
          >
            <FiLogOut className="mobile-app-footer-icon" />
            <span>Log Out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
