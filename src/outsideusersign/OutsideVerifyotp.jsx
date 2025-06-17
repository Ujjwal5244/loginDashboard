import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl, encryptText, decryptText } from "../encryptDecrypt";
import { jwtDecode } from "jwt-decode";
import {
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  FiEdit,
  FiFileText,
  FiCheckCircle,
  FiShield,
  FiChevronRight,
  FiDownload,
} from "react-icons/fi";

const sidebarItems = [
  { text: "Document View", icon: <FiEdit size={18} /> },
  { text: "Verification", icon: <FiCheckCircle size={18} />, active: true },
  { text: "Security Question", icon: <FiShield size={18} /> },
  { text: "Document Sign", icon: <FiFileText size={18} /> },
  { text: "Signed Document", icon: <FiDownload size={18} /> },
];

const OutsideVerifyotp = () => {
  // --- State Management ---
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showOtp, setShowOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [invitee, setInvitee] = useState({ name: "Loading...", email: "..." });
  const [showSidebar, setShowSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // State for URL data and API errors
  const [email, setEmail] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [token, setToken] = useState("");
  const [inviteeId, setInviteeId] = useState(null);
  const [error, setError] = useState("");

  // --- State for IP address and Geolocation ---
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // --- Hooks ---
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 700) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Could not fetch IP address:", error);
        setIpAddress("Not Available");
      }
    };

    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: String(position.coords.latitude),
              longitude: String(position.coords.longitude),
            });
          },
          (err) => {
            console.error("Error getting location:", err.message);
            setLocation({ latitude: "Denied", longitude: "Denied" });
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLocation({ latitude: "Not Supported", longitude: "Not Supported" });
      }
    };

    fetchIpAddress();
    fetchLocation();
  }, []);

  useEffect(() => {
    async function fetchInviteeData() {
      if (!token) return;

      try {
        const response = await axios.get(
          `${baseUrl}/api/document/inviteeBytoken?t=${token}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const encryptedBody = response.data.body;
        const decryptedJsonString = await decryptText(encryptedBody);
        const decryptedPayload = JSON.parse(decryptedJsonString);

        console.log("Decrypted and parsed payload:", decryptedPayload);

        const inviteeData = decryptedPayload.invitee;

        if (inviteeData) {
          setInvitee({
            name: inviteeData.name || "Unknown User",
            email: inviteeData.email || "Not Provided",
          });
        } else {
          console.warn("Decryption success, but no invitee object in payload.");
          setInvitee({
            name: "Not Found",
            email: "Data missing post-decryption",
          });
        }
      } catch (error) {
        console.error("Failed to fetch or decrypt invitee data.", error);
        setInvitee({ name: "Error", email: "Could not load user data" });
      }
    }

    fetchInviteeData();
  }, [token]);

  useEffect(() => {
    const userEmail = searchParams.get("email") || "";
    const docId = searchParams.get("documentId") || "";
    const t = searchParams.get("t") || "";

    if (!userEmail || !docId || !t) {
      console.error("Missing required URL parameters.");
      navigate("/");
      return;
    }
    setEmail(userEmail);
    setDocumentId(docId);
    setToken(t);

    try {
      const decodedToken = jwtDecode(t);
      if (decodedToken && decodedToken.inviteeId) {
        setInviteeId(decodedToken.inviteeId);
      }
    } catch (e) {
      console.error("Failed to decode token:", e);
      setError("Invalid authentication token.");
    }
  }, [searchParams, navigate]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isSubmitting]);

  // --- Handlers ---
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
      e.preventDefault();
      e.target.previousSibling.focus();
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0) return;
    setError("");
    try {
      await axios.post(`${baseUrl}/api/document/invite/send-otp`, {
        email: email,
        documentId: documentId,
      });
      setTimeLeft(60);
    } catch (err) {
      setError("Failed to resend OTP. Please try again later.");
      console.error("Failed to resend OTP:", err);
    }
  };


const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    if (!token) { // Added a check for the token
      setError("Authentication token is missing. Please try the link again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payloadToEncrypt = {
        otp: fullOtp,
        ip: ipAddress,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        email: email,
      };

      console.log("Payload being sent (before encryption):", payloadToEncrypt);

      const payloadString = (payloadToEncrypt);
      const encryptedData = await encryptText(payloadString);

      await axios.post(
        `${baseUrl}/api/document/invite/verify-otp`,
        { body: encryptedData },
        {
          params: { t: token }, 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsSubmitting(false);
      setVerificationSuccess(true);

      setTimeout(() => {
        if (inviteeId) {
          navigate(
            `/invitee/security-question?invitee=${inviteeId}&t=${token}`
          );
        } else {
          console.error(
            "Could not find inviteeId in token. Navigating to home."
          );
          navigate("/");
        }
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);
      // Try to parse the decrypted error from the server if it exists
      if (err.response && err.response.data && err.response.data.body) {
        try {
            const decrypted = await decryptText(err.response.data.body);
            const parsedError = JSON.parse(decrypted);
            setError(parsedError.message || "Invalid OTP or server error.");
        } catch (decryptionError) {
             setError("Invalid OTP or a server error occurred.");
        }
      } else {
         const errorMessage =
            err.response?.data?.message ||
            "Invalid OTP or server error. Please try again.";
         setError(errorMessage);
      }
      console.error("OTP verification failed:", err);
    }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleClick = () => {
    navigate("/");
  };

  // --- Render ---
  if (!email || !token) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-700">
        Loading document details...
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gray-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2a5a99] to-[#3470b2] border-b text-white xs:p-2 sm:p-2 md:p-4 shadow-lg z-50 sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center md:space-x-2 sm:space-x-0">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-1 rounded-md hover:bg-white/10"
              >
                {showSidebar ? (
                  <XMarkIcon className="w-6 h-8" />
                ) : (
                  <Bars3Icon className="w-6 h-8" />
                )}
              </button>
              <div
                className="p-1 bg-white/10 rounded-lg backdrop-blur-sm"
                style={{ display: windowWidth < 700 ? "none" : "block" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold xs:text-[20px] tracking-tight">
                Nifi <span className="font-bold  text-white/80">Payments</span>
              </h1>
            </div>
            <button
              onClick={handleClick}
              className="relative overflow-hidden bg-white text-[#3470b2] px-6 py-2 xs:py-1 xs:px-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#3470b2]/30 group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-0"></span>
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Hidden on mobile unless toggled */}
          {(showSidebar || windowWidth >= 700) && (
            <aside
              className={`w-[315px] bg-white p-5 pt-8 flex-col border-r border-gray-200 fixed md:relative h-[calc(100vh-68px)] md:h-auto z-40 md:z-auto transition-transform duration-300 ${
                showSidebar
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 pt-5 pb-2">
                  Document Actions
                </h2>
                <ul className="divide-y divide-gray-100 flex-1 overflow-y-auto">
                  {sidebarItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className={`flex items-center justify-between px-6 py-4 transition-all duration-200 ${
                          item.active
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <span
                            className={`p-2 rounded-lg ${
                              item.active
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="ml-4 font-medium">{item.text}</span>
                        </div>
                        <FiChevronRight
                          size={18}
                          className={`${
                            item.active ? "text-blue-400" : "text-gray-400"
                          }`}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 p-4">
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <img
                      src={`https://i.pravatar.cc/150?u=${invitee.email}`}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-800">
                        {invitee.name}
                      </p>
                      <p className="text-xs text-gray-500">{invitee.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main
            className={`flex-1 md:p-10 xs:p-1 xs:pt-6 bg-gray-50 flex flex-col overflow-hidden ${
              showSidebar && windowWidth < 700 ? "ml-0" : ""
            }`}
          >
            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 xs:p-3 rounded-xl shadow-sm border border-gray-100 relative">
              {verificationSuccess && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10 animate-fadeIn">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Verified!
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Your identity has been successfully verified
                  </p>
                </div>
              )}
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="text-blue-600 w-7 h-7" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Verify Your Identity
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  We've sent a 6-digit verification code to your email <br />
                  <span className="font-semibold text-gray-700">{email}</span>
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Verification Code
                  </label>
                  <button
                    onClick={() => setShowOtp(!showOtp)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {showOtp ? (
                      <>
                        <DocumentMagnifyingGlassIcon className="mr-1 w-4 h-4" /> Hide
                      </>
                    ) : (
                      <>
                        <DocumentMagnifyingGlassIcon className="mr-1 w-4 h-4" /> Show
                      </>
                    )}
                  </button>
                </div>
                <div className="flex justify-center space-x-2 sm:space-x-3">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type={showOtp ? "text" : "password"}
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      className="w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-gray-300 rounded-lg text-center text-lg sm:text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                    />
                  ))}
                </div>
                {error && (
                  <p className="mt-3 text-sm text-center text-red-600">{error}</p>
                )}
              </div>

              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <svg
                  className="text-gray-500 mr-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-600 mr-2 text-sm sm:text-base">
                  {timeLeft > 0 ? formatTime(timeLeft) : "Code expired"}
                </span>
                <button
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    timeLeft > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  Resend Code
                </button>
              </div>

              <button
                onClick={handleVerify}
                disabled={isSubmitting || otp.join("").length !== 6}
                className={`w-full ${
                  isSubmitting || otp.join("").length !== 6
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify and Continue
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 text-center">
                Didn't receive the code? Check your spam folder or
                <button className="text-blue-600 hover:underline transition-colors duration-200 ml-1">
                  contact support
                </button>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OutsideVerifyotp;
