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
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Device info (you might want to get this dynamically)
  const deviceInfo = {
    ip: "127.0.0.1", // Replace with actual IP detection
    machine: navigator.userAgent,
    browser: navigator.userAgent,
    os: navigator.platform,
    latitude: null,
    longitude: null,
    city: null,
    country: null
  };

  // Google Login Handler
  const responseGoogle = async (authResult) => {
    setLoading(true);
    try {
      if (!authResult || !authResult.code) {
        toast.error("Google login failed: No authorization code received");
        return;
      }
      
      const requestData = {
        event: "login",
        ...deviceInfo
      };

      const encryptedData = await encryptText(requestData);
      const result = await axios.post(`${baseUrl}/api/user/google?code=${authResult.code}`, {
        body: encryptedData
      });

      if (result.data.success) {
        localStorage.setItem("userToken", result.data.token);
        toast.success("Google login successful!");
        navigate("/Maindashboard");
      } else {
        toast.error(result.data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Error while requesting Google code:", err);
      toast.error("Error during Google login");
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    console.error("Google login error:", error);
    setLoading(false);
    toast.error("Google login failed");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: handleError,
    flow: "auth-code",
  });

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

    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        body: encrypt,
      });
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
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        body: encrypt,
      });

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
    <GoogleOAuthProvider clientId='587797030071-kt1lgl2gs8b712ar1ju8otgsroa3dltp.apps.googleusercontent.com'>
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
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-of-get-otp-login-form"
                  onClick={handleGetOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Get OTP"}
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
                onClick={() => googleLogin()}
                disabled={loading}
              >
                <FcGoogle size={24} />
              </button>

              <button
                type="button"
                className="btn-of-login-form"
                onClick={() => toast.info("Facebook login coming soon")}
                disabled={loading}
              >
                <SiFacebook size={24} />
              </button>

              <button
                type="button"
                className="btn-of-login-form flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 transition-colors"
                onClick={() => toast.info("Apple login coming soon")}
                disabled={loading}
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
    </GoogleOAuthProvider>
  );
};

export default Login;