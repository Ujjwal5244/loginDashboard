import React from 'react'
import Sidebar from './maindashboard/sidebar/Sidebar'
import Header from './maindashboard/header/Header'

const Maindashboard = ({ sidebarOpen, toggleSidebar, darkMode, toggleDarkMode }) => {
  return (
    <div>
      <Header 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      <Sidebar sidebarOpen={sidebarOpen} />
    </div>
  )
}

export default Maindashboard