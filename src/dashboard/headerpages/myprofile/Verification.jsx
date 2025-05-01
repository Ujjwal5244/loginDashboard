import React, { useState } from "react";
import "./Verification.css";

const Verification = () => {
  const [step, setStep] = useState("aadhaar"); // 'aadhaar', 'pan', 'bank'
  
  // Aadhaar state
  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarTransactionId, setAadhaarTransactionId] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);

  // PAN state
  const [pan, setPan] = useState("");
  const [panTransactionId, setPanTransactionId] = useState("");
  const [panOtp, setPanOtp] = useState("");
  const [isPanVerified, setIsPanVerified] = useState(false);

  // Bank state
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankOtp, setBankOtp] = useState("");
  const [bankTransactionId, setBankTransactionId] = useState("");
  const [isBankVerified, setIsBankVerified] = useState(false);

  // Aadhaar functions
  const handleSendAadhaarOtp = () => {
    setAadhaarTransactionId("TXN" + Math.floor(Math.random() * 100000));
    alert("OTP sent to mobile linked with Aadhaar");
  };

  const handleVerifyAadhaarOtp = () => {
    if (aadhaarOtp === "123456") {
      setIsAadhaarVerified(true);
      setStep("pan");
    } else {
      alert("Invalid OTP");
    }
  };

  // PAN functions
  const handleSendPanOtp = () => {
    setPanTransactionId("PTXN" + Math.floor(Math.random() * 100000));
    alert("OTP sent to mobile/email linked with PAN");
  };

  const handleVerifyPanOtp = () => {
    if (panOtp === "789012") {
      setIsPanVerified(true);
      setStep("bank");
    } else {
      alert("Invalid PAN OTP");
    }
  };

  // Bank functions
  const handleSendBankOtp = () => {
    setBankTransactionId("BTXN" + Math.floor(Math.random() * 100000));
    alert("Bank OTP sent");
  };

  const handleVerifyBankOtp = () => {
    if (bankOtp === "654321") {
      setIsBankVerified(true);
      alert("All verifications completed!");
    } else {
      alert("Invalid Bank OTP");
    }
  };

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
          <div className="step-label">Aadhaar</div>
        </div>
        <div className={`stepper-line ${step === "pan" || step === "bank" ? "active" : ""}`}></div>
        <div className={`stepper-step ${step === "pan" ? "active" : ""} ${isPanVerified ? "completed" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-label">PAN</div>
        </div>
        <div className={`stepper-line ${step === "bank" ? "active" : ""}`}></div>
        <div className={`stepper-step ${step === "bank" ? "active" : ""} ${isBankVerified ? "completed" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-label">Bank</div>
        </div>
      </div>

      {/* Form Content */}
      <div className="verification-content">
        {/* Aadhaar Step */}
        {step === "aadhaar" && (
          <div className="verification-section">
            <h3>Aadhaar Verification</h3>
            <p className="instruction-text">Please enter your 12-digit Aadhaar number</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="Aadhaar Number"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                maxLength="12"
              />
              <button 
                className="primary-btn"
                onClick={handleSendAadhaarOtp}
                disabled={aadhaar.length !== 12}
              >
                Send OTP
              </button>
            </div>
            
            {aadhaarTransactionId && (
              <div className="otp-group">
                <p className="transaction-id">Transaction ID: {aadhaarTransactionId}</p>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value)}
                  maxLength="6"
                />
                <button 
                  className="primary-btn"
                  onClick={handleVerifyAadhaarOtp}
                  disabled={aadhaarOtp.length !== 6}
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        )}

        {/* PAN Step */}
        {step === "pan" && (
          <div className="verification-section">
            <h3>PAN Verification</h3>
            <p className="instruction-text">Please enter your 10-digit PAN number</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="PAN Number (e.g., AAAAA0000A)"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                maxLength="10"
              />
              <button 
                className="primary-btn"
                onClick={handleSendPanOtp}
                disabled={pan.length !== 10}
              >
                Send OTP
              </button>
            </div>
            
            {panTransactionId && (
              <div className="otp-group">
                <p className="transaction-id">Transaction ID: {panTransactionId}</p>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={panOtp}
                  onChange={(e) => setPanOtp(e.target.value)}
                  maxLength="6"
                />
                <button 
                  className="primary-btn"
                  onClick={handleVerifyPanOtp}
                  disabled={panOtp.length !== 6}
                >
                  Verify PAN
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bank Step */}
        {step === "bank" && (
          <div className="verification-section">
            <h3>Bank Details Verification</h3>
            <p className="instruction-text">Please enter your bank account details</p>
            <div className="bank-inputs">
              <input
                type="text"
                placeholder="Account Number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              />
              <input
                type="text"
                placeholder="IFSC Code"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              />
              <button 
                className="primary-btn"
                onClick={handleSendBankOtp}
                disabled={!bankAccount || !ifsc}
              >
                Send OTP
              </button>
            </div>
            
            {bankTransactionId && (
              <div className="otp-group">
                <p className="transaction-id">Transaction ID: {bankTransactionId}</p>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={bankOtp}
                  onChange={(e) => setBankOtp(e.target.value)}
                  maxLength="6"
                />
                <button 
                  className="primary-btn"
                  onClick={handleVerifyBankOtp}
                  disabled={bankOtp.length !== 6}
                >
                  Verify Bank
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;