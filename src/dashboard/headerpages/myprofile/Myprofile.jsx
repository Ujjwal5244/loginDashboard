import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl, decryptText, encryptText } from "../../../encryptDecrypt";
import "./Myprofile.css";

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
        input.classList.add("input-error");
      } else {
        input.classList.remove("input-error");
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
    <div className={`kyc-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="stepper">
        <div className="step active">1</div>
        <div className="line"></div>
        <div className="step">2</div>
        <div className="line"></div>
        <div className="step">3</div>
      </div>

      <div className="form-content">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="profile-img-upload">
            {image ? (
              <img src={image} alt="Profile" className="uploaded-img" />
            ) : (
              <div className="image-placeholder">NO IMAGE</div>
            )}
            <label className="upload-icon">
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="First Name *"
              value={formData.name.first}
              onChange={(e) => handleNameChange(e, "first")}
            />
            <input
              type="text"
              placeholder="Middle Name"
              value={formData.name.middle}
              onChange={(e) => handleNameChange(e, "middle")}
            />
            <input
              type="text"
              placeholder="Last Name *"
              value={formData.name.last}
              onChange={(e) => handleNameChange(e, "last")}
            />
          </div>
          <div className="form-row">
            <input
              type="tel"
              placeholder="Mobile Number *"
              value={formData.mobile}
              onChange={(e) => handleInputChange(e, null, "mobile")}
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => handleInputChange(e, null, "email")}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Company Information</h2>
          <div className="form-row">
            <input
              type="text"
              placeholder="Company Name *"
              value={formData.companyName}
              onChange={(e) => handleInputChange(e, null, "companyName")}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Address Line 1 *"
              value={formData.companyAddress.line1}
              onChange={(e) => handleInputChange(e, "companyAddress", "line1")}
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={formData.companyAddress.line2}
              onChange={(e) => handleInputChange(e, "companyAddress", "line2")}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Pincode *"
              value={formData.companyAddress.pincode}
              onChange={(e) => handleInputChange(e, "companyAddress", "pincode")}
            />
            <input
              type="text"
              placeholder="State *"
              value={formData.companyAddress.state}
              onChange={(e) => handleInputChange(e, "companyAddress", "state")}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="City *"
              value={formData.companyAddress.city}
              onChange={(e) => handleInputChange(e, "companyAddress", "city")}
            />
            <input
              type="text"
              placeholder="Country *"
              value={formData.companyAddress.country}
              onChange={(e) => handleInputChange(e, "companyAddress", "country")}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Billing Information</h2>
          <div className="form-row">
            <input
              type="text"
              placeholder="Certificate No"
              value={formData.certificateNo}
              onChange={(e) => handleInputChange(e, null, "certificateNo")}
            />
            <input
              type="text"
              placeholder="GST No"
              value={formData.gstNo}
              onChange={(e) => handleInputChange(e, null, "gstNo")}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Address Line 1 *"
              value={formData.billingAddress.line1}
              onChange={(e) => handleInputChange(e, "billingAddress", "line1")}
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={formData.billingAddress.line2}
              onChange={(e) => handleInputChange(e, "billingAddress", "line2")}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Pincode *"
              value={formData.billingAddress.pincode}
              onChange={(e) => handleInputChange(e, "billingAddress", "pincode")}
            />
            <input
              type="text"
              placeholder="State *"
              value={formData.billingAddress.state}
              onChange={(e) => handleInputChange(e, "billingAddress", "state")}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="City *"
              value={formData.billingAddress.city}
              onChange={(e) => handleInputChange(e, "billingAddress", "city")}
            />
            <input
              type="text"
              placeholder="Country *"
              value={formData.billingAddress.country}
              onChange={(e) => handleInputChange(e, "billingAddress", "country")}
            />
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="next-button" onClick={handleSaveAndNext}>
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default Myprofile;