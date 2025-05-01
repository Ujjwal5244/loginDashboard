import React from "react";
import { FaCheckCircle, FaRegIdCard, FaUniversity, FaCreditCard } from "react-icons/fa";
import { MdIncompleteCircle } from "react-icons/md";
import "./Kycstatus.css";

const Kycstatus = () => {
  const kycData = {
    completion: 0,
    verifiedSteps: 0,
    totalSteps: 3,
    status: "Not Started",
    verifications: [
      { name: "Aadhaar", status: "Not Verified", description: "Pending verification", color: "purple" },
      { name: "PAN", status: "Not Verified", description: "Pending verification", color: "pink" },
      { name: "Bank", status: "Not Verified", description: "Pending verification", color: "green" },
    ]
  };

  return (
    <div className="kyc-container">
      <div className="kyc-header">
        <div className="kyc-box">
          <p><MdIncompleteCircle className="icon" /> Completion</p>
          <h2>{kycData.completion}%</h2>
        </div>
        <div className="kyc-box">
          <p><FaCheckCircle className="icon" style={{ color: "green" }} /> Verified Steps</p>
          <h2>{kycData.verifiedSteps} / {kycData.totalSteps}</h2>
        </div>
        <div className="kyc-box">
          <p><FaCreditCard style={{ color: "#3470b2" }} className="icon" /> Status</p>
          <h2 className="status-not-started">{kycData.status}</h2>
        </div>
      </div>

      <div className="kyc-body">
        <div className="kyc-progress">
          <h3>Overall Verification</h3>
          <div className="circle-chart">
            <div className="circle">
              <span>{kycData.completion}%</span>
            </div>
            <div className="circle-legend">
              <div><span className="dot orange" /> Completed</div>
              <div><span className="dot gray" /> Remaining</div>
            </div>
            <p>{kycData.completion}% Completed</p>
            <p>{kycData.verifiedSteps} of {kycData.totalSteps} steps verified</p>
          </div>
        </div>

        <div className="kyc-step-chart">
          <h3>Step Verification Status</h3>
          <div className="bar-chart">
            {kycData.verifications.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar" style={{ height: '0%' }}></div>
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kyc-verification-steps">
        {kycData.verifications.map((item, index) => {
          const Icon = item.name === "Aadhaar" ? FaRegIdCard
                      : item.name === "PAN" ? FaCreditCard
                      : item.name === "Bank" ? FaUniversity
                      : FaCheckCircle;
          return (
            <div key={index} className="verify-box">
              <div className="verify-info">
                <h4><Icon className="verify-icon" style={{ color: "gray" }} />
                {item.name} Verification</h4>
                <p>{item.description}</p>
              </div>
              <span className={`badge ${item.color.toLowerCase()}`}>{item.status}</span>
            </div>
          );
        })}
      </div>
    </div> 
  );
};

export default Kycstatus;
