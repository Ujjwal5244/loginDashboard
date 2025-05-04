import React, { useState } from "react";
import "./Signup.css";
import neralog from "../assets/nerasoft-logo.jpg";
import loginimg3 from "../assets/login-left-img3.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import axios from "axios";
import { baseUrl, decryptText, encryptText } from "../encryptDecrypt";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Function to call OTP API
  const handleGetOtp = async () => {
    if (!mobile) {
      toast.error("Please enter your mobile number.");
      return;
    }
    const payloadData = {
      mobile: mobile,
      email: email,
      name: name,
    };
    const encrypt = await encryptText(payloadData);

    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/api/user/signup`, {
        body: encrypt,
      });
      console.log(response, 'ujj')
      toast.success("OTP sent successfully!");
      setShowOtpInput(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    const payloadData = {
      otp: otp,
      email: email,
    };

    try {
      setLoading(true);
      const encrypt = await encryptText(payloadData);
      const response = await axios.post(`${baseUrl}/api/user/signup`, {
        body: encrypt,
      });
      console.log(response);
      if (response.data.status==="success") {
      toast.success("OTP verified successfully!");
      try{
        const decrypt = await decryptText(response.data.body);
        console.log(decrypt, "decrypt");
        const parsedData = JSON.parse(decrypt);
        localStorage.setItem("userToken", parsedData.token);
        navigate("/Maindashboard");
      }catch(e){
        console.log(e);
      }
      // localStorage.setItem("userToken", response.data.body);
      // navigate("/Maindashboard");

      // Redirect user or perform next steps after successful verification
      } else {
      toast.error(response.data.message || "invalid otp");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    alert(`Login with ${platform} clicked`);
  };

  return (
    <div className="signup-main-container">
      {/* Left side */}
      <div className="left-side w-full md:w-1/2 bg-white h-1/2 md:h-full relative">
        <a
          href="https://nerasoft.in/"
          className="nera-login-logo-container"
          style={{ textDecoration: "none" }}
        >
          <img src={neralog} alt="nera-logo" />
          <p className="nera-logo-para">NifiPayment</p>
        </a>
        <div className="sign-up-left-img-1">
          <img src={loginimg3} alt="Slide 1" />
        </div>
      </div>

      {/* Right side */}
      <div className="right-side-signup">
        <div className="signup-form-container">
          <h1 className="signup-title">Create Account</h1>

          {!showOtpInput && (
            <div>
              <div className="signup-input-group">
                <label className="signup-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="enter your name..."
                />
              </div>

              {/* Email */}
              <div className="signup-input-group">
                <label className="signup-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="enter your email..."
                />
              </div>

              {/* Mobile */}
              <div className="signup-input-group">
                <label className="signup-label">Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="input"
                  placeholder="enter your mobile number..."
                />
              </div>

              {/* Get OTP Button */}
              <button
                className="otp-button"
                onClick={handleGetOtp}
                disabled={loading}
              >
                <FaRegMessage className="otp-icon" />
                {loading ? "Sending..." : "Get OTP"}
              </button>
            </div>
          )}

          {/* Conditionally render OTP input */}
          {showOtpInput && (
            <div className="signup-input-group">
              <label className="signup-label">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input"
                placeholder="enter your otp"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="verify-otp-button"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          {/* Social login */}
          <div className="line-of-login-form">
            <span className="straightline-of-signup-form"></span>
            <p className="para-of-continue-signup-form">Other sign up option</p>
            <span className="straightline-of-signup-form"></span>
          </div>

          <div className="social-login-container">
            <button
              type="button"
              className="btn-of-login-form"
              onClick={() => handleSocialLogin("google")}
            >
              <FcGoogle size={24} />
            </button>
            <button
              type="button"
              className="btn-of-login-form"
              onClick={() => handleSocialLogin("facebook")}
            >
              <SiFacebook size={24} />
            </button>
            <button
              type="button"
              className="btn-of-login-form bg-black text-white hover:bg-gray-800"
              onClick={() => handleSocialLogin("apple")}
            >
              <FaApple size={24} />
            </button>
          </div>

          {/* Link to login */}
          <div className="log-in-form">
            <p className="para-of-sign-up-form">
              Already have an account?{" "}
              <Link to="/" className="sign-up-of-login-form">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
