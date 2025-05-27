import React, { useState, useRef, useEffect } from "react";
import { FaEnvelope, FaUserPlus, FaChevronRight } from "react-icons/fa";
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
    "Aadhaar OTP",
    "Biometric",
    "Electronic Sign",
    "Digital Signature",
  ];

  // Toggle checkbox
  const toggleOptions = (index) => {
    setShowOptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmit = () => {
    alert("Selected methods: " + selectedMethods.join(", "));
    // Send data to backend here
    setShowOptions(false); // close box after submit
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2c5fa5] to-[#3470b2] text-white py-3 px-6 flex items-center gap-4 shadow-md rounded-3xl justify-center">
        <div className="flex items-center gap-1">
          <span className="bg-white text-[#3470b2] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            1
          </span>
          <span className="font-medium text-sm">Generate</span>
          <span className="text-white text-sm">›</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-white text-[#3470b2] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            2
          </span>
          <span className="font-medium text-sm">Request</span>
          <span className="text-white text-sm">›</span>
        </div>
        <div className="flex items-center gap-1 text-gray-200">
          <span className="border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            3
          </span>
          <span className="text-sm">Approve</span>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3470b2] mb-2">
            Document Signing Invitation
          </h1>
          <p className="text-gray-500 text-lg">
            Add signers and reviewers below
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white shadow-lg rounded-full px-6 py-3 border border-gray-200">
            {/* Toggle 1: Fixed Signing Order */}
            <span className="text-sm text-gray-700 font-medium">
              Fixed signing order
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isFixedOrder}
                onChange={handleFixedOrderToggle}
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 transition-all">
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isFixedOrder ? "translate-x-5" : ""}`}
                ></div>
              </div>
            </label>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Toggle 2: I will sign this document */}
            <span className="text-sm text-gray-700 font-medium">
              I will sign this document
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={iWillSign}
                onChange={handleIWillSignToggle}
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 transition-all">
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${iWillSign ? "translate-x-5" : ""}`}
                ></div>
              </div>
            </label>
          </div>
        </div>

        {/* Invitees */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {invitees.map((invitee, index) => (
            <div
              key={index}
              className="bg-white p-6 shadow-lg rounded-lg border border-gray-100 transition-all hover:shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#3470b2] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {invitee.name || "New Invitee"}
                </h2>

                <div
                  className="relative inline-block text-left"
                  ref={(el) => (dropdownRefs.current[index] = el)}
                >
                  <button
                    onClick={() => toggleOptions(index)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <HiDotsVertical />
                  </button>

                  {showOptions[index] && (
                    <div className="absolute z-10 mt-2 w-64 bg-white shadow-lg border rounded-lg p-4">
                      <p className="font-semibold mb-2">
                        Choose Signing Methods:
                      </p>
                      <form>
                        {methods.map((method) => (
                          <label
                            key={method}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMethods.includes(method)}
                              onChange={() => toggleMethod(method)}
                              className="form-checkbox"
                            />
                            <span>{method}</span>
                          </label>
                        ))}
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={invitee.name}
                    onChange={(e) =>
                      updateInvitee(index, "name", e.target.value)
                    }
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact (Email or Phone)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      <FaEnvelope />
                    </span>
                    <input
                      type="text"
                      value={invitee.contact}
                      onChange={(e) =>
                        updateInvitee(index, "contact", e.target.value)
                      }
                      className="pl-10 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div
            onClick={addInvitee}
            className="cursor-pointer border-2 border-dashed border-blue-300 rounded-xl p-5 text-center text-[#3470b2] hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center justify-center space-x-2">
              <FaUserPlus className="text-[#3470b2] transition-colors" />
              <span className="font-medium">Add Another Invitee</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 flex justify-between max-w-2xl mx-auto">
            <button className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors shadow-sm">
              Back
            </button>
            <button className="px-6 py-2.5 bg-[#3470b2] text-white rounded-lg font-medium transition-all shadow-lg flex items-center space-x-2">
              <span>Next</span>
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requestfile;
