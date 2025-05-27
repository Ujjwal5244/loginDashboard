import React, { useState, useEffect } from "react";
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
import { LiaUserLockSolid } from "react-icons/lia";
import { FcApproval, FcCurrencyExchange } from "react-icons/fc";
import { SiGooglecampaignmanager360, SiEclipsemosquitto } from "react-icons/si";
import { MdAnalytics, MdDrafts, MdOutlineSettings, MdOutlineImportantDevices } from "react-icons/md";
import { GrInternetExplorer, GrDocumentText, GrCompliance } from "react-icons/gr";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { SiMonkeytie } from "react-icons/si";


const Sidebar = ({ sidebarOpen, darkMode, toggleSidebar, isMobile }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    menuSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.type === "dropdown") {
          const hasActiveChild = item.items.some(
            (subItem) => isActive(subItem.path)
          );
          if (hasActiveChild) {
            setOpenDropdown(item.label);
          }
        }
      });
    });
  }, [location.pathname]);

  const isActive = (path) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`) ||
      (path === "/maindashboard/home" && 
       (location.pathname === "/maindashboard" || 
        location.pathname === "/maindashboard/"))
    );
  };

  const getIconColor = (iconComponent, active = false) => {
    if (active) return "#ffffff";
    if (!sidebarOpen) return "#ffffff"; // Always white in collapsed state
    if (darkMode) {
      if ([FcApproval, FcCurrencyExchange].includes(iconComponent.type)) 
        return "#63b3ed";
      return "#a0aec0";
    }
    if ([FcApproval, FcCurrencyExchange].includes(iconComponent.type)) 
      return "";
    return "white";
  };

  const menuSections = [
    {
      title: "MENU",
      items: [
        {
          path: "/maindashboard/home",
          icon: <FaHome size={20} color={getIconColor(FaHome, isActive("/maindashboard/home"))} />,
          label: "Home",
          active: isActive("/maindashboard/home")
        },
        {
          path: "/maindashboard/analytics",
          icon: <MdAnalytics size={20} color={getIconColor(MdAnalytics, isActive("/maindashboard/analytics"))} />,
          label: "Analytics",
          active: isActive("/maindashboard/analytics")
        },
        {
          type: "dropdown",
          icon: <FaUsers size={20} color={getIconColor(FaUsers, false)} />,
          label: "Users",
          items: [
            {
              path: "/maindashboard/role-management",
              icon: <SiGooglecampaignmanager360 size={18} color={getIconColor(SiGooglecampaignmanager360, isActive("/maindashboard/role-management"))} />,
              label: "Role Management",
              active: isActive("/maindashboard/role-management")
            },
            {
              path: "/maindashboard/my-team",
              icon: <FaUsersSlash size={18} color={getIconColor(FaUsersSlash, isActive("/maindashboard/my-team"))} />,
              label: "My Team",
              active: isActive("/maindashboard/my-team")
            }
          ]
        },
        {
          type: "dropdown",
          icon: <MdOutlineImportantDevices size={20} color={getIconColor(MdOutlineImportantDevices, false)} />,
          label: "DevTool",
          items: [
            {
              path: "/maindashboard/ip-whitelist",
              icon: <SiEclipsemosquitto size={18} color={getIconColor(SiEclipsemosquitto, isActive("/maindashboard/ip-whitelist"))} />,
              label: "IP Whitelist",
              active: isActive("/maindashboard/ip-whitelist")
            },
            {
              path: "/maindashboard/webhooks",
              icon: <GrInternetExplorer size={18} color={getIconColor(GrInternetExplorer, isActive("/maindashboard/webhooks"))} />,
              label: "Webhooks",
              active: isActive("/maindashboard/webhooks")
            },
            {
              path: "/maindashboard/logs",
              icon: <HiClipboardDocumentList size={18} color={getIconColor(HiClipboardDocumentList, isActive("/maindashboard/logs"))} />,
              label: "Logs",
              active: isActive("/maindashboard/logs")
            },
            {
              path: "/maindashboard/api-credential",
              icon: <SiMonkeytie size={18} color={getIconColor(HiClipboardDocumentList, isActive("/maindashboard/api-credential"))} />,
              label: "Api-Credential",
              active: isActive("/maindashboard/api-credential")
            }
          ]
        },
         {
      path: "/maindashboard/kycstudio",
      icon: <FcApproval size={23} color={getIconColor(FcApproval, isActive("/maindashboard/kycstudio"))} />,
      label: "Kycstudio",
      active: isActive("/maindashboard/kycstudio")
    }
  ]
},
    {
      title: "WALLET TRANSACTION",
      items: [
        {
          path: "/maindashboard/transactionhistory",
          icon: <FcCurrencyExchange size={20} color={getIconColor(FcCurrencyExchange, isActive("/maindashboard/transactionhistory"))} />,
          label: "Transaction History",
          active: isActive("/maindashboard/transactionhistory")
        }
      ]
    },
    {
      title: "DOCUMENTS",
      items: [
        {
          type: "dropdown",
          icon: <GrDocumentText size={20} color={getIconColor(GrDocumentText, false)} />,
          label: "Document",
          items: [
            {
              path: "/maindashboard/signed-agreement",
              icon: <FaFileSignature size={18} color={getIconColor(FaFileSignature, isActive("/maindashboard/signed-agreement"))} />,
              label: "Signed Agreement",
              active: isActive("/maindashboard/signed-agreement")
            }
          ]
        },
        {
          path: "/maindashboard/yourkyc",
          icon: <LiaUserLockSolid size={20} color={getIconColor(LiaUserLockSolid, isActive("/maindashboard/yourkyc"))} />,
          label: "Your Kyc",
          active: isActive("/maindashboard/yourkyc")
        },
        {
          path: "/maindashboard/Email",
          icon: <MdDrafts size={20} color={getIconColor(MdDrafts, isActive("/maindashboard/Email"))} />,
          label: "Email Box",
          active: isActive("/maindashboard/Email")
        },
        {
          path: "/maindashboard/completed",
          icon: <GrCompliance size={20} color={getIconColor(GrCompliance, isActive("/maindashboard/completed"))} />,
          label: "Completed",
          active: isActive("/maindashboard/completed")
        }
      ]
    },
    {
      title: "SETTINGS",
      items: [
        {
          path: "/maindashboard/setting",
          icon: <MdOutlineSettings size={20} color={getIconColor(MdOutlineSettings, isActive("/maindashboard/setting"))} />,
          label: "Settings",
          active: isActive("/maindashboard/setting")
        }
      ]
    }
  ];

  const showFullSidebar = sidebarOpen || isHovered;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}
      
      <div 
        className={`sidebar ${sidebarOpen ? "" : "collapsed"} ${darkMode ? "dark" : ""} ${isMobile ? "mobile" : ""}`}
        onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
        onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
      >
        {/* Mobile header */}
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
              {showFullSidebar && <h2 className="section-title">{section.title}</h2>}
              <ul className="menu-list">
                {section.items.map((item, itemIndex) => {
                  if (item.type === "dropdown") {
                    return (
                      <li
                        key={itemIndex}
                        className={`menu-item ${openDropdown === item.label ? "open" : ""}`}
                      >
                        <div
                          className="menu-link dropdown-header"
                          onClick={() => toggleDropdown(item.label)}
                          data-tooltip={!showFullSidebar ? item.label : undefined}
                        >
                          <span className="icon-wrapper">{item.icon}</span>
                          {showFullSidebar && (
                            <>
                              <span className="menu-label">{item.label}</span>
                              <span className="dropdown-arrow">
                                {openDropdown === item.label ? (
                                  <FaChevronUp size={14} />
                                ) : (
                                  <FaChevronDown size={14} />
                                )}
                              </span>
                            </>
                          )}
                        </div>
                        {(showFullSidebar && openDropdown === item.label) && (
                          <ul className="dropdown-menu">
                            {item.items.map((subItem, subIndex) => (
                              <li
                                key={subIndex}
                                className={`submenu-item ${subItem.active ? "active" : ""}`}
                              >
                                <Link
                                  to={subItem.path}
                                  className="submenu-link"
                                  onClick={isMobile ? toggleSidebar : undefined}
                                >
                                  <span className="submenu-icon">{subItem.icon}</span>
                                  <span className='dropdown-inside-menu-items'>{subItem.label}</span>
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
                        data-tooltip={!showFullSidebar ? item.label : undefined}
                        onClick={isMobile ? toggleSidebar : undefined}
                      >
                        <span className="icon-wrapper">{item.icon}</span>
                        {showFullSidebar && <span className="menu-label">{item.label}</span>}
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