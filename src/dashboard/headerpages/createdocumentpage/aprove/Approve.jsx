import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Approve = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch("/sample.pdf"); // File must be in public/
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    fetchPdf();
  }, []);

  const navigate = useNavigate();

  const handleViewInvitees = () => {
    // You can navigate to another page or open a modal
  };

  const handleSendToSign = () => {
    navigate("/maindashboard/allinvities");
  };

  return (
    <div className="font-sans py-4">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar - Step 3 Active */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <span className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">
              1
            </span>
            <span className="text-sm text-gray-500">Generate</span>
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
            <span className="bg-[#2c5fa5] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span className="font-medium text-sm text-[#2c5fa5]">Approve</span>
          </div>
        </div>

        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-xl font-bold mb-4">Document Approval</h1>
          <div className="border shadow-md p-4 max-w-4xl w-full">
            {pdfUrl ? (
              <Document file={pdfUrl} onLoadError={console.error}>
                <Page pageNumber={1} />
              </Document>
            ) : (
              <p>Loading PDF...</p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleViewInvitees}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              View Invitees
            </button>
            <button
              onClick={handleSendToSign}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
            >
              Send to Sign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approve;
