import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button className="theme-toggle" onClick={toggleDarkMode}>
{darkMode ? <FaSun size={26} color="white" /> : <FaMoon size={26} color="white" />}
    </button>
  );
};

export default ThemeToggle;
