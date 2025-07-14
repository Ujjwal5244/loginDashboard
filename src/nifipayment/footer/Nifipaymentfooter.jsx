import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCreditCard, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const Nifipaymentfooter = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        {/* The main grid now has its columns adjusted to handle the new grouped links section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info - spans full width on medium screens for better balance */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold flex items-center">
              <span className="bg-white text-blue-900 px-2 py-1 rounded mr-2">NIFI</span>
              <span>Payment</span>
            </h3>
            <p className="text-gray-300 md:text-start xs:text-center">
              Secure and fast payment solutions for the modern world. Making transactions easier since 2020.
            </p>
            <div className="flex space-x-4 items-center justify-center md:justify-start">
              <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* --- CHANGE START --- */}
          {/* This new wrapper groups "Quick Links" and "Services". */}
          {/* On large screens, it spans 2 columns. On medium, it spans the full 2-column width. */}
          {/* Most importantly, the inner grid forces its children into 2 columns even on mobile. */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-2 gap-8">
              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Services</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Services</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Aadhaar Verification</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">PAN Verification</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Virtual KYC</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">DL Verification</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Passport Verification</a></li>
                </ul>
              </div>
            </div>
          </div>
          {/* --- CHANGE END --- */}


          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 mt-1 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">123 Payment Street, Financial District, NY 10001</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">support@nifipayment.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Bar - This section was already well-designed for responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center">
            <FaCreditCard className="text-blue-400 mr-3 flex-shrink-0" size={24} />
            <div>
              <h5 className="font-semibold">Multiple Payment Options</h5>
              <p className="text-sm text-gray-300">Credit Cards, Bank Transfer, Crypto</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center">
            <FaShieldAlt className="text-green-400 mr-3 flex-shrink-0" size={24} />
            <div>
              <h5 className="font-semibold">Secure Transactions</h5>
              <p className="text-sm text-gray-300">256-bit SSL Encryption</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center">
            <FaHeadset className="text-purple-400 mr-3 flex-shrink-0" size={24} />
            <div>
              <h5 className="font-semibold">24/7 Support</h5>
              <p className="text-sm text-gray-300">Dedicated Customer Service</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          {/* Centered on mobile, left-aligned on medium and up */}
          <p className="text-gray-400 text-sm mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} NifiPayment. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Nifipaymentfooter;