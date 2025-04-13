import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './login/Login'
import Signup from './signup/Signup'
import Maindashboard from './dashboard/Maindashboard'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Optional: Add dark mode class to body
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/Maindashboard" 
            element={
              <Maindashboard 
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App