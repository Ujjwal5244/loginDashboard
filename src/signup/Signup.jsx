import React from 'react'
import './Signup.css'
import neralog from "../assets/nerasoft-logo.jpg";
import loginimg3 from "../assets/login-left-img3.jpg";
import { Link } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { FaApple } from "react-icons/fa"; // Using react-icons library


const Signup = () => {
  return (
    <div className='signup-main-container'>
      {/* --------- Left side of login --------- */}
            <div className="left-side w-full md:w-1/2 bg-white h-1/2 md:h-full relative">
              <a
                href="https://nerasoft.in/"
                className="nera-login-logo-container"
                style={{ textDecoration: "none" }}
              >
                <img src={neralog} alt="nera-logo" />
                <p className="nera-logo-para">NifiPayment</p>
              </a>
              
              {/* end of crausel */}
              <div className="sign-up-left-img-1">
          <img
          src={loginimg3}
          alt="Slide 1"
          // className="w-full h-full object-contain"
                />
              </div>
              
            </div>
            {/* --------- right side of login --------- */}

      <div className='right-side-signup'>
        <div className='signup-form-container'>
          <h1 className='title'>Create Account</h1>     
          <div className='input-group'>
            <label className='label'>Full Name</label>
            <input 
              type="text" 
              className='input' 
              placeholder="enter your name..." 
            />
          </div>          
          <div className='input-group'>
            <label className='label'>Email</label>
            <input 
              type="email" 
              className='input' 
              placeholder="enter your email..." 
            />
          </div>          
          <div className='input-group'>
            <label className='label'>Mobile Number</label>
            <input 
              type="tel" 
              className='input' 
              placeholder="enter your mobile number..." 
            />
          </div>          
         <button className='otp-button'>
           <FaRegMessage className="otp-icon" /> Get OTP 
         </button>          
          <div className="line-of-login-form">
            <span className="straightline-of-signup-form"></span>
            <p className="para-of-continue-signup-form">Other sign up option</p>
            <span className="straightline-of-signup-form"></span>
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
          
           <div className="log-in-form">
            <p className='para-of-sign-up-form'>
            Already have an account? 
           <Link to="/" className="sign-up-of-login-form">
              Log in
            </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Signup