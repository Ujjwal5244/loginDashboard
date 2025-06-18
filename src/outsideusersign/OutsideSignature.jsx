import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiEdit,
  FiCheckCircle,
  FiShield,
  FiFileText,
  FiDownload,
  FiChevronRight,
  FiSmartphone,
  FiPenTool,
  FiMail,
  FiType,
  FiLoader,
  FiAlertCircle, 
} from "react-icons/fi";
import { FaFingerprint } from "react-icons/fa";
import { baseUrl, encryptText, decryptText } from "../encryptDecrypt";

// Sidebar items 
const sidebarItems = [
  { text: "Document View", icon: <FiEdit size={18} /> },
  { text: "Verification", icon: <FiCheckCircle size={18} /> },
  { text: "Security Question", icon: <FiShield size={18} /> },
  { text: "Document Sign", icon: <FiFileText size={18} />, active: true },
  { text: "Signed Document", icon: <FiDownload size={18} /> },
];

// Available styles for the Typed Signature option (unchanged)
const signatureStyles = [
  {
    id: "cursive",
    name: "Cursive",
    style: { fontFamily: "'Brush Script MT', cursive", fontSize: "2.5rem" },
  },
  {
    id: "formal",
    name: "Formal",
    style: { fontFamily: "'Times New Roman', serif", fontSize: "2rem" },
  },
  {
    id: "modern",
    name: "Modern",
    style: {
      fontFamily: "Arial, sans-serif",
      fontWeight: "bold",
      fontSize: "2rem",
    },
  },
  {
    id: "casual",
    name: "Casual",
    style: {
      fontFamily: "'Comic Sans MS', sans-serif",
      fontSize: "2rem",
      fontStyle: "italic",
    },
  },
  {
    id: "elegant",
    name: "Elegant",
    style: {
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      fontSize: "2rem",
    },
  },
  {
    id: "monospace",
    name: "Monospace",
    style: {
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: "2rem",
    },
  },
  {
    id: "impactful",
    name: "Impact",
    style: {
      fontFamily: "Impact, Charcoal, sans-serif",
      fontSize: "2.2rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
  },
  {
    id: "trebuchet",
    name: "Trebuchet",
    style: {
      fontFamily:
        "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
      fontSize: "2rem",
    },
  },
  {
    id: "georgia-italic",
    name: "Classic Italic",
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "2rem",
      fontStyle: "italic",
    },
  },
  {
    id: "handwritten",
    name: "Handwritten",
    style: {
      fontFamily: "'Bradley Hand', 'Marker Felt', cursive",
      fontSize: "2.4rem",
    },
  },
  {
    id: "garamond",
    name: "Garamond",
    style: { fontFamily: "Garamond, serif", fontSize: "2.2rem" },
  },
  {
    id: "copperplate",
    name: "Engraved",
    style: {
      fontFamily: "Copperplate, 'Copperplate Gothic Light', fantasy",
      fontSize: "2rem",
      letterSpacing: "0.1em",
    },
  },
  {
    id: "papyrus",
    name: "Papyrus",
    style: { fontFamily: "Papyrus, fantasy", fontSize: "2.1rem" },
  },
  {
    id: "verdana",
    name: "Verdana",
    style: { fontFamily: "Verdana, Geneva, sans-serif", fontSize: "1.8rem" },
  },
];

const ALL_SIGNATURE_OPTIONS = [
  {
    id: "aadhaar",
    componentKey: "aadhar", // This key must match the `case` in the switch statement
    title: "Aadhar OTP Sign",
    description: "Sign using an OTP sent to your Aadhar linked mobile number.",
    highlight: "Most secure • Government verified",
    icon: <FiSmartphone size={20} />,
    colorClasses: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      groupHoverBg: "group-hover:bg-blue-600",
      groupHoverText: "group-hover:text-white",
    },
  },
  {
    id: "digital",
    componentKey: "digital",
    title: "Draw Signature",
    description: "Draw your signature using your mouse or a touch screen.",
    highlight: "Natural feel • Just like paper",
    icon: <FiPenTool size={20} />,
    colorClasses: {
      bg: "bg-green-100",
      text: "text-green-600",
      groupHoverBg: "group-hover:bg-green-600",
      groupHoverText: "group-hover:text-white",
    },
  },
  {
    id: "biometric",
    componentKey: "biometric",
    title: "Biometric Sign",
    description: "Use your device's fingerprint or face ID for authentication.",
    highlight: "Instant • No typing required",
    icon: <FaFingerprint size={20} />,
    colorClasses: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      groupHoverBg: "group-hover:bg-purple-600",
      groupHoverText: "group-hover:text-white",
    },
  },
  {
    id: "esign", 
    componentKey: "typed",
    title: "Typed Signature",
    description: "Type your name and choose from beautiful signature styles.",
    highlight: "Professional • Multiple styles",
    icon: <FiType size={20} />,
    colorClasses: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      groupHoverBg: "group-hover:bg-orange-600",
      groupHoverText: "group-hover:text-white",
    },
  },
];

