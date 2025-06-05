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
  FaSortNumericDown, // Icon for sorting/rank
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Requestfile = () => {
  const initialInvitees = [
    { id: 1, name: "Ujjwal Yadav", contact: "ujjwalyadav5244@gmail.com", rank: 1 },
  ];
  const [invitees, setInvitees] = useState(initialInvitees);
  const nextIdRef = useRef(Math.max(0, ...initialInvitees.map(i => i.id)) + 2);

  const [isFixedOrder, setIsFixedOrder] = useState(true);
  const [iWillSign, setIWillSign] = useState(false);
  const navigate = useNavigate();

  const [showOptions, setShowOptions] = useState({});
  const [selectedMethods, setSelectedMethods] = useState([]);
  const dropdownRefs = useRef({});

  // New state and ref for rank selector
  const [showRankSelector, setShowRankSelector] = useState({});
  const rankSelectorContainerRefs = useRef({});

  const methods = [
    { id: "aadhaar", name: "Aadhaar OTP", icon: <FaMobileAlt className="text-blue-500" /> },
    { id: "biometric", name: "Biometric", icon: <FaFingerprint className="text-green-500" /> },
    { id: "esign", name: "Electronic Sign", icon: <FaSignature className="text-purple-500" /> },
    { id: "digital", name: "Digital Signature", icon: <FaIdCard className="text-red-500" /> },
  ];

  const toggleOptions = (inviteeId) => {
    const key = String(inviteeId);
    // Close other dropdowns (options and rank selectors)
    setShowRankSelector({});
    setShowOptions((prev) => ({
      ...Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, false])),
      [key]: !prev[key],
    }));
    setSelectedMethods([]);
  };

  // New toggle function for rank selector
  const toggleRankSelector = (inviteeId) => {
    if (invitees.length <= 1) return; // Prevent opening if only one/zero invitees

    const key = String(inviteeId);
    // Close other dropdowns (options and rank selectors)
    setShowOptions({});
    setShowRankSelector((prev) => {
      const isOpenCurrently = !!prev[key];
      const allClosed = Object.fromEntries(
        Object.keys(prev)
          .map(k => [k, false])
          .filter(entry => entry !== undefined)
      );
      return {
        ...allClosed,
        [key]: !isOpenCurrently,
      };
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
    const invitee = invitees.find(inv => inv.id === inviteeId);
    if (!invitee) return;

    alert(
      `Selected methods for ${invitee.name}: ${selectedMethods
        .map((id) => methods.find((m) => m.id === id).name)
        .join(", ")}`
    );
    setShowOptions((prev) => ({ ...prev, [String(inviteeId)]: false }));
    setSelectedMethods([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle Options Dropdowns
      Object.keys(showOptions).forEach(inviteeIdStr => {
        if (showOptions[inviteeIdStr]) {
          const optionsDropdownRef = dropdownRefs.current[inviteeIdStr];
          const optionsToggleButton = document.querySelector(`button[data-toggles-options='${inviteeIdStr}']`);

          if (
            optionsDropdownRef && !optionsDropdownRef.contains(event.target) &&
            (!optionsToggleButton || !optionsToggleButton.contains(event.target))
          ) {
            setShowOptions(prev => ({ ...prev, [inviteeIdStr]: false }));
          }
        }
      });

      // Handle Rank Selector Dropdowns
      Object.keys(showRankSelector).forEach(inviteeIdStr => {
        if (showRankSelector[inviteeIdStr]) {
          const rankDropdownRef = rankSelectorContainerRefs.current[inviteeIdStr];
          const rankToggleButton = document.querySelector(`button[data-toggles-rank-selector='${inviteeIdStr}']`);
          
          if (
            rankDropdownRef && !rankDropdownRef.contains(event.target) &&
            (!rankToggleButton || !rankToggleButton.contains(event.target))
          ) {
            setShowRankSelector(prev => ({ ...prev, [inviteeIdStr]: false }));
          }
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions, showRankSelector]);


  const handleFixedOrderToggle = () => {
    setIsFixedOrder(prevIsFixed => {
      const newIsFixed = !prevIsFixed;
      setInvitees(currentInvitees => {
        if (newIsFixed) {
          const ranksAreValid = currentInvitees.length > 0 && currentInvitees.every(
            (inv, idx, arr) => arr.find(i => i.rank === idx + 1)
          ) && new Set(currentInvitees.map(i => i.rank)).size === currentInvitees.length;

          if (!ranksAreValid) {
            return currentInvitees.map((invitee, index) => ({
              ...invitee,
              rank: index + 1,
            }));
          }
        }
        return currentInvitees;
      });
      return newIsFixed;
    });
  };

  const handleIWillSignToggle = () => {
    setIWillSign((prev) => !prev);
  };

  const addInvitee = () => {
    const newId = nextIdRef.current;
    nextIdRef.current += 1;
    
    setInvitees(prevInvitees => {
      const newRank = isFixedOrder ? prevInvitees.length + 1 : null;
      const newInviteesList = [
        ...prevInvitees,
        { id: newId, name: "", contact: "", rank: newRank },
      ];
      if(isFixedOrder) {
        return newInviteesList.map((inv, index) => ({...inv, rank: index + 1}));
      }
      return newInviteesList;
    });
  };

  const updateInvitee = (inviteeId, field, value) => {
    setInvitees(prevInvitees =>
      prevInvitees.map(inv =>
        inv.id === inviteeId ? { ...inv, [field]: value } : inv
      )
    );
  };
  
  const updateInviteeRank = (inviteeId, newSelectedRank) => {
    setInvitees(prevInvitees => {
      const currentInvitee = prevInvitees.find(inv => inv.id === inviteeId);
      if (!currentInvitee || currentInvitee.rank === newSelectedRank) return prevInvitees;

      const oldRank = currentInvitee.rank;

      return prevInvitees.map(inv => {
        if (inv.id === inviteeId) {
          return { ...inv, rank: newSelectedRank };
        }
        if (inv.rank === newSelectedRank) {
          return { ...inv, rank: oldRank };
        }
        return inv;
      }).sort((a,b) => (a.rank || Infinity) - (b.rank || Infinity)); // Re-sort by rank to maintain visual order if ranks are adjusted
    });
  };

  const inviteesToDisplay = useMemo(() => {
    if (isFixedOrder) {
      return [...invitees]
        .filter(inv => inv.rank != null)
        .sort((a, b) => a.rank - b.rank);
    }
    return invitees;
  }, [invitees, isFixedOrder]);


  return (
    <div className="font-sans py-4">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1"><span className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span><span className="text-sm text-gray-500">Generate</span></div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center gap-1"><span className="bg-[#2c5fa5] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span><span className=" font-medium text-sm text-[#2c5fa5]">Request</span></div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center gap-1"><span className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span><span className="text-sm text-gray-500">Approve</span></div>
        </div>
        
        <div className="shadow-md border border-gray-200 rounded-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#3470b2] mb-1">Document Signing Invitation</h1>
            <p className="text-gray-500 text-sm">Add signers and reviewers below</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3 bg-white shadow-sm rounded-full px-4 py-2 border border-gray-200">
              <span className="text-xs text-gray-700 font-medium">Fixed signing order</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isFixedOrder} onChange={handleFixedOrderToggle} />
                <div className="relative w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 transition-all">
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isFixedOrder ? "translate-x-4" : ""}`}></div>
                </div>
              </label>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-xs text-gray-700 font-medium">I will sign</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={iWillSign} onChange={handleIWillSignToggle} />
                <div className="relative w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 transition-all">
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${iWillSign ? "translate-x-4" : ""}`}></div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            {inviteesToDisplay.map((invitee, displayIndex) => (
              <div
                key={invitee.id}
                className="bg-white p-4 shadow-sm rounded-lg border border-gray-100 transition-all hover:shadow-md"
              >
                <div className="flex items-center space-x-2 mb-3">
                  {isFixedOrder ? (
                    <div className="flex items-center space-x-2">
                      <span 
                        className="bg-[#3470b2] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0"
                        title={`Signing Order: ${invitee.rank}`}
                      >
                        {invitee.rank}
                      </span>
                      {/* Container for Sort Icon and its Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => toggleRankSelector(invitee.id)}
                          data-toggles-rank-selector={String(invitee.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          title="Change signing order"
                          disabled={invitees.length <= 1}
                        >
                          <FaSortNumericDown className={`text-gray-500 hover:text-gray-700 text-sm ${invitees.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                        </button>

                        {showRankSelector[String(invitee.id)] && invitees.length > 1 && (
                          <div
                            ref={(el) => (rankSelectorContainerRefs.current[String(invitee.id)] = el)}
                            className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-1 w-max min-w-[50px]"
                          >
                            <select
                              title={`Set signing order for ${invitee.name || 'this invitee'}`}
                              value={invitee.rank || ''}
                              onChange={(e) => {
                                updateInviteeRank(invitee.id, parseInt(e.target.value));
                                // Close the selector after selection
                                setShowRankSelector(prev => ({ ...prev, [String(invitee.id)]: false }));
                              }}
                              size={Math.min(5, invitees.length)} // Show a few options, or all if less than 5.
                              className="block w-full text-xs bg-white rounded-sm focus:outline-none appearance-none text-center"
                            >
                              {Array.from({ length: invitees.length }, (_, i) => i + 1).map(rankValue => (
                                <option key={rankValue} value={rankValue} className="py-1 px-3">
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
                      {displayIndex + 1}
                    </div>
                  )}

                  <h2 className="text-sm font-semibold text-gray-800 flex-grow truncate" title={invitee.name || "New Invitee"}>
                    {invitee.name || "New Invitee"}
                  </h2>

                  <div
                    className="relative inline-block text-left ml-auto"
                    // ref for dropdown content is set inside the conditional render block
                  >
                    <button
                      onClick={() => toggleOptions(invitee.id)}
                      data-toggles-options={String(invitee.id)} // Added data-attribute
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <HiDotsVertical className="text-gray-500 hover:text-gray-700 text-sm" />
                    </button>

                    {showOptions[String(invitee.id)] && (
                      <div 
                        ref={(el) => (dropdownRefs.current[String(invitee.id)] = el)} // Ref moved here
                        className="absolute z-20 right-0 mt-1 w-64 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                          <h3 className="font-semibold text-sm text-gray-800">Select Signing Method</h3>
                          <p className="text-xs text-gray-500 mt-1">Choose how {invitee.name || 'this person'} will sign</p>
                        </div>
                        <div className="p-1">
                          {methods.map((method) => (
                            <button
                              key={method.id}
                              onClick={() => toggleMethod(method.id)}
                              className={`flex items-center w-full p-2 rounded-md mb-1 text-sm ${selectedMethods.includes(method.id) ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`}
                            >
                              <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-2.5 ${selectedMethods.includes(method.id) ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                {method.icon}
                              </div>
                              <span className="font-medium">{method.name}</span>
                              {selectedMethods.includes(method.id) && <FaCheck className="ml-auto text-green-500 text-xs" />}
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
                    <label htmlFor={`name-${invitee.id}`} className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      id={`name-${invitee.id}`}
                      type="text"
                      value={invitee.name}
                      onChange={(e) => updateInvitee(invitee.id, "name", e.target.value)}
                      className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label htmlFor={`contact-${invitee.id}`} className="block text-xs font-medium text-gray-700 mb-1">Contact (Email or Phone)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><FaEnvelope /></span>
                      <input
                        id={`contact-${invitee.id}`}
                        type="text"
                        value={invitee.contact}
                        onChange={(e) => updateInvitee(invitee.id, "contact", e.target.value)}
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
            >
              Back
            </button>
            <button
              className="px-5 py-2 bg-[#3470b2] text-white rounded-md font-medium shadow-sm flex items-center space-x-1.5 text-sm hover:bg-[#2c5fa5] transition-colors"
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