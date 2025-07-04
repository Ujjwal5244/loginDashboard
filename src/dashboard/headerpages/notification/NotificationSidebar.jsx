import React from "react";
import Notification from "./Notification";
import { FaFacebookMessenger } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificationSidebar = ({ onClose, darkMode }) => {
  const navigate = useNavigate();

  // Calculate width based on screen size
  const getSidebarWidth = () => {
    const screenWidth = window.innerWidth;
    
    if (screenWidth >= 768) {
      return "350px"; // Default width for larger screens
    } else if (screenWidth >= 760) {
      return `${screenWidth * 1}px`; // 90% of screen width for medium screens
    } else {
      return `${screenWidth}px`; // Full width for small screens
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 ${
          darkMode ? "bg-gray-900" : "bg-gray-600"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full shadow-xl z-[2000] transform transition-all duration-300 ease-in-out flex flex-col ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
        style={{ width: getSidebarWidth() }}
      >
        {/* Fixed Header */}
        <div
          className={`p-4 flex justify-between items-center border-b h-[64px] ${
            darkMode ? "bg-gray-900 border-gray-700" : "bg-[#326bae] border-gray-200"
          }`}
        >
          <h2 
      className={`text-lg font-semibold flex gap-2 items-center justify-center p-1 ${
        darkMode ? "text-[#ff4500]" : "text-white"
      }`}
    >
      <FaFacebookMessenger />
      Notifications
    </h2>
          <button
            className="text-white hover:text-gray-200 transition-colors"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          <div
            className={`h-full overflow-y-auto p-3 ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <Notification darkMode={darkMode} />
          </div>
        </div>

        {/* Fixed Footer */}
        <div
          className={`p-5 text-center border-t h-[80px] flex items-center justify-center ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}
        >
          <button
            className={`p-3 rounded-md ] transition-colors duration-300 ${
              darkMode ? "bg-[#ff4500] text-white" : "bg-[#326bae] text-white"
            }`}
            onClick={() => {
              navigate("/maindashboard/Email");
              onClose();
            }}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;