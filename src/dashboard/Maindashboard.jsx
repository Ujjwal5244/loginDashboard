import React, { useState, useEffect } from "react";
import Sidebar from "./maindashboard/sidebar/Sidebar";
import Header from "./maindashboard/header/Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Maindashboard.css";
import MobileMenu from "./sidebarpages/footer/mobilemenu/Mobilemenu";
import Footer from "./sidebarpages/footer/footerheader/Footer";

const Maindashboard = ({
  sidebarOpen,
  toggleSidebar,
  darkMode,
  toggleDarkMode,
}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      if (width < 700 && sidebarOpen) toggleSidebar();
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen, toggleSidebar]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isMobile = screenWidth < 700;

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex flex-1 overflow-hidden">
        {!mobileMenuOpen && (
          <div className={`sidebar-transition ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
            <Sidebar
              sidebarOpen={sidebarOpen}
              darkMode={darkMode}
              toggleSidebar={toggleSidebar}
              isMobile={isMobile}
            />
          </div>
        )}

        <main className={`main-content-of-dashboard ${!sidebarOpen && !isMobile ? "sidebar-closed" : ""}`}>
          <Outlet />
        </main>
      </div>

      {(mobileMenuOpen || location.pathname === "/Maindashboard/mobilemenu") && (
        <MobileMenu
          isOpen={true}
          onClose={() => {
            navigate(-1);
            setMobileMenuOpen(false);
          }}
          darkMode={darkMode}
        />
      )}

      {!mobileMenuOpen && location.pathname !== "/Maindashboard/mobilemenu" && screenWidth < 500 && (
        <Footer darkMode={darkMode} onMenuToggle={() => setMobileMenuOpen(true)} />
      )}
    </div>
  );
};

export default Maindashboard;