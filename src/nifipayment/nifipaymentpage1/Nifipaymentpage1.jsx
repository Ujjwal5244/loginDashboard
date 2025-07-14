import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// --- MODIFIED: Added 'X' icon for the close button ---
import {
  ArrowRight,
  FilePenLine,
  ShieldCheck,
  LayoutDashboard,
  Copy,
  BarChart3,
  Search,
  X,
} from "lucide-react";
import { FaRegPlayCircle } from "react-icons/fa";
import logo1 from "../../assets/iso.svg";
import logo2 from "../../assets/asoc.webp";
import fakeCompanyLogo1 from "../../assets/Axis_Finace_Logo.svg";
import fakeCompanyLogo2 from "../../assets/ICICI Bank_Logo.svg";
import fakeCompanyLogo3 from "../../assets/Airtel_Payments_Bank.png";

// --- NEW: Mockup Component 1: Document Signing ---
const DocumentSignMockup = () => (
  <div className="bg-slate-50 rounded-lg p-6">
    <h2 className="font-bold text-slate-800 text-lg">
      Vendor Agreement - FY24
    </h2>
    <p className="text-sm text-slate-500 mt-1">
      Please review and sign the document below.
    </p>
    <div className="mt-6 p-4 border-2 border-dashed border-slate-300 rounded-lg h-32 bg-white">
      <p className="text-xs text-slate-400">AGREEMENT_FINAL_V2.PDF</p>
    </div>
    <div className="mt-6 flex justify-between items-center">
      <div className="flex -space-x-2">
        <img
          className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="User 1"
        />
        <img
          className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
          src="https://images.unsplash.com/photo-1550525811-e58691059c44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="User 2"
        />
        <div className="h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-500">
          +2
        </div>
      </div>
      <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-transform hover:scale-105 text-sm">
        <FilePenLine className="w-4 h-4" />
        Sign & Approve
      </button>
    </div>
  </div>
);

