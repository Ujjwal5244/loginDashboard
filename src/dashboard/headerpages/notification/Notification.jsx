import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { decryptText, baseUrl } from "../../../encryptDecrypt";
import { toast } from "react-toastify";

const Notification = ({ darkMode }) => {
  const token = localStorage.getItem("userToken");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/notifications/`, {
        headers: { authorization: token },
      });

      const decryptedResponse = await decryptText(res.data.body);
      const parsedResponse = JSON.parse(decryptedResponse);
      const fetchedNotifications = parsedResponse.notifications || [];

      setNotifications(
        fetchedNotifications.map((notification) => ({
          ...notification,
          isSeen: notification.isSeen === "1" ? "1" : "0",
        }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error("Error fetching notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [token, fetchNotifications]);

  const markAsSeen = async (notificationId) => {
    const currentToken = localStorage.getItem("userToken");
    if (!currentToken) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      const response = await axios.patch(
        `${baseUrl}/api/notifications/seen/${notificationId}?authorization=${currentToken}`
      );

      if (
        response.data.decrypted?.message === "Notification marked as seen ✅"
      ) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isSeen: "1" }
              : notification
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to mark notification as seen:",
        error.response?.data || error.message
      );
      toast.error("Error marking notification as seen");
    }
  };

  const handleNotificationClick = (notificationId) => {
    const notification = notifications.find((n) => n._id === notificationId);
    if (notification && notification.isSeen !== "1") {
      markAsSeen(notificationId);
    }
    setExpandedId((prevId) =>
      prevId === notificationId ? null : notificationId
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (notification.from?.name &&
        notification.from.name.toLowerCase().includes(searchLower)) ||
      (notification.from?.email &&
        notification.from.email.toLowerCase().includes(searchLower)) ||
      (notification.subject &&
        notification.subject.toLowerCase().includes(searchLower)) ||
      (notification.body &&
        notification.body.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid date";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Dark mode color scheme
  const darkModeColors = {
    background: "bg-gray-900",
    cardBackground: "bg-gray-800",
    border: "border-gray-700",
    textPrimary: "text-gray-100",
    textSecondary: "text-gray-300",
    textTertiary: "text-gray-400",
    hoverBackground: "hover:bg-gray-700",
    inputBackground: "bg-gray-700",
    inputBorder: "border-gray-600",
    inputFocus: "focus:ring-purple-500",
    unreadBackground: "bg-blue-900",
    avatarBackground: "bg-purple-600",
    readBadge: "bg-green-900 text-green-300",
    unreadBadge: "bg-blue-800 text-blue-300",
    buttonText: "text-purple-400 hover:text-purple-300",
    divider: "divide-gray-700",
  };

  // Light mode color scheme
  const lightModeColors = {
    background: "bg-white",
    cardBackground: "bg-white",
    border: "border-gray-200",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-700",
    textTertiary: "text-gray-500",
    hoverBackground: "hover:bg-gray-50",
    inputBackground: "bg-white",
    inputBorder: "border-gray-300",
    inputFocus: "focus:ring-blue-500",
    unreadBackground: "bg-blue-50",
    avatarBackground: "bg-blue-500",
    readBadge: "bg-green-100 text-green-700",
    unreadBadge: "bg-blue-100 text-blue-700",
    buttonText: "text-blue-600 hover:text-blue-800",
    divider: "divide-gray-200",
  };

  const colors = darkMode ? darkModeColors : lightModeColors;

  return (
    <div
      className={`max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl ${colors.background}`}
    >
      <div
        className={`p-4 border-b sticky top-0 z-10 ${colors.cardBackground} ${colors.border}`}
      >
        <input
          type="text"
          placeholder="Search notifications..."
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${colors.inputFocus} ${colors.inputBackground} ${colors.inputBorder} ${colors.textPrimary} placeholder-${colors.textTertiary}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={`p-4 text-center ${colors.textTertiary}`}>
          Loading notifications...
        </div>
      ) : (
        <div
          className={`divide-y overflow-y-auto ${colors.divider}`}
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const senderInitial =
                notification.from?.name?.charAt(0) ||
                (notification.from?.email?.charAt(0) || "?").toUpperCase();

              const isExpanded = expandedId === notification._id;

              return (
                <div
                  key={notification._id}
                  className={`p-4 cursor-pointer transition-colors duration-150 ${notification.isSeen !== "1" ? colors.unreadBackground : colors.cardBackground} ${colors.hoverBackground}`}
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex-shrink-0 h-8 w-8 mt-0.5 rounded-full ${colors.avatarBackground} flex items-center justify-center text-white text-sm font-bold`}
                      >
                        {senderInitial}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-sm ${notification.isSeen !== "1" ? `${colors.textPrimary} font-semibold` : `${colors.textSecondary} font-medium`}`}
                        >
                          {notification.subject || "No Subject"}
                        </h3>
                        <p className={`text-xs ${colors.textTertiary}`}>
                          From:{" "}
                          {notification.from?.name ||
                            notification.from?.email ||
                            "System"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs ${colors.textTertiary} whitespace-nowrap ml-2`}
                    >
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pl-11">
                      <p
                        className={`text-sm ${colors.textSecondary} whitespace-pre-wrap`}
                      >
                        {notification.body || "No content."}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex justify-between items-center pl-11">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${notification.isSeen === "1" ? colors.readBadge : colors.unreadBadge}`}
                    >
                      {notification.isSeen === "1" ? "Read" : "Unread"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId((prevId) =>
                          prevId === notification._id ? null : notification._id
                        );
                      }}
                      className={`text-xs font-medium ${colors.buttonText}`}
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`p-6 text-center ${colors.textTertiary}`}>
              {notifications.length === 0 && !loading
                ? "No notifications available."
                : "No notifications found matching your search."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
