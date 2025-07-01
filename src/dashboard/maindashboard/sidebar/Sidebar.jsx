import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaChevronDown,
  FaChevronUp,
  FaUsersSlash,
  FaFileSignature,
  FaTimes,
} from "react-icons/fa";
import { GrDocumentUser,GrDocumentDownload } from "react-icons/gr";
import { LiaUserLockSolid } from "react-icons/lia";
import { FcApproval, FcCurrencyExchange } from "react-icons/fc";
import { SiGooglecampaignmanager360, SiEclipsemosquitto } from "react-icons/si";
import {
  MdAnalytics,
  MdDrafts,
  MdOutlineSettings,
  MdOutlineImportantDevices,
} from "react-icons/md";
import {
  GrInternetExplorer,
  GrDocumentText,
  GrCompliance,
} from "react-icons/gr";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { SiMonkeytie } from "react-icons/si";

const Sidebar = ({ sidebarOpen, darkMode, toggleSidebar, isMobile }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const sidebarRef = useRef(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Effect to close pop-out menu when clicking outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !sidebarOpen &&
        openDropdown &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, sidebarOpen]);

  // *** FIXED: Effect to manage active dropdown on route change ***
  useEffect(() => {
    let activeDropdown = null;

    // This effect should only auto-open a dropdown if the sidebar is expanded.
    // If collapsed, we want dropdowns to be closed by default.
    if (sidebarOpen) {
      menuSections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.type === "dropdown") {
            const hasActiveChild = item.items.some((subItem) =>
              isActive(subItem.path)
            );
            if (hasActiveChild) {
              activeDropdown = item.label;
            }
          }
        });
      });
    }
    
    // Set the open dropdown based on the logic above.
    // If the sidebar is collapsed, activeDropdown will remain null, correctly closing any dropdowns.
    // If the sidebar is expanded, it will open the dropdown with the active link.
    setOpenDropdown(activeDropdown);

  }, [location.pathname, sidebarOpen]);

  const isActive = (path) => {
    if (path === "/maindashboard/home") {
      return (
        location.pathname === "/maindashboard" ||
        location.pathname === "/maindashboard/" ||
        location.pathname === "/maindashboard/home"
      );
    }
    // Use startsWith for parent paths to correctly highlight active state
    return location.pathname.startsWith(path);
  };

  // Cleaned up menuSections array - removed redundant color props
  const menuSections = [
    {
      title: "MENU",
      items: [
        {
          path: "/maindashboard/home",
          icon: <FaHome size={20} />,
          label: "Home",
          active: isActive("/maindashboard/home"),
        },
        {
          path: "/maindashboard/analytics",
          icon: <MdAnalytics size={20} />,
          label: "Analytics",
          active: isActive("/maindashboard/analytics"),
        },
        {
          type: "dropdown",
          icon: <FaUsers size={20} />,
          label: "Users",
          items: [
            {
              path: "/maindashboard/role-management",
              icon: <SiGooglecampaignmanager360 size={18} />,
              label: "Role Management",
              active: isActive("/maindashboard/role-management"),
            },
            {
              path: "/maindashboard/my-team",
              icon: <FaUsersSlash size={18} />,
              label: "My Team",
              active: isActive("/maindashboard/my-team"),
            },
          ],
        },
        {
          type: "dropdown",
          icon: <MdOutlineImportantDevices size={20} />,
          label: "DevTool",
          items: [
            {
              path: "/maindashboard/ip-whitelist",
              icon: <SiEclipsemosquitto size={18} />,
              label: "IP Whitelist",
              active: isActive("/maindashboard/ip-whitelist"),
            },
            {
              path: "/maindashboard/webhooks",
              icon: <GrInternetExplorer size={18} />,
              label: "Webhooks",
              active: isActive("/maindashboard/webhooks"),
            },
            {
              path: "/maindashboard/logs",
              icon: <HiClipboardDocumentList size={18} />,
              label: "Logs",
              active: isActive("/maindashboard/logs"),
            },
            {
              path: "/maindashboard/api-credential",
              icon: <SiMonkeytie size={18} />,
              label: "Api-Credential",
              active: isActive("/maindashboard/api-credential"),
            },
          ],
        },
        {
          path: "/maindashboard/kycstudio",
          icon: <FcApproval size={23} />,
          label: "Kycstudio",
          active: isActive("/maindashboard/kycstudio"),
        },
      ],
    },
    {
      title: "WALLET TRANSACTION",
      items: [
        {
          path: "/maindashboard/transactionhistory",
          icon: <FcCurrencyExchange size={20} />,
          label: "Transaction History",
          active: isActive("/maindashboard/transactionhistory"),
        },
      ],
    },
    {
      title: "DOCUMENTS",
      items: [
        {
          type: "dropdown",
          icon: <GrDocumentText size={20} />,
          label: "Document",
          items: [
            {
              path: "/maindashboard/signed-agreement",
              icon: <FaFileSignature size={18} />,
              label: "Signed Agreement",
              active: isActive("/maindashboard/signed-agreement"),
            },
            {
              path: "/maindashboard/draft-document",
              icon: <GrDocumentUser size={18} />,
              label: "Draft Document",
              active: isActive("/maindashboard/draft-document"),
            },
            {
              path: "/maindashboard/complete-document",
              icon: <GrDocumentDownload size={18} />,
              label: "Complete Document",
              active: isActive("/maindashboard/complete-document"),
            },
          ],
        },
        {
          path: "/maindashboard/yourkyc",
          icon: <LiaUserLockSolid size={20} />,
          label: "Your Kyc",
          active: isActive("/maindashboard/yourkyc"),
        },
        {
          path: "/maindashboard/Email",
          icon: <MdDrafts size={20} />,
          label: "Email Box",
          active: isActive("/maindashboard/Email"),
        },
      ],
    },
    {
      title: "SETTINGS",
      items: [
        {
          path: "/maindashboard/setting",
          icon: <MdOutlineSettings size={20} />,
          label: "Settings",
          active: isActive("/maindashboard/setting"),
        },
      ],
    },
  ];

  return (
    <>
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      <div
        ref={sidebarRef}
        className={`sidebar ${sidebarOpen ? "" : "collapsed"} ${darkMode ? "dark" : ""} ${isMobile ? "mobile" : ""}`}
      >
        {isMobile && (
          <div className="mobile-sidebar-header">
            <button className="mobile-close-btn" onClick={toggleSidebar}>
              <FaTimes size={24} />
            </button>
          </div>
        )}

        <div className="sidebar-content">
          {menuSections.map((section, index) => (
            <nav key={index} className="sidebar-section">
              {sidebarOpen && (
                <h2 className="section-title">{section.title}</h2>
              )}
              <ul className="menu-list">
                {section.items.map((item, itemIndex) => {
                  if (item.type === "dropdown") {
                    const isDropdownOpen = openDropdown === item.label;
                    return (
                      <li
                        key={itemIndex}
                        className={`menu-item ${isDropdownOpen ? "open" : ""}`}
                      >
                        <div
                          className="menu-link dropdown-header"
                          onClick={() => toggleDropdown(item.label)}
                          data-tooltip={!sidebarOpen ? item.label : undefined}
                        >
                          <span className="icon-wrapper">{item.icon}</span>
                          {sidebarOpen && (
                            <>
                              <span className="menu-label">{item.label}</span>
                              <span className="dropdown-arrow">
                                {isDropdownOpen ? (
                                  <FaChevronUp size={14} />
                                ) : (
                                  <FaChevronDown size={14} />
                                )}
                              </span>
                            </>
                          )}
                        </div>
                        {isDropdownOpen && (
                          <ul className="dropdown-menu">
                            {item.items.map((subItem, subIndex) => (
                              <li
                                key={subIndex}
                                className={`submenu-item ${subItem.active ? "active" : ""}`}
                              >
                                <Link
                                  to={subItem.path}
                                  className="submenu-link"
                                  onClick={() => {
                                    setOpenDropdown(null);
                                    if (isMobile) toggleSidebar();
                                  }}
                                >
                                  <span className="submenu-icon">
                                    {subItem.icon}
                                  </span>
                                  <span className="dropdown-inside-menu-items">
                                    {subItem.label}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }
                  return (
                    <li
                      key={itemIndex}
                      className={`menu-item ${item.active ? "active" : ""}`}
                    >
                      <Link
                        to={item.path}
                        className="menu-link"
                        data-tooltip={!sidebarOpen ? item.label : undefined}
                        onClick={isMobile ? toggleSidebar : undefined}
                      >
                        <span className="icon-wrapper">{item.icon}</span>
                        {sidebarOpen && (
                          <span className="menu-label">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;