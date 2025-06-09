import React, { useState } from 'react';
import './Nifipaymentheader.css'; // Assuming you have a CSS file for styles

const Nifipaymentheader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const navItems = [
    "Product",
    "Why NifiPayment",
    "Solutions",
    "Nifi Hub",
    "Resources",
    "About Us",
    "Pricing",
  ];

  return (
    <div className="Nifipaymentheader-of-header-container">
      {/* Top accent bar with animation */}
      <div className="Nifipaymentheader-of-accent-bar"></div>

      {/* Main header content */}
      <nav className="Nifipaymentheader-of-main-nav">
        <div className="Nifipaymentheader-of-nav-content">
          {/* Logo with hover effect */}
          <div className="Nifipaymentheader-of-logo-container">
            <div className="Nifipaymentheader-of-logo-wrapper">
              <span className="Nifipaymentheader-of-logo-text">
                <span className='Nifipaymentheader-of-logo-first-part'>Nifi</span>
                <span className="Nifipaymentheader-of-logo-second-part text-orange-500">Payment</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="Nifipaymentheader-of-desktop-nav">
            <div className="Nifipaymentheader-of-nav-items">
              {navItems.map((item) => (
                <div key={item} className="Nifipaymentheader-of-nav-item-group">
                  <a
                    href="#"
                    className={`Nifipaymentheader-of-nav-link ${activeItem === item ? 'active-nav-link' : ''}`}
                    onClick={() => setActiveItem(item)}
                  >
                    {item}
                    <span className="Nifipaymentheader-of-nav-link-underline-hover"></span>
                    {activeItem === item && (
                      <span className="Nifipaymentheader-of-nav-link-underline-active"></span>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons - Right side */}
          <div className="Nifipaymentheader-of-action-buttons">
            <button type="button" className="Nifipaymentheader-of-primary-button">
              <span className="Nifipaymentheader-of-button-text">Book demo</span>
              <span className="Nifipaymentheader-of-button-hover-effect"></span>
            </button>
            <button type="button" className="Nifipaymentheader-of-secondary-button">
              <span className="Nifipaymentheader-of-button-text">Sign in / Register</span>
              <span className="Nifipaymentheader-of-button-hover-effect"></span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="Nifipaymentheader-of-mobile-menu-button">
            <button
              type="button"
              className="Nifipaymentheader-of-menu-toggle-button"
              aria-label="Open main menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {!isMenuOpen ? (
                <svg className="Nifipaymentheader-of-menu-icon" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="Nifipaymentheader-of-menu-icon" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="Nifipaymentheader-of-mobile-menu">
          <div className="Nifipaymentheader-of-mobile-menu-content">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="Nifipaymentheader-of-mobile-nav-link"
                onClick={() => {
                  setActiveItem(item);
                  setIsMenuOpen(false);
                }}
              >
                {item}
              </a>
            ))}
            <div className="Nifipaymentheader-of-mobile-buttons-container">
              <button type="button" className="Nifipaymentheader-of-mobile-primary-button">
                Book demo
              </button>
              <button type="button" className="Nifipaymentheader-of-mobile-secondary-button">
                Sign in / Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nifipaymentheader;
