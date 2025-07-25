import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FaEnvelope,
  FaUserPlus,
  FaChevronRight,
  FaCheck,
  FaSignature,
  FaFingerprint,
  FaMobileAlt,
  FaIdCard,
  FaSortNumericDown,
} from "react-icons/fa";
import { MdDelete, MdOutlineSecurity } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl, decryptText, encryptText } from "../../../../encryptDecrypt";
import axios from "axios";
import SidebarRequestfile from "./SidebarRequestfile";
import { useWindowWidth } from "./window_width";

const Requestfile = ({ darkMode }) => {
  const { documentId } = useParams();
  const token = localStorage.getItem("userToken");

  const [selfSignerInfo, setSelfSignerInfo] = useState(null);
  const [invitees, setInvitees] = useState([]);
  const nextIdRef = useRef(2);
  const [isFixedOrder, setIsFixedOrder] = useState(true);
  const [iWillSign, setIWillSign] = useState(true);
  const [showOptions, setShowOptions] = useState({});
  const [selectedMethods, setSelectedMethods] = useState([]);
  const dropdownRefs = useRef({});
  const [showRankSelector, setShowRankSelector] = useState({});
  const rankSelectorContainerRefs = useRef({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true); // New state for initial page load
  const navigate = useNavigate();
  const scrollableContainerRef = useRef(null);
  const isInitialMount = useRef(true);

  const [location, setLocation] = useState(null);

  // State to control the sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const methods = [
    {
      id: "aadhaar",
      name: "Aadhaar OTP",
      icon: <FaMobileAlt className="text-blue-500" />,
    },
    {
      id: "biometric",
      name: "Biometric",
      icon: <FaFingerprint className="text-green-500" />,
    },
    {
      id: "esign",
      name: "Electronic Sign",
      icon: <FaSignature className="text-purple-500" />,
    },
    {
      id: "digital",
      name: "Digital Signature",
      icon: <FaIdCard className="text-red-500" />,
    },
  ];

  // Fetch location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          toast.warn(
            "Could not get your location. It will not be included in the request."
          );
        }
      );
    } else {
      toast.warn("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const initializePageData = async () => {
      if (!token || !documentId) {
        toast.error("Authentication or document information is missing.");
        setIsPageLoading(false);
        return;
      }
      setIsPageLoading(true);

      // Step 1: Fetch user profile
      let localSelfSignerInfo = null;
      try {
        const profileResponse = await axios.get(`${baseUrl}/api/user/profile`, {
          headers: { authorization: token },
        });
        const decryptedProfile = await decryptText(profileResponse.data.body);
        const profileData = JSON.parse(decryptedProfile);
        if (profileData?.data?.name && profileData?.data?.email) {
          localSelfSignerInfo = {
            id: profileData.data.id,
            name: profileData.data.name,
            contact: profileData.data.email,
            isSelf: true,
          };
          setSelfSignerInfo(localSelfSignerInfo);
        }
      } catch (error) {
        toast.error("Failed to fetch your profile information.");
        console.error("Failed to fetch profile:", error);
        setIsPageLoading(false);
        return;
      }

      // Step 2: Fetch existing invitees
      try {
        const inviteesResponse = await axios.get(
          `${baseUrl}/api/document/getInvitees/${documentId}`,
          { headers: { authorization: token } }
        );
        const decryptedInvitees = await decryptText(inviteesResponse.data.body);
        const inviteesData = JSON.parse(decryptedInvitees);
        console.log("Fetched invitees data:", inviteesData);

        if (inviteesData?.invitees && inviteesData.invitees.length > 0) {
          // We are mapping over `inviteesData.invitees`
          const fetchedInvitees = inviteesData.invitees.map((inv) => {
            let parsedSignatureTypes = [];
            try {
              if (typeof inv.signatureType === "string") {
                parsedSignatureTypes = JSON.parse(inv.signatureType);
              } else {
                parsedSignatureTypes = inv.signatureType || [];
              }
            } catch (e) {
              console.error(
                "Failed to parse signatureType:",
                inv.signatureType,
                e
              );
              parsedSignatureTypes = [];
            }

            return {
              id: inv.id,
              name: inv.name,
              contact: inv.email,
              rank: inv.order,
              signatureTypes: parsedSignatureTypes,
              isSelf: localSelfSignerInfo?.contact === inv.email,
            };
          });

          setInvitees(fetchedInvitees);
          // Also check for these flags at the top level
          setIsFixedOrder(inviteesData.isInSequence ?? true);
          setIWillSign(inviteesData.mySign ?? false);
          nextIdRef.current = fetchedInvitees.length + 100;
        } else {
          // Fallback if no invitees are found
          if (localSelfSignerInfo) {
            setInvitees([
              { ...localSelfSignerInfo, rank: 1, signatureTypes: [] },
            ]);
          }
        }
      } catch (error) {
        console.log(
          "Could not fetch existing invitees, setting up default state.",
          error.message
        );
        if (localSelfSignerInfo) {
          setInvitees([
            { ...localSelfSignerInfo, rank: 1, signatureTypes: [] },
          ]);
        }
      } finally {
        setIsPageLoading(false);
      }
    };

    initializePageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, token]);

  const toggleOptions = (inviteeId) => {
    const invitee = invitees.find((inv) => inv.id === inviteeId);
    if (!invitee) return;

    const key = String(inviteeId);
    setShowRankSelector({});
    setShowOptions((prev) => ({
      ...Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, false])),
      [key]: !prev[key],
    }));
    setSelectedMethods(invitee.signatureTypes || []);
  };

  const toggleRankSelector = (inviteeId) => {
    if (invitees.length <= 1) return;
    const key = String(inviteeId);
    setShowOptions({});
    setShowRankSelector((prev) => {
      const isOpenCurrently = !!prev[key];
      const allClosed = Object.fromEntries(
        Object.keys(prev)
          .map((k) => [k, false])
          .filter((entry) => entry !== undefined)
      );
      return { ...allClosed, [key]: !isOpenCurrently };
    });
  };

  const toggleMethod = (methodId) => {
    setSelectedMethods((prev) =>
      prev.includes(methodId)
        ? prev.filter((id) => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSubmit = (inviteeId) => {
    setInvitees((prevInvitees) =>
      prevInvitees.map((inv) =>
        inv.id === inviteeId ? { ...inv, signatureTypes: selectedMethods } : inv
      )
    );
    toast.success("Signature methods confirmed for this invitee.");
    setShowOptions((prev) => ({ ...prev, [String(inviteeId)]: false }));
    setSelectedMethods([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(showOptions).forEach((inviteeIdStr) => {
        if (showOptions[inviteeIdStr]) {
          const optionsDropdownRef = dropdownRefs.current[inviteeIdStr];
          const optionsToggleButton = document.querySelector(
            `button[data-toggles-options='${inviteeIdStr}']`
          );
          if (
            optionsDropdownRef &&
            !optionsDropdownRef.contains(event.target) &&
            (!optionsToggleButton ||
              !optionsToggleButton.contains(event.target))
          ) {
            setShowOptions((prev) => ({ ...prev, [inviteeIdStr]: false }));
          }
        }
      });
      Object.keys(showRankSelector).forEach((inviteeIdStr) => {
        if (showRankSelector[inviteeIdStr]) {
          const rankDropdownRef =
            rankSelectorContainerRefs.current[inviteeIdStr];
          const rankToggleButton = document.querySelector(
            `button[data-toggles-rank-selector='${inviteeIdStr}']`
          );
          if (
            rankDropdownRef &&
            !rankDropdownRef.contains(event.target) &&
            (!rankToggleButton || !rankToggleButton.contains(event.target))
          ) {
            setShowRankSelector((prev) => ({ ...prev, [inviteeIdStr]: false }));
          }
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions, showRankSelector]);

  const handleFixedOrderToggle = () => {
    setIsFixedOrder((prevIsFixed) => {
      const newIsFixed = !prevIsFixed;
      setInvitees((currentInvitees) => {
        if (newIsFixed) {
          const sorted = [...currentInvitees].sort((a, b) => a.id - b.id);
          return sorted.map((invitee, index) => ({
            ...invitee,
            rank: index + 1,
          }));
        }
        return currentInvitees.map((invitee) => ({ ...invitee, rank: null }));
      });
      return newIsFixed;
    });
  };

  const handleIWillSignToggle = () => {
    const newIWillSignState = !iWillSign;
    setIWillSign(newIWillSignState);
    if (newIWillSignState) {
      setInvitees((prevInvitees) => {
        // Avoid adding duplicate self-signer
        if (prevInvitees.some((inv) => inv.isSelf)) return prevInvitees;

        const updatedInvitees = [
          { ...selfSignerInfo, rank: null, signatureTypes: [] },
          ...prevInvitees,
        ];
        if (isFixedOrder) {
          return updatedInvitees.map((inv, index) => ({
            ...inv,
            rank: index + 1,
          }));
        }
        return updatedInvitees;
      });
    } else {
      setInvitees((prevInvitees) => {
        const updatedInvitees = prevInvitees.filter((inv) => !inv.isSelf);
        if (isFixedOrder) {
          return updatedInvitees.map((inv, index) => ({
            ...inv,
            rank: index + 1,
          }));
        }
        return updatedInvitees;
      });
    }
  };

  const addInvitee = () => {
    const newId = nextIdRef.current;
    nextIdRef.current += 1;
    setInvitees((prevInvitees) => {
      const newRank = isFixedOrder ? prevInvitees.length + 1 : null;
      const newInviteesList = [
        ...prevInvitees,
        { id: newId, name: "", contact: "", rank: newRank, signatureTypes: [] },
      ];
      return newInviteesList;
    });
  };
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({
        top: scrollableContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [invitees.length]);

  const removeInvitee = (inviteeIdToRemove) => {
    setInvitees((prevInvitees) => {
      const inviteeToRemove = prevInvitees.find(
        (inv) => inv.id === inviteeIdToRemove
      );
      if (inviteeToRemove && inviteeToRemove.isSelf) {
        toast.warn(
          "To remove yourself, please turn off the 'I will sign this document' toggle."
        );
        return prevInvitees;
      }
      const updatedInvitees = prevInvitees.filter(
        (inv) => inv.id !== inviteeIdToRemove
      );
      if (isFixedOrder) {
        return updatedInvitees.map((inv, index) => ({
          ...inv,
          rank: index + 1,
        }));
      }
      return updatedInvitees;
    });
  };

  const updateInvitee = (inviteeId, field, value) => {
    setInvitees((prevInvitees) =>
      prevInvitees.map((inv) =>
        inv.id === inviteeId ? { ...inv, [field]: value } : inv
      )
    );
  };

  const updateInviteeRank = (inviteeId, newSelectedRank) => {
    setInvitees((prevInvitees) => {
      const currentInvitee = prevInvitees.find((inv) => inv.id === inviteeId);
      if (!currentInvitee || currentInvitee.rank === newSelectedRank)
        return prevInvitees;
      const oldRank = currentInvitee.rank;
      return prevInvitees
        .map((inv) => {
          if (inv.id === inviteeId) {
            return { ...inv, rank: newSelectedRank };
          }
          if (inv.rank === newSelectedRank) {
            return { ...inv, rank: oldRank };
          }
          return inv;
        })
        .sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity));
    });
  };

  const inviteesToDisplay = useMemo(() => {
    if (isFixedOrder) {
      return [...invitees]
        .filter((inv) => inv.rank != null)
        .sort((a, b) => a.rank - b.rank);
    }
    return invitees;
  }, [invitees, isFixedOrder]);

  const handleNext = async () => {
    // ... (rest of the handleNext function remains unchanged)
    if (!documentId) {
      toast.error("Document ID is missing. Cannot proceed.");
      return;
    }

    if (invitees.length === 0) {
      toast.error("Please add at least one invitee.");
      return;
    }

    for (const invitee of invitees) {
      if (!invitee.name.trim() || !invitee.contact.trim()) {
        toast.error(`Please fill in the name and contact for all invitees.`);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(invitee.contact)) {
        toast.error(`Please provide a valid email for ${invitee.name}.`);
        return;
      }
      if (!invitee.signatureTypes || invitee.signatureTypes.length === 0) {
        toast.error(
          `Please select and confirm at least one signature method for ${invitee.name}.`
        );
        return;
      }
    }

    if (!location) {
      toast.warn(
        "Location data is not yet available. Please wait a moment and try again."
      );
      return;
    }

    setIsLoading(true);

    try {
      const payloadData = {
        invitees: invitees.map((invitee) => ({
          name: invitee.name,
          email: invitee.contact,
          order: invitee.rank,
          type: "user",
          signatureType: invitee.signatureTypes,
          securityQuestions: [],
          aadhaarVerification: { enabled: false },
          advancedOptions: {},
        })),
        isInSequence: isFixedOrder,
        mySign: iWillSign,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      };
      // const payloadString = await encryptText(JSON.stringify(payloadData));
      const encryptedPayload = await encryptText(payloadData);

      const response = await axios.post(
        `${baseUrl}/api/document/invitees/${documentId}`,
        { body: encryptedPayload },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        try {
          const decryptedResponse = await decryptText(response.data.body);
          const responseData = JSON.parse(decryptedResponse);

          if (response.status === 200 || response.status === 201) {
            toast.success("Invitations have been sent successfully!");
            navigate(
              `/maindashboard/approve/${documentId}?isInSequence=${isFixedOrder}`
            );
          } else {
            toast.error(responseData.message || "Failed to send invitations");
          }
        } catch (decryptError) {
          console.error("Failed to decrypt response:", decryptError);
          toast.error("Failed to process server response");
        }
      } else {
        toast.error("No data received from server");
      }
    } catch (error) {
      console.error("Failed to send invitations:", error);

      let errorMessage = "Failed to send invitations. Please try again.";
      if (error.response) {
        if (
          error.response.data &&
          typeof error.response.data === "object" &&
          error.response.data.body
        ) {
          try {
            const decryptedError = await decryptText(error.response.data.body);
            const errorData = JSON.parse(decryptedError);
            errorMessage = errorData.message || errorMessage;
          } catch (decryptError) {
            console.error("Failed to decrypt error response:", decryptError);
            errorMessage =
              "An unknown error occurred while processing the server response.";
          }
        } else if (
          error.response.data &&
          typeof error.response.data === "string"
        ) {
          errorMessage = error.response.data;
        }
      } else if (error.request) {
        errorMessage = "No response received from server";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while fetching initial data
  if (isPageLoading) {
    return (
      <div
        className={`flex h-screen items-center justify-center ${darkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="flex items-center gap-3">
          {/* Spinner */}
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
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
          <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Loading Document Details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-[100%] ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* The rest of your JSX from the original component goes here */}
      {/* ... (Main Content Pane) ... */}
      {/* ... (Sidebar Pane) ... */}
      {/* I've omitted the large JSX block for brevity, but you should place your original return statement's content here. */}
      <main className="flex-grow overflow-y-auto">
        <div
          className={`font-sans py-1 p-2  ${darkMode ? "text-gray-200" : ""}`}
        >
          <div className="max-w-5xl mx-auto">
            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                <span
                  className={`border ${darkMode ? "border-gray-600" : "border-gray-400"} rounded-full md:w-6 md:h-6 xs:w-4 xs:h-4 flex items-center justify-center md:text-xs xs:text-[8px] ${darkMode ? "text-gray-300" : ""}`}
                >
                  1
                </span>
                <span
                  className={`md:text-sm xs:text-[12px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Generate
                </span>
              </div>
              <div
                className={`md:w-8 xs:w-4 h-px ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
              ></div>
              <div className="flex items-center gap-1">
                <span
                  className={`${darkMode ? "bg-blue-600" : "bg-[#2c5fa5]"} text-white rounded-full md:w-6 md:h-6 xs:w-4 xs:h-4 flex items-center justify-center md:text-xs xs:text-[8px] font-bold`}
                >
                  2
                </span>
                <span
                  className={`font-medium md:text-sm xs:text-[12px] ${darkMode ? "text-blue-400" : "text-[#2c5fa5]"}`}
                >
                  Request
                </span>
              </div>
              <div
                className={`md:w-8 xs:w-4 h-px ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
              ></div>
              <div className="flex items-center gap-1">
                <span
                  className={`border ${darkMode ? "border-gray-600" : "border-gray-400"} rounded-full md:w-6 md:h-6 xs:w-4 xs:h-4 flex items-center justify-center md:text-xs xs:text-[8px] ${darkMode ? "text-gray-300" : ""}`}
                >
                  3
                </span>
                <span
                  className={`md:text-sm xs:text-[12px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Approve
                </span>
              </div>
            </div>

            <div
              className={`shadow-md border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} rounded-xl  md:p-6 md:py-3 xs:p-3 xs:py-6`}
            >
              <div className="text-center mb-6">
                <h1
                  className={`md:text-2xl xs:text-xl font-bold ${darkMode ? "text-blue-400" : "text-[#3470b2]"} mb-1`}
                >
                  Document Signing Invitation
                </h1>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
                >
                  Add signers and reviewers below
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <div
                  className={`flex items-center space-x-3 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} shadow-sm rounded-full md:px-4 xs:px-4 py-2 border`}
                >
                  <span
                    className={`md:text-xs xs:text-[11px] ${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}
                  >
                    Fixed sign order
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isFixedOrder}
                      onChange={handleFixedOrderToggle}
                    />
                    <div
                      className={`relative w-9 h-5 ${darkMode ? "peer-focus:ring-orange-800" : "peer-focus:ring-blue-300"} ${darkMode ? "bg-gray-600" : "bg-gray-300"} peer-focus:outline-none peer-focus:ring-2 rounded-full peer ${isFixedOrder ? (darkMode ? "peer-checked:bg-orange-700" : "peer-checked:bg-green-500") : ""} transition-all`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 ${darkMode ? "bg-gray-300" : "bg-white"} rounded-full transition-transform ${isFixedOrder ? "translate-x-4" : ""}`}
                      ></div>
                    </div>
                  </label>
                  <div
                    className={`h-4 w-px ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}
                  ></div>
                  <span
                    className={`md:text-xs xs:text-[11px] ${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}
                  >
                    I will sign this document
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={iWillSign}
                      onChange={handleIWillSignToggle}
                      disabled={!selfSignerInfo}
                    />
                    <div
                      className={`relative w-9 h-5 ${darkMode ? "peer-focus:ring-orange-800" : "peer-focus:ring-blue-300"} ${darkMode ? "bg-gray-600" : "bg-gray-300"} peer-focus:outline-none peer-focus:ring-2 rounded-full peer ${iWillSign ? (darkMode ? "peer-checked:bg-orange-700" : "peer-checked:bg-green-500") : ""} transition-all`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 ${darkMode ? "bg-gray-300" : "bg-white"} rounded-full transition-transform ${iWillSign ? "translate-x-4" : ""}`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>

              {/*  This is the scrollable container of invitees */}
              <div
                ref={scrollableContainerRef}
                className="h-[47vh] overflow-y-auto pr-2  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
              >
                <div className="space-y-3">
                  {inviteesToDisplay.map((invitee) => (
                    <div
                      key={invitee.id}
                      className={`${
                        darkMode
                          ? "bg-gray-800 border-gray-700 hover:shadow-gray-800"
                          : "bg-white border-gray-100 hover:shadow-md"
                      } p-4 shadow-sm rounded-lg border transition-all`}
                    >
                      {/* ... all your existing invitee card content remains unchanged here ... */}
                      <div className="flex items-center space-x-2 mb-3">
                        {isFixedOrder ? (
                          <div className="flex items-center space-x-2">
                            <span
                              className={`${
                                darkMode ? "bg-blue-600" : "bg-[#3470b2]"
                              } text-white rounded-full md:w-7 md:h-7 xs:w-5 xs:h-5 flex items-center justify-center md:text-xs xs:text-[10px] font-bold shrink-0`}
                              title={`Signing Order: ${invitee.rank}`}
                            >
                              {invitee.rank}
                            </span>
                            <div className="relative">
                              <button
                                onClick={() => toggleRankSelector(invitee.id)}
                                data-toggles-rank-selector={String(invitee.id)}
                                className={`p-1 ${
                                  darkMode
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                                } rounded-full transition-colors`}
                                title="Change signing order"
                                disabled={invitees.length <= 1}
                              >
                                <FaSortNumericDown
                                  className={`${
                                    darkMode
                                      ? "text-gray-400 hover:text-gray-300"
                                      : "text-gray-500 hover:text-gray-700"
                                  } text-sm ${
                                    invitees.length <= 1
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                />
                              </button>

                              {showRankSelector[String(invitee.id)] &&
                                invitees.length > 1 && (
                                  <div
                                    ref={(el) =>
                                      (rankSelectorContainerRefs.current[
                                        String(invitee.id)
                                      ] = el)
                                    }
                                    className={`absolute z-20 top-full left-1/2 -translate-x-1/2 mt-1 ${
                                      darkMode
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-300"
                                    } border rounded-md shadow-lg p-1 w-max min-w-[50px]`}
                                  >
                                    <select
                                      title={`Set signing order for ${
                                        invitee.name || "this invitee"
                                      }`}
                                      value={invitee.rank || ""}
                                      onChange={(e) => {
                                        updateInviteeRank(
                                          invitee.id,
                                          parseInt(e.target.value)
                                        );
                                        setShowRankSelector((prev) => ({
                                          ...prev,
                                          [String(invitee.id)]: false,
                                        }));
                                      }}
                                      size={Math.min(5, invitees.length)}
                                      className={`block w-full text-xs ${
                                        darkMode
                                          ? "bg-gray-700 text-gray-200"
                                          : "bg-white"
                                      } rounded-sm focus:outline-none appearance-none text-center`}
                                    >
                                      {Array.from(
                                        { length: invitees.length },
                                        (_, i) => i + 1
                                      ).map((rankValue) => (
                                        <option
                                          key={rankValue}
                                          value={rankValue}
                                          className={`py-1 px-3 ${
                                            darkMode
                                              ? "hover:bg-gray-600"
                                              : "hover:bg-gray-100"
                                          }`}
                                        >
                                          {rankValue}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`${
                              darkMode
                                ? "bg-gray-600 text-gray-300"
                                : "bg-gray-300 text-gray-700"
                            } rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0`}
                          >
                            •
                          </div>
                        )}

                        <h2
                          className={`md:text-sm xs:text-[12px] font-semibold ${
                            darkMode ? "text-gray-200" : "text-gray-800"
                          } flex-grow truncate`}
                          title={invitee.name || "New Invitee"}
                        >
                          {invitee.name || "New Invitee"}
                        </h2>
                        <div className="relative inline-block text-left">
                          <div className="flex items-center gap-1">
                            {invitee.signatureTypes?.length > 0 && (
                              <FaCheck
                                title="Methods Confirmed"
                                className="text-green-500"
                              />
                            )}
                            <button
                              onClick={() => toggleOptions(invitee.id)}
                              data-toggles-options={String(invitee.id)}
                              className={`md:p-2 xs:p-2 ${
                                darkMode
                                  ? "hover:bg-blue-900 bg-blue-800"
                                  : "hover:bg-blue-100 bg-blue-50"
                              } rounded-full flex items-center md:text-sm xs:text-[10px] gap-1 transition-colors`}
                            >
                              <span className={darkMode ? "text-gray-200" : ""}>
                                Signature Types
                              </span>
                              <HiDotsVertical
                                className={`${
                                  darkMode ? "text-gray-300" : "text-gray-500"
                                } text-sm`}
                              />
                            </button>
                          </div>

                          {showOptions[String(invitee.id)] && (
                            <div
                              ref={(el) =>
                                (dropdownRefs.current[String(invitee.id)] = el)
                              }
                              className={`absolute z-20 right-0 mt-1 w-64 ${
                                darkMode
                                  ? "bg-gray-700 border-gray-600"
                                  : "bg-white border-gray-200"
                              } shadow-lg border rounded-lg overflow-hidden`}
                            >
                              <div
                                className={`p-3 border-b ${
                                  darkMode
                                    ? "border-gray-600 bg-gray-800"
                                    : "border-gray-100 bg-gray-50"
                                }`}
                              >
                                <h3
                                  className={`font-semibold text-sm ${
                                    darkMode ? "text-gray-200" : "text-gray-800"
                                  }`}
                                >
                                  Select Signing Method
                                </h3>
                                <p
                                  className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  } mt-1`}
                                >
                                  Choose how {invitee.name || "this person"}{" "}
                                  will sign
                                </p>
                              </div>
                              <div className="p-1">
                                {methods.map((method) => (
                                  <button
                                    key={method.id}
                                    onClick={() => toggleMethod(method.id)}
                                    className={`flex items-center w-full p-2 rounded-md mb-1 text-sm ${
                                      selectedMethods.includes(method.id)
                                        ? darkMode
                                          ? "bg-blue-900 text-blue-300"
                                          : "bg-blue-50 text-blue-700"
                                        : darkMode
                                          ? "hover:bg-gray-600 text-gray-200"
                                          : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    <div
                                      className={`flex items-center justify-center w-6 h-6 rounded-full mr-2.5 ${
                                        selectedMethods.includes(method.id)
                                          ? darkMode
                                            ? "bg-blue-800"
                                            : "bg-blue-100"
                                          : darkMode
                                            ? "bg-gray-600"
                                            : "bg-gray-100"
                                      }`}
                                    >
                                      {method.icon}
                                    </div>
                                    <span className="font-medium">
                                      {method.name}
                                    </span>
                                    {selectedMethods.includes(method.id) && (
                                      <FaCheck className="ml-auto text-green-500 text-xs" />
                                    )}
                                  </button>
                                ))}
                              </div>
                              <div
                                className={`p-2 ${
                                  darkMode
                                    ? "bg-gray-800 border-gray-700"
                                    : "bg-gray-50 border-gray-200"
                                } border-t flex justify-end`}
                              >
                                <button
                                  onClick={() => handleSubmit(invitee.id)}
                                  className={`px-3 py-1.5 ${
                                    darkMode
                                      ? "bg-blue-700 hover:bg-blue-600"
                                      : "bg-[#3470b2] hover:bg-[#2c5fa5]"
                                  } text-white rounded-md text-xs font-medium transition-colors disabled:opacity-50`}
                                  disabled={selectedMethods.length === 0}
                                >
                                  Confirm Methods
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor={`name-${invitee.id}`}
                            className={`block text-xs font-medium ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            } mb-1`}
                          >
                            Full Name
                          </label>
                          <input
                            id={`name-${invitee.id}`}
                            type="text"
                            value={invitee.name}
                            onChange={(e) =>
                              updateInvitee(invitee.id, "name", e.target.value)
                            }
                            disabled={invitee.isSelf}
                            className={`block w-full px-3 py-1.5 border ${
                              darkMode
                                ? "border-gray-600 bg-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            } rounded-md shadow-sm focus:ring-1 text-sm disabled:${
                              darkMode ? "bg-gray-600" : "bg-gray-100"
                            } disabled:cursor-not-allowed`}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`contact-${invitee.id}`}
                            className={`block text-xs font-medium ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            } mb-1`}
                          >
                            Contact / Email
                          </label>
                          <div className="relative">
                            <span
                              className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${
                                darkMode ? "text-gray-400" : "text-gray-400"
                              } text-sm`}
                            >
                              <FaEnvelope />
                            </span>
                            <input
                              id={`contact-${invitee.id}`}
                              type="email"
                              value={invitee.contact}
                              onChange={(e) =>
                                updateInvitee(
                                  invitee.id,
                                  "contact",
                                  e.target.value
                                )
                              }
                              disabled={invitee.isSelf}
                              className={`pl-8 block w-full px-3 py-1.5 border ${
                                darkMode
                                  ? "border-gray-600 bg-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              } rounded-md shadow-sm focus:ring-1 text-sm disabled:${
                                darkMode ? "bg-gray-600" : "bg-gray-100"
                              } disabled:cursor-not-allowed`}
                              placeholder="email@example.com"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        {!invitee.isSelf && (
                          <button
                            onClick={() => removeInvitee(invitee.id)}
                            className={`p-2 ${
                              darkMode
                                ? "text-red-400 hover:text-red-300 hover:bg-red-900"
                                : "text-red-700 hover:text-red-600 hover:bg-red-50"
                            } rounded-full transition-colors`}
                            title="Remove Invitee"
                          >
                            <MdDelete />
                          </button>
                        )}
                        <button
                          onClick={openSidebar}
                          className={`flex items-center gap-1 p-1 ${
                            darkMode
                              ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900"
                              : "text-green-700 hover:text-blue-600 hover:bg-blue-50"
                          } rounded-full transition-colors`}
                          aria-label="Open Invitee Settings"
                        >
                          <MdOutlineSecurity size={13} />
                          <span
                            className={`${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            } text-[15px]`}
                          >
                            Security Question
                            <span className="text-red-500"> *</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                onClick={addInvitee}
                className={`cursor-pointer  border-2 border-dashed mt-1 ${darkMode ? "border-blue-500 hover:border-blue-400 hover:bg-blue-900" : "border-blue-300 hover:border-blue-400 hover:bg-blue-50"} rounded-lg p-3 text-center ${darkMode ? "text-blue-400" : "text-[#3470b2]"} transition-all text-sm`}
              >
                <div className="flex items-center justify-center space-x-1.5">
                  <FaUserPlus
                    className={`${darkMode ? "text-blue-400" : "text-[#3470b2]"} text-base`}
                  />
                  <span className="font-medium">Add Another Invitee</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  className={`px-5 py-2 ${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-md text-sm font-medium shadow-sm transition-colors`}
                  onClick={() => navigate("/maindashboard/createfile")}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  className={`px-5 py-2 ${darkMode ? "bg-blue-700 hover:bg-blue-600" : "bg-[#3470b2] hover:bg-[#2c5fa5]"} text-white rounded-md font-medium shadow-sm flex items-center space-x-1.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={handleNext}
                  disabled={isLoading || invitees.length === 0}
                >
                  <span>{isLoading ? "Sending..." : "Next"}</span>
                  {!isLoading && <FaChevronRight className="text-xs" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isSidebarOpen &&
        (isMobile ? (
          <div className="fixed inset-0 z-[1000] bg-gray-900">
            <SidebarRequestfile onClose={closeSidebar} darkMode={darkMode} />
          </div>
        ) : (
          <aside
            className={`
              flex-shrink-0 transition-all duration-300 border-l ease-in-out ${darkMode ? "border-gray-700" : "border-gray-200"}
              w-[350px] ${darkMode ? "bg-gray-800" : "bg-white"}
            `}
            style={{ overflow: "hidden" }}
          >
            <SidebarRequestfile onClose={closeSidebar} darkMode={darkMode} />
          </aside>
        ))}
    </div>
  );
};

export default Requestfile;
