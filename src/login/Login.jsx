import React, { useState } from "react";
import "./Login.css";
import neralog from "../assets/nerasoft-logo.jpg";
import loginimg3 from "../assets/login-left-img3.jpg";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { Link } from "react-router-dom";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import { baseUrl, decryptText, encryptText } from "../encryptDecrypt";
import { toast } from "react-toastify";


const Login = () => {
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [Loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Function to handle social login redirects
  const handleSocialLogin = (provider) => {
    if (provider === "google") {
      window.location.href = "https://yourdomain.com/auth/google";
    } else if (provider === "apple") {
      window.location.href = "https://yourdomain.com/auth/apple";
    }
  };

  // Function to handle Get OTP button click
  const handleGetOtp = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }
    const payloadData = {
      email: email,
    };
    const encrypt = await encryptText(payloadData);
    ("");

    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        body: encrypt,
      });
      console.log(response)
      toast.success("OTP sent successfully!");
      setShowOtpInput(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }
  
    const payloadData = {
      email: email,
      otp: otp,
    };
    const encrypt = await encryptText(payloadData);
  
    setLoading(true);
    setMessage("");
  

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        body: encrypt,
      });

      console.log(response)
      if (response) {
        toast.success("OTP verified successfully");
        const decrypt = await decryptText(response.data.body);
        const parsedData = JSON.parse(decrypt);
        
        localStorage.setItem("userToken", parsedData.token);
        navigate("/Maindashboard");
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-login flex flex-col md:flex-row h-screen">
      {/* --------- Left side of login --------- */}
      <div className="left-side signup-left-side w-full md:w-1/2 h-1/2 md:h-full relative">
        <a
          href="https://nerasoft.in/"
          className="nera-login-logo-container"
          style={{ textDecoration: "none" }}
        >
          <img src={neralog} alt="nera-logo" />
          <p className="nera-logo-para">NifiPayment</p>
        </a>

        <div className="left-img-1">
          <img src={loginimg3} alt="Slide 1" />
        </div>
      </div>

      {/* --------- Right side of login --------- */}
      <div className="right-side w-full md:w-1/2 flex items-center justify-center bg-transparent h-1/2 md:h-full">
        <div className="login-form-container">
          <div className="h2-of-login-form">
            <h2>Log in to continue your NifiPayment journey</h2>
          </div>

          {/* --------- form-container --------- */}
          <div className="form-container">
            <input
              type="text"
              placeholder="Email"
              className="input-of-login-form"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={showOtpInput}
            />

            {showOtpInput ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="input-of-login-form"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-of-get-otp-login-form"
                  onClick={handleVerifyOtp}
                  disabled={Loading}
                >
                  {Loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-of-get-otp-login-form"
                onClick={handleGetOtp}
                disabled={Loading}
              >
                {Loading ? "Sending..." : "Get OTP"}
              </button>
            )}

            {message && <p className="message">{message}</p>}
          </div>
          {/* ---------End form-container --------- */}

          <div className="line-of-login-form">
            <span className="straightline-of-login-form"></span>
            <p className="para-of-continue-login-form">Or continue with</p>
            <span className="straightline-of-login-form"></span>
          </div>

          {/* --------- social-login-container --------- */}
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
              className="btn-of-login-form flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 transition-colors"
              onClick={() => handleSocialLogin("apple")}
            >
              <FaApple size={24} />
            </button>
          </div>

          <div className="sign-up-form">
            <p className="para-of-login-form">
              Don't have an account?{" "}
              <Link to="/signup" className="sign-up-of-login-form">
                Sign up
              </Link>
            </p>
            <p className="para-of-2nd-signup-form">
              Log in with your organization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
