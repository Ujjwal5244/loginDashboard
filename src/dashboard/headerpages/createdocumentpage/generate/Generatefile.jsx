import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Generatefile = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [stampImage, setStampImage] = useState(null);

  const handlePDFUpload = (e) => setPdfFile(e.target.files[0]);
  const handleStampUpload = (e) => setStampImage(e.target.files[0]);
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/Maindashboard/requestfile"); // full path from Router's base
  };

  // Function to get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };
  const tomorrowDate = getTomorrowDate();

  return (
    <div className="font-sans min-h-screen  py-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-[#2c5fa5] to-[#3470b2] text-white py-3 px-6 flex items-center gap-4 shadow-md rounded-3xl justify-center mb-8">
          <div className="flex items-center gap-1">
            <span className="bg-white text-[#3470b2] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span className="font-medium text-sm">Generate</span>
            <span className="text-white text-sm">›</span>
          </div>
          <div className="flex items-center gap-1 text-gray-200">
            <span className="border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              2
            </span>
            <span className="text-sm">Request</span>
            <span className="text-sm">›</span>
          </div>
          <div className="flex items-center gap-1 text-gray-200">
            <span className="border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              3
            </span>
            <span className="text-sm">Approve</span>
          </div>
        </div>

        {/* Compact Form Section */}
        <div className="bg-gray-50 rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
          {/* Upload Document */}
          <div>
            <h2 className="font-semibold text-md mb-3 text-gray-800 flex items-center">
              <span className="bg-[#3470b2] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
                1
              </span>
              Upload Document
            </h2>
            <label
              htmlFor="pdfUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 h-24 rounded-lg cursor-pointer hover:border-[#3470b2] transition-colors duration-200"
            >
              <input
                id="pdfUpload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePDFUpload}
              />
              <p className="text-gray-600 text-center px-4 text-sm">
                {pdfFile ? (
                  <span className="text-[#3470b2] font-medium">
                    {pdfFile.name}
                  </span>
                ) : (
                  <>
                    Drag and drop your PDF here
                    <br />
                    <span className="text-xs text-gray-400">or</span>
                  </>
                )}
              </p>
              <button className="mt-1 px-3 py-1 bg-[#3470b2] hover:bg-[#2c5fa5] text-white text-xs rounded-md transition-colors duration-200 shadow-sm">
                {pdfFile ? "Change File" : "Browse Files"}
              </button>
            </label>
          </div>

          {/* Document Details - Compact Grid */}
          <div>
            <h2 className="font-semibold text-md mb-3 text-gray-800 flex items-center">
              <span className="bg-[#3470b2] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
                2
              </span>
              Document Details
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Contract Agreement"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3470b2] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. REF-2023-001"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3470b2] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3470b2] text-sm"
                  min={tomorrowDate}
                  defaultValue={tomorrowDate}
                />
              </div>
            </div>
          </div>

          {/* Add Stamp (Optional) */}
          <div>
            <h2 className="font-semibold text-md mb-3 text-gray-800 flex items-center">
              <span className="bg-[#3470b2] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
                3
              </span>
              Add Stamp (Optional)
            </h2>
            <div className="flex items-start  gap-4">
              <label className="flex-1">
                <span className="block text-xs font-medium text-gray-700 mb-2">
                  Upload Stamp Image
                </span>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStampUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="border border-gray-300 rounded-md px-3 py-3 flex items-center justify-between bg-gray-50 text-sm">
                    <span className="text-gray-600 truncate">
                      {stampImage ? stampImage.name : "No file chosen"}
                    </span>
                    <button className="ml-2 px-2 py-1 bg-[#3470b2] hover:bg-[#2c5fa5] text-white text-xs rounded-md">
                      Choose
                    </button>
                  </div>
                </div>
              </label>
              {stampImage && (
                <div className="mt-5 p-1 border border-gray-200 rounded-md">
                  <img
                    src={URL.createObjectURL(stampImage)}
                    alt="Stamp preview"
                    className="h-12 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-2 text-right">
            <button
              onClick={handleContinue}
              className="bg-[#3470b2] hover:bg-[#2c5fa5] text-white px-6 py-2 rounded-md font-medium text-sm shadow-md hover:shadow-lg transition-all"
            >
              Continue to Signers →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generatefile;
