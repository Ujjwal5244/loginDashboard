import React, { useState, useCallback } from "react";
import "./Verification.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl, decryptText } from "../../../encryptDecrypt";
import { toast } from "react-toastify";

const Verification = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("aadhaar");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  // Aadhaar state
  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarTransactionId, setAadhaarTransactionId] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [isAadhaarOtpSent, setIsAadhaarOtpSent] = useState(false);

  // PAN state
  const [pan, setPan] = useState("");
  const [panTransactionId, setPanTransactionId] = useState("");
  const [isPanVerified, setIsPanVerified] = useState(false);

  // Bank state
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankTransactionId, setBankTransactionId] = useState("");
  const [isBankVerified, setIsBankVerified] = useState(false);


 // Aadhaar functions (no makeApiCall)
const handleSendAadhaarOtp = useCallback(async () => {
  // 1. validation
  if (aadhaar.length !== 12 || aadhaarTransactionId.trim().length < 6) {
    toast.error("Please enter valid Aadhaar and Transaction ID");
    return;
  }

  setLoading(true);
  try {
    // 2. build payload (add your location here)
    const payload = {
      aadharNumber: aadhaar,
      txnId: aadhaarTransactionId,
      location: "28.6139,77.2090"  // static, or replace with your geolocation logic
    };

    // 3. raw axios call
    const response = await axios.post(
      `${baseUrl}/api/user/aadhar/validate`,
      payload,
      { headers: { authorization: token } }
    );

    // 5. check & toast
    if (response) {
      toast.success("OTP sent to mobile linked with Aadhaar");
      setIsAadhaarOtpSent(true);
      return response;
    } else {
      throw new Error(data.message || "OTP send failed");
    }

  } catch (error) {
    // handle errors
    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Error processing Aadhaar OTP request"
    );
    console.error("Aadhaar OTP send error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
}, [aadhaar, aadhaarTransactionId, baseUrl, token, decryptText]);


const handleVerifyAadhaarOtp = useCallback(async () => {
  // 1. Validate OTP length
  if (aadhaarOtp.length !== 6) {
    toast.error("Please enter a valid 6-digit OTP");
    return;
  }

  setLoading(true);
  try {
    // 2. Build payload (you can uncomment aadharNumber if your API needs it)
    const payload = {
      txnId: aadhaarTransactionId,
      otp: aadhaarOtp
    };

    // 3. Raw axios POST
    const response = await axios.post(
      `${baseUrl}/api/user/aadhar/otp-submit`,
      payload,
      { headers: { authorization: token } }
    );

    // 5. Check status and toast
    if (response) {
      toast.success("Aadhaar verified successfully");
      setIsAadhaarVerified(true);
      setStep("pan");
      return response;
    } else {
      throw new Error(response.message || "Verification failed");
    }

  } catch (error) {
    toast.error(
      error.response?.message ||
      error.message ||
      "Error verifying Aadhaar OTP"
    );
    console.error("Aadhaar verification error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
}, [
  aadhaarOtp,
  aadhaarTransactionId,
  baseUrl,
  token,
  decryptText,
  setIsAadhaarVerified,
  setStep
]);

  // PAN verification
const handleVerifyPan = useCallback(async () => {
  if (pan.length !== 10 || panTransactionId.trim().length < 6) {
    toast.error("Please enter valid PAN and Transaction ID");
    return;
  }

  setLoading(true);
  try {
    const payload = {
      panNumber: pan,
      transactionId: panTransactionId
    };

    const response = await axios.post(
      `${baseUrl}/api/user/validate-pan`,
      payload,
      { headers: { authorization: token } }
    );

    if (response) {
      toast.success("PAN verified successfully");
      setIsPanVerified(true);
      setStep("bank");
      return response;
    } else {
      throw new Error(response.message || "PAN verification failed");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Error verifying PAN"
    );
    console.error("PAN verification error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
}, [pan, panTransactionId, token]);

// Bank verification
const handleVerifyBank = useCallback(async () => {
  if (!bankAccount || !ifsc || bankTransactionId.trim().length < 6) {
    toast.error("Please enter all bank details correctly");
    return;
  }

  setLoading(true);
  try {
    const payload = {
      accountNumber: bankAccount,
      ifscCode: ifsc,
      txnId: bankTransactionId
    };

    const response = await axios.post(
      `${baseUrl}/api/user/validate-bank`,
      payload,
      { headers: { authorization: token } }
    );

    if (response) {
      toast.success("Bank details verified successfully");
      setIsBankVerified(true);
      navigate("/Maindashboard/sign-agreement");
      return response;
    } else {
      throw new Error(response.message || "Bank verification failed");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Error verifying bank details"
    );
    console.error("Bank verification error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
}, [bankAccount, ifsc, bankTransactionId, navigate, token]);

  return (
    <div className="verification-container">
      <div className="verification-header">
        <h2>Complete Your Verification</h2>
        <p>Secure your account by verifying your identity</p>
      </div>

      {/* Stepper */}
      <div className="verification-stepper">
        <div className={`stepper-step ${step === "aadhaar" ? "active" : ""} ${isAadhaarVerified ? "completed" : ""}`}>
          <div className="step-number">1</div>
        </div>
        <div className={`stepper-line ${step === "pan" || step === "bank" ? "active" : ""}`}></div>
        <div className={`stepper-step ${step === "pan" ? "active" : ""} ${isPanVerified ? "completed" : ""}`}>
          <div className="step-number">2</div>
        </div>
        <div className={`stepper-line ${step === "bank" ? "active" : ""}`}></div>
        <div className={`stepper-step ${step === "bank" ? "active" : ""} ${isBankVerified ? "completed" : ""}`}>
          <div className="step-number">3</div>
        </div>
      </div>

      {/* Form Content */}
      <div className="verification-content">
        {step === "aadhaar" && (
          <div className="verification-section">
            <h3>Aadhaar Verification</h3>
            <p className="instruction-text">Enter your Aadhaar number and Transaction ID to receive OTP.</p>
            <input
              type="text"
              placeholder="Aadhaar Number"
              value={aadhaar}
              onChange={(e) => {
                setAadhaar(e.target.value);
                setIsAadhaarOtpSent(false);
              }}
              maxLength="12"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Transaction ID"
              value={aadhaarTransactionId}
              onChange={(e) => {
                setAadhaarTransactionId(e.target.value);
                setIsAadhaarOtpSent(false);
              }}
              disabled={loading}
            />
            {!isAadhaarOtpSent && (
              <button
                className="primary-btn"
                onClick={handleSendAadhaarOtp}
                disabled={aadhaar.length !== 12 || aadhaarTransactionId.trim().length < 6 || loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            )}

            {isAadhaarOtpSent && (
              <>
                <p className="transaction-id">Transaction ID: {aadhaarTransactionId}</p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value)}
                  maxLength="6"
                  disabled={loading}
                />
                <button
                  className="primary-btn"
                  onClick={handleVerifyAadhaarOtp}
                  disabled={aadhaarOtp.length !== 6 || loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
          </div>
        )}

        {step === "pan" && (
          <div className="verification-section">
            <h3>PAN Verification</h3>
            <p className="instruction-text">Enter your PAN number and Transaction ID</p>
            <input
              type="text"
              placeholder="PAN Number"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              maxLength="10"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Transaction ID"
              value={panTransactionId}
              onChange={(e) => setPanTransactionId(e.target.value)}
              disabled={loading}
            />
            <button
              className="primary-btn"
              onClick={handleVerifyPan}
              disabled={pan.length !== 10 || panTransactionId.trim().length < 6 || loading}
            >
              {loading ? "Verifying..." : "Verify PAN"}
            </button>
          </div>
        )}

        {step === "bank" && (
          <div className="verification-section">
            <h3>Bank Verification</h3>
            <p className="instruction-text">Enter your bank details and Transaction ID</p>
            <input
              type="text"
              placeholder="Account Number"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="IFSC Code"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Transaction ID"
              value={bankTransactionId}
              onChange={(e) => setBankTransactionId(e.target.value)}
              disabled={loading}
            />
            <button
              className="primary-btn"
              onClick={handleVerifyBank}
              disabled={!bankAccount || !ifsc || bankTransactionId.trim().length < 6 || loading}
            >
              {loading ? "Verifying..." : "Verify Bank Details"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;