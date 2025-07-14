import React, { useState } from "react";
import "./Nifipaymentheader.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { TagIcon } from "@heroicons/react/20/solid";

const Nifipaymentheader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();
  const navItems = [
    "Product",
    "Why NifiPayment",
    "Solutions",
    "Nifi Hub",
    "Resources",
    "About Us",
    "Pricing",
  ];
  const message = "Limited Time: Save over 55% with code SUPERDEAL!";

  return (
    <div className="Nifipaymentheader-of-header-container">
      {/* Top accent bar with animation */}
      <div className="Nifipaymentheader-of-accent-bar"></div>

      {/* Main header content */}
      <nav className="Nifipaymentheader-of-main-nav">
        <div className="Nifipaymentheader-of-nav-content">
          {/* Left section: Menu Icon (mobile) + Logo */}
          <div className="Nifipaymentheader-of-left-section">
            {/* Mobile menu button */}
            <div className="Nifipaymentheader-of-mobile-menu-button">
              <button
                type="button"
                className="Nifipaymentheader-of-menu-toggle-button"
                aria-label="Open main menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {!isMenuOpen ? (
                  <svg
                    className="Nifipaymentheader-of-menu-icon"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="Nifipaymentheader-of-menu-icon"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Logo with hover effect */}
            <div className="Nifipaymentheader-of-logo-container">
              <div className="Nifipaymentheader-of-logo-wrapper">
                <span className="Nifipaymentheader-of-logo-text">
                  <span className="Nifipaymentheader-of-logo-first-part">
                    Nifi
                  </span>
                  <span className="Nifipaymentheader-of-logo-second-part text-orange-500">
                    Payment
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="Nifipaymentheader-of-desktop-nav">
            <div className="Nifipaymentheader-of-nav-items">
              {navItems.map((item) => (
                <div key={item} className="Nifipaymentheader-of-nav-item-group">
                  <a
                    href="#"
                    className={`Nifipaymentheader-of-nav-link ${
                      activeItem === item ? "active-nav-link" : ""
                    }`}
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

          {/* Action Buttons - Right side (Visible on all screen sizes) */}
          <div className="Nifipaymentheader-of-action-buttons">
            <button
              type="button"
              className="Nifipaymentheader-of-primary-button"
              onClick={() => navigate("/login")}
            >
              <span className="Nifipaymentheader-of-button-text">
                Book demo
              </span>
              <span className="Nifipaymentheader-of-button-hover-effect"></span>
            </button>

            <button
              type="button"
              className="Nifipaymentheader-of-secondary-button"
              onClick={() => navigate("/login")}
            >
              <span className="Nifipaymentheader-of-button-text">
                Sign in
              </span>
              <span className="Nifipaymentheader-of-button-hover-effect"></span>
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
          </div>
        </div>
      )}

      {/* Promotional banner */}
      <Link
        to="/offer"
        className="group w-full bg-teal-500 text-white flex items-center justify-center text-center p-2 md:text-sm xs:text-xs font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
      >
        <TagIcon className="h-5 w-5 mr-2 -ml-1 opacity-80 group-hover:scale-110 transition-transform" />
        <span>
          {message}
          <span className="ml-2 opacity-80 group-hover:opacity-100 group-hover:ml-3 transition-all">
            →
          </span>
        </span>
      </Link>
    </div>
  );
};

export default Nifipaymentheader;