import React, { useState, useRef } from 'react';
import './PdfSign.css';

const PdfSign = () => {
  const [signatureMethod, setSignatureMethod] = useState('');
  const [signatureData, setSignatureData] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Handle signature method selection
  const handleMethodSelect = (method) => {
    setSignatureMethod(method);
    setSignatureData(null);
    setOtpSent(false);
  };

  // Handle Aadhaar signature
  const handleAadhaarSignature = () => {
    // In a real app, you would integrate with Aadhaar API here
    console.log("Initiating Aadhaar e-sign...");
    // Mock implementation
    setSignatureData({ type: 'aadhaar', data: 'aadhaar_signature_data' });
  };

  // Handle canvas drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    // Save the signature
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setSignatureData({ type: 'canvas', data: dataUrl });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  // Handle OTP
  const sendOtp = () => {
    // In a real app, you would send OTP to the mobile number
    console.log(`OTP sent to ${mobileNumber}`);
    setOtpSent(true);
  };

  const verifyOtp = () => {
    // In a real app, you would verify the OTP
    console.log("Verifying OTP...");
    if (otp === "123456") { // Mock verification
      setSignatureData({ type: 'otp', data: 'verified', mobile: mobileNumber });
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Submit the signature
  const handleSubmit = () => {
    if (!signatureData) {
      alert("Please complete the signature process");
      return;
    }
    console.log("Signature submitted:", signatureData);
    // Here you would typically send the signature data to your backend
    // along with the PDF for signing
    alert("Document signed successfully!");
  };

  return (
    <section className='pdf-sign'>
      <h2>PDF Signature</h2>
      
      {!signatureMethod ? (
        <div className="signature-methods">
          <h3>Select Signature Method</h3>
          <button onClick={() => handleMethodSelect('aadhaar')}>Aadhaar e-Sign</button>
          <button onClick={() => handleMethodSelect('canvas')}>Draw Signature</button>
          <button onClick={() => handleMethodSelect('otp')}>Mobile OTP Verification</button>
        </div>
      ) : (
        <div className="signature-container">
          <button onClick={() => setSignatureMethod('')}>← Back to methods</button>
          
          {signatureMethod === 'aadhaar' && (
            <div className="aadhaar-signature">
              <h3>Aadhaar e-Sign</h3>
              <p>You will be redirected to Aadhaar e-Sign service</p>
              <button onClick={handleAadhaarSignature}>Proceed with Aadhaar</button>
              {signatureData && (
                <div className="signature-success">
                  <p>Aadhaar signature successful!</p>
                </div>
              )}
            </div>
          )}

          {signatureMethod === 'canvas' && (
            <div className="canvas-signature">
              <h3>Draw Your Signature</h3>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                style={{ border: '1px solid #000' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
              />
              <div className="canvas-controls">
                <button onClick={clearCanvas}>Clear</button>
              </div>
              {signatureData && (
                <div className="signature-preview">
                  <p>Signature preview:</p>
                  <img src={signatureData.data} alt="Your signature" style={{ maxWidth: '200px' }} />
                </div>
              )}
            </div>
          )}

          {signatureMethod === 'otp' && (
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
                <button onClick={sendOtp} disabled={!mobileNumber || otpSent}>
                  {otpSent ? 'OTP Sent' : 'Send OTP'}
                </button>
              </div>
              
              {otpSent && (
                <>
                  <div className="otp-input">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={verifyOtp}>Verify OTP</button>
                  </div>
                </>
              )}
              
              {signatureData && (
                <div className="verification-success">
                  <p>Mobile number {signatureData.mobile} verified successfully!</p>
                </div>
              )}
            </div>
          )}

          {signatureData && (
            <div className="submit-section">
              <button onClick={handleSubmit}>Sign Document</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PdfSign;