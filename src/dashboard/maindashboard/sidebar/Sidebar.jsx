import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaChevronDown,
  FaChevronUp,
  FaUsersSlash,
  FaRegUser,
} from "react-icons/fa";
import { FcComboChart, FcApproval, FcDoNotMix,FcCurrencyExchange } from "react-icons/fc";
import { SiGooglecampaignmanager360, SiEclipsemosquitto } from "react-icons/si";
import { GrInternetExplorer } from "react-icons/gr";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { VscVerified } from "react-icons/vsc";


const Sidebar = ({ sidebarOpen }) => {
  // State to manage the open/close state of the dropdowns
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [devToolDropdownOpen, setDevToolDropdownOpen] = useState(false);
  const [kycDropdownOpen, setKycDropdownOpen] = useState(false);

  const toggleUsersDropdown = () => {
    setUsersDropdownOpen(!usersDropdownOpen);
    setDevToolDropdownOpen(false); // Close DevTool when opening Users
  };

  const toggleDevToolDropdown = () => {
    setDevToolDropdownOpen(!devToolDropdownOpen);
    setUsersDropdownOpen(false); // Close Users when opening DevTool
  };
  const toggleKycDropdown = () => {
    setKycDropdownOpen(!kycDropdownOpen);
    setUsersDropdownOpen(false);
    setDevToolDropdownOpen(false);
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
      <div className="sidebar-all-items-inside-this">
        <nav>
          <div className="sidebar-menu-title">
            <h2 className="sidebar-menu-h2">MENU</h2>
          </div>
          <ul className="menu-ul">
            <li>
              <Link to="/home">
                <FaHome size={24} style={{ color: "royalblue" }} />
                {sidebarOpen && <span className="menu-Home">Home</span>}
              </Link>
            </li>
            <li>
              <Link to="/analytics">
                <FcComboChart size={24} className="icon" />
                {sidebarOpen && <span className="menu-span">Analytics</span>}
              </Link>
            </li>

            {/* Users dropdown menu item */}
            <li
              className={`dropdown-container ${usersDropdownOpen ? "open" : ""}`}
            >
              <div className="dropdown-header-wrapper">
                <div className="dropdown-header" onClick={toggleUsersDropdown}>
                  <FaUsers size={24} style={{ color: "royalblue" }} />
                  {sidebarOpen && (
                    <>
                      <span className="menu-span">Users</span>
                      {usersDropdownOpen ? (
                        <FaChevronUp size={14} />
                      ) : (
                        <FaChevronDown size={14} />
                      )}
                    </>
                  )}
                </div>

                {sidebarOpen && usersDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/role-management" className="dropdown-item">
                        <SiGooglecampaignmanager360
                          size={18}
                          className="dropdown-icon"
                        />
                        <span>Role Management</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-team" className="dropdown-item">
                        <FaUsersSlash size={18} className="dropdown-icon" />
                        <span>My Team</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* DevTool dropdown menu item */}
            <li
              className={`dropdown-container ${devToolDropdownOpen ? "open" : ""}`}
            >
              <div className="dropdown-header-wrapper">
                <div
                  className="dropdown-header"
                  onClick={toggleDevToolDropdown}
                >
                  <FcDoNotMix size={24} style={{ color: "royalblue" }} />
                  {sidebarOpen && (
                    <>
                      <span className="menu-span">DevTool</span>
                      {devToolDropdownOpen ? (
                        <FaChevronUp size={14} />
                      ) : (
                        <FaChevronDown size={14} />
                      )}
                    </>
                  )}
                </div>

                {sidebarOpen && devToolDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/ip-whitelist" className="dropdown-item">
                        <SiEclipsemosquitto
                          size={18}
                          className="dropdown-icon"
                        />
                        <span>IP Whitelist</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/webhooks" className="dropdown-item">
                        <GrInternetExplorer
                          size={18}
                          className="dropdown-icon"
                        />
                        <span>Webhooks</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/logs" className="dropdown-item">
                        <HiClipboardDocumentList
                          size={18}
                          className="dropdown-icon"
                        />
                        <span>Logs</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            {/* Kyc Studio dropdown menu item */}
            <li
              className={`dropdown-container ${kycDropdownOpen ? "open" : ""}`}
            >
              <div className="dropdown-header-wrapper">
                <div className="dropdown-header" onClick={toggleKycDropdown}>
                  <FcApproval size={24} style={{ color: "royalblue" }} />
                  {sidebarOpen && (
                    <>
                      <span className="menu-span">Kyc Studio</span>
                      {kycDropdownOpen ? (
                        <FaChevronUp size={14} />
                      ) : (
                        <FaChevronDown size={14} />
                      )}
                    </>
                  )}
                </div>

                {sidebarOpen && kycDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/Allverification" className="dropdown-item">
                        <VscVerified size={18} className="dropdown-icon" />
                        <span>All Verification</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/KycTemplates" className="dropdown-item">
                        <FaRegUser size={18} className="dropdown-icon" />
                        <span>Kyc Templates</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          </ul>
        </nav>
          {/* end of Kyc Studio dropdown menu item */}

        {/* wallet transaction nav list */}
        <div className="sidebar-all-items-inside-this">
          <nav>
            <div className="sidebar-wallet-title">
            <h2 className="sidebar-wallet-h2">WALLET TRANSACTION</h2>
            </div>
            <ul className="transaction-ul">
            <li className='transaction-li'>
                      <Link to="/TransactionHistory" className="dropdown-item">
                        <FcCurrencyExchange size={28} className="dropdown-icon" />
                        <span className='transaction-span'>Transaction History</span>
                      </Link>
              </li>
           </ul>
          </nav>
        </div>
            {/* end of wallet transaction nav list */}

      </div>
    </div>
  );
};

export default Sidebar;
