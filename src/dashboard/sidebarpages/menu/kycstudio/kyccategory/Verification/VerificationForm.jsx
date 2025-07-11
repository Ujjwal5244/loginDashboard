import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl, decryptText } from "../../../../../../encryptDecrypt";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

// --- Color Palette Definition ---
const BRAND_BLUE = "#3470b2";

// --- Icon Components (Unchanged) ---
const InfoIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const LightbulbIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
const DocumentIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// --- Stepper Component (Refined for new color scheme) ---
const Stepper = ({ currentStep, maxStep, darkMode }) => {
  const steps = Array.from({ length: maxStep }, (_, i) => i + 1);

  return (
    <div className="flex items-center w-full px-2 pt-2 pb-5">
      {steps.map((step, index) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${isCompleted ? "bg-emerald-500 text-white" : isCurrent ? `bg-[#3470b2] text-white ring-4 ring-[#3470b2]/30` : darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}`}
              >
                {isCompleted ? <CheckIcon className="w-5 h-5" /> : step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 transition-colors duration-300 ${isCompleted ? "bg-emerald-500" : darkMode ? "bg-gray-700" : "bg-gray-200"}`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// --- Main VerificationForm Component (Revamped with Contained Scrolling) ---
const VerificationForm = ({ category, darkMode }) => {
  const token = localStorage.getItem("userToken");
  const [formData, setFormData] = useState({});
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Reset form when category changes
  useEffect(() => {
    setSelectedService("");
    setFormData({});
    setFormFields([]);
    setCurrentStep(1);
  }, [category.id]);

  // Fetch services when category changes
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseUrl}/api/services/${category.id}`,
          { headers: { authorization: token } }
        );
        const decrypted = await decryptText(response.data.body);
        const parsed = JSON.parse(decrypted);
        if (parsed.success && parsed.data) {
          setServices(parsed.data);
        } else {
          toast.error("Failed to load services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Error loading services");
      } finally {
        setIsLoading(false);
      }
    };
    if (category.id) fetchServices();
  }, [category.id, token]);

  // Fetch form fields when service is selected
  useEffect(() => {
    const fetchFormFields = async () => {
      if (!selectedService) return;
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseUrl}/api/services/getjson/${selectedService}`,
          { headers: { authorization: token } }
        );
        const decrypted = await decryptText(response.data.body);
        const parsed = JSON.parse(decrypted);
        if (parsed.payloads) {
          const visibleFields = parsed.payloads.filter(
            (field) => !field.isHidden
          );
          setFormFields(visibleFields);
          setCurrentStep(1);
        }
      } catch (error) {
        console.error("Error fetching form fields:", error);
        toast.error("Error loading form fields");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormFields();
  }, [selectedService, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
    setFormData({});
  };

  const handleResetService = () => {
    setSelectedService("");
    setFormData({});
    setFormFields([]);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    const currentStepFields = formFields.filter(
      (field) => field.step === currentStep
    );
    for (const field of currentStepFields) {
      if (field.isRequired && !formData[field.name]) {
        toast.error(`Please fill in the "${field.Label}" field.`);
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const currentStepFields = formFields.filter(
        (field) => field.step === currentStep
      );
      const missingFields = currentStepFields
        .filter((field) => field.isRequired && !formData[field.name])
        .map((field) => field.Label);
      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in required fields: ${missingFields.join(", ")}`
        );
      }
      const maxStep = Math.max(...formFields.map((field) => field.step || 1));
      if (currentStep < maxStep) {
        handleNextStep();
        setIsSubmitting(false);
        return;
      }
      const selectedServiceData = services.find(
        (service) => service._id === selectedService
      );
      const submissionData = {
        serviceId: selectedService,
        serviceName: selectedServiceData?.serviceName || "",
        categoryId: category.id,
        categoryName: category.categoryName,
        ...formData,
      };
      console.log("Submitting verification:", submissionData);
      toast.success("Verification submitted successfully!");
      setFormData({});
      setSelectedService("");
      setFormFields([]);
      setCurrentStep(1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verificationTips = [
    {
      title: "Document Preparation",
      description: "Have all required documents ready, clear, and valid.",
    },
    {
      title: "Accuracy Matters",
      description:
        "Double-check that all information matches your official documents.",
    },
    {
      title: "Secure Environment",
      description: "Complete this process in a private, secure location.",
    },
  ];

  const currentStepFields = formFields.filter(
    (field) => field.step === currentStep
  );
  const maxStep =
    formFields.length > 0
      ? Math.max(...formFields.map((field) => field.step || 1))
      : 1;
  const selectedServiceData = services.find((s) => s._id === selectedService);

  return (
    <div
      className={` mt-6 transition-all duration-500 ease-in-out ${darkMode ? "bg-gray-900/50" : "bg-white"} rounded-2xl`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* --- Left Side: Form Section --- */}
        <div className="lg:col-span-3">
          <div
            className={`flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg border h-full max-h-[68vh]`}
          >
            {/* --- Form Header (Not Scrollable) --- */}
            <div
              className={`p-2 pl-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <h2
                className={`text-2xl font-semibold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {category.categoryName} Verification
              </h2>
              <p
                className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Complete the steps below to get verified.
              </p>
            </div>

            {/* --- Form Body (Scrollable) --- */}
            <div
              className={`flex-1 p-6 overflow-y-auto scrollbar-thin ${darkMode ? "scrollbar-thumb-gray-600 scrollbar-track-gray-800" : "scrollbar-thumb-gray-400 scrollbar-track-gray-100"}`}
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div
                    style={{ borderColor: BRAND_BLUE }}
                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
                  ></div>
                </div>
              ) : (
                <form
                  id="verification-form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="service"
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Verification Service{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <select
                        id="service"
                        value={selectedService}
                        onChange={handleServiceChange}
                        disabled={selectedService !== ""}
                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${darkMode ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-700/50 disabled:cursor-not-allowed focus:ring-[#3470b2]" : "bg-gray-50 border-gray-300 text-gray-900 disabled:bg-gray-200 disabled:cursor-not-allowed focus:ring-[#3470b2]"}`}
                        required
                      >
                        <option value="" disabled>
                          Select a service...
                        </option>
                        {services.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.serviceName}
                          </option>
                        ))}
                      </select>
                      {selectedService && (
                        <button
                          type="button"
                          onClick={handleResetService}
                          className={`text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors ${darkMode ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedService && formFields.length > 0 && (
                      <motion.div
                        key="form-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="border-t pt-2"
                        style={{
                          borderColor: darkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                        }}
                      >
                        {maxStep > 1 && (
                          <Stepper
                            currentStep={currentStep}
                            maxStep={maxStep}
                            darkMode={darkMode}
                          />
                        )}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 pt-2"
                          >
                            {currentStepFields.map((field) => (
                              <div key={`${field.name}-${field.step}`}>
                                <label
                                  htmlFor={field.name}
                                  className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {field.Label}{" "}
                                  {field.isRequired && (
                                    <span className="text-red-500">*</span>
                                  )}
                                </label>
                                <input
                                  type={field.type || "text"}
                                  id={field.name}
                                  name={field.name}
                                  value={formData[field.name] || ""}
                                  onChange={handleInputChange}
                                  placeholder={
                                    field.placeholder || `Enter ${field.Label}`
                                  }
                                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#3470b2]" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#3470b2]"}`}
                                  required={field.isRequired}
                                />
                              </div>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              )}
            </div>

            {/* --- Form Footer (Not Scrollable) --- */}
            <AnimatePresence>
              {selectedService && formFields.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`flex justify-between items-center p-3 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} flex-shrink-0`}
                >
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg transition"
                      >
                        Previous
                      </button>
                    )}
                  </div>
                  <div>
                    {currentStep < maxStep ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        style={{ backgroundColor: BRAND_BLUE }}
                        className="hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg transition"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        form="verification-form"
                        disabled={isSubmitting}
                        className={`flex items-center justify-center font-bold py-2 px-5 rounded-lg transition text-white ${isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"}`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-5 w-5 mr-1.5" /> Submit
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- Right Side: Unified Info & Tips Panel (Sticky on large screens) --- */}
        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-6 self-start">
          {/* Selected Service Info */}
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"} p-5 rounded-2xl shadow-lg border`}
          >
            <div className="flex items-center mb-3">
              <DocumentIcon
                className={`h-6 w-6 text-[#3470b2] dark:text-blue-400`}
              />
              <h3
                className={`ml-2 text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Selected Service
              </h3>
            </div>
            {selectedServiceData ? (
              <div>
                <h4
                  className={`font-bold text-base ${darkMode ? "text-gray-100" : `text-gray-800`}`}
                >
                  {selectedServiceData.serviceName}
                </h4>
                <p
                  className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}
                >
                  {selectedServiceData.serviceDescription ||
                    "Detailed description for this service."}
                </p>
              </div>
            ) : (
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
              >
                Select a service from the list to see its description and
                requirements here.
              </p>
            )}
          </div>

          {/* Pro Tips Panel */}
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"} p-5 rounded-2xl shadow-lg border`}
          >
            <div className="flex items-center mb-3">
              <LightbulbIcon
                className={`h-6 w-6 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`}
              />
              <h3
                className={`ml-2 text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Pro Tips for a Smooth Process
              </h3>
            </div>
            <ul className="space-y-3">
              {verificationTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon
                    className={`flex-shrink-0 h-4 w-4 mt-1 mr-2.5 ${darkMode ? "text-emerald-400" : "text-emerald-500"}`}
                  />
                  <div>
                    <h4
                      className={`font-semibold text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {tip.title}
                    </h4>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {tip.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
