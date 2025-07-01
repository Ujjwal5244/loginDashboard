import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Agreement.css";
import { baseUrl } from "../../../encryptDecrypt";

const Agreement = ({ darkMode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${baseUrl}/api/user/preview/nifi`, {
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch PDF");
        }

        const data = await response.json();
        if (data.url) {
          setPdfUrl(data.url);
        } else {
          throw new Error("No PDF URL found in response");
        }
      } catch (error) {
        console.error("Failed to fetch PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [token]);

  const handleAcceptTerms = () => {
    if (acceptedTerms) {
      navigate("/Maindashboard/pdf-sign");
    } else {
      alert("Please accept the terms and conditions to proceed.");
    }
  };

  const handleDeclineTerms = () => {
    alert("You must accept the terms to sign the document.");
    navigate(-1);
  };

  return (
    <div className={`sign-agreement-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="sign-agreement-header">
        <div className="sign-header">
          <h1 className={`sign-header-h ${darkMode ? "dark-text" : ""}`}>Your Agreement Document</h1>
          <p className={`sign-header-p ${darkMode ? "dark-text" : ""}`}>Preview and download your document</p>
        </div>
      </div>

      <div className={`pdf-preview ${darkMode ? "dark-pdf-container" : ""}`}>
        {!loading && pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Sign Agreement"
            width="100%"
            height="600px"
            className={darkMode ? "dark-iframe" : ""}
          />
        ) : (
          <p className={darkMode ? "dark-text" : ""}>
            {loading ? "Loading PDF preview..." : "No PDF available."}
          </p>
        )}
      </div>
      <div className={`terms-container ${darkMode ? "dark-terms" : ""}`}>
        <div className="terms-content">
          <h2 className={darkMode ? "dark-text" : ""}>Terms and Conditions</h2>
        </div>
        <div className="terms-checkbox">
          <div className={`sign-terms-checkbox ${darkMode ? "dark-checkbox" : ""}`}>
            <input
              type="checkbox"
              id="acceptTerms"
              className={`checkbox-margin-top ${darkMode ? "dark-checkbox-input" : ""}`}
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="acceptTerms" className={darkMode ? "dark-text" : ""}>
              I have read and agree to the terms and conditions above.
            </label>
          </div>
          <div className="terms-buttons">
            <button 
              className={`decline-btn ${darkMode ? "dark-decline-btn" : ""}`} 
              onClick={handleDeclineTerms}
            >
              Decline
            </button>
            <button
              className={`accept-btn ${darkMode ? "dark-accept-btn" : ""}`}
              onClick={handleAcceptTerms}
              disabled={!acceptedTerms}
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agreement;