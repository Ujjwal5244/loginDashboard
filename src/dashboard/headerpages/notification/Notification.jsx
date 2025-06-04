import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import axios from "axios";
import { decryptText, baseUrl } from "../../../encryptDecrypt";
import { toast } from "react-toastify";

const Notification = () => {
  // Token is read once when the component mounts.
  const token = localStorage.getItem("userToken"); 
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Memoize fetchNotifications as it's a dependency of useEffect
  const fetchNotifications = useCallback(async () => {
    if (!token) { // Check token existence early
      // console.log("fetchNotifications: No token found, aborting fetch.");
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // console.log("Starting fetch notifications with token:", token);
      const res = await axios.get(`${baseUrl}/api/notifications/`, {
        headers: { authorization: token },
      });
      
      // console.log("Raw API response:", res.data);
      
      const decryptedResponse = await decryptText(res.data.body);
      // console.log("Decrypted response:", decryptedResponse);
      
      const parsedResponse = JSON.parse(decryptedResponse);
      // console.log("Parsed response:", parsedResponse);
      
      // Assuming parsedResponse is like { notifications: [], unseenCount: 0 }
      const fetchedNotifications = parsedResponse.notifications || [];

      setNotifications(
        fetchedNotifications.map(notification => ({
          ...notification, // Keep all original fields
          isSeen: notification.isSeen === "1" ? "1" : "0", // Normalize just in case
        }))
      );
      
    } catch (error) {
      console.error("Error fetching notifications:", {
        message: error.message,
        response: error.response?.data,
        // stack: error.stack // Stack can be very verbose, log if needed for deep debugging
      });
      toast.error("Error fetching notifications");
      setNotifications([]); // Clear notifications on error
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Depends on the 'token' const. decryptText and baseUrl are stable.

  // Effect for initial data fetching
  useEffect(() => {
    // console.log("Component mounted or token value changed. Current token:", token);
    if (token) {
      fetchNotifications();
    } else {
      // No token, ensure UI reflects this (e.g., no loading, empty list)
      setNotifications([]);
      setLoading(false);
      // toast.info("Please log in to view notifications."); // Optional user feedback
    }
  }, [token, fetchNotifications]); // fetchNotifications is now memoized

  // Mark notification as seen
  const markAsSeen = async (notificationId) => {
    const currentToken = localStorage.getItem("userToken"); // Get fresh token for action
    if (!currentToken) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      const response = await axios.patch(
        // Using token in query param as per your original code.
        // Consider using headers: { authorization: currentToken } if backend supports it for PATCH
        `${baseUrl}/api/notifications/seen/${notificationId}?authorization=${currentToken}`
      );

      // This check `response.data.decrypted?.message` is specific.
      // It implies the PATCH response might also be encrypted or structured in a particular way.
      if (response.data.decrypted?.message === "Notification marked as seen ✅") {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification._id === notificationId 
              ? { ...notification, isSeen: "1" } 
              : notification
          )
        );
        // Optional: If the expanded email is the one marked read, you might want to keep it expanded
        // or handle UI changes. Current logic is fine.
      } else {
        console.warn("Mark as seen response not as expected or message mismatch:", response.data);
        toast.warn("Could not confirm notification read status from server response.");
      }
    } catch (error) {
      console.error("Failed to mark notification as seen:", error.response?.data || error.message);
      toast.error("Error marking notification as seen");
    }
  };

  const handleNotificationClick = (notificationId) => {
    const notification = notifications.find(n => n._id === notificationId);
    if (notification && notification.isSeen !== "1") {
      markAsSeen(notificationId);
    }
    // Toggle expand even if already seen or markAsSeen fails, for UI responsiveness
    setExpandedId(prevId => (prevId === notificationId ? null : notificationId));
  };

  const filteredNotifications = notifications.filter((notification) => {
    const searchLower = searchTerm.toLowerCase();
    // Ensure all fields exist before calling toLowerCase on them
    return (
      (notification.from?.name && notification.from.name.toLowerCase().includes(searchLower)) ||
      (notification.from?.email && notification.from.email.toLowerCase().includes(searchLower)) ||
      (notification.subject && notification.subject.toLowerCase().includes(searchLower)) ||
      (notification.body && notification.body.toLowerCase().includes(searchLower))
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

  // Removed toggleExpand as it's incorporated into handleNotificationClick or direct button
  // const toggleExpand = (id) => {
  //   setExpandedId(expandedId === id ? null : id);
  // };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <input
          type="text"
          placeholder="Search notifications..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="p-4 text-center text-gray-500">Loading notifications...</div>
      ) : (
        <div className="divide-y overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}> {/* Adjust maxHeight as needed */}
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => {
              const senderInitial = (notification.from?.name?.charAt(0) || 
                                   notification.from?.email?.charAt(0) || 
                                   "?").toUpperCase();
              
              const isExpanded = expandedId === notification._id;

              return (
                <div 
                  key={notification._id} 
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${notification.isSeen !== "1" ? 'bg-blue-50 font-medium' : 'bg-white'}`} // Emphasize unread
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3"> {/* items-start for avatar alignment */}
                      <div className="flex-shrink-0 h-8 w-8 mt-0.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        {senderInitial}
                      </div>
                      <div className="flex-1"> {/* Ensure text content can wrap */}
                        <h3 className={`text-sm ${notification.isSeen !== "1" ? 'text-gray-900 font-semibold' : 'text-gray-700 font-medium'}`}>
                          {notification.subject || "No Subject"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          From: {notification.from?.name || notification.from?.email || "System"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2"> {/* Prevent time from wrapping */}
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>

                  {/* Conditional rendering for expanded view based on isExpanded state */}
                  {isExpanded && (
                    <div className="mt-3 pl-11"> {/* Indent body */}
                      <p className="text-sm text-gray-700 whitespace-pre-wrap"> {/* Allow multi-line body */}
                        {notification.body || "No content."}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex justify-between items-center pl-11"> {/* Indent status/button */}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${notification.isSeen === "1" ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {notification.isSeen === "1" ? 'Read' : 'Unread'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking button
                        setExpandedId(prevId => (prevId === notification._id ? null : notification._id));
                      }}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-500">
              {notifications.length === 0 && !loading // Initial state with no token or empty fetch
                ? "No notifications available." 
                : "No notifications found matching your search." // Search yielded no results
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;