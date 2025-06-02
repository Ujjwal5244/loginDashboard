export const serviceForms = {
  AadharLite: {
    title: "Aadhar Verification",
    fields: [
      { name: "aadharNumber", label: "Aadhar Number *", placeholder: "Enter 12-digit Aadhar Number", type: "text", validation: { required: true, pattern: /^\d{12}$/, message: "Aadhar number must be 12 digits." } },
    ],
    buttonText: "Verify Aadhar",
    apiEndpoint: "/api/package-code/aadharlite/aadhar-lite", // Example backend endpoint
  },
  PanLite: {
    title: "PAN Card Verification",
    fields: [
      { name: "panNumber", label: "PAN Number *", placeholder: "Enter 10-digit PAN", type: "text", validation: { required: true, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format." } },
      { name: "dateOfBirth", label: "Date of Birth *", placeholder: "", type: "date", validation: { required: true } },
    ],
    buttonText: "Verify PAN",
    apiEndpoint: "/api/package-code/panLite/pan-lite",
  },
  RationCard: {
    title: "Ration Card Verification",
    fields: [
      { name: "rationCardNumber", label: "Ration Card Number *", placeholder: "Enter Ration Card Number", type: "text", validation: { required: true } },
      {
        name: "state",
        label: "State *",
        type: "select",
        options: [
          "", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
          "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
          "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
          "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
          "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        ],
        validation: { required: true }
      },
    ],
    buttonText: "Verify Ration Card",
    apiEndpoint: "/api/verify/ration-card",
  },
  VoterID: {
    title: "Voter ID Verification",
    fields: [
      { name: "voterIdNumber", label: "Voter ID Number *", placeholder: "Enter Voter ID Number", type: "text", validation: { required: true } },
      { name: "fullName", label: "Full Name *", placeholder: "As per Voter ID", type: "text", validation: { required: true } },
    ],
    buttonText: "Verify Voter ID",
    apiEndpoint: "/api/verify/voter-id",
  },
  DrivingLicense: {
    title: "Driving License Verification",
    fields: [
      { name: "licenseNumber", label: "License Number *", placeholder: "Enter Driving License Number", type: "text", validation: { required: true } },
      { name: "dateOfBirth", label: "Date of Birth *", placeholder: "", type: "date", validation: { required: true } },
    ],
    buttonText: "Verify Driving License",
    apiEndpoint: "/api/verify/driving-license",
  },
  Passport: {
    title: "Passport Verification",
    fields: [
      { name: "passportNumber", label: "Passport Number *", placeholder: "Enter Passport Number", type: "text", validation: { required: true } },
      { name: "fullName", label: "Full Name *", placeholder: "As per Passport", type: "text", validation: { required: true } },
    ],
    buttonText: "Verify Passport",
    apiEndpoint: "/api/verify/passport",
  },
  BirthCertificate: {
    title: "Birth Certificate Verification",
    fields: [
      { name: "certificateNumber", label: "Certificate Number *", placeholder: "Enter Certificate Number", type: "text", validation: { required: true } },
      { name: "dateOfBirth", label: "Date of Birth *", placeholder: "", type: "date", validation: { required: true } },
    ],
    buttonText: "Verify Birth Certificate",
    apiEndpoint: "/api/verify/birth-certificate",
  },
  Domacile: { // Note: Typo "Domacile" from original, kept for consistency. Should be "Domicile"
    title: "Domicile Verification",
    fields: [
      { name: "domicileCertificateNo", label: "Domicile Certificate No *", placeholder: "Enter Certificate Number", type: "text", validation: { required: true } },
      { name: "state", label: "State *", placeholder: "Enter your State", type: "text", validation: { required: true } }, // Could be a select too
    ],
    buttonText: "Verify Domicile",
    apiEndpoint: "/api/verify/domicile",
  },
  LivingCertificate: {
    title: "Living Certificate Verification",
    fields: [
      { name: "certificateNumber", label: "Certificate Number *", placeholder: "Enter Certificate Number", type: "text", validation: { required: true } },
      { name: "fullName", label: "Full Name *", placeholder: "As per Certificate", type: "text", validation: { required: true } },
    ],
    buttonText: "Verify Living Certificate",
    apiEndpoint: "/api/verify/living-certificate",
  },
  ESICLite: {
    title: "ESIC Verification",
    fields: [
      { name: "esicNumber", label: "ESIC Number *", placeholder: "Enter ESIC Number", type: "text", validation: { required: true } },
      { name: "fullName", label: "Full Name *", placeholder: "As per ESIC Record", type: "text", validation: { required: true } },
    ],
    buttonText: "Verify ESIC",
    apiEndpoint: "/api/verify/esic-lite",
  },
  FasTagAdvance: {
    title: "FasTag Verification",
    fields: [
      { name: "fasTagId", label: "FasTag ID *", placeholder: "Enter FasTag ID", type: "text", validation: { required: true } },
      { name: "vehicleNumber", label: "Vehicle Number *", placeholder: "Enter Vehicle Number", type: "text", validation: { required: true } },
    ],
    buttonText: "Verify FasTag",
    apiEndpoint: "/api/verify/fastag-advance",
  },
  DeathCertificate: {
    title: "Death Certificate Verification",
    fields: [
      { name: "certificateNumber", label: "Certificate Number *", placeholder: "Enter Certificate Number", type: "text", validation: { required: true } },
      { name: "dateOfDeath", label: "Date of Death *", placeholder: "", type: "date", validation: { required: true } },
    ],
    buttonText: "Verify Death Certificate",
    apiEndpoint: "/api/verify/death-certificate",
  },
};
