import React from 'react';
import './Header.css'; 
import { FaBars, FaUserCircle } from 'react-icons/fa';
import ThemeToggle from '../ThemToggle';
import nifiLogo from '../../../assets/nifipayments.png'; 

const Header = ({  toggleSidebar, darkMode, toggleDarkMode }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars size='23'/>
        </button>
        <div className="nifi-logo">
          <img src={nifiLogo} alt='nifi-logo' />
        </div>
      </div>
      <div className="header-right">
        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="profile-dropdown">
          <button className="profile-btn">
            <FaUserCircle size={24} />
          </button>
          <div className="dropdown-content">
            <a href="#profile">My Profile</a>
            <a href="#logout">Logout</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;