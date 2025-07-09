import React, { useState, useEffect } from "react";
import neralog from "../assets/nerasoft-logo.jpg";
import loginimg1 from "../assets/kyc-img1.jpg";
import loginimg2 from "../assets/kyc-img2.jpg";
import loginimg3 from "../assets/kyc-img3.jpg";
import loginimg4 from "../assets/kyc-img4.webp";
import { FaApple, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl, decryptText, encryptText } from "../encryptDecrypt";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Spinner = () => (
  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
);

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const navigate = useNavigate();

  const slides = [
    {
      image: loginimg1,
      title: "Secure Payments",
      description: "Bank-level encryption keeps your transactions safe",
      color: "rgba(74, 107, 255, 0.85)",
      buttonColor: "#4a6bff", // Solid version of the color
    },
    {
      image: loginimg2,
      title: "Instant Transfers",
      description: "Send money anywhere in seconds, not days",
      color: "rgba(108, 92, 231, 0.85)",
      buttonColor: "#6c5ce7",
    },
    {
      image: loginimg3,
      title: "Smart Analytics",
      description: "Track spending with beautiful visual reports",
      color: "rgba(0, 184, 148, 0.85)",
      buttonColor: "#00b894",
    },
    {
      image: loginimg4,
      title: "Global Access",
      description: "Manage your money from anywhere in the world",
      color: "rgba(253, 121, 168, 0.85)",
      buttonColor: "#fd79a8",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
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

  const handleGetOtp = async () => {
    if (!name || !email || !mobile) {
      toast.warn("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.warn("Please enter a valid email address");
      return;
    }
    const payloadData = { mobile, email, name };
    const encrypt = await encryptText(payloadData);
    try {
      setLoading(true);
      await axios.post(`${baseUrl}/api/user/signup`, { body: encrypt });
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
      toast.warn("Please enter the OTP");
      return;
    }
    const payloadData = { otp, email };
    const encrypt = await encryptText(payloadData);
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/user/signup`, {
        body: encrypt,
      });
      if (response.data.status === "success") {
        toast.success("OTP verified successfully!");
        const decrypt = await decryptText(response.data.body);
        const parsedData = JSON.parse(decrypt);
        localStorage.setItem("userToken", parsedData.token);
        navigate("/Maindashboard");
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(
        error.response?.data?.message || "Invalid OTP or an error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    toast.info(`${platform} login coming soon`);
  };

  // On mobile, currentSlide will be 0, so it will use the first slide's color as a default.
  const activeColor = isMobile ? "#4f46e5" : slides[currentSlide].buttonColor;

  return (
    <div className="flex min-h-screen w-full bg-gray-50 font-sans relative">
      {/* Mobile Logo - Only shown on mobile and positioned outside the form */}
      {isMobile && (
        <div className="absolute left-2 top-2 z-20">
          <motion.a
            href="https://nerasoft.in/"
            className="flex items-center gap-1 text-gray-800 no-underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={neralog}
              alt="nera-logo"
              className="h-6 w-6 rounded-full object-cover"
            />
            <p className="text-[20px] font-bold tracking-tight">NifiPayment</p>
          </motion.a>
        </div>
      )}

      {/* Carousel Section - Hidden on mobile */}
      {!isMobile && (
        <div className="relative hidden w-[60%] lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div
              className="absolute inset-0 z-10 transition-colors duration-500"
              style={{ backgroundColor: slides[currentSlide].color }}
            ></div>
          </div>

          {/* Logo positioned in top corner */}
          <div className="absolute left-4 top-4 z-20">
            <motion.a
              href="https://nerasoft.in/"
              className="flex items-center gap-1 text-white no-underline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={neralog}
                alt="nera-logo"
                className="h-6 w-6 rounded-full object-cover"
              />
              <p className="text-[20px] font-bold tracking-tight">
                NifiPayment
              </p>
            </motion.a>
          </div>

          <div className="relative z-20 flex h-full flex-col justify-center">
            <div className="text-center text-white">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-lg"
              >
                <h3 className="mb-4 text-4xl font-bold leading-tight">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-xl opacity-90">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-8">
              <button
                onClick={prevSlide}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                aria-label="Previous slide"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <div className="flex gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "scale-125 bg-white"
                        : "bg-white/40"
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                aria-label="Next slide"
              >
                <FaArrowRight className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="flex w-full items-center justify-center p-3 mt-12 lg:w-[40%] lg:p-12 lg:mt-0">
        <motion.div
          className="w-full max-w-md rounded-2xl bg-white pt-1 pr-3 pb-2.5 pl-3 shadow-xl lg:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-8 text-center relative">
            <motion.h2
              className="mb-2 text-2xl font-bold md:text-2xl"
              style={{
                color: activeColor,
                transition: "color 0.5s ease-in-out",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Create Account
            </motion.h2>

            <div className="relative h-1 flex justify-center">
              <motion.div
                className="h-full bg-gray-300 origin-right absolute"
                initial={{ scaleX: 0, width: "50%" }}
                animate={{
                  scaleX: 1,
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="h-full bg-gray-300 origin-left absolute"
                initial={{ scaleX: 0, width: "50%" }}
                animate={{
                  scaleX: 1,
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            {!showOtpInput ? (
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label
                    htmlFor="name"
                    className="mb-2 md:ml-0 xs:ml-1 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label
                    htmlFor="email"
                    className="mb-2 md:ml-0 xs:ml-1 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label
                    htmlFor="mobile"
                    className="mb-2 md:ml-0 xs:ml-1 block text-sm font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    disabled={loading}
                    maxLength="10"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition disabled:cursor-not-allowed"
                    onClick={handleGetOtp}
                    disabled={loading}
                    style={{
                      backgroundColor: activeColor,
                      transition: "background-color 0.5s ease-in-out",
                      opacity: loading ? 0.7 : 1,
                    }}
                    whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <FaMessage className="text-lg" /> Get OTP
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Verify Your Account
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      We've sent a 6-digit code to {email}
                    </p>
                  </div>

                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.5em] transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </motion.div>

                <motion.button
                  className="flex w-full items-center justify-center rounded-xl py-3.5 font-semibold text-white transition disabled:cursor-not-allowed"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  style={{
                    backgroundColor: activeColor,
                    transition: "background-color 0.5s ease-in-out",
                    opacity: loading ? 0.7 : 1,
                  }}
                  whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? <Spinner /> : "Verify & Create Account"}
                </motion.button>

                <motion.div
                  className="text-center text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Didn't receive code?{" "}
                  <button
                    className="font-medium hover:underline"
                    onClick={handleGetOtp}
                    style={{
                      color: activeColor,
                      transition: "color 0.5s ease-in-out",
                    }}
                  >
                    Resend
                  </button>
                </motion.div>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 flex-shrink text-sm text-gray-500">
                Or sign up with
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <motion.button
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                onClick={() => handleSocialLogin("Google")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FcGoogle size={18} />
                <span className="hidden sm:inline">Google</span>
              </motion.button>
              <motion.button
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                onClick={() => handleSocialLogin("Facebook")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <SiFacebook size={18} color="#1877F2" />
                <span className="hidden sm:inline">Facebook</span>
              </motion.button>
              <motion.button
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-900 bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                onClick={() => handleSocialLogin("Apple")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaApple size={18} />
                <span className="hidden sm:inline">Apple</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 text-center text-sm p-2 border rounded-lg bg-gray-200 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="mb-2">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-medium hover:underline"
                style={{
                  color: activeColor,
                  transition: "color 0.5s ease-in-out",
                }}
              >
                Log in
              </Link>
            </p>
            <hr
              style={{ height: "1px", border: "none", backgroundColor: "#ccc" }}
            />
            <p className="mt-1">
              <Link
                to="/organization-login"
                className="hover:underline"
                style={{
                  color: activeColor,
                  transition: "color 0.5s ease-in-out",
                }}
              >
                Log in with your organization
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;