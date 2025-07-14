import React from "react";
import onlinesign from "../../assets/onlinedigital.jpg";
import nifipaymentdigital from "../../assets/nifipaymentdigital.jpg";
import nifipaymentbank from "../../assets/nifipaymentbank.jpg";

const Nifipaymentpage2 = () => {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 lg:py-10 font-sans"> 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free eSign box */}
        <div className="bg-gradient-to-b from-purple-200 to-pink-100 rounded-xl p-6">
          <button className="bg-white text-black text-sm font-medium px-3 py-1 rounded shadow">
            Try a free eSign
          </button>
          <div className="mt-6">
            <div className="p-4 rounded">
              <img
                src={onlinesign}
                alt="eSign"
                className="md:h-[240px] md:w-[370px] xs:h-[150px] rounded-lg"
              />
              <p className="text-xs text-center text-gray-600 mt-2">
                Authenticated through Nifpayment.com(78xxxx967)
                <br />
                Date: Fri Dec 06 13:18:54 IST 2024
              </p>
            </div>
          </div>
        </div>

        {/* ROI Data box */}
        <div className="bg-green-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">ROI Data</h3>
          <div className="p-2 rounded">
            <img
              src={nifipaymentdigital}
              alt="eSign"
              className="md:h-[240px] md:w-[370px] xs:h-[150px] mt-4 rounded-lg"
            />
            <p className="text-sm text-gray-800 mt-2 text-center">
              For every ₹1 invested with Nifipayment,
              <br />
              they got a return of ₹6
            </p>
          </div>
        </div>

        {/* Federal bank story */}
        <div className="bg-[#00498f] rounded-xl p-4 text-white flex flex-col items-center">
          <div className="bg-gray-200 text-gray-900 px-3 py-1 rounded text-sm font-medium mb-3">
            NifiPayment bank Implementation story
          </div>
          <img
            src={nifipaymentbank}
            alt="Federal Bank Story"
            className="md:h-[240px] md:w-[370px] xs:h-[150px] rounded-lg mt-7"
          />
           <p className="text-sm text-gray-800 mt-2 text-center">
              For every ₹1 invested with Nifipayment,
              <br />
              they got a return of ₹6
            </p>
        </div>
      </div>

      <p className="text-center text-gray-800 text-xl font-medium mt-10">
        2000+ Indian businesses – from high-growth unicorns to the largest banks
        – use Leegaly to go paperless
      </p>
    </div>
  );
};

export default Nifipaymentpage2;
