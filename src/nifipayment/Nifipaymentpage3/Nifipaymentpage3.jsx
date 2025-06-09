import React from 'react';
import TCHFL_logo from '../../assets/TCHFL_Logo.webp';
import TimesInternet_logo from '../../assets/times-internet-logo-new.avif';
import Aitel_logo from '../../assets/Airtel_Payments_Bank.png';
import Asian_logo from '../../assets/asian_paonts.svg';
import Asoc_logo from '../../assets/asoc.webp';
import Axisbank_logo from '../../assets/Axis_Finace_Logo.svg';
import Bob_logo from '../../assets/bob_logo.svg';
import Icici_logo from '../../assets/ICICI Bank_Logo.svg';

const Nifipaymentpage3 = () => {
  const logos = [
    { src: TCHFL_logo, alt: "TCHFL Logo" },
    { src: TimesInternet_logo, alt: "Times Internet Logo" },
    { src: Aitel_logo, alt: "Airtel Logo" },
    { src: Asian_logo, alt: "Asian Paints Logo" },
    { src: Asoc_logo, alt: "Asoc Logo" },
    { src: Axisbank_logo, alt: "Axis Bank Logo" },
    { src: Bob_logo, alt: "Bob Logo" },
    { src: Icici_logo, alt: "ICICI Logo" },
  ];

  // Duplicate the array to create a seamless loop
  const doubleLogos = [...logos, ...logos];

  return (
    <div className="pb-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Our Trusted Partners
        </h2>
        
        {/* Marquee Container with hover pause */}
        <div className="relative w-full overflow-hidden group">
          <div className="animate-marquee whitespace-nowrap flex items-center group-hover:animation-pause">
            {doubleLogos.map((logo, index) => (
              <div 
                key={`${logo.alt}-${index}`} 
                className="mx-8 flex-shrink-0 flex items-center justify-center"
                style={{ width: '160px' }}
              >
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-12 object-contain opacity-80 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Custom animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Nifipaymentpage3;