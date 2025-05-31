import React, { useState, useCallback } from "react";
import "./Verification.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl, decryptText } from "../../../encryptDecrypt";
import { toast } from "react-toastify";

const Verification = ({ darkMode }) => {
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

  // Generate a random transaction ID
  const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  // Aadhaar functions
  const handleSendAadhaarOtp = useCallback(async () => {
    if (aadhaar.length !== 12) {
      toast.error("Please enter valid 12-digit Aadhaar number");
      return;
    }

    setLoading(true);
    try {
      // Generate transaction ID
      const txnId = generateTransactionId();
      setAadhaarTransactionId(txnId);

      const payload = {
        aadharNumber: aadhaar,
        txnId: txnId,
        location: "28.6139,77.2090", // static, or replace with your geolocation logic
      };

      const response = await axios.post(
        `${baseUrl}/api/user/aadhar/validate`,
        payload,
        { headers: { authorization: token } }
      );

      if (response) {
        toast.success("OTP sent to mobile linked with Aadhaar");
        setIsAadhaarOtpSent(true);
        return response;
      } else {
        throw new Error(data.message || "OTP send failed");
      }
    } catch (error) {
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
  }, [aadhaar, baseUrl, token]);

  const handleVerifyAadhaarOtp = useCallback(async () => {
    if (aadhaarOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        txnId: aadhaarTransactionId,
        otp: aadhaarOtp,
      };

      const response = await axios.post(
        `${baseUrl}/api/user/aadhar/otp-submit`,
        payload,
        { headers: { authorization: token } }
      );

      if (response) {
        toast.success("Aadhaar verified successfully");
        setIsAadhaarVerified(true);
        setStep("pan");
        // Generate PAN transaction ID in advance
        setPanTransactionId(generateTransactionId());
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
  }, [aadhaarOtp, aadhaarTransactionId, baseUrl, token]);

  // PAN verification
  const handleVerifyPan = useCallback(async () => {
    if (pan.length !== 10) {
      toast.error("Please enter valid 10-digit PAN");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        panNumber: pan,
        transactionId: panTransactionId,
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
        // Generate Bank transaction ID in advance
        setBankTransactionId(generateTransactionId());
        return response;
      } else {
        throw new Error(response.message || "PAN verification failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Error verifying PAN"
      );
      console.error("PAN verification error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [pan, panTransactionId, token]);

  // Bank verification
  const handleVerifyBank = useCallback(async () => {
    if (!bankAccount || !ifsc) {
      toast.error("Please enter all bank details correctly");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        accountNumber: bankAccount,
        ifscCode: ifsc,
        txnId: bankTransactionId,
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
    <div className={`verification-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="verification-header">
        <h2>Complete Your Verification</h2>
        <p>Secure your account by verifying your identity</p>
      </div>
      {/* Stepper */}
      <div className="verification-stepper">
        <div
          className={`stepper-step ${step === "aadhaar" ? "active" : ""} ${isAadhaarVerified ? "completed" : ""}`}
        >
          <div className="step-number">1</div>
        </div>
        <div
          className={`stepper-line ${step === "pan" || step === "bank" ? "active" : ""}`}
        ></div>
        <div
          className={`stepper-step ${step === "pan" ? "active" : ""} ${isPanVerified ? "completed" : ""}`}
        >
          <div className="step-number">2</div>
        </div>
        <div
          className={`stepper-line ${step === "bank" ? "active" : ""}`}
        ></div>
        <div
          className={`stepper-step ${step === "bank" ? "active" : ""} ${isBankVerified ? "completed" : ""}`}
        >
          <div className="step-number">3</div>
        </div>
      </div>
      {/* Form Content */}
      <div className="verification-content">
        {step === "aadhaar" && (
          <div className="verification-section">
            <h3>Aadhaar Verification</h3>
            <p className="instruction-text">
              Enter your Aadhaar number to receive OTP.
            </p>
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

            {isAadhaarOtpSent && (
              <div className="transaction-info">
                <p>Transaction ID: {aadhaarTransactionId}</p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value)}
                  maxLength="6"
                  disabled={loading}
                />
              </div>
            )}

            {!isAadhaarOtpSent ? (
              <button
                className="primary-btn"
                onClick={handleSendAadhaarOtp}
                disabled={aadhaar.length !== 12 || loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <button
                className="primary-btn"
                onClick={handleVerifyAadhaarOtp}
                disabled={aadhaarOtp.length !== 6 || loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            )}
          </div>
        )}

        {step === "pan" && (
          <div className="verification-section">
            <h3>PAN Verification</h3>
            <p className="instruction-text">Enter your PAN number</p>
            <input
              type="text"
              placeholder="PAN Number"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              maxLength="10"
              disabled={loading}
            />
            <div className="transaction-info">
              <p>Transaction ID: {panTransactionId}</p>
            </div>
            <button
              className="primary-btn"
              onClick={handleVerifyPan}
              disabled={pan.length !== 10 || loading}
            >
              {loading ? "Verifying..." : "Verify PAN"}
            </button>
          </div>
        )}

        {step === "bank" && (
          <div className="verification-section">
            <h3>Bank Verification</h3>
            <p className="instruction-text">Enter your bank details</p>
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
            <div className="transaction-info">
              <p>Transaction ID: {bankTransactionId}</p>
            </div>
            <button
              className="primary-btn"
              onClick={handleVerifyBank}
              disabled={!bankAccount || !ifsc || loading}
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
