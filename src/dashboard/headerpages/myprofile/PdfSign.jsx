import React, { useState, useRef } from "react";
import "./PdfSign.css";
import { AiFillSignature } from "react-icons/ai";
import { baseUrl, encryptText } from "../../../encryptDecrypt";
import { useNavigate } from "react-router-dom";

const PdfSign = () => {
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
        navigate("/maindashboard/signed-agreement");
      } else {
        alert(result.message || "Failed to sign the document.");
      }

      console.log("Signature submitted:", signatureData);
      alert("Document signed successfully!");
    } catch (error) {
      console.error("Error submitting signature:", error);
      alert("Something went wrong while signing the document.");
    }
  };

  return (
     <section className="pdf-sign">
      <div className="digital-signature-header">
        <h2>
          <AiFillSignature style={{ color: "#2c3e50" }} />
          Digital PDF Signature
        </h2>
      </div>
      {!signatureMethod ? (
        <div className="signature-methods">
          <h3>Select Signature Method</h3>
          <button
            className="pdf-sign-button"
            onClick={() => handleMethodSelect("aadhaar")}
          >
            Aadhaar e-Sign
          </button>
          <button
            className="pdf-sign-button"
            onClick={() => handleMethodSelect("canvas")}
          >
            Draw Signature
          </button>
          <button
            className="pdf-sign-button"
            onClick={() => handleMethodSelect("otp")}
          >
            Mobile OTP Verification
          </button>
        </div>
      ) : (
        <div className="signature-container">
          <button
            className="pdf-sign-button pdf-sign-back-button"
            onClick={() => setSignatureMethod("")}
          >
            ← Back to methods
          </button>

          {signatureMethod === "aadhaar" && (
            <div className="aadhaar-signature">
              <h3>Aadhaar e-Sign</h3>
              <div className="aadhaar-input-section">
                {!aadhaarOtpSent ? (
                  <>
                    <div className="aadhaar-input-group">
                      <label htmlFor="aadhaar-number">Aadhaar Number</label>
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
                      />
                      <small>We'll send OTP to your registered mobile number</small>
                    </div>
                    <button
                      className="pdf-sign-button pdf-sign-proceed-button"
                      onClick={sendAadhaarOtp}
                      disabled={aadhaarNumber.length !== 12}
                    >
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    <div className="aadhaar-otp-group">
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
                      />
                      <small>OTP sent to mobile linked with Aadhaar</small>
                    </div>
                    <div className="aadhaar-verify-buttons">
                      <button
                        className="pdf-sign-button pdf-sign-resend-button"
                        onClick={sendAadhaarOtp}
                      >
                        Resend OTP
                      </button>
                      <button
                        className="pdf-sign-button pdf-sign-verify-button"
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
                <div className="signature-success aadhaar-success">
                  <p>Aadhaar verification successful!</p>
                  <p>Document will be signed with your Aadhaar</p>
                </div>
              )}
            </div>
          )}

          {signatureMethod === "canvas" && (
            <div className="canvas-signature">
              <h3>Draw Your Signature</h3>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                style={{ border: "1px solid #000" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
              />
              <div className="canvas-controls">
                <button
                  className="pdf-sign-button pdf-sign-clear-button"
                  onClick={clearCanvas}
                >
                  Clear
                </button>
              </div>
              {signatureData && (
                <div className="signature-preview">
                  <p>Signature preview:</p>
                  <img
                    src={signatureData.data}
                    alt="Your signature"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              )}
            </div>
          )}

          {signatureMethod === "otp" && (
            <div className="otp-verification">
              <h3>Mobile OTP Verification</h3>
              <div className="mobile-input">
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled={otpSent}
                />
                <button
                  className="pdf-sign-button pdf-sign-otp-button"
                  onClick={sendOtp}
                  disabled={!mobileNumber || otpSent}
                >
                  {otpSent ? "OTP Sent" : "Send OTP"}
                </button>
              </div>

              {otpSent && (
                <>
                  <div className="pdf-sign-otp-input">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      className="pdf-sign-button pdf-sign-verify-button"
                      onClick={verifyOtp}
                    >
                      Verify OTP
                    </button>
                  </div>
                </>
              )}

              {signatureData && (
                <div className="verification-success">
                  <p>
                    Mobile number {signatureData.mobile} verified successfully!
                  </p>
                </div>
              )}
            </div>
          )}

          {signatureData && (
            <div className="submit-section">
              <button
                className="pdf-sign-button pdf-sign-submit-button"
                onClick={handleSubmit}
              >
                Sign Document
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PdfSign;