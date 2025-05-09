import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl, decryptText } from "../../../encryptDecrypt";
import "./Myprofile.css";

const Myprofile = () => {
  const token = localStorage.getItem("userToken");
  const [image, setImage] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };


  // Fetch Profile Data
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


  
  const handleSaveAndNext = () => {
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
  
    navigate("/Maindashboard/verification");
  };
  

  return (
    <div className="kyc-container">
      <div className="stepper">
        <div className="step active">1</div>
        <div className="line"></div>
        <div className="step">2</div>
        <div className="line"></div>
        <div className="step">3</div>
      </div>

      <div className="form-section">
        <h2>Personal Information</h2>
        <div className="profile-img-upload">
          {image ? (
            <img src={image} alt="Profile" className="uploaded-img" />
          ) : (
            <div className="image-placeholder">NO IMAGE AVAILABLE</div>
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
          <input type="text" placeholder="First Name *" defaultValue={profileData?.name?.split(" ")[0] || ""} />
          <input type="text" placeholder="Middle Name" />
          <input type="text" placeholder="Last Name *" defaultValue={profileData?.name?.split(" ")[1] || ""} />
        </div>
        <div className="form-row">
          <input type="tel" placeholder="Mobile Number *" defaultValue={profileData?.mobile || ""} />
          <input type="email" placeholder="Email *" defaultValue={profileData?.email || ""} />
        </div>
      </div>

      <div className="form-section">
        <h2>Company Information</h2>
        <div className="form-row">
          <input type="text" placeholder="Company Name *" defaultValue={profileData?.companyName || ""} />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Address Line 1 *" defaultValue={profileData?.companyAddress?.line1 || ""} />
          <input type="text" placeholder="Address Line 2" defaultValue={profileData?.companyAddress?.line2 || ""} />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Pincode *" defaultValue={profileData?.companyAddress?.pincode || ""} />
          <input type="text" placeholder="State *" defaultValue={profileData?.companyAddress?.state || ""} />
        </div>
        <div className="form-row">
          <input type="text" placeholder="City *" defaultValue={profileData?.companyAddress?.city || ""} />
          <input type="text" placeholder="Country *" defaultValue={profileData?.companyAddress?.country || ""} />
        </div>
      </div>

      <div className="form-section">
        <h2>Billing Information</h2>
        <div className="form-row">
          <input type="text" placeholder="Certificate No" defaultValue={profileData?.certificateNo || ""} />
          <input type="text" placeholder="GST No" defaultValue={profileData?.gstNo || ""} />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Address Line 1 *" defaultValue={profileData?.billingAddress?.line1 || ""} />
          <input type="text" placeholder="Address Line 2" defaultValue={profileData?.billingAddress?.line2 || ""} />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Pincode *" defaultValue={profileData?.billingAddress?.pincode || ""} />
          <input type="text" placeholder="State *" defaultValue={profileData?.billingAddress?.state || ""} />
        </div>
        <div className="form-row">
          <input type="text" placeholder="City *" defaultValue={profileData?.billingAddress?.city || ""} />
          <input type="text" placeholder="Country *" defaultValue={profileData?.billingAddress?.country || ""} />
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
