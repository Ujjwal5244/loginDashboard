import React, { useState, useEffect } from "react";
import "./Home.css";
import walleticon from "../../../../assets/wallet-icon.jpg";
import kycstatus from "../../../../assets/kyc-status-home.png";
import {
  FaUser,
  FaEnvelope,
  FaMobileAlt,
  FaIdCard,
  FaUniversity,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
// import Uploaddocumnt from "./Uploaddocumnt";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl, decryptText } from "../../../../encryptDecrypt";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/user/profile`, {
          headers: { authorization: token },
        });
        const dec = await decryptText(res.data.body);
        const data = JSON.parse(dec);
        setProfileData(data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  const safeJsonParse = (data) => {
    if (!data) return null;
    try {
      if (typeof data === "object") return data;
      return JSON.parse(data);
    } catch (err) {
      console.warn("JSON parsing failed:", data);
      return null;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return <div className="main-home">Loading...</div>;
  }

  if (!profileData) {
    return <div className="main-home">Failed to load profile data</div>;
  }

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return "Not provided";
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.country,
      address.pincode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const panDetails = safeJsonParse(profileData.panDetails);
  const bankDetails = safeJsonParse(profileData.bankDetails);

  return (
    <div className="main-home">
      <h1 className="welcome-of-person-name-in-home">
        Welcome {profileData.name}
      </h1>
      {profileData.kycStatus !== "verified" && (
        <Link>
          <button
            className={`complete-Kyc-verification-btn ${isVisible ? "visible pulse" : ""}`}
          >
            Complete KYC Verification
          </button>
        </Link>
      )}

      {/* _______main-home-container-1_________ */}
      <div className="main-home-container-1">
        <div className="home-profile-img-container">
          <img
            src={
              profileData.profile ||
              "https://as1.ftcdn.net/v2/jpg/03/10/45/72/1000_F_310457273_U26ukZnb2joxc3itZFUwpiJDwCwc7ewR.jpg"
            }
            alt="Profile"
            className="src"
          />
        </div>
        <div className="home-profile-info-container">
          <h1 className="home-profile-name">{profileData.name}</h1>
          <p className="home-profile-email">{profileData.email}</p>
          <div className="home-profile-verified-container">
            <h3 className="home-profile-verified">
              {profileData.kycStatus === "verified"
                ? "Verified"
                : "Verification pending"}
            </h3>
            <span
              className={`animate-pulse h-2 w-2 rounded-full ${
                profileData.kycStatus === "verified"
                  ? "bg-green-400"
                  : "bg-yellow-400"
              }`}
            ></span>
          </div>
        </div>
      </div>

      {/* _____________main-home-container-2_____________  */}
      <div className="main-home-container-2">
        {/* card container-1 */}
        <div className="card-container-1">
          <div className="info-card-container-wallet">
            <h2 className="wallet-card-title">Main Wallet</h2>
            <h1 className="wallet-card-amount-value">
              <span id="home-wallet-ruppes">₹ </span>
              {profileData.wallet.mainWallet}
            </h1>
          </div>
          <div className="wallet-card-amount">
            <img src={walleticon} alt="wallet-icon" className="src" />
          </div>
        </div>
        {/* card container-2 */}
        <div className="card-container-1">
          <div className="info-card-container-wallet">
            <h2 className="wallet-card-title">Loan Wallet</h2>
            <h1 className="wallet-card-amount-value">
              <span id="home-wallet-ruppes">₹ </span>
              {profileData.wallet.leanWallet}
            </h1>
          </div>
          <div className="wallet-card-amount">
            <img src={walleticon} alt="wallet-icon" className="src" />
          </div>
        </div>
        {/* card container-3 */}
        <div className="card-container-1">
          <div className="info-card-container-wallet">
            <h2 className="wallet-card-title">KYC Status</h2>
            <h1
              className={`wallet-card-kyc-${profileData.kycStatus.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {profileData.kycStatus}
            </h1>
          </div>
          <div className="wallet-card-kyc-img">
            <img src={kycstatus} alt="wallet-icon" className="src" />
          </div>
        </div>
      </div>

      {/* __________main-home-container-3____________  */}
      <div className="main-home-container-3">
        {/* Personal Information Card */}
        <div className="personal-info-card-container">
          <div className="personal-info-header">
            <FaUser className="personal-info-icon" />
            <h2>Personal Information</h2>
          </div>
          <div className="personal-info-details">
            <div className="personal-info-item">
              <div className="info-item-header">
                <FaUser className="info-item-icon" />
                <h3>Full Name</h3>
              </div>
              <p className="info-item-value">{profileData.name}</p>
            </div>
            <div className="personal-info-item">
              <div className="info-item-header">
                <FaEnvelope className="info-item-icon" />
                <h3>Email Address</h3>
              </div>
              <p className="info-item-value">{profileData.email}</p>
            </div>
            <div className="personal-info-item">
              <div className="info-item-header">
                <FaMobileAlt className="info-item-icon" />
                <h3>Mobile Number</h3>
              </div>
              <p className="info-item-value">+91 {profileData.mobile}</p>
            </div>
            {profileData.aadharDetails && (
              <div className="personal-info-item">
                <div className="info-item-header">
                  <FaIdCard className="info-item-icon" />
                  <h3>Aadhar Number</h3>
                </div>
                <p className="info-item-value">
                  {profileData.aadharDetails.aadharNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verification Status Card */}
        <div className="verification-status-card-container">
          <div className="verification-status-header">
            <FaIdCard className="verification-status-icon" />
            <h2>KYC Verification Status</h2>
          </div>
          <div className="verification-status-items">
            <div
              className={`verification-status-item ${
                profileData.aadharVerification ? "verified" : "not-verified"
              }`}
            >
              <div className="status-item-header">
                <FaIdCard className="status-item-icon" />
                <h3>Aadhaar</h3>
              </div>
              <div className="status-badge">
                {profileData.aadharVerification ? (
                  <>
                    <FaCheckCircle className="status-icon" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="status-icon" />
                    <span>Not Verified</span>
                  </>
                )}
              </div>
            </div>
            <div
              className={`verification-status-item ${
                profileData.panVerification
                  ? "verified"
                  : panDetails
                    ? "pending"
                    : "not-verified"
              }`}
            >
              <div className="status-item-header">
                <FaIdCard className="status-item-icon" />
                <h3>PAN Card</h3>
              </div>
              <div className="status-badge">
                {profileData.panVerification ? (
                  <>
                    <FaCheckCircle className="status-icon" />
                    <span>Verified</span>
                  </>
                ) : panDetails ? (
                  <>
                    <FaExclamationCircle className="status-icon" />
                    <span>Pending</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="status-icon" />
                    <span>Not Verified</span>
                  </>
                )}
              </div>
            </div>
            <div
              className={`verification-status-item ${
                profileData.bankVerification
                  ? "verified"
                  : bankDetails
                    ? "pending"
                    : "not-verified"
              }`}
            >
              <div className="status-item-header">
                <FaUniversity className="status-item-icon" />
                <h3>Bank Account</h3>
              </div>
              <div className="status-badge">
                {profileData.bankVerification ? (
                  <>
                    <FaCheckCircle className="status-icon" />
                    <span>Verified</span>
                  </>
                ) : bankDetails ? (
                  <>
                    <FaExclamationCircle className="status-icon" />
                    <span>Pending</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="status-icon" />
                    <span>Not Verified</span>
                  </>
                )}
              </div>
            </div>
            <div className="verification-divider"></div>
            <div className="verification-overall-status">
              <div className="status-item-header">
                <FaIdCard className="status-item-icon" />
                <h3>Overall KYC Status</h3>
              </div>
              <div
                className={`status-badge ${
                  profileData.kycStatus === "verified"
                    ? "verified"
                    : profileData.kycStatus === "under review"
                      ? "pending"
                      : "not-verified"
                }`}
              >
                {profileData.kycStatus === "verified" ? (
                  <>
                    <FaCheckCircle className="status-icon" />
                    <span>Verified</span>
                  </>
                ) : profileData.kycStatus === "under review" ? (
                  <>
                    <FaExclamationCircle className="status-icon" />
                    <span>In Progress</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="status-icon" />
                    <span>Not Verified</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* __________main-home-container-4____________  */}
      <div className="main-home-container-4">
        {/* company information */}
        <div className="company-information-card-container">
          <h1 className="h1-of-company-info">Company Information</h1>

          <div className="company-info-item">
            <h2>Company Name</h2>
            <p>{profileData.companyName || "Not provided"}</p>
          </div>
          <div className="company-info-item">
            <h2>Company Address</h2>
            <p>{formatAddress(profileData.companyAddress)}</p>
          </div>
          <div className="company-info-item">
            <h2>Company Mobile Number</h2>
            <p>{profileData.mobile}</p>
          </div>
          <div className="company-info-item">
            <h2>About Company</h2>
            <a
              href="https://nerasoft.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="company-link"
            >
              Visit Our Website
            </a>
          </div>
        </div>

        {/* billing information */}
        <div className="billing-information-card-container">
          <h1 className="billing-information-of-home-profile">
            Billing Information
          </h1>
          <div className="billing-info-item">
            <h2>GST Number</h2>
            <p>{profileData.gstNo || "Not provided"}</p>
          </div>
          <div className="billing-info-item">
            <h2>Certificate Number</h2>
            <p>{profileData.certificateNo || "Not provided"}</p>
          </div>
          <div className="billing-info-item">
            <h2>Billing details</h2>
            <p>{profileData.review || "Not provided"}</p>
          </div>
          <div className="billing-info-item">
            <h2>Billing Address</h2>
            <p>{formatAddress(profileData.billingAddress)}</p>
          </div>
        </div>
      </div>

      {/* _______upload-documents-funcetion-main-home-container-5_________ */}
      {/* <Uploaddocumnt /> */}
      {/* _______upload-documents-funcetion-main-home-container-5_________ */}
    </div>
  );
};

export default Home;
