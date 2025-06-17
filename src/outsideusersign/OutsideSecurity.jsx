import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiCheckCircle,
  FiShield,
  FiFileText,
  FiDownload,
  FiChevronRight,
} from "react-icons/fi";
import axios from "axios";
import { IoLockClosedSharp } from "react-icons/io5";
import { BsCalendar, BsCheckLg } from "react-icons/bs";
import { baseUrl, encryptText, decryptText } from "../encryptDecrypt";
import { useSearchParams, useNavigate } from "react-router-dom";

const sidebarItems = [
  { text: "Document View", icon: <FiEdit size={18} /> },
  { text: "Verification", icon: <FiCheckCircle size={18} /> },
  { text: "Security Question", icon: <FiShield size={18} />, active: true },
  { text: "Document Sign", icon: <FiFileText size={18} /> },
  { text: "Signed Document", icon: <FiDownload size={18} /> },
];

const OutsideSecurity = () => {
  const [invitee, setInvitee] = useState({ name: "Loading...", email: "..." });
  const [documentId, setDocumentId] = useState(null); 
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("t");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!documentId) {
      console.error("Cannot navigate because documentId is not available.");
      alert("Error: Data is still loading. Please try again in a moment.");
      return;
    }

    const newParams = new URLSearchParams(searchParams);

    newParams.set("documentId", documentId);

    navigate(`/invitee/sign?${newParams.toString()}`);
  };

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

        console.log("--- API DEBUG: Decrypted Payload ---", decryptedPayload);

        const inviteeData = decryptedPayload.invitee;
      
        const docId = inviteeData.documentId;
        if (inviteeData) {
          setInvitee({
            name: inviteeData.name || "Unknown User",
            email: inviteeData.email || "Not Provided",
          });
        }

        if (docId) {
          setDocumentId(docId);
        } else {
          console.warn(
            "Document ID was not found in the API response payload."
          );
        }
      } catch (error) {
        console.error("Failed to fetch or decrypt invitee data.", error);
        setInvitee({ name: "Error", email: "Could not load user data" });
      }
    }

    fetchInviteeData();
  }, [token]);

  // A reusable input field component
  const FormInput = ({ label, id, defaultValue, placeholder }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm shadow-sm
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );

  const InputWithIcon = ({ label, id, defaultValue, icon, placeholder }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          id={id}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm shadow-sm
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
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
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="relative group font-medium">
              Features
              <span className="absolute left-0 bottom-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="relative group font-medium">
              Pricing
              <span className="absolute left-0 bottom-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="relative group font-medium">
              Solutions
              <span className="absolute left-0 bottom-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="relative group font-medium">
              Contact
              <span className="absolute left-0 bottom-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          <button className="relative overflow-hidden bg-white text-[#3470b2] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#3470b2]/30 group">
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-0"></span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[315px] bg-white p-5 pt-8 flex flex-col border-r border-gray-200">
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
          </div>

          <div className="mt-auto pt-6">
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

        {/* Main Content - Security Question Section */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col max-h-[80vh]">
              {/* --- 1. Non-scrolling Header --- */}
              <div className="p-8 pb-4">
                <div className="flex justify-end mb-4">
                  <div className="flex items-center gap-2 bg-indigo-100 text-indigo-800 font-semibold px-4 py-2 w-fit rounded-full text-sm">
                    <IoLockClosedSharp />
                    <span>Secure Session</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Security Questions
                  </h2>
                  <p className="text-sm text-gray-500">5 required</p>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-1 w-full">
                    <div
                      className="bg-blue-600 h-1 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* --- 2. Scrollable Form Body --- */}
              <div className="flex-1 overflow-y-auto px-8">
                <form
                  id="security-form"
                  className="space-y-6 py-4"
                  onSubmit={handleSubmit}
                >
                  <FormInput
                    label="What was your childhood nickname?"
                    id="q1"
                    placeholder="e.g., Sparky"
                  />
                  <FormInput
                    label="In what city were you born?"
                    id="q2"
                    placeholder="e.g., New York"
                  />
                  <FormInput
                    label="What is the name of your first pet?"
                    id="q3"
                    placeholder="e.g., Fido"
                  />
                  <InputWithIcon
                    label="What is your mother's date of birth?"
                    id="q4"
                    placeholder="e.g., 18/06/1975"
                    icon={<BsCalendar className="h-5 w-5 text-gray-400" />}
                  />
                  <InputWithIcon
                    label="What is the name of the first school you attended?"
                    id="q5"
                    placeholder="e.g., Oakwood Elementary"
                    icon={<FiFileText className="h-5 w-5 text-gray-400" />}
                  />
                  <FormInput
                    label="What was the make of your first car?"
                    id="q6"
                    placeholder="e.g., Honda"
                  />
                  <FormInput
                    label="What is your favorite movie?"
                    id="q7"
                    placeholder="e.g., The Matrix"
                  />
                  <FormInput
                    label="What is your favorite food?"
                    id="q8"
                    placeholder="e.g., Pizza"
                  />
                </form>
              </div>

              {/* --- 3. Non-scrolling Footer --- */}
              <div className="p-8 pt-6 border-t border-gray-200 bg-white">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    form="security-form"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span>Submit Answers</span>
                    <BsCheckLg className="h-5 w-5 font-bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OutsideSecurity;
