import React from "react";
import Notification from "./Notification";
import { FaFacebookMessenger } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificationSidebar = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 w-[350px] h-full bg-white shadow-xl z-[2000] transform transition-all duration-300 ease-in-out flex flex-col">
        {/* Fixed Header */}
        <div className="p-4 bg-[#326bae] flex justify-between items-center border-b border-gray-200 h-[64px]">
          <h2 className="text-lg font-semibold text-white flex gap-2 items-center justify-center p-1">
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
          <div className="h-full overflow-y-auto p-3 bg-gray-100">
            <Notification />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-5 bg-white text-center border-t border-gray-700 h-[80px] flex items-center justify-center">
          <button
            className="p-3 bg-[#326bae] text-white rounded-md hover:bg-[#1b4b8e] transition-colors duration-300"
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
