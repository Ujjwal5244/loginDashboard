import React, { useState, useEffect } from "react";
import Sidebar from "./maindashboard/sidebar/Sidebar";
import Header from "./maindashboard/header/Header";
import { Outlet } from "react-router-dom";
import "./Maindashboard.css";
import Footer from "./maindashboard/footer/Footer";

const Maindashboard = ({
  sidebarOpen,
  toggleSidebar,
  darkMode,
  toggleDarkMode,
}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 700;
  const isTablet = screenWidth >= 740 && screenWidth <= 1000;

  return (
    <div
      className={`h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`sidebar-transition ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
        >
          <Sidebar sidebarOpen={sidebarOpen} darkMode={darkMode} />
        </div>

        {/* Main Content Area */}
        <main
          className={`main-content-of-dashboard ${
            !sidebarOpen && !isMobile ? "sidebar-closed" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Maindashboard;
