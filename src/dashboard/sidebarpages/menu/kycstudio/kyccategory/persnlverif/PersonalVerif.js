export const serviceForms = {
  AadharLite: {
    title: "Aadhar Verification",
    fields: [
      { label: "Aadhar Number *", placeholder: "Enter 12-digit Aadhar Number", type: "text" },
      { label: "Full Name *", placeholder: "As per Aadhar card", type: "text" },
    ],
    buttonText: "Verify Aadhar",
  },
  PanLite: {
    title: "PAN Card Verification",
    fields: [
      { label: "PAN Number *", placeholder: "Enter 10-digit PAN", type: "text" },
      { label: "Date of Birth *", placeholder: "", type: "date" },
    ],
    buttonText: "Verify PAN",
  },
  RationCard: {
    title: "Ration Card Verification",
    fields: [
      { label: "Ration Card Number *", placeholder: "Enter Ration Card Number", type: "text" },
      {
        label: "State *",
        type: "select",
        options: [
          "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
          "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
          "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
          "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
          "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        ],
      },
    ],
    buttonText: "Verify Ration Card",
  },
  VoterID: {
    title: "Voter ID Verification",
    fields: [
      { label: "Voter ID Number *", placeholder: "Enter Voter ID Number", type: "text" },
      { label: "Full Name *", placeholder: "As per Voter ID", type: "text" },
    ],
    buttonText: "Verify Voter ID",
  },

  // 👇 Add placeholder forms for new services
  DrivingLicense: {
    title: "Driving License Verification",
    fields: [
      { label: "License Number *", placeholder: "Enter Driving License Number", type: "text" },
      { label: "Date of Birth *", placeholder: "", type: "date" },
    ],
    buttonText: "Verify Driving License",
  },
  Passport: {
    title: "Passport Verification",
    fields: [
      { label: "Passport Number *", placeholder: "Enter Passport Number", type: "text" },
      { label: "Full Name *", placeholder: "As per Passport", type: "text" },
    ],
    buttonText: "Verify Passport",
  },
  BirthCertificate: {
    title: "Birth Certificate Verification",
    fields: [
      { label: "Certificate Number *", placeholder: "Enter Certificate Number", type: "text" },
      { label: "Date of Birth *", placeholder: "", type: "date" },
    ],
    buttonText: "Verify Birth Certificate",
  },
  Domacile: {
    title: "Domicile Verification",
    fields: [
      { label: "Domicile Certificate No *", placeholder: "Enter Certificate Number", type: "text" },
      { label: "State *", placeholder: "Enter your State", type: "text" },
    ],
    buttonText: "Verify Domicile",
  },
  LivingCertificate: {
    title: "Living Certificate Verification",
    fields: [
      { label: "Certificate Number *", placeholder: "Enter Certificate Number", type: "text" },
      { label: "Full Name *", placeholder: "As per Certificate", type: "text" },
    ],
    buttonText: "Verify Living Certificate",
  },
  ESICLite: {
    title: "ESIC Verification",
    fields: [
      { label: "ESIC Number *", placeholder: "Enter ESIC Number", type: "text" },
      { label: "Full Name *", placeholder: "As per ESIC Record", type: "text" },
    ],
    buttonText: "Verify ESIC",
  },
  FasTagAdvance: {
    title: "FasTag Verification",
    fields: [
      { label: "FasTag ID *", placeholder: "Enter FasTag ID", type: "text" },
      { label: "Vehicle Number *", placeholder: "Enter Vehicle Number", type: "text" },
    ],
    buttonText: "Verify FasTag",
  },
  DeathCertificate: {
    title: "Death Certificate Verification",
    fields: [
      { label: "Certificate Number *", placeholder: "Enter Certificate Number", type: "text" },
      { label: "Date of Death *", placeholder: "", type: "date" },
    ],
    buttonText: "Verify Death Certificate",
  },
};
