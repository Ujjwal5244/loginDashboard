import React, { useState, useEffect } from "react";
import "./Login.css";
import neralog from "../assets/nerasoft-logo.jpg";
import loginimg1 from "../assets/kyc-img1.jpg";
import loginimg2 from "../assets/kyc-img2.jpg";
import loginimg3 from "../assets/kyc-img3.jpg";
import loginimg4 from "../assets/kyc-img4.webp";
import { FaApple, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl, decryptText, encryptText } from "../encryptDecrypt";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence

const Spinner = () => <div className="spinner"></div>;

const Login = () => {
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  // Carousel data with better content
  const slides = [
    {
      image: loginimg1,
      title: "Secure Payments",
      description: "Bank-level encryption keeps your transactions safe.",
      color: "rgba(74, 107, 255, 0.9)",
    },
    {
      image: loginimg2,
      title: "Instant Transfers",
      description: "Send money anywhere in seconds, not days.",
      color: "rgba(108, 92, 231, 0.9)",
    },
    {
      image: loginimg3,
      title: "Smart Analytics",
      description: "Track spending with beautiful visual reports.",
      color: "rgba(0, 184, 148, 0.9)",
    },
    {
      image: loginimg4,
      title: "Global Access",
      description: "Manage your money from anywhere in the world.",
      color: "rgba(253, 121, 168, 0.9)",
    },
  ];

  // Device info
  const deviceInfo = {
    ip: "127.0.0.1",
    machine: navigator.userAgent,
    browser: navigator.userAgent,
    os: navigator.platform,
    latitude: null,
    longitude: null,
    city: null,
    country: null,
  };

  // Auto-rotate slides for desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Only auto-play on desktop
    if (!isMobile) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMobile, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleMobileLoginClick = () => {
    setShowLoginForm(true);
  };

  // Google Login Handler
  const responseGoogle = async (authResult) => {
    // ... (rest of your existing functions are perfect, no changes needed)
    setLoading(true);
    try {
      if (!authResult || !authResult.code) {
        toast.error("Google login failed: No authorization code received");
        return;
      }

      const requestData = { event: "login", ...deviceInfo };
      const encryptedData = await encryptText(requestData);
      const result = await axios.post(
        `${baseUrl}/api/user/google?code=${authResult.code}`,
        { body: encryptedData }
      );

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
    // ... (rest of your existing functions are perfect, no changes needed)
    if (!email) {
      toast.warn("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.warn("Please enter a valid email address");
      return;
    }
    const payloadData = { email: email };
    const encrypt = await encryptText(payloadData);
    try {
      setLoading(true);
      await axios.post(`${baseUrl}/api/user/login`, {
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
    // ... (rest of your existing functions are perfect, no changes needed)
    if (!otp) {
      toast.warn("Please enter the OTP");
      return;
    }
    const payloadData = { email: email, otp: otp };
    const encrypt = await encryptText(payloadData);
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        body: encrypt,
      });
      toast.success("OTP verified successfully");
      const decrypt = await decryptText(response.data.body);
      const parsedData = JSON.parse(decrypt);
      localStorage.setItem("userToken", parsedData.token);
      navigate("/Maindashboard");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Invalid OTP or an error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // NEW: Onboarding screen for mobile view
  if (isMobile && !showLoginForm) {
    return (
      <div className="mobile-onboarding-screen">
        <div className="mobile-onboarding-logo-container">
            <img
              src={neralog}
              alt="Nera Logo"
              className="mobile-onboarding-logo"
            />
            <p className="nifipayment-login-name">NifiPayment</p>
          </div>
        <div className="mobile-onboarding-slider">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="mobile-onboarding-slide"
            >
              <div className="mobile-slide-image-container">
                <motion.img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 120,
                  }}
                />
              </div>
              <div className="mobile-slide-text">
                <h3 className="login-mobile-slide-title">
                  {slides[currentSlide].title}
                </h3>
                <p className="login-mobile-slide-description">
                  {slides[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mobile-onboarding-controls">
          <div className="slider-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentSlide ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {currentSlide < slides.length - 1 ? (
            <motion.button
              className="onboarding-nav-button"
              onClick={nextSlide}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next <FaArrowRight />
            </motion.button>
          ) : (
            <motion.button
              className="onboarding-nav-button get-started"
              onClick={handleMobileLoginClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  // Existing code for Desktop and Mobile Login Form
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className={`login-container ${isMobile ? "mobile-view" : ""}`}>
        {!isMobile && (
          <div
            className="carousel-section"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="carousel-overlay"
              style={{ backgroundColor: slides[currentSlide].color }}
            ></div>
            <a href="https://nerasoft.in/" className="logo-link">
              <img src={neralog} alt="nera-logo" />
              <p className="login-name-nifipayment">NifiPayment</p>
            </a>
            <div className="carousel-content">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="slide-caption"
              >
                <h3 className="slide-caption-h3">
                  {slides[currentSlide].title}
                </h3>
                <p className="slide-caption-p">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
              <div className="carousel-controls">
                <button className="carousel-nav prev" onClick={prevSlide}>
                  <FaArrowLeft />
                </button>
                <button className="carousel-nav next" onClick={nextSlide}>
                  <FaArrowRight />
                </button>
                <div className="carousel-dots">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${
                        index === currentSlide ? "active" : ""
                      }`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

{isMobile && (
        <div className="mobile-login-header">
          <div className="mobile-login-logo-container">
            <img src={neralog} alt="Nera Logo" className="mobile-login-logo" />
            <p className="mobile-login-name">NifiPayment</p>
          </div>
        </div>
      )}
        <div className="form-section">
          <motion.div
            className="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: isMobile ? 0 : 0.3 }} // Add delay for smoother transition on mobile
          >
            <div className="form-header">
              {/* MODIFICATION 1: Added inline style to set text color dynamically */}
              <h2
                className="login-form-header-h2"
                style={{ color: slides[currentSlide].color }}
              >
                Welcome Back!
              </h2>
              {/* <p className="login-form-header-p">Log in to continue your NifiPayment journey</p> */}
            </div>
            <div className="form-fields">
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={showOtpInput || loading}
                />
              </div>
              {showOtpInput && (
                <div className="input-group">
                  <label htmlFor="otp">Verification Code</label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                  />
                </div>
              )}
              {/* MODIFICATION 2: Added inline style to set background color dynamically */}
              <motion.button
                className="submit-button"
                onClick={showOtpInput ? handleVerifyOtp : handleGetOtp}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ backgroundColor: slides[currentSlide].color }}
              >
                {loading ? (
                  <Spinner />
                ) : showOtpInput ? (
                  "Verify OTP"
                ) : (
                  "Get OTP"
                )}
              </motion.button>
            </div>
            <div className="social-login">
              <p className="divider">Or continue with</p>
              <div className="social-buttons">
                <motion.button
                  className="social-button google"
                  onClick={() => googleLogin()}
                  whileHover={{ y: -2 }}
                >
                  <FcGoogle size={20} />
                  <span>Google</span>
                </motion.button>
                <motion.button
                  className="social-button facebook"
                  onClick={() => toast.info("Facebook login coming soon")}
                  whileHover={{ y: -2 }}
                >
                  <SiFacebook size={20} color="#1877F2" />
                  <span>Facebook</span>
                </motion.button>
                <motion.button
                  className="social-button apple"
                  onClick={() => toast.info("Apple login coming soon")}
                  whileHover={{ y: -2 }}
                >
                  <FaApple size={20} />
                  <span>Apple</span>
                </motion.button>
              </div>
            </div>
            <div className="form-footer">
              <p className="login-signup-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
              <hr
                style={{
                  height: "1px",
                  border: "none",
                  backgroundColor: "#ccc",
                }}
              />
              <p className="org-login">Log in with your organization</p>
            </div>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;