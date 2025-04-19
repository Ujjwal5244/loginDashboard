import React from 'react';
import Sidebar from './maindashboard/sidebar/Sidebar';
import Header from './maindashboard/header/Header';
import { Outlet } from 'react-router-dom';

const Maindashboard = ({ sidebarOpen, toggleSidebar, darkMode, toggleDarkMode }) => {
  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Header 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Container - Added dark mode class here */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-16'} $`}>
          <Sidebar sidebarOpen={sidebarOpen} darkMode={darkMode} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 mt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Maindashboard;