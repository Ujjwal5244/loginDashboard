import React from "react";
import logo1 from '../../assets/iso.svg'
import logo2 from '../../assets/asoc.webp'

const Nifipaymentpage1 = () => {
  return (
    // IMPROVEMENT: More vibrant gradient and increased vertical padding for better spacing.
    <section className="bg-gradient-to-br from-blue-100 via-gray-100 to-orange-100 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left side content */}
        <div className="space-y-8 order-2 lg:order-1 flex flex-col justify-center">
          <div className="space-y-6 p-2">
            <h1 className="text-3xl xs:text-[18px] md:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
              With NifiPayment, Indian businesses can remove the paper from their
              <span className="text-orange-500"> paperwork</span>
            </h1>
            <p className="sm:text-[12px] md:text-xl text-gray-600 max-w-xl">
              Transform your document processes with our secure, efficient digital solutions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-orange-500/30">
              Book Custom Demo
            </button>
            <button className="bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              View Platform Overview
            </button>
          </div>
        </div>
        {/* End of left side content */}

        {/* Right side content */}
        <div className="bg-white/60 backdrop-blur-xl p-8 pt-8 lg:p-12 rounded-3xl shadow-xl shadow-blue-200/50 order-1 lg:order-2">
          {/* part-1 */}
          <div className="space-y-6">
            <p className=" sm:text-[12px] md:text-xl text-gray-800 leading-relaxed">
              <span className="font-bold text-black">Paperwork costs</span> your business time, money and productivity.
            </p>
            <p className="sm:text-[12px] md:text-xl text-gray-800 leading-relaxed font-bold">
              It's time to change this.
            </p>
            <p className="sm:text-[12px] md:text-xl text-gray-700 leading-relaxed">
              NifiPayment allows your business to quickly deploy electronic
              signing, stamping, fraud-proofing and automation across all your
              paperwork processes in a fast, easy and compliant way.
            </p>
          </div>
          
          {/* part-2 */}
          <div className="mt-10 pt-8 border-t border-gray-300/70 flex flex-row items-center justify-center sm:justify-start gap-1">
            <div className="flex items-center gap-3">
              <img src={logo1} alt="ISO 27001 Certified" className="md:h-12 sm:h-6 w-auto" />
              <span className="md:text-sm xs:text-[12px] font-medium text-gray-700">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={logo2} alt="SOC 2 Compliant" className="md:h-12 xs:h-8 w-auto" />
              <span className="md:text-sm xs:text-[12px] font-medium text-gray-700">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nifipaymentpage1;