import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useNavigate } from 'react-router-dom';


pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Approve = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch('/sample.pdf'); // File must be in public/
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
navigate('/maindashboard/allinvities');  };

  return (
    <div className="font-sans min-h-screen py-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar - Added from Generatefile component */}
        <div className="bg-gradient-to-r from-[#2c5fa5] to-[#3470b2] text-white py-3 px-6 flex items-center gap-4 shadow-md rounded-3xl justify-center mb-8">
          <div className="flex items-center gap-1 text-gray-200">
            <span className="border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              1
            </span>
            <span className="text-sm">Generate</span>
            <span className="text-sm">›</span>
          </div>
          <div className="flex items-center gap-1 text-gray-200">
            <span className="border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              2
            </span>
            <span className="text-sm">Request</span>
            <span className="text-sm">›</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-white text-[#3470b2] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span className="font-medium text-sm">Approve</span>
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