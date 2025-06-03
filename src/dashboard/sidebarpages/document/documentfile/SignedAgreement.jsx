import React, { useEffect, useState, useRef } from "react";
import { decryptText, baseUrl } from "../../../../encryptDecrypt";
import "./pdfWorker"; // Sets the PDF.js worker
import { getDocument } from "pdfjs-dist";
import axios from "axios";

const SignedAgreement = () => {
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/user/signed-pdf`, {
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
        } else {
          throw new Error("No PDF URL found in response");
        }
      } catch (error) {
        console.error("Error fetching PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchKycStatus = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/user/kycstatus`, {
          headers: { authorization: token },
        });

        const decrypted = await decryptText(res.data.body);
        const parsed = JSON.parse(decrypted);
        console.log("KYC Status:", parsed);
        setKycStatus(parsed.kycStatus);

        // If KYC is already approved, fetch the PDF
        if (parsed.kycStatus === "approved") {
          fetchPdf();
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };
    fetchKycStatus();
  }, []);

  const handleSubmit = async () => {
    try {
      setHasSubmitted(true);
      const res = await axios.get(`${baseUrl}/api/notifications/`, {
        headers: { authorization: token },
      });

      const decrypted = await decryptText(res.data.body);
      const parsed = JSON.parse(decrypted);
      console.log("KYC Status:", parsed);

      // After submission, show the "under review" message
      // setKycStatus("pending");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Signed-Agreement">
      {/* First section - shows PDF or review status */}
      <div className="pdf-preview">
        {!loading && pdfUrl && (kycStatus === "approved" || kycStatus === "pending") ? (
          <PdfViewerWithDownload pdfUrl={pdfUrl} />
        ) : (
          <div className="kyc-status-message">
            {hasSubmitted ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-bold mb-2">KYC Under Review</h3>
                <p>
                  Your KYC documents are being reviewed by our team. You'll be
                  notified once approved.
                </p>
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-bold mb-2">
                  Your KYC is in Pending
                </h3>
                <p>Please submit your KYC documents</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit section - only shows when KYC hasn't been submitted yet */}
      {/* {kycStatus !== "pending" && kycStatus !== "approved" && (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="accept-checkbox"
              onChange={() => setIsAccepted(!isAccepted)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-2 focus:ring-2"
            />
            <label
              htmlFor="accept-checkbox"
              className="ml-3 block text-gray-700 font-medium"
            >
              I accept the terms and conditions of this agreement
            </label>
          </div>

          <button
            disabled={!isAccepted}
            type="submit"
            onClick={handleSubmit}
            className={`w-full px-4 py-2 rounded-md font-medium text-white ${
              isAccepted
                ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      )} */}

      {kycStatus === "approved" && pdfUrl && (
        <div className="mt-4 text-center">
          <a
            href={pdfUrl}
            download="signed-agreement.pdf"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

const PdfViewerWithDownload = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(0);
  const canvasRefs = useRef([]);

  useEffect(() => {
    const renderAllPages = async () => {
      const loadingTask = getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      setNumPages(pdf.numPages);

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRefs.current[pageNum - 1];
        if (!canvas) continue;

        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      }
    };

    if (pdfUrl) {
      renderAllPages();
    }
  }, [pdfUrl]);

  return (
    <div className="pdf-viewer">
      {Array.from(new Array(numPages), (_, index) => (
        <canvas
          key={`page_${index + 1}`}
          ref={(el) => (canvasRefs.current[index] = el)}
          style={{ marginBottom: "20px", border: "1px solid #ccc" }}
        />
      ))}
    </div>
  );
};

export default SignedAgreement;
