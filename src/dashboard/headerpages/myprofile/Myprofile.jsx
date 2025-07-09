import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl, decryptText, encryptText } from "../../../encryptDecrypt";

const Myprofile = ({ darkMode }) => {
  const token = localStorage.getItem("userToken");
  const [image, setImage] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: { first: "", middle: "", last: "" },
    email: "",
    mobile: "",
    companyName: "",
    companyAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    billingAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    certificateNo: "",
    gstNo: "",
  });
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/user/profile`, {
          headers: { authorization: token },
        });

        const decrypted = await decryptText(res.data.body);
        const data = JSON.parse(decrypted);

        if (data.status === "success") {
          setProfileData(data.data);
          const nameParts = data.data.name?.split(" ") || ["", ""];
          setFormData({
            name: {
              first: nameParts[0] || "",
              middle: nameParts.length > 2 ? nameParts[1] : "",
              last: nameParts.length > 2 ? nameParts[2] : nameParts[1] || "",
            },
            email: data.data.email || "",
            mobile: data.data.mobile || "",
            companyName: data.data.companyName || "",
            companyAddress: {
              line1: data.data.companyAddress?.line1 || "",
              line2: data.data.companyAddress?.line2 || "",
              city: data.data.companyAddress?.city || "",
              state: data.data.companyAddress?.state || "",
              country: data.data.companyAddress?.country || "",
              pincode: data.data.companyAddress?.pincode || "",
            },
            billingAddress: {
              line1: data.data.billingAddress?.line1 || "",
              line2: data.data.billingAddress?.line2 || "",
              city: data.data.billingAddress?.city || "",
              state: data.data.billingAddress?.state || "",
              country: data.data.billingAddress?.country || "",
              pincode: data.data.billingAddress?.pincode || "",
            },
            certificateNo: data.data.certificateNo || "",
            gstNo: data.data.gstNo || "",
          });
        } else {
          throw new Error(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile information");
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNameChange = (e, part) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        [part]: value,
      },
    }));
  };

  const handleSaveAndNext = async () => {
    const requiredInputs = document.querySelectorAll('input[placeholder*="*"]');
    let allFilled = true;

    requiredInputs.forEach((input) => {
      if (!input.value.trim()) {
        allFilled = false;
        input.classList.add("border-red-500", "ring-2", "ring-red-200");
      } else {
        input.classList.remove("border-red-500", "ring-2", "ring-red-200");
      }
    });

    if (!allFilled) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    try {
      const fullName =
        `${formData.name.first} ${formData.name.middle ? formData.name.middle + " " : ""}${formData.name.last}`.trim();

      const updateData = {
        name: fullName,
        email: formData.email,
        mobile: formData.mobile,
        companyName: formData.companyName,
        companyAddress: formData.companyAddress,
        billingAddress: formData.billingAddress,
        certificateNo: formData.certificateNo,
        gstNo: formData.gstNo,
      };

      const encryptedData = await encryptText(updateData);

      const res = await axios.put(
        `${baseUrl}/api/user/profile`,
        { body: encryptedData },
        { headers: { authorization: token } }
      );

      const decryptedResponse = await decryptText(res.data.body);
      const responseData = JSON.parse(decryptedResponse);
      toast.success(responseData.message);
      navigate("/Maindashboard/verification");
    } catch (err) {
      const decryptedResponse = await decryptText(err?.res?.data?.body);
      const responseData = JSON.parse(decryptedResponse);
      toast.error(responseData.message);
    }
  };

  return (
    // This outer container ensures the component takes up the full screen
    <div
      className={`w-full h-[100%] ${darkMode ? "bg-gray-900" : "bg-white"}`}
    >
      {/* Main card with flex-col layout to structure header, content, and footer */}
      <div
        className={`flex flex-col max-w-4xl mx-auto h-full rounded-xl shadow-md overflow-hidden ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white"}`}
      >
        {/* Header: Contains the stepper, fixed at the top */}
        <div
          className={`shrink-0 p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-center">
            <div className="bg-[#3470b2] text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm">
              1
            </div>
            <div className="w-10 h-0.5 bg-gray-300 mx-2"></div>
            <div className="bg-gray-300 text-gray-600 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm">
              2
            </div>
            <div className="w-10 h-0.5 bg-gray-300 mx-2"></div>
            <div className="bg-gray-300 text-gray-600 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm">
              3
            </div>
          </div>
        </div>

        {/* Content: This area grows and becomes scrollable */}
        <div className="flex-1 overflow-y-auto p-6 ">
          {/* Personal Information */}
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-[#3470b2] mb-4">
              Personal Information
            </h2>

            {/* Profile Image Upload */}
            <div className="relative flex items-center mb-4">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full flex justify-center items-center text-xs text-center ${darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-100 text-gray-500"}`}
                >
                  NO IMAGE
                </div>
              )}
              <label className="absolute cursor-pointer text-xl bottom-0 left-14 bg-[#3470b2] text-white w-6 h-6 rounded-full flex items-center justify-center">
                📷
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name Fields */}
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name *"
                value={formData.name.first}
                onChange={(e) => handleNameChange(e, "first")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="text"
                placeholder="Middle Name"
                value={formData.name.middle}
                onChange={(e) => handleNameChange(e, "middle")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={formData.name.last}
                onChange={(e) => handleNameChange(e, "last")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>

            {/* Contact Fields */}
            <div className="flex flex-wrap gap-4">
              <input
                type="tel"
                placeholder="Mobile Number *"
                value={formData.mobile}
                onChange={(e) => handleInputChange(e, null, "mobile")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => handleInputChange(e, null, "email")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-[#3470b2] mb-4">
              Company Information
            </h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Company Name *"
                value={formData.companyName}
                onChange={(e) => handleInputChange(e, null, "companyName")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Address Line 1 *"
                value={formData.companyAddress.line1}
                onChange={(e) =>
                  handleInputChange(e, "companyAddress", "line1")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={formData.companyAddress.line2}
                onChange={(e) =>
                  handleInputChange(e, "companyAddress", "line2")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Pincode *"
                value={formData.companyAddress.pincode}
                onChange={(e) =>
                  handleInputChange(e, "companyAddress", "pincode")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="text"
                placeholder="State *"
                value={formData.companyAddress.state}
                onChange={(e) =>
                  handleInputChange(e, "companyAddress", "state")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="City *"
                value={formData.companyAddress.city}
                onChange={(e) => handleInputChange(e, "companyAddress", "city")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="text"
                placeholder="Country *"
                value={formData.companyAddress.country}
                onChange={(e) =>
                  handleInputChange(e, "companyAddress", "country")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>
          </div>

          {/* Billing Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#3470b2] mb-4">
              Billing Information
            </h2>
            {/* ... rest of the form fields ... */}
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Certificate No"
                value={formData.certificateNo}
                onChange={(e) => handleInputChange(e, null, "certificateNo")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="text"
                placeholder="GST No"
                value={formData.gstNo}
                onChange={(e) => handleInputChange(e, null, "gstNo")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Address Line 1 *"
                value={formData.billingAddress.line1}
                onChange={(e) =>
                  handleInputChange(e, "billingAddress", "line1")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={formData.billingAddress.line2}
                onChange={(e) =>
                  handleInputChange(e, "billingAddress", "line2")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Pincode *"
                value={formData.billingAddress.pincode}
                onChange={(e) =>
                  handleInputChange(e, "billingAddress", "pincode")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="text"
                placeholder="State *"
                value={formData.billingAddress.state}
                onChange={(e) =>
                  handleInputChange(e, "billingAddress", "state")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="City *"
                value={formData.billingAddress.city}
                onChange={(e) => handleInputChange(e, "billingAddress", "city")}
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              <input
                type="text"
                placeholder="Country *"
                value={formData.billingAddress.country}
                onChange={(e) =>
                  handleInputChange(e, "billingAddress", "country")
                }
                className={`flex-1 min-w-0 p-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
            </div>
          </div>
        </div>

        {/* Footer: Contains the action button, fixed at the bottom */}
        <div
          className={`shrink-0 text-center  p-6 border-t ${darkMode ? "border-gray-700 " : "border-gray-200 bg-white"}`}
        >
          <button
            onClick={handleSaveAndNext}
            className="bg-[#3470b2] text-white py-2 px-6 rounded-md text-sm font-medium transition-colors min-w-[150px] "
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
