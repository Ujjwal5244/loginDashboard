import React, { useState, useEffect, useCallback } from "react";
import {
  FaInbox,
  FaTrash,
  FaEnvelope,
  FaSyncAlt,
  FaStar,
  FaPaperclip,
  FaSearch,
  FaEllipsisV,
  FaChevronDown,
  FaArrowLeft, // Added for back button
} from "react-icons/fa";
import axios from "axios";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { decryptText, baseUrl } from "../../../../encryptDecrypt";
import { toast } from "react-toastify";

const EmailDashboard = ({ darkMode }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State for mobile sidebar
  const token = localStorage.getItem("userToken");

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/user/profile`, {
        headers: { authorization: token },
      });
      const decrypted = await decryptText(res.data.body);
      const parsed = JSON.parse(decrypted);
      if (parsed.status === "success") {
        setUserProfile({
          name: parsed.data.name,
          email: parsed.data.email,
          profile: parsed.data.profile,
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [token]);

  // Fetch emails
  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/notifications/`, {
        headers: { authorization: token },
      });
      const decryptedResponse = await decryptText(res.data.body);
      const parsedResponse = JSON.parse(decryptedResponse);
      const notifications = Array.isArray(parsedResponse)
        ? parsedResponse
        : parsedResponse.notifications || [];

      const formattedEmails = notifications.map((notification) => ({
        _id: notification._id,
        sender:
          notification.from?.name || notification.from?.email || "Unknown",
        subject: notification.subject || "No Subject",
        preview:
          notification.body?.slice(0, 50) +
            (notification.body?.length > 50 ? "..." : "") || "",
        fullBody: notification.body || "",
        time: new Date(notification.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          month: "short",
          day: "numeric",
        }),
        read: notification.isSeen === "1",
        starred: false,
        hasAttachment: false,
      }));

      setEmails(formattedEmails);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
      toast.error("Error fetching emails");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Mark email as seen
  const markAsSeen = async (notificationId) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/notifications/seen/${notificationId}?authorization=${token}`
      );

      if (
        response.data.decrypted?.message === "Notification marked as seen ✅"
      ) {
        setEmails((prevEmails) =>
          prevEmails.map((email) =>
            email._id === notificationId ? { ...email, read: true } : email
          )
        );
        if (selectedEmail && selectedEmail._id === notificationId) {
          setSelectedEmail((prev) => ({ ...prev, read: true }));
        }
      }
    } catch (error) {
      console.error("Failed to mark notification as seen:", error);
      toast.error("Error marking notification as seen");
    }
  };

  // Handle email click
  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    if (!email.read) {
      markAsSeen(email._id);
    }
  };

  // On mount
  useEffect(() => {
    fetchEmails();
    fetchUserProfile();
  }, [fetchEmails, fetchUserProfile]);

  // Filter emails
  const filteredEmails = emails.filter((email) => {
    const term = searchTerm.toLowerCase();
    return (
      (activeFolder === "inbox" || activeFolder === "trash") &&
      (email.subject.toLowerCase().includes(term) ||
        email.sender.toLowerCase().includes(term) ||
        email.preview.toLowerCase().includes(term))
    );
  });

  return (
    <div
      className={`${darkMode ? "bg-[#111827] text-gray-200" : "bg-gray-50 text-gray-800"} font-sans flex h-screen max-h-screen overflow-hidden relative`}
    >
      {/* Overlay for mobile sidebar */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={() => setIsSidebarVisible(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 shadow-lg flex flex-col border-r ${darkMode ? "border-gray-700 bg-[#111827]" : "border-gray-100 bg-white"} absolute lg:relative inset-y-0 left-0 transform ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
      >
        <div
          className={`p-3 text-xl font-semibold ${darkMode ? "text-[#ff9800]" : "text-[#2c5aa0]"} flex items-center gap-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <FaEnvelope
            className={`${darkMode ? "text-[#ff9800]" : "text-[#2c5aa0]"} text-2xl`}
          />
          <span className="font-bold">NeraSoft Mail</span>
        </div>

        <nav className="mt-8 flex-1">
          <ul className="space-y-1 px-3">
            <li
              className={`px-3 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                activeFolder === "inbox"
                  ? darkMode
                    ? "bg-[#ff9800]/10 text-[#ff9800] font-medium shadow-inner"
                    : "bg-[#2c5aa0]/10 text-[#2c5aa0] font-medium shadow-inner"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => {
                setActiveFolder("inbox");
                setIsSidebarVisible(false);
              }}
            >
              <FaInbox
                className={darkMode ? "text-[#ff9800]" : "text-[#2c5aa0]"}
              />
              <span>Inbox</span>
              <span
                className={`ml-auto ${darkMode ? "bg-[#ff9800]" : "bg-[#2c5aa0]"} text-white text-xs px-2 py-1 rounded-full`}
              >
                {filteredEmails.length}
              </span>
            </li>
            <li
              className={`px-3 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                activeFolder === "trash"
                  ? darkMode
                    ? "bg-[#ff9800]/10 text-[#ff9800] font-medium shadow-inner"
                    : "bg-[#2c5aa0]/10 text-[#2c5aa0] font-medium shadow-inner"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => {
                setActiveFolder("trash");
                setIsSidebarVisible(false);
              }}
            >
              <FaTrash
                className={darkMode ? "text-[#ff9800]" : "text-[#2c5aa0]"}
              />
              <span>Trash</span>
            </li>
          </ul>
        </nav>

        <div
          className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-300"} mt-auto`}
        >
          {/* User Profile... (no changes here) */}
          <div className="flex items-center gap-3">
            {userProfile ? (
              <>
                <img
                  src={userProfile.profile}
                  alt={userProfile.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="text-sm">
                  <div
                    className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {userProfile.name}
                  </div>
                  <div
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {userProfile.email}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`w-9 h-9 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
                />
                <div className="text-sm">
                  <div
                    className={`font-medium ${darkMode ? "bg-gray-700" : "bg-gray-100"} h-4 w-24 mb-1 rounded animate-pulse`}
                  ></div>
                  <div
                    className={`text-xs ${darkMode ? "bg-gray-700" : "bg-gray-100"} h-3 w-32 rounded animate-pulse`}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Inbox List */}
      <section
        className={`w-full lg:w-80 border-r ${darkMode ? "border-gray-700 bg-[#111827]" : "border-gray-100 bg-white"} flex flex-col ${selectedEmail ? "hidden md:flex" : "flex"}`}
      >
        <div
          className={`flex items-center justify-between mt-[-5px] md:px-5 xs:px-2.5 md:py-4 xs:py-0 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 text-gray-500"
              onClick={() => setIsSidebarVisible(true)}
            >
              <BsFillMenuButtonWideFill size={15} />
            </button>
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold ${darkMode ? "text-[#ff9800]" : "text-[#2c5aa0]"}`}
              >
                Inbox
              </span>
              <FaChevronDown
                size={12}
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} hidden sm:inline`}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`p-1 ${darkMode ? "text-gray-400 hover:text-[#ff9800]" : "text-gray-500 hover:text-[#2c5aa0]"}`}
              onClick={fetchEmails}
            >
              <FaSyncAlt size={14} />
            </button>
            <button
              className={`p-1
                ${
                  darkMode
                    ? "text-gray-400 hover:text-[#ff9800]"
                    : "text-gray-500 hover:text-[#2c5aa0]"
                }`}
            >
              <FaEllipsisV size={14} />
            </button>
          </div>
        </div>

        <div
          className={`border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}
        >
          {/* Search bar... (no changes here) */}
          <div
            className={`flex items-center px-4 py-3 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <div className="flex-1 relative">
              <FaSearch
                className={`absolute left-3 top-3 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
              />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-sm border ${darkMode ? "border-gray-700 bg-gray-800 text-gray-200 focus:ring-[#ff9800]/50 focus:border-[#ff9800]/50" : "border-gray-200 bg-white text-gray-800 focus:ring-[#2c5aa0]/50 focus:border-[#2c5aa0]/50"} rounded-lg focus:outline-none focus:ring-2`}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Email list mapping... (no changes here) */}
          {loading ? (
            <div
              className={`p-4 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Loading emails...
            </div>
          ) : filteredEmails.length === 0 ? (
            <div
              className={`p-4 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              No emails found in {activeFolder}
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email._id}
                className={`border-b ${darkMode ? "border-gray-700" : "border-gray-100"} px-4 py-3 cursor-pointer transition-colors ${
                  !email.read
                    ? darkMode
                      ? "bg-[#ff9800]/10 font-semibold"
                      : "bg-[#2c5aa0]/5 font-semibold"
                    : darkMode
                      ? "bg-[#111827] hover:bg-gray-800"
                      : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => handleEmailClick(email)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <button
                      className={
                        darkMode
                          ? "text-gray-500 hover:text-[#ff9800]"
                          : "text-gray-300 hover:text-yellow-400"
                      }
                    >
                      <FaStar
                        className={
                          email.starred
                            ? darkMode
                              ? "text-[#ff9800] fill-[#ff9800]"
                              : "text-yellow-400 fill-yellow-400"
                            : ""
                        }
                      />
                    </button>
                    <span
                      className={
                        !email.read
                          ? darkMode
                            ? "text-[#ff9800]"
                            : "text-[#2c5aa0]"
                          : darkMode
                            ? "text-gray-200"
                            : "text-gray-700"
                      }
                    >
                      {email.sender}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {email.time}
                  </span>
                </div>
                <div className="pl-7">
                  <div
                    className={`text-sm ${
                      !email.read
                        ? darkMode
                          ? "text-gray-200"
                          : "text-gray-800"
                        : darkMode
                          ? "text-gray-400"
                          : "text-gray-600"
                    }`}
                  >
                    {email.subject}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p
                      className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"} truncate w-48`}
                    >
                      {email.preview}
                    </p>
                    {email.hasAttachment && (
                      <FaPaperclip
                        className={`${darkMode ? "text-gray-500" : "text-gray-400"} text-xs`}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Email Detail View */}
      <main
        className={`flex-1 flex-col ${darkMode ? "bg-[#111827] border-l border-gray-700" : "bg-white border-l border-gray-100"} ${selectedEmail ? "flex" : "hidden md:flex"}`}
      >
        {selectedEmail ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className={`md:hidden ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}
                  >
                    <FaArrowLeft size={18} />
                  </button>
                  <h2
                    className={`text-xl md:text-2xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {selectedEmail.subject}
                  </h2>
                </div>
                <div className="flex gap-4">
                  <button
                    className={
                      darkMode
                        ? "text-gray-400 hover:text-[#ff9800]"
                        : "text-gray-500 hover:text-[#2c5aa0]"
                    }
                  >
                    <FaTrash />
                  </button>
                  <button
                    className={
                      darkMode
                        ? "text-gray-400 hover:text-[#ff9800]"
                        : "text-gray-500 hover:text-[#2c5aa0]"
                    }
                  >
                    <FaEllipsisV />
                  </button>
                </div>
              </div>

              {/* Email Detail Body... (no changes here) */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full ${darkMode ? "bg-gradient-to-r from-[#ff9800] to-[#ffc107]" : "bg-gradient-to-r from-[#2c5aa0] to-[#3a7bd5]"} flex items-center justify-center text-white font-medium`}
                  >
                    {selectedEmail.sender.charAt(0)}
                  </div>
                  <div>
                    <div
                      className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {selectedEmail.sender}
                    </div>
                    <div
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      to me
                    </div>
                  </div>
                </div>
                <div
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {selectedEmail.time}
                </div>
              </div>

              <div
                className={`prose max-w-none ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                <div
                  className={`prose max-w-none ${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap`}
                >
                  <p>{selectedEmail.fullBody}</p>
                </div>
              </div>

              {selectedEmail.hasAttachment && (
                <div
                  className={`mt-8 border ${darkMode ? "border-gray-700" : "border-gray-200"} rounded-lg p-4`}
                >
                  <h3
                    className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-3`}
                  >
                    Attachments
                  </h3>
                  <div
                    className={`flex items-center gap-3 p-3 border ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"} rounded-md w-64 cursor-pointer`}
                  >
                    <div
                      className={`${darkMode ? "bg-[#ff9800]/10" : "bg-[#2c5aa0]/10"} p-2 rounded-md`}
                    >
                      <FaPaperclip
                        className={
                          darkMode ? "text-[#ff9800]" : "text-[#2c5aa0]"
                        }
                      />
                    </div>
                    <div>
                      <div
                        className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                      >
                        Document.pdf
                      </div>
                      <div
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        250 KB
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`flex-1 flex-col items-center justify-center text-center p-8 ${darkMode ? "bg-gradient-to-br from-[#111827] to-gray-900" : "bg-gradient-to-br from-white to-[#f8fafc]"} hidden md:flex`}
          >
            <div
              className={`w-24 h-24 ${darkMode ? "bg-[#ff9800]/10" : "bg-[#2c5aa0]/5"} rounded-full flex items-center justify-center mb-6`}
            >
              <FaEnvelope
                className={`text-4xl ${darkMode ? "text-[#ff9800]/30" : "text-[#2c5aa0]/30"}`}
              />
            </div>
            <h3
              className={`text-xl font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
            >
              {filteredEmails.length === 0
                ? "No emails to display"
                : "Select an email to read"}
            </h3>
            <p
              className={`${darkMode ? "text-gray-400" : "text-gray-500"} max-w-md text-sm leading-6`}
            >
              {filteredEmails.length === 0
                ? "Your inbox is currently empty."
                : "Choose a message from your inbox to view its contents and details."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmailDashboard;
