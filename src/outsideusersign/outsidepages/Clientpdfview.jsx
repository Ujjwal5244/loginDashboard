import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseUrl,token } from '../../encryptDecrypt'; 


// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Clientpdfview = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inviteeDetail, setInviteeDetail] = useState(null);
  const [documentUrl,setDocumentUrl] = useState("");
  const [info, setInfo] = useState(null);

  const query = useQuery();
  const searchTerm = query.get('t')||'';
  // ✅ Corrected useEffect
useEffect(() => {
  if (!inviteeDetail || !info) return; // safer condition
  async function fetchInviteeDetail() {
    try {
      const response = await axios.post(
        `${baseUrl}/api/document/getdocument/${inviteeDetail.document_id}`,
        {
          ip: info?.ip || "",
          machine: info?.machine || "",
          browser: info?.browser || "",
          os: info?.os || "",
          location: {
            latitude: info?.latitude || "",
            longitude: info?.longitude || "",
            city: info?.city || "",
            country: info?.country || "",
          },
        }
      );
      if (response.data.success) {
        setDocumentUrl(response.data.documentUrl);
      } else {
        console.error("Failed to fetch document URL:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching invitee detail:", error);
    }
  }
  fetchInviteeDetail();
}, [inviteeDetail, info]);

// ✅ Corrected inviteeByTOken
useEffect(() => {
  async function inviteeByTOken() {
    try {
      const response = await axios.get(
        `${baseUrl}/api/document/inviteeBytoken?t=${searchTerm}`,
        {
          headers: { authorization: token }
        }
      );
      if (response.data.success) {
        setInviteeDetail(response.data.invitee);
      } else {
        console.error("Failed to fetch invitee data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching invitee by token:", error);
    }
  }
  if (searchTerm) inviteeByTOken();
}, [searchTerm]);

  
  useEffect(() => {
       

    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        setInfo(data);
      })
      .catch((err) => console.error("Error fetching IP/location:", err));
  }, []);
  // Replace this with your actual PDF file
  // const pdfFile = '/sample.pdf'; 
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Document Preview</h2>
        
        <div className="relative border rounded-lg overflow-hidden min-h-[500px]">
          <span className="absolute top-2 right-2 bg-yellow-300 text-sm font-medium px-2 py-1 rounded z-10">
            Pending Signature
          </span>
          
          <div className="pdf-container h-full">
            <Document
              file={documentUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div>Loading PDF...</div>}
              error={<div>Failed to load PDF.</div>}
              className="flex justify-center"
            >
              <Page 
                pageNumber={pageNumber} 
                width={800}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
          
          {numPages > 1 && (
            <div className="flex justify-center mt-2">
              <button 
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
                className="mx-2 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-2">
                Page {pageNumber} of {numPages}
              </span>
              <button 
                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                disabled={pageNumber >= numPages}
                className="mx-2 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
            Proceed to Sign →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Clientpdfview;