const OutsideSignature = () => {
  // --- STATE MANAGEMENT ---
  const [token, setToken] = useState("");
  const [invitee, setInvitee] = useState({ name: "Loading...", email: "..." });
  const [selectedOption, setSelectedOption] = useState(null);
  const [signature, setSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  // Aadhar State
  const [aadharStep, setAadharStep] = useState("enter_aadhar");
  const [aadharNumber, setAadharNumber] = useState("");
  const [aadharConsent, setAadharConsent] = useState(false);
  const [aadharOtp, setAadharOtp] = useState(new Array(6).fill(""));

  // --- NEW AADHAR API STATE ---
  const [isAadharLoading, setIsAadharLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [location, setLocation] = useState(null);

  // Typed Signature State
  const [typedName, setTypedName] = useState("Alex Doe");
  const [selectedStyle, setSelectedStyle] = useState(signatureStyles[0].id);

  // --- NEW STATE for dynamic options ---
  const [allowedSignatureTypes, setAllowedSignatureTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Hooks ---
  const [searchParams] = useSearchParams();
  const inviteeId = searchParams.get('invitee');
  const documentId = searchParams.get('documentId');
  const navigate = useNavigate();

  // Effect to get token from URL
  useEffect(() => {
    const tokenFromParams = searchParams.get("t");

    if (tokenFromParams) {
      setToken(tokenFromParams);
    } else {
      console.error(
        "Token is missing from URL parameters. Redirecting to home."
      );
      navigate("/");
    }
  }, [searchParams, navigate]);

  // Effect to get location for Aadhar signing
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
          });
          console.log("Location obtained successfully.");
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          setApiError(
            "Location access denied. Please enable location services in your browser for Aadhar signing."
          );
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setApiError(
        "Geolocation is not supported by your browser, which is required for Aadhar signing."
      );
    }
  }, []); // Run only once on component mount

  useEffect(() => {
    async function fetchInviteeData() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true); // Start loading
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
          setAllowedSignatureTypes(inviteeData.signatureType || []);
        } else {
          console.warn(
            "Decryption success, but no invitee object in payload."
          );
          setInvitee({
            name: "Not Found",
            email: "Data missing post-decryption",
          });
          setAllowedSignatureTypes([]);
        }
      } catch (error) {
        console.error("Failed to fetch or decrypt invitee data.", error);
        setInvitee({ name: "Error", email: "Could not load user data" });
        setAllowedSignatureTypes([]);
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
      }
    }

    fetchInviteeData();
  }, [token]);

  // --- HANDLERS ---
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setApiError(""); // Clear previous errors when switching options
  };

  const resetAllFlows = () => {
    // Reset Aadhar flow
    setAadharStep("enter_aadhar");
    setAadharNumber("");
    setAadharConsent(false);
    setAadharOtp(new Array(6).fill(""));
    setApiError(""); // Clear any API errors
    // Reset Digital (Canvas) flow
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setSignature("");
    setSelectedOption(null);
  };

  // ------------------AADHAR API HANDLERS -------------------
  const handleAadharSubmit = async (e) => {
  e.preventDefault();
  if (!location) {
    setApiError(
      "Location is required for Aadhar signing. Please enable it and refresh the page."
    );
    return;
  }
  // Add a check to ensure inviteeId was found in the URL
  if (!inviteeId) {
    setApiError("invitee ID is missing from the URL. Cannot proceed.");
    return;
  }

  setIsAadharLoading(true);
  setApiError("");

  try {
    const payload = {
      aadhaarNumber: aadharNumber,
      location: location,
    };
    const encryptedPayload = await encryptText(payload);

    // CORRECTED: Use inviteeId in the URL instead of token
    await axios.post(
      `${baseUrl}/api/document/aadhaar-sign/${inviteeId}`,
      { body: encryptedPayload },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // On successful OTP request, move to the next step
    setAadharStep("enter_otp");
  } catch (error) {
    console.error("Error sending Aadhar OTP:", error);
    const errorMessage =
      error.response?.data?.message ||
      "An error occurred sending the OTP. Check the Aadhar number and try again.";
    setApiError(errorMessage);
  } finally {
    setIsAadharLoading(false);
  }
};

const handleAadharOtpSubmit = async (e) => {
  e.preventDefault();
  if (!location) {
    setApiError("Location data lost. Please go back and try again.");
    return;
  }
  // The documentId is now retrieved from the URL at the component level
  if (!inviteeId || !documentId) { 
    setApiError("Invitee ID or Document ID is missing from the URL. Cannot proceed.");
    return;
  }

  setIsAadharLoading(true);
  setApiError("");

  try {
    const otpPayload = {
      aadhaarNumber: aadharNumber,
      otp: aadharOtp.join(""),
      location: location,
    };
    
    const encryptedOtpPayload = await encryptText(otpPayload);
    await axios.post(
      `${baseUrl}/api/document/aadhaar-sign/${inviteeId}`,
      { body: encryptedOtpPayload },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log("Aadhaar OTP verification successful. Now fetching final document URL...");

    const docDetailsResponse = await axios.get(
      `${baseUrl}/api/document/getdocument/${documentId}`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Decrypt the response body from the GET request
    const encryptedDocBody = docDetailsResponse.data.body;
    const decryptedDocString = await decryptText(encryptedDocBody);
    const finalDocData = JSON.parse(decryptedDocString);

    console.log("Fetched final document details:", finalDocData);

    const signUrl = finalDocData.document?.documentUrl;

    // Validate that we got the URL
    if (!signUrl) {
      setApiError("Verification successful, but failed to retrieve the signed document URL. Please contact support.");
      setIsAadharLoading(false);
      return;
    }

    // Construct the final target URL and navigate
    const targetUrl = `/invitee/done?documentId=${documentId}&signUrl=${encodeURIComponent(signUrl)}&t=${token}`;
    
    navigate(targetUrl);

  } catch (error) {
    console.error("Error during the signing process:", error);
    const errorMessage =
      error.response?.data?.message ||
      "An error occurred during the signing process. Please try again.";
    setApiError(errorMessage);
  } finally {
    // This will only run if an error occurs, since successful navigation will unmount the component.
    setIsAadharLoading(false);
  }
};

  // Digital Canvas Handlers
  const handleCanvasMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setSignature(canvasRef.current.toDataURL());
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  const handleUseDigitalSignature = () => {
    if (signature) {
      alert("Document signed with your digital signature!");
      resetAllFlows();
    } else {
      alert("Please draw your signature first.");
    }
  };

  // Biometric Handler
  const handleBiometricSign = () => {
    alert("Biometric authentication successful! Document signed.");
    resetAllFlows();
  };

  // Typed Signature Handler
  const handleTypedSignatureSubmit = (e) => {
    e.preventDefault();
    alert(
      `Document signed with the selected typed signature for "${typedName}".`
    );
    resetAllFlows();
  };

  // --- RENDER LOGIC ---

  const ApiErrorDisplay = ({ message }) => {
    if (!message) return null;
    return (
      <div className="flex items-center p-3 my-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
        <FiAlertCircle className="w-5 h-5 mr-3" />
        <span>{message}</span>
      </div>
    );
  };

  const renderSignatureOptions = () => {
    // Show a loading state while fetching data
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <FiLoader className="animate-spin text-4xl mb-4" />
          <p className="text-lg">Loading your signature options...</p>
        </div>
      );
    }

    // Filter the master list based on what the API allows
    const availableOptions = ALL_SIGNATURE_OPTIONS.filter((option) =>
      allowedSignatureTypes.includes(option.id)
    );

    if (selectedOption === null) {
      // Handle case where no options are enabled for this user
      if (availableOptions.length === 0) {
        return (
          <div className="p-8 w-full max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Signature Methods Available
            </h2>
            <p className="text-gray-600">
              There are no signature methods enabled for you for this document.
              Please contact the sender if you believe this is an error.
            </p>
          </div>
        );
      }

      return (
        <div className="p-8 w-full max-w-4xl h-full mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Choose Your Signature Method
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableOptions.map((option) => (
              <div
                key={option.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleOptionSelect(option.componentKey)}
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`p-1 rounded-2xl ${option.colorClasses.bg} ${option.colorClasses.text} ${option.colorClasses.groupHoverBg} ${option.colorClasses.groupHoverText} transition-colors`}
                  >
                    {option.icon}
                  </div>
                  <h3
                    className={`ml-4 font-semibold text-gray-800 group-hover:${option.colorClasses.text} transition-colors`}
                  >
                    {option.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {option.description}
                  <span
                    className={`block mt-1 text-xs ${option.colorClasses.text} font-medium`}
                  >
                    {option.highlight}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // --- ENHANCED SELECTED OPTIONS ---
    switch (selectedOption) {
      case "aadhar":
        return (
          <div className="p-8 w-full h-full max-w-2xl mx-auto">
            <button
              className="flex items-center text-blue-600 mb-8 font-medium hover:underline"
              onClick={resetAllFlows}
            >
              <FiChevronRight className="rotate-180 mr-1" /> Back to options
            </button>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              {aadharStep === "enter_aadhar" ? (
                <form onSubmit={handleAadharSubmit}>
                  {/* ... Existing Aadhar form elements ... */}
                   <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-medium mb-2"
                      htmlFor="aadharNumber"
                    >
                      Aadhar Number
                    </label>
                    <div className="relative">
                      <input
                        id="aadharNumber"
                        type="text"
                        maxLength="12"
                        pattern="\d{12}"
                        required
                        value={aadharNumber}
                        onChange={(e) =>
                          setAadharNumber(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter 12-digit Aadhar"
                      />
                      {/* ... icon ... */}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      We'll send an OTP to your registered mobile number
                    </p>
                  </div>
                   <div className="mb-6">
                    <div className="flex items-start ">
                      <div className="flex h-5 mt-1">
                        <input
                          type="checkbox"
                          checked={aadharConsent}
                          onChange={(e) => setAadharConsent(e.target.checked)}
                          className="h-3 w-3 text-[#326cae] border-gray-300 rounded focus:ring-[#326cae]"
                        />
                      </div>
                      <div className="ml-2 text-sm">
                        <p className="text-gray-500">
                          I authorize NifiPayments to use my Aadhar details for
                          electronic signature as per IT Act 2000.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ApiErrorDisplay message={apiError} />
                  {!location && !apiError && (
                    <p className="mt-2 text-xs text-yellow-600 text-center mb-2">
                      Waiting for location data... Please enable location services.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!aadharConsent || aadharNumber.length !== 12 || isAadharLoading || !location}
                    className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                      !aadharConsent || aadharNumber.length !== 12 || !location
                        ? "bg-gray-300 cursor-not-allowed"
                        : isAadharLoading
                        ? "bg-blue-300 cursor-wait"
                        : "bg-[#326cae] text-white shadow-md"
                    }`}
                  >
                    {isAadharLoading && <FiLoader className="animate-spin mr-2" />}
                    {isAadharLoading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAadharOtpSubmit}>
                  {/* ... Existing OTP form elements ... */}
                  <div className="text-center mb-6">
                    <p className="text-gray-500 mt-1">
                      Sent to mobile linked with Aadhar ending{" "}
                      <span className="font-semibold">
                        ••••{aadharNumber.slice(-4)}
                      </span>
                    </p>
                  </div>
                  <div className="mb-6">
                    <div className="flex space-x-3">
                      {aadharOtp.map((digit, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength="1"
                          className="flex-1 text-center text-xl font-semibold py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326cae] transition-all"
                          value={digit}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const newOtp = [...aadharOtp];
                            newOtp[i] = e.target.value.replace(/\D/g, "").slice(0, 1);
                            setAadharOtp(newOtp);
                            if (e.target.value && i < 5) {
                              e.target.nextElementSibling?.focus();
                            }
                          }}
                           onKeyDown={(e) => {
                            if (e.key === "Backspace" && !aadharOtp[i] && i > 0) {
                              e.preventDefault();
                              e.target.previousElementSibling?.focus();
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <ApiErrorDisplay message={apiError} />
                  <button
                    type="submit"
                    disabled={aadharOtp.join("").length !== 6 || isAadharLoading}
                    className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                      aadharOtp.join("").length !== 6
                        ? "bg-gray-300 cursor-not-allowed"
                        : isAadharLoading
                        ? "bg-blue-300 cursor-wait"
                        : "bg-[#326cae]  text-white shadow-md"
                    }`}
                  >
                    {isAadharLoading && <FiLoader className="animate-spin mr-2" />}
                    {isAadharLoading ? "Verifying..." : "Verify & Sign Document"}
                  </button>
                </form>
              )}
            </div>
            <div className="mt-6 text-center text-xs text-gray-400">
              <p>Your Aadhar details are securely processed and not stored</p>
            </div>
          </div>
        );
      // Other cases (digital, biometric, typed) remain unchanged
      case "digital":
        return (
          <div className="p-8 w-full max-w-md mx-auto">
            <button
              className="flex items-center text-[#326cae] mb-8 font-medium hover:underline"
              onClick={resetAllFlows}
            >
              <FiChevronRight className="rotate-180 mr-1" /> Back to options
            </button>

            <div className="text-center mb-8">
              <div className="text-center items-center gap-2 justify-center flex mx-auto mb-4 ">
                <div className="w-10 h-10  bg-green-100 rounded-full flex items-center justify-center ">
                  <FiPenTool size={20} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Draw Your Signature
                </h2>
              </div>
              <p className="text-gray-500">
                Create your natural signature using mouse or touch
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 relative overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    className="w-full h-48 cursor-crosshair bg-white"
                  />
                  {!signature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-gray-400">Draw your signature here</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClearCanvas}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear
                </button>
                <button
                  onClick={handleUseDigitalSignature}
                  disabled={!signature}
                  className={`flex-1 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center ${!signature ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white shadow-md"}`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Use This Signature
                </button>
              </div>

              {signature && (
                <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Your Signature Preview:
                  </p>
                  <img
                    src={signature}
                    alt="Your signature"
                    className="h-12 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
              <p>Your drawn signature is encrypted for security</p>
            </div>
          </div>
        );

      case "biometric":
        handleBiometricSign();
        return null; 

      case "typed":
        return (
          <div className="p-8 w-full max-w-2xl mx-auto">
            <button
              className="flex items-center text-[#326cae] mb-8 font-medium hover:underline"
              onClick={resetAllFlows}
            >
              <FiChevronRight className="rotate-180 mr-1" /> Back to options
            </button>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <form onSubmit={handleTypedSignatureSubmit}>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="typedName"
                  >
                    Your Full Name
                  </label>
                  <input
                    id="typedName"
                    type="text"
                    required
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326cae] focus:border-[#326cae] transition-all"
                    placeholder="Enter your name as it should appear"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-3">
                    Signature Style Preview
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4 flex items-center justify-center h-24">
                    <p
                      style={
                        signatureStyles.find((s) => s.id === selectedStyle)
                          ?.style
                      }
                      className="text-gray-800"
                    >
                      {typedName || "Your Name"}
                    </p>
                  </div>

                  <label className="block text-gray-700 text-sm font-medium mb-3">
                    Choose a Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6 max-h-60 overflow-y-auto pr-2">
                    {signatureStyles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 border rounded-lg transition-all ${selectedStyle === style.id ? "border-[#326cae] ring-2 ring-blue-200 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                      >
                        <p
                          style={style.style}
                          className="text-gray-800 text-center truncate"
                        >
                          {typedName || "Sample"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          {style.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!typedName}
                  className={`w-full py-3 px-4 rounded-lg transition-colors ${!typedName ? "bg-gray-300 cursor-not-allowed" : "bg-[#326cae]  text-white shadow-md"}`}
                >
                  Adopt and Sign Document
                </button>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header (Unchanged) */}
      <header className="bg-gradient-to-r from-[#2a5a99] to-[#3470b2] border-b text-white p-4 shadow-lg z-50 sticky top-0 backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
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
            <h1 className="text-2xl font-bold tracking-tight">
              Nifi <span className="font-bold text-white/80">Payments</span>
            </h1>
          </div>
          <button className="relative overflow-hidden bg-white text-[#3470b2] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#3470b2]/30 group">
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-0"></span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Unchanged) */}
        <aside className="w-[315px] bg-white p-5 pt-8 flex-col border-r border-gray-200 hidden md:flex">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 pt-5 pb-2">
              Document Actions
            </h2>
            <ul className="divide-y divide-gray-100">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center justify-between px-6 py-4 transition-all duration-200 ${
                      item.active
                        ? "bg-blue-50 text-[#326cae]"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <span
                        className={`p-2 rounded-lg ${
                          item.active
                            ? "bg-blue-100 text-[#326cae]"
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
          </div>
          <div className="mt-auto pt-6 p-4">
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <img
                src={`https://i.pravatar.cc/150?u=${invitee.email}`}
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-800">{invitee.name}</p>
                <p className="text-xs text-gray-500">{invitee.email}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          {renderSignatureOptions()}
        </main>
      </div>
    </div>
  );
};

export default OutsideSignature;