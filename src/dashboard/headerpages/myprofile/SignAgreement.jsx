import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignAgreement.css';
import { baseUrl } from '../../../encryptDecrypt';

const SignAgreement = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(true);

  useEffect(() => {
    if (!showTerms) {
      const fetchPdf = async () => {
        try {
          const response = await fetch("/api/user/preview/kill", {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch PDF');
          }

          const data = await response.json();
          if (data.url) {
            setPdfUrl(url);
          } else {
            throw new Error('No PDF URL found in response');
          }
        } catch (error) {
          console.error('Failed to fetch PDF:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPdf();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [token, showTerms]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Signed-Agreement.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAcceptTerms = () => {
    if (acceptedTerms) {
      setShowTerms(false);
      navigate('/Maindashboard/pdf-sign');
    } else {
      alert("Please accept the terms and conditions to proceed.");
    }
  };

  const handleDeclineTerms = () => {
    alert("You must accept the terms to sign the document.");
    navigate(-1);
  };

  return (
    <div className="sign-agreement-container">
      <div className="sign-agreement-header">
        <div className="sign-header">
          <h1>Your Signed Agreement</h1>
          <p>Preview and download your document</p>
        </div>
        <button
          className="download-btn"
          onClick={handleDownload}
          disabled={loading || !pdfUrl}
        >
          {loading ? 'Generating PDF...' : '⬇ Download PDF'}
        </button>
      </div>

      <div className="pdf-preview">
        {!loading && pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Sign Agreement"
            width="100%"
            height="600px"
          />
        ) : (
          <p>{loading ? 'Loading PDF preview...' : 'No PDF available.'}</p>
        )}
      </div>
      <div className="terms-container">
        <div className="terms-content">
          <h2>Terms and Conditions</h2>
        </div>
        <div className="terms-checkbox">
          <div className='sign-terms-checkbox'>
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="acceptTerms">
              I have read and agree to the terms and conditions above.
            </label>
          </div>
          <div className="terms-buttons">
            <button className="decline-btn" onClick={handleDeclineTerms}>
              Decline
            </button>
            <button
              className="accept-btn"
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

export default SignAgreement;