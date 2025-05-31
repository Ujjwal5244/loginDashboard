import React, { useState } from 'react';
import { vahanForms } from './Vahanform';

const CorporateVerification = ({ darkMode }) => {
  const [selectedService, setSelectedService] = useState('');

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  return (
    <section className={`max-w-6xl md:flex-col mx-auto xs:px-1 px-4 md:flex-cols ${darkMode ? 'dark' : ''}`}>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Service Selection */}
        <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="xs:p-2  space-y-6">
            <div className="space-y-4">
              <select
                onChange={handleServiceChange}
                className={`border-2 rounded-lg px-4 py-3 w-full focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-700 text-white focus:ring-gray-500' 
                    : 'border-gray-200 focus:ring-gray-200 text-gray-700'
                }`}
                defaultValue=""
              >
                <option value="" disabled className={darkMode ? 'text-gray-400' : 'text-gray-400'}>
                  -- Select a service --
                </option>
                {Object.keys(vahanForms).map((key) => (
                  <option key={key} value={key} className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                    {vahanForms[key].title}
                  </option>
                ))}
              </select>
            </div>

            {/* Benefits Section */}
            <div className={`flex rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-purple-50 border-purple-100'
            } xs:p-3 md:p-6`}>
              <div className="space-x-4">
                <div className="flex flex-row xs:w-[240px] md:w-[400px] xs:justify-center xs:text-center xs:items-center md:justify-start gap-3">
                  <div className={`rounded-full flex-shrink-0 xs:p-1 md:p-2 ${
                    darkMode ? 'bg-gray-600' : 'bg-purple-100'
                  }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="xs:h-4 xs:w-4 md:h-6 md:w-6 text-[#3470b2]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className={`xs:text-[15px] md:text-xl font-bold ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      Why vahan Verification?
                    </h2>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    'Instant verification results',
                    '256-bit encryption security',
                    '24/7 customer support',
                    'Government-compliant processes',
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#3470b2]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Dynamic Forms */}
        <div className="space-y-6">
          {vahanForms[selectedService] && (
            <div className={`rounded-xl border border-gray-400 overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-6 flex items-center ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  <span className={`p-2 rounded-full mr-3 ${
                    darkMode ? 'bg-gray-700 text-[#3470b2]' : 'bg-purple-100 text-[#3470b2]'
                  }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1z" />
                      <path
                        fillRule="evenodd"
                        d="M10 6a4 4 0 100 8 4 4 0 000-8zm0 10a8 8 0 100-16 8 8 0 000 16z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {vahanForms[selectedService].title}
                </h3>

                <div className="space-y-4">
                  {vahanForms[selectedService].fields.map((field, index) => (
                    <div key={index}>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' 
                            : 'border-gray-300 focus:ring-gray-400'
                        }`}>
                          <option value="">Select your option</option>
                          {field.options.map((opt, idx) => (
                            <option key={idx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' 
                              : 'border-gray-300 focus:ring-gray-400'
                          }`}
                          placeholder={field.placeholder || ''}
                        />
                      )}
                    </div>
                  ))}
                  <button className="w-full bg-[#3470b2] text-white font-medium py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.01]">
                    {vahanForms[selectedService].buttonText}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CorporateVerification;