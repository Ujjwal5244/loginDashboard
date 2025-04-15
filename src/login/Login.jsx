import React from "react";
import "./Login.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import neralog from "../assets/nerasoft-logo.jpg";
import loginimg3 from "../assets/login-left-img3.jpg";
import { FaApple } from "react-icons/fa"; // Using react-icons library
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { Link } from "react-router-dom";

const Login = () => {
  // Function to handle social login redirects
  const handleSocialLogin = (provider) => {
    if (provider === "google") {
      window.location.href = "https://yourdomain.com/auth/google"; // Replace with your Google auth endpoint
    } else if (provider === "apple") {
      window.location.href = "https://yourdomain.com/auth/apple"; // Replace with your Apple auth endpoint
    }
  };

  return (
    <div className="main-login flex flex-col md:flex-row h-screen">
      {/* --------- Left side of login --------- */}
      <div className="left-side  w-full md:w-1/2 bg-white h-1/2 md:h-full relative">
        <a
          href="https://nerasoft.in/"
          className="nera-login-logo-container"
          style={{ textDecoration: "none" }}
        >
          <img src={neralog} alt="nera-logo" />
          <p className="nera-logo-para">NeraSoft</p>
        </a>
        {/* <Carousel
  showArrows={true}
  autoPlay={true}
  infiniteLoop={true}
  showThumbs={false}
  showStatus={false}
  className='login-carousel'
> */}
          {/* All slides now have consistent sizing */}
  {/* <div className="left-img-1">
    <img
    src={loginimg1}
    alt="Slide 1"
    className="w-full h-full object-contain"
  />
  </div>

  <div className="h-[50vh] md:h-[100vh] w-full relative">
    <img
      src={loginimg2}
      alt="Slide 2"
      className="object-cover w-full h-full"
    />
  </div>

  <div className="h-[50vh] md:h-[100vh] w-full relative">
    <img
      src={loginimg3}
      alt="Slide 3"
      className="object-cover w-full h-full"
    />
            </div> 
 </Carousel> */}
        {/* end of crausel */}
        <div className="left-img-1">
    <img
    src={loginimg3}
    alt="Slide 1"
    className="w-full h-full object-contain"
          />
        </div>
        
      </div>

      {/* --------- Right side of login --------- */}
      <div className="right-side w-full md:w-1/2 flex items-center justify-center bg-transparent md:bg-white h-1/2 md:h-full">
        <div className="login-form-container">
          <div className="h2-of-login-form ">
            <h2>Log in to continue your
            </h2>
            <p className='para-of-h2-of-login-form'>
              <span className='login-nifipayment'>NifiPayment</span> journey
              </p>
            </div>
          {/* <p className="para-of-login-form">
            Don't have an account?{" "}
            <Link to="/signup" className="sign-up-of-login-form">
              Sign up
            </Link>
          </p> */}
          {/* --------- form-container --------- */}
          <div className="form-container">
            {/* <p className="para-email-of-login-form">Email</p> */}
            <input
              type="text"
              placeholder="Email"
              className="input-of-login-form"
            />
            <button type="submit" className="btn-of-get-otp-login-form">
              Get OTP
            </button>
          </div>
          {/* ---------End form-container --------- */}
          <div className="line-of-login-form">
            <span className="straightline-of-login-form"></span>
            <p className="para-of-continue-login-form">Or continue with</p>
            <span className="straightline-of-login-form"></span>
          </div>
          {/* --------- social-login-container --------- */}
          <div className="social-login-container">
            {/* Google Login Button */}
            <button
              type="button"
              className="btn-of-login-form"
              onClick={() => handleSocialLogin("google")}
            >
              <FcGoogle size={24} />
            </button>
            
            {/* facebook Login Button */}
            <button
              type="button"
              className="btn-of-login-form"
              onClick={() => handleSocialLogin("facebook")}
            >
              <SiFacebook  size={24} />
            </button>

            {/* Apple Login Button */}
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
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
