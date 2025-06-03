import React, { useState, useRef } from "react";
import "./PdfSign.css";
import { AiFillSignature } from "react-icons/ai";
import { baseUrl, encryptText,decryptText } from "../../../encryptDecrypt";
import { useNavigate } from "react-router-dom";
import PdfViewerAllPages from "./PdfViewer";
import axios from "axios";

const PdfSign = ({darkMode}) => {
  const token = localStorage.getItem("userToken");
  const [signatureMethod, setSignatureMethod] = useState("");
  const [signatureData, setSignatureData] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const navigate = useNavigate();

  // after pdf signed
  const [pdfUrl, setPdfUrl] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPdfSigned,setIsPdfSigned] = useState(false)

  const fetchPdf = async () => {
    // setLoading(true);
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
      // setLoading(false);
    }
  };

  const handleMethodSelect = (method) => {
    setSignatureMethod(method);
    setSignatureData(null);
    setOtpSent(false);
    setAadhaarOtpSent(false);
  };

  // ____________________AAdhaar OTP sending____________________________
const sendAadhaarOtp = async () => {
  if (!aadhaarNumber || aadhaarNumber.length !== 12) {
    alert("Please enter a valid 12-digit Aadhaar number");
    return;
  }

  try {
    const payload = {
      input: aadhaarNumber,
      lat: "",
      long: "",
      ip: "",
    };

    const encryptedPayload = await encryptText(payload);

    const response = await fetch(`${baseUrl}/api/user/sign`, {
      method: "POST",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { encryptedData: encryptedPayload } }),
    });

    const result = await response.json();
    
   
      setAadhaarOtpSent(true);
      alert("OTP sent to your registered mobile number");
    
      alert(result.message || "Failed to send OTP. Please try again.");

  } catch (error) {
    console.error("Error sending Aadhaar OTP:", error);
    alert("Something went wrong while sending OTP");
  }
};

// ____________________AAdhaar signature verification____________________________
const verifyAadhaarOtp = async () => {
  if (!otp || otp.length !== 6) {
    alert("Please enter a valid 6-digit OTP");
    return;
  }

  try {
    const payload = {
      input: aadhaarNumber,
      otp: otp,
      lat: "28.6139",
      long: "77.2090",
      ip: "192.168.1.1",
    };

    const encryptedPayload = await encryptText(payload);

    const response = await fetch(`${baseUrl}/api/user/sign`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { encryptedData: encryptedPayload } }),
    });

    const result = await response.json();

    
      setSignatureData({
        type: "aadhaar",
        data: result.url || "verified",
        aadhaar: aadhaarNumber,
      });
      alert("Aadhaar verification successful!");
      navigate("/maindashboard/signed-agreement");
   
      alert(result.message || "Failed to verify Aadhaar OTP.");
    
  } catch (error) {
    console.error("Error in Aadhaar verification:", error);
    alert("Something went wrong during Aadhaar verification.");
  }
};

