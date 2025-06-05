import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaRegIdCard,
  FaUniversity,
  FaCreditCard,
} from "react-icons/fa";
import { MdIncompleteCircle } from "react-icons/md";
import "./Kycstatus.css";
import axios from "axios";
import { baseUrl, decryptText } from "../../../encryptDecrypt";

const Kycstatus = () => {
  const token = localStorage.getItem("userToken");
  const [kycData, setKycData] = useState({
    completion: 0,
    verifiedSteps: 0,
    totalSteps: 3,
    status: "Not Started",
    verifications: [
      {
        name: "Aadhaar",
        status: "Not Verified",
        description: "Pending verification",
        color: "purple",
      },
      {
        name: "PAN",
        status: "Not Verified",
        description: "Pending verification",
        color: "pink",
      },
      {
        name: "Bank",
        status: "Not Verified",
        description: "Pending verification",
        color: "green",
      },
    ],
  });

  useEffect(() => {
    // Simulate API call
    const fetchKycStatus = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/user/kycstatus`, {
          headers: { authorization: token },
        });
        const dec = await decryptText(response.data.body);
        console.log(dec);
        const apiData = JSON.parse(dec);

        // Calculate verified steps
        const verifiedSteps = [
          apiData.adharVerification,
          apiData.panVerification,
          apiData.bankVerification,
        ].filter(Boolean).length;

        // Update state based on API response
        setKycData({
          completion: Math.round((verifiedSteps / 3) * 100),
          verifiedSteps,
          totalSteps: 3,
          status: apiData.kycStatus,
          verifications: [
            {
              name: "Aadhaar",
              status: apiData.adharVerification ? "Verified" : "Not Verified",
              description: apiData.adharVerification
                ? "Verification complete"
                : "Pending verification",
              color: "purple",
            },
            {
              name: "PAN",
              status: apiData.panVerification ? "Verified" : "Not Verified",
              description: apiData.panVerification
                ? "Verification complete"
                : "Pending verification",
              color: "pink",
            },
            {
              name: "Bank",
              status: apiData.bankVerification ? "Verified" : "Not Verified",
              description: apiData.bankVerification
                ? "Verification complete"
                : "Pending verification",
              color: "green",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    fetchKycStatus();
  }, []);

  return (
    <div className="kyc-container">
      <div className="kyc-header">
        <div className="kyc-box">
          <p>
            <MdIncompleteCircle className="icon" /> Completion
          </p>
          <h2>{kycData.completion}%</h2>
        </div>
        <div className="kyc-box">
          <p>
            <FaCheckCircle className="icon" style={{ color: "green" }} />{" "}
            Verified Steps
          </p>
          <h2>
            {kycData.verifiedSteps} / {kycData.totalSteps}
          </h2>
        </div>
        <div className="kyc-box">
          <p>
            <FaCreditCard style={{ color: "#3470b2" }} className="icon" />{" "}
            Status
          </p>
          <h2
            className={`status-${kycData.status.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {kycData.status}
          </h2>
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
              <div>
                <span className="dot orange" /> Completed
              </div>
              <div>
                <span className="dot gray" /> Remaining
              </div>
            </div>
            <p>{kycData.completion}% Completed</p>
            <p>
              {kycData.verifiedSteps} of {kycData.totalSteps} steps verified
            </p>
          </div>
        </div>

       <div className="kyc-step-chart">
  <h3>Step Verification Status</h3>
  <div className="bar-chart">
    {kycData.verifications.map((item, index) => (
      <div key={index} className="bar-item">
        <div className="bar-container">
          <div
            className={`bar ${item.status === "Verified" ? "verified" : ""}`}
            style={{
              backgroundColor:
                item.status === "Verified"
                  ? item.color === "purple"
                    ? "#800080"
                    : item.color === "pink"
                      ? "#FF69B4"
                      : "#008000"
                  : "#e0e0e0",
            }}
          >
            {item.status === "Verified" && (
              <div className="bar-fill" style={{ height: "100%" }}>
                <div className="sparkle"></div>
              </div>
            )}
          </div>
          <div className="bar-label">
            {item.status === "Verified" && (
              <FaCheckCircle className="check-icon" />
            )}
          </div>
        </div>
        <p className="bar-name">{item.name}</p>
        <p className={`bar-status ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
          {item.status}
        </p>
      </div>
    ))}
  </div>
</div>
      </div>

      <div className="kyc-verification-steps">
        {kycData.verifications.map((item, index) => {
          const Icon =
            item.name === "Aadhaar"
              ? FaRegIdCard
              : item.name === "PAN"
                ? FaCreditCard
                : item.name === "Bank"
                  ? FaUniversity
                  : FaCheckCircle;
          return (
            <div key={index} className="verify-box">
              <div className="verify-info">
                <h4>
                  <Icon
                    className="verify-icon"
                    style={{
                      color: item.status === "Verified" ? item.color : "gray",
                    }}
                  />
                  {item.name} Verification
                </h4>
                <p>{item.description}</p>
              </div>
              <span className={`badge ${item.color.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kycstatus;
