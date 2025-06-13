import React, { useState } from "react";
import { FaFilePdf, FaSignature, FaBuilding, FaChevronRight, FaCheckCircle } from "react-icons/fa";

const Clientpdfview = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    setActiveTab("sign");
  };

  const handleCompleteSign = () => {
    setSigned(true);
    // You can add additional logic here like API calls, etc.
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="bg-[#3470b2] shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaBuilding className="text-blue-600 text-2xl" />
          <h1 className="text-xl font-bold text-gray-800">Company Name</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Help
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            JD
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Document Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Document Name</p>
                <p className="text-sm font-medium">Contract Agreement</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Date</p>
                <p className="text-sm font-medium">June 13, 2023</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Status</p>
                <p className={`text-sm font-medium ${signed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {signed ? 'Signed' : 'Pending Signature'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Signature</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40">
              {signed ? (
                <div className="text-center">
                  <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Document Signed</p>
                </div>
              ) : (
                <>
                  <FaSignature className="text-gray-400 text-2xl mb-2" />
                  <p className="text-sm text-gray-500 text-center">Your signature will appear here after completion</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Tabs */}
          <div className="bg-white border-b border-gray-200 flex">
            <button
              className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'view' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab("view")}
            >
              <FaFilePdf className="mr-2" />
              Document View
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'sign' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab("sign")}
              disabled={signed}
            >
              <FaSignature className="mr-2" />
              Sign Document
            </button>
          </div>

          {/* Dynamic Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-100">
            {activeTab === "view" ? (
              <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
                {/* PDF Viewer Placeholder */}
                <div className="border-2 border-gray-300 rounded-lg flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <FaFilePdf className="text-red-500 text-5xl mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">Contract Agreement.pdf</h3>
                    <p className="text-sm text-gray-500 mt-1">Preview of your document</p>
                  </div>
                </div>

                {!signed && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSign}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                    >
                      Proceed to Sign <FaChevronRight className="ml-2" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
                {/* Signing Area */}
                <div className="border-2 border-gray-300 rounded-lg flex-1 flex flex-col items-center justify-center bg-gray-50">
                  {signed ? (
                    <div className="text-center">
                      <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-700">Document Successfully Signed</h3>
                      <p className="text-sm text-gray-500 mt-2">Your signed document has been saved</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8 text-center">
                        <h3 className="text-xl font-medium text-gray-700">Sign the Document</h3>
                        <p className="text-sm text-gray-500 mt-1">Please review and sign below</p>
                      </div>
                      
                      {/* Signature Pad Placeholder */}
                      <div className="w-full max-w-md h-48 border-2 border-dashed border-gray-400 rounded-lg mb-8 bg-white">
                        {/* In a real app, you would use a signature pad component here */}
                      </div>
                      
                      <button
                        onClick={handleCompleteSign}
                        className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center text-lg"
                      >
                        Complete Signature <FaCheckCircle className="ml-2" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientpdfview;