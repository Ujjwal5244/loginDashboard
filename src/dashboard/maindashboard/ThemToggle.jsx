import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button className="theme-toggle" onClick={toggleDarkMode}>
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;
