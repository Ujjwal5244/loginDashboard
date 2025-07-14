import React, { useState, useRef } from "react";

// --- ICONS (Added UploadIcon and SettingsIcon) ---

const IconWrapper = ({ children, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 ${className}`} // Slightly larger for better visibility
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5} // Slightly thinner for a modern look
    {...props}
  >
    {children}
  </svg>
);

const PreviewIcon = () => (
  <IconWrapper className="mr-2 h-5 w-5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </IconWrapper>
);

const UploadIcon = () => (
  <IconWrapper>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </IconWrapper>
);

const SettingsIcon = () => (
  <IconWrapper className="h-5 w-5 text-slate-500 hover:text-slate-800">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
    />
  </IconWrapper>
);

// --- MAIN BRANDING COMPONENT ---

const Branding = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initialSubtitle = "Your payment solution";
  const initialTerms =
    "By proceeding, you agree to our Terms of Service and Privacy Policy. Your payment will be processed securely through NifiPayments™. All transactions are encrypted and protected.";

  const [logo, setLogo] = useState(null);
  const [domain, setDomain] = useState("");
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [termsText, setTermsText] = useState(initialTerms);
  const [redirectUrl, setRedirectUrl] = useState("");

  const fileInputRef = useRef(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    // In a real app, you would send this data to your backend
    alert("Branding settings saved successfully!");
    setIsEditing(false); // Lock the form after saving
  };

  const handleRecreate = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete and reset all branding settings? This action cannot be undone."
      )
    ) {
      // Reset all state to initial values
      setLogo(null);
      setDomain("");
      setSubtitle(initialSubtitle);
      setTermsText(initialTerms);
      setRedirectUrl("");
      setIsEditing(false);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="h-[100%] bg-white font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white  z-10">
        <div className="p-3 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Branding</h1>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-slate-100"
            >
              <SettingsIcon />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                <button
                  onClick={handleRecreate}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Recreate Branding
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Branding
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
            {/* Left Column: Form Inputs - Scrollable */}
            <div className="lg:col-span-3 h-full overflow-y-auto py-6 pr-4">
              <div className="space-y-6">
                {/* Brand Identity Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">
                    Brand Identity
                  </h2>
                  <p className="text-slate-500 mb-6">
                    {isEditing
                      ? "Upload your logo and set your brand messaging."
                      : "Click the options menu (···) to recreate branding."}
                  </p>

                  <div className="space-y-6">
                    {/* Logo Upload */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Logo
                      </label>
                      <div className="flex items-center gap-6">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          ref={fileInputRef}
                          className="hidden"
                          disabled={!isEditing}
                        />
                        <div
                          onClick={() =>
                            isEditing && fileInputRef.current.click()
                          }
                          className={`w-[150px] h-[80px] bg-slate-50 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                            isEditing
                              ? "cursor-pointer border-slate-300 hover:border-blue-500 hover:bg-slate-100"
                              : "cursor-not-allowed border-slate-200 bg-slate-100 opacity-70"
                          }`}
                        >
                          {logo ? (
                            <img
                              src={logo}
                              alt="Logo Preview"
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <div className="text-center text-slate-500">
                              <UploadIcon />
                              <p className="text-xs mt-1">Upload Logo</p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">
                          Recommended:
                          <br />
                          PNG with transparent background.
                          <br />
                          Max size: 5MB.
                        </p>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label
                        htmlFor="subtitle"
                        className="block mb-2 text-sm font-medium text-slate-700"
                      >
                        Heading Subtitle
                      </label>
                      <input
                        id="subtitle"
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="e.g., Your Trusted Partner"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Domain */}
                    <div>
                      <label
                        htmlFor="domain"
                        className="block mb-2 text-sm font-medium text-slate-700"
                      >
                        Domain Name
                      </label>
                      <input
                        id="domain"
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="yourdomain.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Consent Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">
                    Consent & Terms
                  </h2>
                  <p className="text-slate-500 mb-6">
                    Customize the text customers agree to during checkout.
                  </p>
                  <textarea
                    value={termsText}
                    onChange={(e) => setTermsText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    rows="6"
                    disabled={!isEditing}
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    This text will appear on your payment consent screen. Use
                    clear and concise language.
                  </p>
                </div>

                {/* Post-Acceptance Redirect URL */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <label
                    htmlFor="postRedirectUrl"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Post-Acceptance Redirect URL
                  </label>
                  <input
                    type="url"
                    name="postRedirectUrl"
                    id="postRedirectUrl"
                    placeholder="https://example.com/thank-you"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    disabled={!isEditing}
                  />
                </div>

                {/* Save Button - Only visible in edit mode */}
                {isEditing && (
                  <div className="flex justify-end pt-4 pb-8">
                    <button
                      onClick={handleSaveChanges}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Preview - Fixed */}
            <div className="lg:col-span-2 h-full hidden lg:block">
              <div className="sticky top-6">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-8 bg-slate-50/50 border-b border-slate-200">
                    <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center bg-white rounded-full shadow-md">
                      {logo ? (
                        <img
                          src={logo}
                          alt="Logo Preview"
                          className="h-8 w-auto object-contain"
                        />
                      ) : (
                        <span className="text-xl font-bold text-blue-600">
                          B
                        </span>
                      )}
                    </div>
                    <h4 className="text-center text-xl font-semibold text-orange-800">
                      {subtitle || "Your payment solution"}
                    </h4>
                    <p className="text-center text-sm text-slate-500 mt-1">
                      Paying on {domain || "yourdomain.com"}
                    </p>
                  </div>
                  <div className="p-8">
                    <p className="text-sm text-slate-600 font-medium mb-4">
                      You are paying:
                    </p>
                    <p className="text-4xl font-bold text-slate-900 mb-6">
                      $99.00
                    </p>
                    <button className="w-full bg-orange-300 text-white font-bold py-3 rounded-lg shadow-md hover:bg-orange-500 transition">
                      Pay Now
                    </button>
                  </div>
                  <div className="px-8 pb-8">
                    {redirectUrl && (
                      <div className="text-center text-xs text-slate-500 mb-4 bg-slate-100 p-2 rounded-md">
                        After payment, you will be redirected to: <br />
                        <span className="font-medium text-slate-600 break-all">
                          {redirectUrl}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 leading-relaxed text-center">
                      {termsText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branding;
