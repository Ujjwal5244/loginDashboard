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


const Requestfile = () => {
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
  const navigate = useNavigate();

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
    const fetchProfile = async () => {
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }
      try {
        const response = await axios.get(`${baseUrl}/api/user/profile`, {
          headers: { authorization: token },
        });
        const decrypted = await decryptText(response.data.body);
        const data = JSON.parse(decrypted);

        if (data?.data?.name && data?.data?.email) {
          const signer = {
            id: data.data.id,
            name: data.data.name,
            contact: data.data.email,
            isSelf: true,
            signatureTypes: [],
          };
          setSelfSignerInfo(signer);
          if (iWillSign) {
            setInvitees([{ ...signer, rank: 1 }]);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch your profile information.");
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [token, iWillSign]); // Re-fetch or re-evaluate if iWillSign changes

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
      const payloadString = payloadData;
      const encryptedPayload = await encryptText(payloadString);

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
        if (error.response.data && typeof error.response.data === "object") {
          try {
            const decryptedError = await decryptText(error.response.data.body);
            const errorData = JSON.parse(decryptedError);
            errorMessage = errorData.message || errorMessage;
          } catch (decryptError) {
            console.error("Failed to decrypt error response:", decryptError);
            errorMessage = error.response.data.message || errorMessage;
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

  return (
    <div className="flex h-[100%] bg-white">
      {/* Main Content Pane */}
      <main className="flex-grow overflow-y-auto">
        <div className="font-sans py-4 p-2">
          <div className="max-w-5xl mx-auto">
            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-1">
                <span className="border border-gray-400 rounded-full md:w-6 md:h-6 xs:w-4 xs:h-4 flex items-center justify-center md:text-xs xs:text-[8px]">
                  1
                </span>
                <span className="md:text-sm xs:text-[12px] text-gray-500">
                  Generate
                </span>
              </div>
              <div className="md:w-8 xs:w-4 h-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <span className="bg-[#2c5fa5] text-white rounded-full md:w-6 md:h-6 xs:w-4 xs:h-4 flex items-center justify-center md:text-xs xs:text-[8px] font-bold">
                  2
                </span>
                <span className=" font-medium md:text-sm xs:text-[12px] text-[#2c5fa5]">
                  Request
                </span>
              </div>
              <div className="md:w-8 xs:w-4 h-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <span className="border border-gray-400 rounded-full md:w-6 md:h-6 xs:w-4 xs:h-4 flex items-center justify-center md:text-xs xs:text-[8px]">
                  3
                </span>
                <span className="md:text-sm xs:text-[12px] text-gray-500">
                  Approve
                </span>
              </div>
            </div>

            <div className="shadow-md border border-gray-200 rounded-xl md:p-6 xs:p-3 xs:py-6 bg-white">
              <div className="text-center mb-6">
                <h1 className="md:text-2xl xs:text-xl font-bold text-[#3470b2] mb-1">
                  Document Signing Invitation
                </h1>
                <p className="text-gray-500 text-sm">
                  Add signers and reviewers below
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-3 bg-white shadow-sm rounded-full md:px-4 xs:px-4 py-2 border border-gray-200">
                  <span className="md:text-xs xs:text-[11px] text-gray-700 font-medium">
                    Fixed sign order
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isFixedOrder}
                      onChange={handleFixedOrderToggle}
                    />
                    <div className="relative w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 transition-all">
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isFixedOrder ? "translate-x-4" : ""}`}
                      ></div>
                    </div>
                  </label>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <span className="md:text-xs xs:text-[11px] text-gray-700 font-medium">
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
                    <div className="relative w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 transition-all">
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${iWillSign ? "translate-x-4" : ""}`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                {inviteesToDisplay.map((invitee) => (
                  <div
                    key={invitee.id}
                    className="bg-white p-4 shadow-sm rounded-lg border border-gray-100 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      {isFixedOrder ? (
                        <div className="flex items-center space-x-2">
                          <span
                            className="bg-[#3470b2] text-white rounded-full md:w-7 md:h-7 xs:w-5 xs:h-5 flex items-center justify-center md:text-xs xs:text-[10px] font-bold shrink-0"
                            title={`Signing Order: ${invitee.rank}`}
                          >
                            {invitee.rank}
                          </span>
                          <div className="relative">
                            <button
                              onClick={() => toggleRankSelector(invitee.id)}
                              data-toggles-rank-selector={String(invitee.id)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              title="Change signing order"
                              disabled={invitees.length <= 1}
                            >
                              <FaSortNumericDown
                                className={`text-gray-500 hover:text-gray-700 text-sm ${invitees.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
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
                                  className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-1 w-max min-w-[50px]"
                                >
                                  <select
                                    title={`Set signing order for ${invitee.name || "this invitee"}`}
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
                                    className="block w-full text-xs bg-white rounded-sm focus:outline-none appearance-none text-center"
                                  >
                                    {Array.from(
                                      { length: invitees.length },
                                      (_, i) => i + 1
                                    ).map((rankValue) => (
                                      <option
                                        key={rankValue}
                                        value={rankValue}
                                        className="py-1 px-3"
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
                        <div className="bg-gray-300 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">
                          •
                        </div>
                      )}

                      <h2
                        className="md:text-sm xs:text-[12px] font-semibold text-gray-800 flex-grow truncate"
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
                            className="md:p-2 xs:p-2  hover:bg-blue-100 bg-blue-50 rounded-full flex items-center md:text-sm xs:text-[10px] gap-1 transition-colors"
                          >
                            Signature Types
                            <HiDotsVertical className="text-gray-500 hover:text-gray-700 text-sm" />
                          </button>
                        </div>

                        {showOptions[String(invitee.id)] && (
                          <div
                            ref={(el) =>
                              (dropdownRefs.current[String(invitee.id)] = el)
                            }
                            className="absolute z-20 right-0 mt-1 w-64 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <div className="p-3 border-b border-gray-100 bg-gray-50">
                              <h3 className="font-semibold text-sm text-gray-800">
                                Select Signing Method
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Choose how {invitee.name || "this person"} will
                                sign
                              </p>
                            </div>
                            <div className="p-1">
                              {methods.map((method) => (
                                <button
                                  key={method.id}
                                  onClick={() => toggleMethod(method.id)}
                                  className={`flex items-center w-full p-2 rounded-md mb-1 text-sm ${selectedMethods.includes(method.id) ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`}
                                >
                                  <div
                                    className={`flex items-center justify-center w-6 h-6 rounded-full mr-2.5 ${selectedMethods.includes(method.id) ? "bg-blue-100" : "bg-gray-100"}`}
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
                            <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-end">
                              <button
                                onClick={() => handleSubmit(invitee.id)}
                                className="px-3 py-1.5 bg-[#3470b2] text-white rounded-md text-xs font-medium hover:bg-[#2c5fa5] transition-colors disabled:opacity-50"
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
                          className="block text-xs font-medium text-gray-700 mb-1"
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
                          className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`contact-${invitee.id}`}
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Contact / Email
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
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
                            className="pl-8 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end  mt-3">
                      {!invitee.isSelf && (
                        <button
                          onClick={() => removeInvitee(invitee.id)}
                          className="p-2 text-red-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove Invitee"
                        >
                          <MdDelete />
                        </button>
                      )}
                      <button
                        onClick={openSidebar}
                        className="flex items-center gap-1 p-1 text-green-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        aria-label="Open Invitee Settings"
                      >
                        <MdOutlineSecurity size={13} />
                        <span className="text-gray-700 text-[15px]">
                          Security Question
                          <span className="text-red-500"> *</span>
                        </span>
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  onClick={addInvitee}
                  className="cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-lg p-3 text-center text-[#3470b2] hover:bg-blue-50 transition-all text-sm"
                >
                  <div className="flex items-center justify-center space-x-1.5">
                    <FaUserPlus className="text-[#3470b2] text-base" />
                    <span className="font-medium">Add Another Invitee</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium shadow-sm transition-colors"
                  onClick={() => navigate("/maindashboard/createfile")}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  className="px-5 py-2 bg-[#3470b2] text-white rounded-md font-medium shadow-sm flex items-center space-x-1.5 text-sm hover:bg-[#2c5fa5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Sidebar Pane */}
     {isSidebarOpen && (
  isMobile ? (
    // ON MOBILE (< 768px): Render as a full-screen fixed overlay.
    // `fixed inset-0` makes it cover the entire screen.
    // `z-50` ensures it's on top of all other content.
    <div className="fixed top-0 left-0 w-full h-[100%] z-[1000] bg-white">
      <SidebarRequestfile onClose={closeSidebar} />
    </div>
  ) : (
    // ON DESKTOP (>= 768px): Render as the original fixed-width sidebar.
    <aside
      className={`
        flex-shrink-0 transition-all duration-300 ease-in-out border-l border-gray-200
        w-[350px]
      `}
      style={{ overflow: 'hidden' }}
    >
      <SidebarRequestfile onClose={closeSidebar} />
    </aside>
  )
)}
    </div>
  );
};

export default Requestfile;
