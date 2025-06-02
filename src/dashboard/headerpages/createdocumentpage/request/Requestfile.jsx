import React, { useState, useRef, useEffect } from "react";
import {
  FaEnvelope,
  FaUserPlus,
  FaChevronRight,
  FaCheck,
  FaSignature,
  FaFingerprint,
  FaMobileAlt,
  FaIdCard,
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Requestfile = () => {
  const [invitees, setInvitees] = useState([
    { name: "ujjwal yadav", contact: "ujjwalyadav5244@gmail.com" },
  ]);
  const [isFixedOrder, setIsFixedOrder] = useState(true);
  const [iWillSign, setIWillSign] = useState(false);
  const navigate = useNavigate();

  const [showOptions, setShowOptions] = useState({});
  const [selectedMethods, setSelectedMethods] = useState([]);
  const dropdownRefs = useRef({});

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

  // Toggle checkbox
  const toggleOptions = (index) => {
    setShowOptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleMethod = (methodId) => {
    setSelectedMethods((prev) =>
      prev.includes(methodId)
        ? prev.filter((id) => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSubmit = (index) => {
    alert(
      `Selected methods for ${invitees[index].name}: ${selectedMethods
        .map((id) => methods.find((m) => m.id === id).name)
        .join(", ")}`
    );
    setShowOptions((prev) => ({ ...prev, [index]: false }));
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(dropdownRefs.current).forEach(([key, ref]) => {
        if (ref && !ref.contains(event.target)) {
          setShowOptions((prev) => ({
            ...prev,
            [key]: false,
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFixedOrderToggle = () => {
    setIsFixedOrder((prev) => {
      const newValue = !prev;
      console.log("Fixed Signing Order:", newValue);
      return newValue;
    });
  };

  const handleIWillSignToggle = () => {
    setIWillSign((prev) => {
      const newValue = !prev;
      console.log("I will sign this document:", newValue);
      return newValue;
    });
  };

  const addInvitee = () => {
    setInvitees([...invitees, { name: "", contact: "" }]);
  };

  const updateInvitee = (index, field, value) => {
    const newInvitees = [...invitees];
    newInvitees[index][field] = value;
    setInvitees(newInvitees);
  };

  return (
    <div className="font-sans py-4">
  <div className="max-w-5xl mx-auto">
    {/* Simplified Progress Bar */}
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className="flex items-center gap-1">
        <span className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">
          1
        </span>
        <span className="text-sm text-gray-500">Generate</span>
      </div>
      
      <div className="w-8 h-px bg-gray-300"></div>
      
      <div className="flex items-center gap-1">
        <span className="bg-[#2c5fa5] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          2
        </span>
        <span className=" font-medium text-sm text-[#2c5fa5]">Request</span>
      </div>
      
      <div className="w-8 h-px bg-gray-300"></div>
      
      <div className="flex items-center gap-1">
        <span className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">
          3
        </span>
        <span className="text-sm text-gray-500">Approve</span>
      </div>
    </div>
        
        {/* Content */}
        <div className="shadow-md border border-gray-200 rounded-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#3470b2] mb-1">
              Document Signing Invitation
            </h1>
            <p className="text-gray-500 text-sm">
              Add signers and reviewers below
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3 bg-white shadow-sm rounded-full px-4 py-2 border border-gray-200">
              {/* Toggle 1: Fixed Signing Order */}
              <span className="text-xs text-gray-700 font-medium">
                Fixed signing order
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

              {/* Divider */}
              <div className="h-4 w-px bg-gray-300"></div>

              {/* Toggle 2: I will sign this document */}
              <span className="text-xs text-gray-700 font-medium">
                I will sign
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={iWillSign}
                  onChange={handleIWillSignToggle}
                />
                <div className="relative w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 transition-all">
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${iWillSign ? "translate-x-4" : ""}`}
                  ></div>
                </div>
              </label>
            </div>
          </div>

          {/* Invitees */}
          <div className="space-y-3">
            {invitees.map((invitee, index) => (
              <div
                key={index}
                className="bg-white p-4 shadow-sm rounded-lg border border-gray-100 transition-all hover:shadow-md"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-[#3470b2] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    {invitee.name || "New Invitee"}
                  </h2>

                  <div
                    className="relative inline-block text-left ml-auto"
                    ref={(el) => (dropdownRefs.current[index] = el)}
                  >
                    <button
                      onClick={() => toggleOptions(index)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <HiDotsVertical className="text-gray-500 hover:text-gray-700 text-sm" />
                    </button>

                    {showOptions[index] && (
                      <div className="absolute z-10 left-0 mt-1 w-64 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                          <h3 className="font-semibold text-sm text-gray-800">
                            Select Signing Method
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Choose how this person will sign
                          </p>
                        </div>

                        <div className="p-1">
                          {methods.map((method) => (
                            <button
                              key={method.id}
                              onClick={() => toggleMethod(method.id)}
                              className={`flex items-center w-full p-2 rounded-md mb-1 text-sm ${selectedMethods.includes(method.id) ? "bg-blue-50" : "hover:bg-gray-50"}`}
                            >
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 mr-2">
                                {method.icon}
                              </div>
                              <span className="font-medium text-gray-700">
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
                            onClick={() => handleSubmit(index)}
                            className="px-3 py-1.5 bg-[#3470b2] text-white rounded-md text-xs font-medium hover:bg-[#2c5fa5] transition-colors"
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={invitee.name}
                      onChange={(e) =>
                        updateInvitee(index, "name", e.target.value)
                      }
                      className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Contact (Email or Phone)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2.5 text-gray-400 text-sm">
                        <FaEnvelope />
                      </span>
                      <input
                        type="text"
                        value={invitee.contact}
                        onChange={(e) =>
                          updateInvitee(index, "contact", e.target.value)
                        }
                        className="pl-8 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              onClick={addInvitee}
              className="cursor-pointer border-2 border-dashed border-blue-200 rounded-lg p-3 text-center text-[#3470b2] hover:bg-blue-50 transition-all text-sm"
            >
              <div className="flex items-center justify-center space-x-1">
                <FaUserPlus className="text-[#3470b2] text-xs" />
                <span className="font-medium">Add Another Invitee</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-between">
            <button
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium shadow-sm"
              onClick={() => navigate("/maindashboard/createfile")}
            >
              Back
            </button>
            <button
              className="px-4 py-1.5 bg-[#3470b2] text-white rounded-md font-medium shadow-sm flex items-center space-x-1 text-sm"
              onClick={() => navigate("/maindashboard/approve")}
            >
              <span>Next</span>
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requestfile;