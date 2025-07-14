import React, { useState } from "react";
import { FiKey, FiCheckCircle } from "react-icons/fi";
import textSignature from "../../assets/textsignature.png";
import adharSignature from "../../assets/Aadhaar eSign.webp"; 
import digitalSignature from "../../assets/digital-sign.png"; 
import biometricSignature from "../../assets/textsignature.png"; 

// --- Data for each tab ---
const tabsData = [
  {
    id: "text",
    title: "Text Sign",
    imageUrl: textSignature,
    heading: "Intuitive & Collaborative Signing",
    description:
      "Easily create your signature, add signers, and manage the entire document workflow from a single, beautiful interface. Designed for speed and security.",
    features: [
      "Invite multiple participants and track their status in real-time.",
      "Choose from multiple signature types: draw, type, or upload.",
      "Secure every signature with optional two-factor authentication.",
    ],
  },
  {
    id: "adhar",
    title: "Adhar E-sign",
    imageUrl: adharSignature,
    heading: "Legally Binding Aadhaar E-Sign",
    description:
      "Authenticate signatures using Aadhaar-based eKYC. A secure, paperless, and legally valid method accepted across India, verified via OTP.",
    features: [
      "Fully compliant with the Information Technology Act, 2000.",
      "Fast and secure OTP-based verification process.",
      "Reduces paperwork and provides a clear audit trail.",
    ],
  },
  {
    id: "digital",
    title: "Digital Sign",
    imageUrl: digitalSignature,
    heading: "High-Security Digital Signatures",
    description:
      "Utilize cryptographically secure Digital Signature Certificates (DSC) issued by licensed Certifying Authorities, typically stored on a USB token.",
    features: [
      "Highest level of security and legal validity.",
      "Ideal for corporate filings, tenders, and high-value contracts.",
      "Ensures data integrity and non-repudiation.",
    ],
  },
  {
    id: "biometric",
    title: "Biometric Sign",
    imageUrl: biometricSignature,
    heading: "Verifiable Biometric Authentication",
    description:
      "Sign documents using unique biological traits like fingerprints. Perfect for in-person verification and high-security environments.",
    features: [
      "Provides undeniable proof of identity.",
      "Seamless integration with standard biometric scanners.",
      "Used in banking, government, and healthcare sectors.",
    ],
  },
];

// --- Main Page Component ---
const Nifipaymentpage4 = () => {
  const [activeTab, setActiveTab] = useState("text");
  const currentTab = tabsData.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white font-sans text-gray-800">
      {/* Cursive fonts and fade-in animation */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Sacramento&display=swap");
        .font-cursive-1 {
          font-family: "Dancing Script", cursive;
        }
        .font-cursive-2 {
          font-family: "Great Vibes", cursive;
        }
        .font-cursive-3 {
          font-family: "Sacramento", cursive;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header Section - Now with better responsive behavior */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 gap-y-4 text-slate-600 font-medium mb-10 md:mb-12">
          {tabsData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                activeTab === tab.id
                  ? "bg-yellow-400 text-black scale-105 shadow-lg shadow-yellow-400/30"
                  : "bg-slate-100 hover:text-black hover:bg-slate-200"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Main Content Section: Enhanced responsive layout */}
        <div className="flex flex-col-reverse lg:flex-row gap-8 md:gap-16">
          {/* === LEFT COLUMN: UI MOCKUPS (Sticky on desktop) === */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-12 self-start">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-full max-w-lg mx-auto">
                {/* The image will now change with the animation */}
                <div
                  key={activeTab} // Triggers animation on change
                  className="bg-white p-2 rounded-xl shadow-lg w-full aspect-[16/10] flex items-center justify-center transition-transform hover:scale-[1.02] animate-fade-in"
                >
                  <img
                    src={currentTab.imageUrl}
                    alt={`${currentTab.heading} mockup`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN: TEXT CONTENT === */}
          <div className="w-full lg:w-1/2">
            {/* Animates in sync with the left column */}
            <div
              key={activeTab}
              className="max-w-xl text-center lg:text-left mx-auto lg:mx-0 animate-fade-in"
            >
              {/* Feature Description */}
              <h2 className="md:text-3xl sm:text-2xl xs:text-2xl font-bold text-slate-800 tracking-tight">
                {currentTab.heading}
              </h2>
              <p className="mt-4 text-base sm:text-lg xs:text-[14px] text-center  text-slate-600">
                {currentTab.description}
              </p>

              <ul className="mt-6 md:mt-8 space-y-4 text-left inline-block">
                {currentTab.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FiCheckCircle className="md:w-6 md:h-6 xs:w-4 xs:h-4 text-teal-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 md:text-lg xs:text-[12px]">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 md:mt-10 mb-8 sm:mb-0">
                <a
                  href="#get-started"
                  className="inline-block bg-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-teal-600 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started Free
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nifipaymentpage4;
