import React, { useState } from 'react';
import './Signup.css';
import neralog from "../assets/nerasoft-logo.jpg";
import loginimg3 from "../assets/login-left-img3.jpg";
import { Link } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { FaApple } from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false); // 🔥 NEW STATE

  // Function to call OTP API
  const handleGetOtp = async () => {
    if (!mobile) {
      alert("Please enter your mobile number.");
      return;
    }

    try {
      const response = await fetch('https://your-api.com/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("OTP sent successfully!");
        setShowOtpInput(true); // ✅ Show the OTP input box
      } else {
        alert(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Something went wrong.");
    }
  };

  const handleSocialLogin = (platform) => {
    alert(`Login with ${platform} clicked`);
  };

  return (
    <div className='signup-main-container'>
      {/* Left side */}
      <div className="left-side w-full md:w-1/2 bg-white h-1/2 md:h-full relative">
        <a href="https://nerasoft.in/" className="nera-login-logo-container" style={{ textDecoration: "none" }}>
          <img src={neralog} alt="nera-logo" />
          <p className="nera-logo-para">NifiPayment</p>
        </a>
        <div className="sign-up-left-img-1">
          <img src={loginimg3} alt="Slide 1" />
        </div>
      </div>

      {/* Right side */}
      <div className='right-side-signup'>
        <div className='signup-form-container'>
          <h1 className='signup-title'>Create Account</h1>

          {/* Full Name */}
          <div className='signup-input-group'>
            <label className='signup-label'>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='input' placeholder="enter your name..." />
          </div>

          {/* Email */}
          <div className='signup-input-group'>
            <label className='signup-label'>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='input' placeholder="enter your email..." />
          </div>

          {/* Mobile */}
          <div className='signup-input-group'>
            <label className='signup-label'>Mobile Number</label>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className='input' placeholder="enter your mobile number..." />
          </div>

          {/* Conditionally render OTP input */}
          {showOtpInput && (
            <div className='signup-input-group'>
              <label className='signup-label'>OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='input'
                placeholder="enter your otp"
              />
            </div>
          )}

          {/* Get OTP Button */}
          <button className='otp-button' onClick={handleGetOtp}>
            <FaRegMessage className="otp-icon" /> Get OTP
          </button>

          {/* Social login */}
          <div className="line-of-login-form">
            <span className="straightline-of-signup-form"></span>
            <p className="para-of-continue-signup-form">Other sign up option</p>
            <span className="straightline-of-signup-form"></span>
          </div>

          <div className="social-login-container">
            <button type="button" className="btn-of-login-form" onClick={() => handleSocialLogin("google")}>
              <FcGoogle size={24} />
            </button>
            <button type="button" className="btn-of-login-form" onClick={() => handleSocialLogin("facebook")}>
              <SiFacebook size={24} />
            </button>
            <button type="button" className="btn-of-login-form bg-black text-white hover:bg-gray-800" onClick={() => handleSocialLogin("apple")}>
              <FaApple size={24} />
            </button>
          </div>

          {/* Link to login */}
          <div className="log-in-form">
            <p className='para-of-sign-up-form'>
              Already have an account? <Link to="/" className="sign-up-of-login-form">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
