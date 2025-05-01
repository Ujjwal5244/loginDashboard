import React, { useState } from 'react';
import './Uploaddocument.css';
import { CiMemoPad } from "react-icons/ci";
import { AiOutlineIdcard } from "react-icons/ai";
import { FaIdCard } from "react-icons/fa";

const Uploaddocumnt = () => {
  const [uploadStates, setUploadStates] = useState({
    aadhar: { progress: 0, fileName: '', isUploaded: false },
    pan: { progress: 0, fileName: '', isUploaded: false },
    bank: { progress: 0, fileName: '', isUploaded: false }
  });

  const handleFileUpload = (event, documentType) => {
    const file = event.target.files[0];
    if (!file) return;

    // Update state with file name and reset progress
    setUploadStates(prev => ({
      ...prev,
      [documentType]: {
        fileName: file.name,
        progress: 0,
        isUploaded: false
      }
    }));

    // Simulate upload progress (replace with actual API call)
    const interval = setInterval(() => {
      setUploadStates(prev => {
        const newProgress = prev[documentType].progress + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            [documentType]: {
              ...prev[documentType],
              progress: 100,
              isUploaded: true
            }
          };
        }
        
        return {
          ...prev,
          [documentType]: {
            ...prev[documentType],
            progress: newProgress
          }
        };
      });
    }, 100);
  };

  const getUploadStatusClass = (documentType) => {
    if (uploadStates[documentType].isUploaded) return 'upload-success';
    if (uploadStates[documentType].progress > 0) return 'upload-in-progress';
    return '';
  };

  return (
    <div className="main-home-container-5">
      <div className="document-verification-status-header">
        <FaIdCard className="document-verification-status-icon" />
        <h2>Upload Your Documents</h2>
      </div>
      <div className="verification-status-border-of-line"></div>
      <div className="home-upload-file-document-container">
        <div 
          className={`adharcard-upload-file-document ${getUploadStatusClass('aadhar')}`}
          onClick={() => document.getElementById('aadhar-upload').click()}
        >
          <CiMemoPad className="document-verification-status-icon" />
          <h2>Aadhar Card</h2>
          {uploadStates.aadhar.fileName && (
            <>
              <p className="upload-info">
                {uploadStates.aadhar.isUploaded 
                  ? `Uploaded: ${uploadStates.aadhar.fileName}`
                  : `Uploading: ${uploadStates.aadhar.fileName}`}
              </p>
              <div className="upload-progress">
                <div 
                  className="upload-progress-bar" 
                  style={{ width: `${uploadStates.aadhar.progress}%` }}
                ></div>
              </div>
            </>
          )}
          <input 
            type="file" 
            id="aadhar-upload" 
            className="upload-input" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, 'aadhar')}
          />
        </div>
        
        <div 
          className={`pancard-upload-file-document ${getUploadStatusClass('pan')}`}
          onClick={() => document.getElementById('pan-upload').click()}
        >
          <AiOutlineIdcard className="document-verification-status-icon" />
          <h2>Pan Card</h2>
          {uploadStates.pan.fileName && (
            <>
              <p className="upload-info">
                {uploadStates.pan.isUploaded 
                  ? `Uploaded: ${uploadStates.pan.fileName}`
                  : `Uploading: ${uploadStates.pan.fileName}`}
              </p>
              <div className="upload-progress">
                <div 
                  className="upload-progress-bar" 
                  style={{ width: `${uploadStates.pan.progress}%` }}
                ></div>
              </div>
            </>
          )}
          <input 
            type="file" 
            id="pan-upload" 
            className="upload-input" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, 'pan')}
          />
        </div>
        
        <div 
          className={`pancard-upload-file-document ${getUploadStatusClass('bank')}`}
          onClick={() => document.getElementById('bank-upload').click()}
        >
          <AiOutlineIdcard className="document-verification-status-icon" />
          <h2>Bank Details</h2>
          {uploadStates.bank.fileName && (
            <>
              <p className="upload-info">
                {uploadStates.bank.isUploaded 
                  ? `Uploaded: ${uploadStates.bank.fileName}`
                  : `Uploading: ${uploadStates.bank.fileName}`}
              </p>
              <div className="upload-progress">
                <div 
                  className="upload-progress-bar" 
                  style={{ width: `${uploadStates.bank.progress}%` }}
                ></div>
              </div>
            </>
          )}
          <input 
            type="file" 
            id="bank-upload" 
            className="upload-input" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, 'bank')}
          />
        </div>
      </div>
    </div>
  );
};

export default Uploaddocumnt;