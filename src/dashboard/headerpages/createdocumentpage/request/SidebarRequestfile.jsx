import React, { useState } from "react";
import { CreditCard, Key, Plus, Check, Shield } from "lucide-react";
import { MapPinIcon, UserCircleIcon } from "@heroicons/react/24/outline";

// Reusable ToggleSwitch component
const ToggleSwitch = ({ enabled, setEnabled, darkMode }) => {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`
        relative inline-flex items-center
        h-5 w-9
        flex-shrink-0 cursor-pointer rounded-full 
        border-2 border-transparent 
        p-1
        transition-colors duration-200 ease-in-out 
        focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1
        ${
          enabled
            ? darkMode
              ? "bg-orange-600"
              : "bg-[#3470b2]"
            : darkMode
              ? "bg-gray-600"
              : "bg-gray-200"
        }
        ${darkMode ? "focus:ring-offset-gray-800" : ""}
      `}
      role="switch"
      aria-checked={enabled}
    >
      {/* The inner circle (thumb) */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block 
          h-4 w-4
          transform rounded-full bg-white shadow-lg 
          ring-0
          transition duration-200 ease-in-out
          ${enabled ? "translate-x-3" : "translate-x-0"}
        `}
      />
    </button>
  );
};

// Security Field Component
const SecurityField = ({ id, index, onRemove, canBeRemoved, darkMode }) => {
  const [isRequired, setIsRequired] = useState(true);
  return (
    <div
      className={`space-y-4 rounded-lg border p-4 shadow-sm ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center justify-between">
        <h3
          className={`font-semibold text-[15px] ${darkMode ? "text-gray-200" : "text-gray-700"}`}
        >
          Security Field {index + 1}
        </h3>
        {canBeRemoved && (
          <button
            onClick={() => onRemove(id)}
            className={`text-[10px] font-medium ${darkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700"}`}
          >
            Remove Field
          </button>
        )}
      </div>
      <div className="space-y-1">
        <label
          htmlFor={`field-label-${id}`}
          className={`block text-[12px] font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Field Label <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id={`field-label-${id}`}
          placeholder="e.g. What is your mother's name"
          className={`block w-full rounded-md shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm ${darkMode ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400" : "border-gray-300"}`}
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor={`field-type-${id}`}
          className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Field Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id={`field-type-${id}`}
            className={`block w-full pl-3 pr-10 py-2.5 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3470b2] focus:border-[#3470b2] transition-all duration-200 appearance-none ${darkMode ? "bg-gray-800 border-gray-400 text-gray-200" : "bg-white border-gray-300"}`}
          >
            <option className="py-2">Text</option>
            <option className="py-2">Number</option>
            <option className="py-2">Date</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span
          className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Required Field
        </span>
        <ToggleSwitch
          enabled={isRequired}
          setEnabled={setIsRequired}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

// Aadhaar Section Component
const AadhaarSection = ({ darkMode }) => {
  const [enableAadhaar, setEnableAadhaar] = useState(false);
  const [maskAadhaar, setMaskAadhaar] = useState(true);

  const inputStyles = `block w-full rounded-md shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm ${darkMode ? "bg-gray-800 border-gray-400 text-gray-200 placeholder-gray-400" : "border-gray-300"}`;
  const labelStyles = `block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`;
  const selectStyles = `block w-full rounded-md border pl-10 shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm py-2 ${darkMode ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400" : "border-gray-300"}`;

  return (
    <div className="space-y-6">
      <div
        className={`rounded-lg border p-6 shadow-sm ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}
      >
        <h3
          className={`mb-4 text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
        >
          Aadhaar Verification
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
            >
              Enable Aadhaar Verification
            </p>
            <p
              className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Require invitee to provide Aadhaar details
            </p>
          </div>
          <ToggleSwitch
            enabled={enableAadhaar}
            setEnabled={setEnableAadhaar}
            darkMode={darkMode}
          />
        </div>

        {enableAadhaar && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Mask Aadhaar Number
                </p>
                <p
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Display only last 4 digits for security
                </p>
              </div>
              <ToggleSwitch
                enabled={maskAadhaar}
                setEnabled={setMaskAadhaar}
                darkMode={darkMode}
              />
            </div>
            <div className="space-y-1">
              <label className={labelStyles}>
                Aadhaar Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter 12-digit Aadhaar number"
                className={inputStyles}
                maxLength="12"
              />
            </div>
            <div className="space-y-1">
              <label className={labelStyles}>
                Year of Birth<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter year of birth"
                className={inputStyles}
                maxLength="4"
              />
            </div>
            <div className="space-y-1">
              <label className={labelStyles}>
                Pin Code<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter pincode number"
                className={inputStyles}
                maxLength="6"
              />
            </div>
            <div className="space-y-1">
              <label className={labelStyles}>
                Last 4 Aadhaar Digit<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter 4-digit Aadhaar number"
                className={inputStyles}
                maxLength="4"
              />
            </div>
            <div className="max-w-lg mx-auto">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="state" className={`${labelStyles} mb-1`}>
                    State<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MapPinIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <select id="state" name="state" className={selectStyles}>
                      <option value="" disabled selected>
                        Select a state
                      </option>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="AR">Arunachal Pradesh</option>
                      <option value="AS">Assam</option>
                      <option value="BR">Bihar</option>
                      <option value="CT">Chhattisgarh</option>
                      <option value="GA">Goa</option>
                      <option value="GJ">Gujarat</option>
                      <option value="HR">Haryana</option>
                      <option value="HP">Himachal Pradesh</option>
                      <option value="JH">Jharkhand</option>
                      <option value="KA">Karnataka</option>
                      <option value="KL">Kerala</option>
                      <option value="MP">Madhya Pradesh</option>
                      <option value="MH">Maharashtra</option>
                      <option value="MN">Manipur</option>
                      <option value="ML">Meghalaya</option>
                      <option value="MZ">Mizoram</option>
                      <option value="NL">Nagaland</option>
                      <option value="OD">Odisha</option>
                      <option value="PB">Punjab</option>
                      <option value="RJ">Rajasthan</option>
                      <option value="SK">Sikkim</option>
                      <option value="TN">Tamil Nadu</option>
                      <option value="TG">Telangana</option>
                      <option value="TR">Tripura</option>
                      <option value="UP">Uttar Pradesh</option>
                      <option value="UK">Uttarakhand</option>
                      <option value="WB">West Bengal</option>

                      <option value="AN">Andaman and Nicobar Islands</option>
                      <option value="CH">Chandigarh</option>
                      <option value="DN">
                        Dadra and Nagar Haveli and Daman and Diu
                      </option>
                      <option value="DL">Delhi</option>
                      <option value="JK">Jammu and Kashmir</option>
                      <option value="LA">Ladakh</option>
                      <option value="LD">Lakshadweep</option>
                      <option value="PY">Puducherry</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="gender" className={`${labelStyles} mb-1`}>
                    Gender<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserCircleIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <select id="gender" name="gender" className={selectStyles}>
                      <option value="" disabled selected>
                        Select a gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Advanced Section Component
const AdvancedSection = ({ darkMode }) => {
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [enableIPRestriction, setEnableIPRestriction] = useState(false);

  const labelStyles = `block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`;
  const inputStyles = `block w-full rounded-md shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm ${darkMode ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400" : "border-gray-300"}`;
  const selectStyles = `block w-full p-2 rounded-md border shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm ${darkMode ? "bg-gray-800 border-gray-600 text-gray-200" : "border-gray-300"}`;

  return (
    <div className="space-y-6">
      <div
        className={`rounded-lg border p-6 shadow-sm ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}
      >
        <h3
          className={`mb-4 text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
        >
          Advanced Settings
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
              >
                Enable Session Expiry
              </p>
              <p
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Automatically log out after inactivity
              </p>
            </div>
            <ToggleSwitch
              enabled={enableExpiry}
              setEnabled={setEnableExpiry}
              darkMode={darkMode}
            />
          </div>

          {enableExpiry && (
            <div className="space-y-1">
              <label className={labelStyles}>Expiry Time (minutes)</label>
              <input
                type="number"
                min="1"
                defaultValue="30"
                className={inputStyles}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
              >
                IP Address Restriction
              </p>
              <p
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Limit access to specific IP addresses
              </p>
            </div>
            <ToggleSwitch
              enabled={enableIPRestriction}
              setEnabled={setEnableIPRestriction}
              darkMode={darkMode}
            />
          </div>

          {enableIPRestriction && (
            <div className="space-y-2">
              <label className={labelStyles}>Allowed IP Addresses</label>
              <div className="flex justify-center items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g., 192.168.1.1"
                  className={`block items-center mt-4 px-3 py-1 rounded-md border shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] text-sm ${darkMode ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400" : "border-gray-300"}`}
                />
                <button className="rounded-md bg-[#3470b2] px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-[#2c5fa5]">
                  Add
                </button>
              </div>

              <div
                className={`mt-2 rounded-md border p-2 ${darkMode ? "border-gray-600" : "border-gray-200"}`}
              >
                <p
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  No IP addresses added yet
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className={labelStyles}>Authentication Level</label>
            <select className={selectStyles}>
              <option>Standard (Password only)</option>
              <option>Two-Factor Authentication</option>
              <option>Biometric + Password</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarRequestfile = ({ onClose, darkMode }) => {
  const [activeTab, setActiveTab] = useState("security");
  const [fields, setFields] = useState([{ id: 1 }]);

  const addField = () => {
    const newField = { id: Date.now() };
    setFields([...fields, newField]);
  };

  const removeField = (idToRemove) => {
    if (fields.length <= 1) return;
    setFields(fields.filter((field) => field.id !== idToRemove));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "security":
        return (
          <>
            <p
              className={`text-[12px] text-center ${darkMode ? "text-green-400" : "text-green-600"}`}
            >
              Security and fields invitee must complete before signing.
            </p>
            <div className="space-y-5">
              {fields.map((field, index) => (
                <SecurityField
                  key={field.id}
                  id={field.id}
                  index={index}
                  onRemove={removeField}
                  canBeRemoved={fields.length > 1}
                  darkMode={darkMode}
                />
              ))}
            </div>
            <button
              onClick={addField}
              className={`flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3470b2] focus:ring-offset-2 ${darkMode ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-offset-gray-800" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              <Plus size={16} /> Add Another Security Field
            </button>
          </>
        );
      case "aadhaar":
        return <AadhaarSection darkMode={darkMode} />;
      case "advanced":
        return <AdvancedSection darkMode={darkMode} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex h-full w-full flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Tabs */}
      <nav
        className={`flex border-b flex-shrink-0 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <button
          onClick={() => setActiveTab("security")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === "security" ? (darkMode ? "border-blue-400 text-blue-400" : "border-[#3470b2] text-[#3470b2]") : darkMode ? "border-transparent text-gray-400 hover:text-gray-200" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <Shield size={16} /> Security
        </button>
        <button
          onClick={() => setActiveTab("aadhaar")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === "aadhaar" ? (darkMode ? "border-orange-400 text-orange-400" : "border-orange-600 text-orange-600") : darkMode ? "border-transparent text-gray-400 hover:text-gray-200" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <CreditCard size={16} /> Aadhaar
        </button>
        <button
          onClick={() => setActiveTab("advanced")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === "advanced" ? (darkMode ? "border-green-400 text-green-400" : "border-green-600 text-green-600") : darkMode ? "border-transparent text-gray-400 hover:text-gray-200" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <Key size={16} /> Advanced
        </button>
      </nav>

      {/* Main Content (Scrollable Area) */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">{renderTabContent()}</div>
      </main>

      {/* Footer */}
      <footer
        className={`flex border-t justify-center md:mb-0 xs:mb-12 px-6 py-4 flex-shrink-0 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3470b2] focus:ring-offset-2 ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-offset-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
          >
            Cancel
          </button>
          <button
            className={`flex items-center justify-center gap-2 rounded-md 
    ${darkMode ? "bg-[#ff4500] hover:bg-[#ff4500]" : "bg-[#3470b2] hover:bg-[#2c5fa5]"} 
    px-4 py-2 text-sm font-medium text-white shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-[#3470b2] focus:ring-offset-2 
    ${darkMode ? "focus:ring-offset-gray-800" : ""}`}
          >
            <Check size={16} /> Save
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SidebarRequestfile;