// ______________________________send otp api calling______________________________
const sendOtp = async () => {
  if (!mobileNumber) {
    alert("Please enter a valid mobile number");
    return;
  }

  try {
    const payload = {
      input: mobileNumber,
      lat: "28.6139",
      long: "77.2090",
      ip: "192.168.1.1",
    };

    const encryptedPayload = await encryptText(payload);

    const response = await fetch(`${baseUrl}/api/user/sign`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { encryptedData: encryptedPayload } }),
    });

    if (response.ok) {
      console.log(`OTP sent to ${mobileNumber}`);
      setOtpSent(true);
    } else {
      const result = await response.json();
      alert(result.message || "Failed to send OTP");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

// ______________________________verify otp api calling________________________________
const verifyOtp = async () => {
  if (!otp || otp.length !== 6) {
    alert("Enter a valid 6-digit OTP");
    return;
  }

  try {
    const payload = {
      input: mobileNumber,
      otp: otp,
      lat: "28.6139",
      long: "77.2090",
      ip: "192.168.1.1",
    };

    const encryptedPayload = await encryptText(payload);

    const response = await fetch(`${baseUrl}/api/user/sign`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { encryptedData: encryptedPayload } }),
    });

    const result = await response.json();

    if (response.ok) {
      setSignatureData({
        type: "otp",
        data: "verified",
        mobile: mobileNumber,
      });
      alert("Mobile verification successful!");
      navigate("/maindashboard/signed-agreement");
    } else {
      alert(result.message || "Invalid OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
  }
};

  // __________________canvas signature api____________________________
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setSignatureData({ type: "canvas", data: dataUrl });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  // canvas signature api
  const handleSubmit = async () => {
    console.log(signatureData);
    if (!signatureData) {
      alert("Please complete the signature process");
      return;
    }

    const payload = {
      signature: signatureData.data, // Use the full base64 string including the prefix
      signatureFormat: "png",
    };

    try {
      const response = await fetch(`${baseUrl}/api/user/generate`, {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(response);

      if (response.status === 200 || response.status === 409) {
        // navigate("/maindashboard/signed-agreement");
        await fetchPdf()
        setIsPdfSigned(true)
      } else {
        alert(result.message || "Failed to sign the document.");
      }

      console.log("Signature submitted:", signatureData);
      alert("Document signed successfully!");
    } catch (error) {
      if(error.response && error.response.status === 409) {
        alert("You have already signed this document.");
        await fetchPdf();
        setIsPdfSigned(true);
      }
      console.error("Error submitting signature:", error);
      alert("Something went wrong while signing the document.");
    }
  };

  const handleSendMailSubmit = async () => {
    try {
      setHasSubmitted(true);
      const res = await axios.get(`${baseUrl}/api/notifications/`, {
        headers: { authorization: token },
      });

      const decrypted = await decryptText(res.data.body);
      const parsed = JSON.parse(decrypted);
      console.log("KYC Status:", parsed);
      navigate("/maindashboard/signed-agreement");
      // After submission, show the "under review" message
      // setKycStatus("pending");
    } catch (error) {
      console.log(error);
    }
  };

  return ( 
    !isPdfSigned ?
    <section className={`pdf-sign ${darkMode ? "dark-mode" : ""}`}>
      <div className={`digital-signature-header ${darkMode ? "dark-header" : ""}`}>
        <h2 className='h2-of-digital-sign'>
          <AiFillSignature style={{ color: darkMode ? "#6c5ce7" : "#2c3e50" }} />
          Digital PDF Signature
        </h2>
      </div>
      {!signatureMethod ? (
        <div className={`signature-methods ${darkMode ? "dark-methods" : ""}`}>
          <h3 className='h3-of-digital-sign'>Select Signature Method</h3>
          <button
            className={`pdf-sign-button ${darkMode ? "dark-button" : ""}`}
            onClick={() => handleMethodSelect("aadhaar")}
          >
            Aadhaar e-Sign
          </button>
          <button
            className={`pdf-sign-button ${darkMode ? "dark-button" : ""}`}
            onClick={() => handleMethodSelect("canvas")}
          >
            Draw Signature
          </button>
          <button
            className={`pdf-sign-button ${darkMode ? "dark-button" : ""}`}
            onClick={() => handleMethodSelect("otp")}
          >
            Mobile OTP Verification
          </button>
        </div>
      ) : (
        <div className={`signature-container ${darkMode ? "dark-container" : ""}`}>
          <button
            className={`pdf-sign-button pdf-sign-back-button ${darkMode ? "dark-back-button" : ""}`}
            onClick={() => setSignatureMethod("")}
          >
            ← Back to methods
          </button>

          {signatureMethod === "aadhaar" && (
            <div className={`aadhaar-signature ${darkMode ? "dark-aadhaar" : ""}`}>
              <h3 className='aadharr-signature-h3-digital-sign'>Aadhaar e-Sign</h3>
              <div className={`aadhaar-input-section ${darkMode ? "dark-input-section" : ""}`}>
                {!aadhaarOtpSent ? (
                  <>
                    <div className={`aadhaar-input-group ${darkMode ? "dark-input-group" : ""}`}>
                      <input
                        id="aadhaar-number"
                        type="tel"
                        placeholder="Enter 12-digit Aadhaar number"
                        value={aadhaarNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 12) {
                            setAadhaarNumber(value);
                          }
                        }}
                        maxLength={12}
                        className={darkMode ? "dark-input" : ""}
                      />
                      <small>We'll send OTP to your registered mobile number</small>
                    </div>
                    <button
                      className={`pdf-sign-button pdf-sign-proceed-button ${darkMode ? "dark-primary-button" : ""}`}
                      onClick={sendAadhaarOtp}
                      disabled={aadhaarNumber.length !== 12}
                    >
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`aadhaar-otp-group ${darkMode ? "dark-input-group" : ""}`}>
                      <label htmlFor="aadhaar-otp">Enter OTP</label>
                      <input
                        id="aadhaar-otp"
                        type="tel"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 6) {
                            setOtp(value);
                          }
                        }}
                        maxLength={6}
                        className={darkMode ? "dark-input" : ""}
                      />
                      <small>OTP sent to mobile linked with Aadhaar</small>
                    </div>
                    <div className="aadhaar-verify-buttons">
                      <button
                        className={`pdf-sign-button pdf-sign-resend-button ${darkMode ? "dark-secondary-button" : ""}`}
                        onClick={sendAadhaarOtp}
                      >
                        Resend OTP
                      </button>
                      <button
                        className={`pdf-sign-button pdf-sign-verify-button ${darkMode ? "dark-primary-button" : ""}`}
                        onClick={verifyAadhaarOtp}
                        disabled={otp.length !== 6}
                      >
                        Verify OTP
                      </button>
                    </div>
                  </>
                )}
              </div>

              {signatureData && (
                <div className={`signature-success aadhaar-success ${darkMode ? "dark-success" : ""}`}>
                  <p>Aadhaar verification successful!</p>
                  <p>Document will be signed with your Aadhaar</p>
                </div>
              )}
            </div>
          )}

          {signatureMethod === "canvas" && (
            <div className={`canvas-signature ${darkMode ? "dark-canvas" : ""}`}>
              <h3 className="canvas-signature-h3-digital-sign">Draw Your Signature</h3>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                style={{ 
                  border: darkMode ? "1px solid #6c5ce7" : "1px solid #000",
                  backgroundColor: darkMode ? "" : "#fff"
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
              />
              <div className="canvas-controls">
                <button
                  className={`pdf-sign-button pdf-sign-clear-button ${darkMode ? "dark-secondary-button" : ""}`}
                  onClick={clearCanvas}
                >
                  Clear
                </button>
              </div>
              {signatureData && (
                <div className={`signature-preview ${darkMode ? "dark-preview" : ""}`}>
                  <p className='signature-preview-of-para-digital'>Signature preview:</p>
                  <img
                    src={signatureData.data}
                    alt="Your signature"
                    style={{ maxWidth: "200px", border: darkMode ? "1px solid #6c5ce7" : "1px solid #000" }}
                  />
                </div>
              )}
            </div>
          )}

          {signatureMethod === "otp" && (
            <div className={`otp-verification ${darkMode ? "dark-otp" : ""}`}>
              <h3 className='otp-verification-h3-digital-sign'>Mobile OTP Verification</h3>
              <div className={`mobile-input ${darkMode ? "dark-input-group" : ""}`}>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled={otpSent}
                  className={darkMode ? "dark-input" : ""}
                />
                <button
                  className={`pdf-sign-button pdf-sign-otp-button ${darkMode ? "dark-primary-button" : ""}`}
                  onClick={sendOtp}
                  disabled={!mobileNumber || otpSent}
                >
                  {otpSent ? "OTP Sent" : "Send OTP"}
                </button>
              </div>

              {otpSent && (
                <>
                  <div className={`pdf-sign-otp-input ${darkMode ? "dark-input-group" : ""}`}>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={darkMode ? "dark-input" : ""}
                    />
                    <button
                      className={`pdf-sign-button pdf-sign-verify-button ${darkMode ? "dark-primary-button" : ""}`}
                      onClick={verifyOtp}
                    >
                      Verify OTP
                    </button>
                  </div>
                </>
              )}

              {signatureData && (
                <div className={`verification-success ${darkMode ? "dark-success" : ""}`}>
                  <p>
                    Mobile number {signatureData.mobile} verified successfully!
                  </p>
                </div>
              )}
            </div>
          )}

          {signatureData && (
            <div className={`submit-section ${darkMode ? "dark-submit" : ""}`}>
              <button
                className={`pdf-sign-button pdf-sign-submit-button ${darkMode ? "dark-submit-button" : ""}`}
                onClick={handleSubmit}
              >
                Sign Document
              </button>
            </div>
          )}
        </div>
      )}
    </section> : <div className="verification-section">
            <h3>SendMail Verification</h3>
            <PdfViewerAllPages pdfUrl={pdfUrl}/>
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
              onClick={handleSendMailSubmit}
              className={`w-full px-4 py-2 rounded-md font-medium text-white ${
                isAccepted
                  ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
          </div>
  );
};

export default PdfSign;