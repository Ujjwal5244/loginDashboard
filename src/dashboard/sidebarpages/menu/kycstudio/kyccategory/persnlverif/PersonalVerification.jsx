import React, { useState, useEffect } from "react";
import { serviceForms } from "./PersonalVerif";
import {
  baseUrl,
  decryptText,
} from "../../../../../../encryptDecrypt";
import { toast } from "react-toastify";
import axios from "axios";
import DynamicForm from "./DynamicForm";

export default function PersonalVerification({ darkMode,id }) {
  const [selectedService, setSelectedService] = useState("");

  const [selectedServiceKey, setSelectedServiceKey] = useState(""); // Renamed for clarity
  // const [initialServiceData, setInitialServiceData] = useState(null); // If getService loads config

  const handleServiceChange = (e) => {
    setSelectedServiceKey(e.target.value);
  };

  // This function seems to fetch some data related to 'id'.
  // If this data is supposed to BE the serviceForms configuration or modify it,
  // you'll need to adjust how serviceForms is sourced.
  // For now, I'm assuming 'serviceForms' imported above is the source of truth for form structure.
  const getServiceDataById = async () => {
    if (!id) return; // Don't run if id is not available
    try {
      const response = await axios(`${baseUrl}/api/services/getjson/${id}`);
      if (response.data && response.data.body) {
        const dec = await decryptText(response.data.body);
        const data = JSON.parse(dec);
        console.log("Fetched service data by ID:", data);
        // setInitialServiceData(data); // Store it if needed for other purposes
        // If 'data' IS the form configuration, you'd do something like:
        // setFetchedServiceForms(data); // And then use this state instead of the imported 'serviceForms'
      } else {
        console.warn("No data body in response from getjson");
      }
    } catch (error) {
      console.error("Error fetching service data by ID:", error);
      // toast.error("Failed to load initial service configuration.");
    }
  };

  useEffect(() => {
    getServiceDataById();
  }, [id]); // Rerun if id changes

  const handleVerificationSubmit = async (formTitle, formData, backendResponse) => {
    // This function is called by DynamicForm upon successful submission
    console.log("Verification Submitted from DynamicForm in PersonalVerification:", {
      formTitle,
      formData,
      backendResponse,
    });
    toast.success(
      `${formTitle} verification: ${backendResponse.message || "Processed successfully!"}`
    );
    // You can add further logic here, e.g., update UI, redirect, etc.

    // IMPORTANT: Encryption
    // The DynamicForm currently sends plain JSON. If your backend endpoint (defined in
    // serviceForms[selectedServiceKey].apiEndpoint) expects encrypted data,
    // you have a few options:
    // 1. Modify DynamicForm's handleSubmit to use `encryptText` before `fetch`.
    //    This would mean passing `encryptText` (or a wrapper) as a prop to DynamicForm.
    // 2. If the `id` is needed as part of the payload for every verification,
    //    DynamicForm's handleSubmit could be modified to accept and merge additional static data.
    // 3. The backend handles encryption/decryption internally based on the endpoint hit.
  };

  const currentFormConfig = selectedServiceKey ? serviceForms[selectedServiceKey] : null;

  return (
    <section className={`max-w-6xl md:flex-col mx-auto xs:px-1 px-4 md:flex-cols ${darkMode ? "" : ""}`}>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Service Selection and Benefits */}
        <div className="space-y-6">
          <div className={`rounded-xl xs:p-2 md:p-4 space-y-2 overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="space-y-4">
              <select
                onChange={handleServiceChange}
                value={selectedService}
                className={`border-2 rounded-lg px-4 py-3 w-full focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  darkMode 
                    ? "border-gray-700 focus:ring-gray-600 bg-gray-700 text-white" 
                    : "border-gray-200 focus:ring-gray-200 "
                }`}
              >
                <option value="" disabled className={darkMode ? "text-gray-300" : "text-gray-900"}>
                  -- Select a service --
                </option>
                <option value="AadharLite" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Aadhar Lite
                </option>
                <option value="PanLite" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  PAN Lite
                </option>
                <option value="RationCard" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Ration Card
                </option>
                <option value="VoterID" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Voter ID
                </option>
                <option value="DrivingLicense" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Driving License
                </option>
                <option value="Passport" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Passport
                </option>
                <option value="BirthCertificate" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Birth Certificate
                </option>
                <option value="Domacile" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Domacile
                </option>
                <option value="LivingCertificate" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Living Certificate
                </option>
                <option value="ESICLite" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  ESIC Lite
                </option>
                <option value="FasTagAdvance" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  FasTag Advance
                </option>
                <option value="DeathCertificate" className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Death Certificate
                </option>
              </select> 
            </div>
          </div>

          {/* Benefits Section - Moved here from right column */}
          <div className="xs:p-2">
            <div className={`xs:p-3 md:p-6 flex rounded-lg border ${
              darkMode 
                ? "bg-gray-800 border-gray-700" 
                : "bg-purple-50 border-purple-100"
            }`}>
              <div className="space-x-4">
                <div className="flex flex-row xs:w-[240px] md:w-[400px] xs:justify-center xs:text-center xs:items-center md:justify-start gap-3">
                  <div className={`xs:p-1 md:p-2 rounded-full flex-shrink-0 ${
                    darkMode ? "bg-gray-700" : "bg-purple-100"
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
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Why Personal Verification?
                    </h2>
                  </div>
                </div>
                <div>
                  <div className="mt-4 space-y-3">
                    {[
                      "Instant verification results",
                      "256-bit encryption security",
                      "24/7 customer support",
                      "Government-compliant processes",
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
                        <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms of selected service - Dynamic Forms */}
          {/* Right Column - Dynamic Form */}
          {currentFormConfig ? (
          <div className={`rounded-xl border overflow-hidden ${
            darkMode ? "bg-gray-800 border-gray-500" : "bg-white"
          }`}>
            {/* DynamicForm will render its own title from formConfig.title */}
            {/* You might want to adjust DynamicForm's internal styling or pass Tailwind classes if needed */}
            <DynamicForm
              key={selectedServiceKey} // IMPORTANT: Ensures form re-initializes when service changes
              formConfig={currentFormConfig}
              onFormSubmit={handleVerificationSubmit}
              // If DynamicForm needs to know about darkMode for its *internal* styles:
              // darkMode={darkMode} // You'd then need to modify DynamicForm to use this prop
            />
          </div>
        ) : (
          selectedServiceKey && ( // Show a message if a key is selected but no config found
            <div className={`p-6 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-500 text-gray-300" : "bg-white text-gray-700"}`}>
                <p>Configuration for selected service "{serviceForms[selectedServiceKey]?.title || selectedServiceKey}" not found or is invalid.</p>
            </div>
          )
        )}
        {/* Show a placeholder if no service is selected yet */}
        {!selectedServiceKey && (
            <div className={`p-6 rounded-xl border flex items-center justify-center ${darkMode ? "bg-gray-800 border-gray-500 text-gray-300" : "bg-white text-gray-400"}`}>
                <p className="text-lg">Please select a service to view the verification form.</p>
            </div>
        )}
     
      </div>
    </section>
  );
}