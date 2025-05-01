import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Myprofile.css';

const Myprofile = () => {

  const [image, setImage] = useState(null);
  const navigate = useNavigate(); 

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  const handleSaveAndNext = () => {
    // navigate to step 2 (you can use React Router for actual navigation)
    alert("Proceeding to Step 2...");
     // You can add validation or API calls here
     navigate('/Maindashboard/verification'); 
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
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <div className="form-row">
          <input type="text" placeholder="First Name *" />
          <input type="text" placeholder="Middle Name" />
          <input type="text" placeholder="Last Name *" />
        </div>
        <div className="form-row">
          <input type="tel" placeholder="Mobile Number *" />
          <input type="email" placeholder="Email *"  />
        </div>
      </div>

      <div className="form-section">
        <h2>Company Information</h2>
        <div className="form-row">
          <input type="text" placeholder="Company Name *" />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Address Line 1 *" />
          <input type="text" placeholder="Address Line 2" />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Pincode *" />
          <input type="text" placeholder="State *" />
        </div>
        <div className="form-row">
          <input type="text" placeholder="City *" />
          <input type="text" placeholder="Country *" />
        </div>
      </div>

      <div className="form-section">
        <h2>Billing Information</h2>
        <div className="form-row">
          <input type="text" placeholder="Certificate No" />
          <input type="text" placeholder="GST No" />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Address Line 1 *" />
          <input type="text" placeholder="Address Line 2" />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Pincode *" />
          <input type="text" placeholder="State *" />
        </div>
        <div className="form-row">
          <input type="text" placeholder="City *" />
          <input type="text" placeholder="Country *" />
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