// --- NEW: Mockup Component 2: Analytics Dashboard ---
const DashboardMockup = () => (
  <div className="bg-slate-50 rounded-lg p-6">
    <div className="flex justify-between items-center">
      <h2 className="font-bold text-slate-800 text-lg">Quarterly Analytics</h2>
      <LayoutDashboard className="w-6 h-6 text-indigo-500" />
    </div>
    <p className="text-sm text-slate-500 mt-1">
      Overview of document activity.
    </p>
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-1/2 bg-white p-3 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500">Documents Signed</p>
          <p className="text-2xl font-bold text-slate-800">1,204</p>
        </div>
        <div className="w-1/2 bg-white p-3 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500">Turnaround Time</p>
          <p className="text-2xl font-bold text-slate-800">
            2.1
            <span className="text-base font-medium text-slate-500">hrs</span>
          </p>
        </div>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-slate-600">Completion Rate</p>
          <BarChart3 className="w-4 h-4 text-slate-400" />
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full"
            style={{ width: "88%" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

// --- NEW: Mockup Component 3: Template Library ---
const TemplateLibraryMockup = () => (
  <div className="bg-slate-50 rounded-lg p-6">
    <h2 className="font-bold text-slate-800 text-lg">Template Library</h2>
    <div className="relative mt-2">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        placeholder="Search templates..."
        className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
      />
    </div>
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 hover:border-orange-400 cursor-pointer transition-colors">
        <p className="font-medium text-slate-700 text-sm">
          NDA for Contractors
        </p>
        <Copy className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 hover:border-orange-400 cursor-pointer transition-colors">
        <p className="font-medium text-slate-700 text-sm">
          Master Services Agreement
        </p>
        <Copy className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border-2 border-orange-500 ring-2 ring-orange-200">
        <p className="font-semibold text-orange-600 text-sm">
          Employee Offer Letter
        </p>
        <Copy className="w-4 h-4 text-orange-500" />
      </div>
    </div>
  </div>
);

// --- Array to hold all mockup components ---
const mockups = [
  { component: DocumentSignMockup, title: "Sign & Approve" },
  { component: DashboardMockup, title: "Track Analytics" },
  { component: TemplateLibraryMockup, title: "Use Templates" },
];

const Nifipaymentpage1 = () => {
  const [activeMockupIndex, setActiveMockupIndex] = useState(0);
  // --- NEW: State to control the video player's visibility ---
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

  const logos = [
    { src: fakeCompanyLogo1, alt: "Axis Finance" },
    { src: fakeCompanyLogo2, alt: "ICICI Bank" },
    { src: fakeCompanyLogo3, alt: "Airtel Payments Bank" },
  ];

  const marqueeVariants = {
    animate: {
      x: [0, -1005], // Adjust -1005 to be the width of your logo set
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20, // Adjust duration for speed
          ease: "linear",
        },
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMockupIndex((prevIndex) => (prevIndex + 1) % mockups.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const ActiveMockup = mockups[activeMockupIndex].component;

  return (
    <section className="relative font-sans overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 -left-48 w-96 h-96 bg-indigo-200/50 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-48 w-96 h-96 bg-rose-200/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-13 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left side content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-4 text-center lg:text-left">
                Trusted by leading Indian businesses
              </p>
              <div className="w-full overflow-hidden">
                <motion.div
                  className="flex"
                  variants={marqueeVariants}
                  animate="animate"
                >
                  {[...logos, ...logos].map((logo, index) => (
                    <img
                      key={`logo-fm-${index}`}
                      src={logo.src}
                      alt={logo.alt}
                      className="h-6 opacity-60 mx-8 flex-shrink-0"
                    />
                  ))}
                </motion.div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Remove the paper from your
              <span className="text-orange-500"> paperwork</span>.
            </h1>
            <p className="mt-6 text-sm text-slate-600 max-w-xl leading-relaxed">
              NifiPayment provides secure, compliant, and lightning-fast digital
              signing and stamping to accelerate your business.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
              <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-orange-500/30">
                Book a Custom Demo
                <ArrowRight className="w-5 h-5" />
              </button>
              {/* --- MODIFIED: Added onClick to open the video player --- */}
              <button
                onClick={() => setIsVideoPlayerOpen(true)}
                className="bg-white/80 flex gap-3 border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Platform Overview{" "}
                <FaRegPlayCircle className="w-6 h-6 mt-[1px]" />
              </button>
            </div>
          </motion.div>

          {/* Right side content - DYNAMIC Product Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-500/10 p-4 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMockupIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ActiveMockup />
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 flex gap-2 px-2">
                {mockups.map((mockup, index) => (
                  <div
                    key={mockup.title}
                    className="w-1/3 h-1.5 bg-slate-200 rounded-full overflow-hidden"
                  >
                    {index === activeMockupIndex && (
                      <motion.div
                        className="h-full bg-orange-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 flex  items-center justify-center  gap-x-8 gap-y-4">
                <div className="flex items-center gap-2">
                  <img
                    src={logo1}
                    alt="ISO 27001 Certified"
                    className="md:h-8 md:w-8 xs:h-6 xs:w-6 object-contain"
                  />
                  <span className="text-[8px] md:text-sm font-medium text-slate-600 flex items-center gap-1">
                    <ShieldCheck className="md:w-4 md:h-4 xs:w-3 xs:h-3 text-green-600" />
                    ISO 27001
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={logo2}
                    alt="SOC 2 Compliant"
                    className="md:h-8 md:w-8 xs:h-6 xs:w-6 object-contain"
                  />
                  <span className="text-[8px] md:text-sm font-medium text-slate-600 flex items-center gap-1">
                    <ShieldCheck className="md:w-4 md:h-4 xs:w-3 xs:h-3 text-green-600" />
                    SOC 2 Compliant
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- NEW: Video Player Modal --- */}
      <AnimatePresence>
        {isVideoPlayerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoPlayerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            {/* Video Container - Use stopPropagation to prevent clicks inside from closing the modal */}
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-black rounded-xl overflow-hidden shadow-2xl w-[700px] h-[500px] max-w-full"
            >
              <button
                onClick={() => setIsVideoPlayerOpen(false)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                width="700"
                height="500"
                src="https://www.youtube.com/embed/21c1CrCZKOc?si=Mx9eQ2uF3v9uNSgx"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Nifipaymentpage1;
