import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
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
} from "react-icons/fi";
import { FaFingerprint } from "react-icons/fa";

const sidebarItems = [
  { text: "Document View", icon: <FiEdit size={18} /> },
  { text: "Verification", icon: <FiCheckCircle size={18} /> },
  { text: "Security Question", icon: <FiShield size={18} /> },
  { text: "Document Sign", icon: <FiFileText size={18} />, active: true },
  { text: "Signed Document", icon: <FiDownload size={18} /> },
];

const OutsideSignature = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [aadharOtp, setAadharOtp] = useState("");
  const [email, setEmail] = useState("");
  const [signature, setSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasRef, setCanvasRef] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleCanvasMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
    setSignature(canvasRef.toDataURL());
  };

  const handleBiometricSign = () => {
    // In a real app, this would trigger device biometric authentication
    alert("Biometric authentication successful! Document signed.");
    setSelectedOption(null);
  };

  const handleAadharOtpSubmit = (e) => {
    e.preventDefault();
    // Validate OTP and sign document
    alert(`Document signed with Aadhar OTP: ${aadharOtp}`);
    setSelectedOption(null);
    setAadharOtp("");
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Send email with signature link
    alert(`Signature request sent to: ${email}`);
    setSelectedOption(null);
    setEmail("");
  };

  const renderSignatureOptions = () => {
    if (selectedOption === null) {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose a Signature Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aadhar OTP Option */}
            <div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => handleOptionSelect("aadhar")}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <FiSmartphone size={20} />
                </div>
                <h3 className="ml-4 font-semibold text-gray-800">Aadhar OTP Sign</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Sign using OTP sent to your Aadhar linked mobile number.
              </p>
            </div>

            {/* Digital Canvas Signature */}
            <div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => handleOptionSelect("digital")}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <FiPenTool size={20} />
                </div>
                <h3 className="ml-4 font-semibold text-gray-800">Digital Signature</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Draw your signature using mouse or touch screen.
              </p>
            </div>

            {/* Biometric Signature */}
            <div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => handleOptionSelect("biometric")}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  < FaFingerprint size={20} />
                </div>
                <h3 className="ml-4 font-semibold text-gray-800">Biometric Sign</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Sign using your device's fingerprint or face recognition.
              </p>
            </div>

            {/* Electronic Signature */}
            <div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => handleOptionSelect("electronic")}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <FiMail size={20} />
                </div>
                <h3 className="ml-4 font-semibold text-gray-800">Electronic Sign</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Receive an email to sign the document electronically.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Render selected option
    switch (selectedOption) {
      case "aadhar":
        return (
          <div className="p-8">
            <button 
              className="flex items-center text-blue-600 mb-6"
              onClick={() => setSelectedOption(null)}
            >
              <FiChevronRight className="rotate-180 mr-1" /> Back to options
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Aadhar OTP Signature</h2>
            <div className="max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-6">
                We'll send an OTP to your Aadhar linked mobile number to verify your identity.
              </p>
              <form onSubmit={handleAadharOtpSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="aadharOtp">
                    Enter 6-digit OTP
                  </label>
                  <input
                    id="aadharOtp"
                    type="text"
                    maxLength="6"
                    pattern="\d{6}"
                    required
                    value={aadharOtp}
                    onChange={(e) => setAadharOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="XXXXXX"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Verify & Sign Document
                </button>
              </form>
            </div>
          </div>
        );

      case "digital":
        return (
          <div className="p-8">
            <button 
              className="flex items-center text-blue-600 mb-6"
              onClick={() => setSelectedOption(null)}
            >
              <FiChevronRight className="rotate-180 mr-1" /> Back to options
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Digital Signature</h2>
            <div className="max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-6">
                Draw your signature in the box below using your mouse or touch screen.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg mb-4">
                <canvas
                  ref={(ref) => setCanvasRef(ref)}
                  width={500}
                  height={200}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  className="w-full h-48 bg-white cursor-crosshair"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    const ctx = canvasRef.getContext("2d");
                    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
                    setSignature("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    if (signature) {
                      alert("Document signed with your digital signature!");
                      setSelectedOption(null);
                    } else {
                      alert("Please draw your signature first.");
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use This Signature
                </button>
              </div>
            </div>
          </div>
        );

      case "biometric":
        return (
          <div className="p-8">
            <button 
              className="flex items-center text-blue-600 mb-6"
              onClick={() => setSelectedOption(null)}
            >
              <FiChevronRight className="rotate-180 mr-1" /> Back to options
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Biometric Signature</h2>
            <div className="max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="p-4 bg-blue-50 rounded-full inline-flex mb-6">
                < FaFingerprint size={48} className="text-blue-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Use your device's fingerprint sensor or face recognition to sign the document.
              </p>
              <button
                onClick={handleBiometricSign}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Authenticate with Biometrics
              </button>
            </div>
          </div>
        );

      case "electronic":
        return (
          <div className="p-8">
            <button 
              className="flex items-center text-blue-600 mb-6"
              onClick={() => setSelectedOption(null)}
            >
              <FiChevronRight className="rotate-180 mr-1" /> Back to options
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Electronic Signature</h2>
            <div className="max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-6">
                Enter your email address to receive a link to sign the document electronically.
              </p>
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Signature Request
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
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2a5a99] to-[#3470b2] border-b text-white p-4 shadow-lg z-50 sticky top-0 backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
          {/* Navigation Card */}
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

          {/* User Profile */}
          <div className="mt-auto pt-6">
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <img
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-800">Alex Doe</p>
                <p className="text-xs text-gray-500">alex.doe@example.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderSignatureOptions()}
        </main>
      </div>
    </div>
  );
};

export default OutsideSignature;