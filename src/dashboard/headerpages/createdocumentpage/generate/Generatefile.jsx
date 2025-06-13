import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl, decryptText, encryptText } from "../../../../encryptDecrypt"; // Removed encryptText as it's not used for the request

const Generatefile = () => {
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [stampImage, setStampImage] = useState(null);
  const [documentDetails, setDocumentDetails] = useState({
    name: "",
    referenceNumber: "",
    expiryDate: getTomorrowDate(),
  });
  const navigate = useNavigate();

  // Function to get tomorrow's date in YYYY-MM-DD format
  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  const handlePDFUpload = (e) => setPdfFile(e.target.files[0]);
  const handleStampUpload = (e) => setStampImage(e.target.files[0]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDocumentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = async () => {
    // --- Validation Checks ---
    if (!pdfFile) {
      toast.error("Please upload a PDF file.");
      return;
    }
    if (!documentDetails.name.trim()) {
      toast.error("Document name is required.");
      return;
    }
    if (!documentDetails.expiryDate) {
      toast.error("Expiry date is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      // Append the PDF file and document details to the FormData 
      console.log("pdfFile", pdfFile);                        
      formData.append("document", pdfFile);
      console.log("documentDetails", documentDetails);
     
    
      const encryptedBody = await encryptText(
      {
        name: documentDetails.name,
        refNo: documentDetails.referenceNumber,
        expiredAt: documentDetails.expiryDate,
      }
      )
      console.log("encryptedBody", encryptedBody);
      formData.append("body", encryptedBody);
      // Conditionally append the stamp image if it exists
      if (stampImage) {
        formData.append("stamp", stampImage);
      }
      console.log(formData, "data");

      const response = await axios.post(
        `${baseUrl}/api/document/create`,
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response, "data");
      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);
      console.log(data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Document generated successfully. Redirecting...");
        navigate(`/Maindashboard/requestfile/${data._id}`);
      } else {
        throw new Error(data.message || "Failed to generate document");
      }
    } catch (error) {
      console.log(error, "error");
      console.error("Error generating document:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans py-4">
      <div className="max-w-5xl mx-auto">
        {/* Simplified Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <span className="bg-[#2c5fa5] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span className="font-medium text-sm text-[#2c5fa5]">Generate</span>
          </div>

          <div className="w-8 h-px bg-gray-300"></div>

          <div className="flex items-center gap-1">
            <span className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">
              2
            </span>
            <span className="text-sm text-gray-500">Request</span>
          </div>

          <div className="w-8 h-px bg-gray-300"></div>

          <div className="flex items-center gap-1">
            <span className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">
              3
            </span>
            <span className="text-sm text-gray-500">Approve</span>
          </div>
        </div>

        {/* Compact Form Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
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
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 h-28 rounded-lg cursor-pointer hover:border-[#3470b2] transition-colors duration-200"
            >
              <input
                id="pdfUpload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePDFUpload}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600 text-center px-4 text-sm">
                {pdfFile ? (
                  <span className="text-[#3470b2] font-medium">
                    {pdfFile.name}
                  </span>
                ) : (
                  "Click to browse or drag & drop PDF"
                )}
              </p>
              <span className="text-xs text-gray-400 mt-1">
                Maximum file size: 10MB
              </span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={documentDetails.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Contract Agreement"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3470b2] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={documentDetails.referenceNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. REF-2023-001"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3470b2] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={documentDetails.expiryDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3470b2] text-sm"
                  min={getTomorrowDate()}
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
            <div className="flex items-end gap-4">
              <label className="flex-1">
                <span className="block text-xs font-medium text-gray-700 mb-1">
                  Upload Stamp Image
                </span>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleStampUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="stamp-upload"
                  />
                  <div className="border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between bg-white text-sm">
                    <span className="text-gray-500 truncate pr-2">
                      {stampImage ? stampImage.name : "No file chosen"}
                    </span>
                    <span className="ml-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-md pointer-events-none">
                      Browse
                    </span>
                  </div>
                </div>
              </label>
              {stampImage && (
                <div className="p-1 border bg-white border-gray-200 rounded-md shadow-sm">
                  <img
                    src={URL.createObjectURL(stampImage)}
                    alt="Stamp preview"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-4 text-right">
            <button
              onClick={handleContinue}
              disabled={loading || !pdfFile}
              className="bg-[#3470b2] hover:bg-[#2c5fa5] text-white px-6 py-2 rounded-md font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Continue to Signers →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generatefile;
