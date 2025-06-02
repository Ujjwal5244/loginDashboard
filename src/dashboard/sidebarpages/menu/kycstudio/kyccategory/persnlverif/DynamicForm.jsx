import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  baseUrl,
  encryptText,token
} from "../../../../../../encryptDecrypt";


const DynamicForm = ({ formConfig, onFormSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Initialize form data when formConfig changes
  useEffect(() => {
    const initialData = {};
    formConfig.fields.forEach(field => {
      initialData[field.name] = field.type === 'select' ? (field.options?.[0] || '') : '';
    });
    setFormData(initialData);
    setErrors({}); // Reset errors when form changes
    setSubmissionStatus(null);
    setSubmissionMessage('');
  }, [formConfig]);

  const validateField = (name, value) => {
    const field = formConfig.fields.find(f => f.name === name);
    if (!field || !field.validation) return ''; // No validation rules

    const { required, pattern, message: patternMessage, minLength, maxLength } = field.validation;

    if (required && !value && value !== 0) { // 0 can be a valid value
      return `${field.label.replace(' *', '')} is required.`;
    }
    if (pattern && value && !pattern.test(value)) {
      return patternMessage || `Invalid format for ${field.label.replace(' *', '')}.`;
    }
    if (minLength && value && value.length < minLength) {
      return `${field.label.replace(' *', '')} must be at least ${minLength} characters.`;
    }
    if (maxLength && value && value.length > maxLength) {
      return `${field.label.replace(' *', '')} must be at most ${maxLength} characters.`;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: fieldValue,
    }));

    // Validate on change
    if (errors[name]) { // Clear error if user starts typing/correcting
        const fieldError = validateField(name, fieldValue);
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: fieldError,
        }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors(prevErrors => ({
        ...prevErrors,
        [name]: fieldError,
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    formConfig.fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        formIsValid = false;
      }
    });
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null);
    setSubmissionMessage('');

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting data:", formData);
    console.log("To endpoint:", formConfig.apiEndpoint);
    const encryptBody = await encryptText(formData)

    try {
      // --- Replace with your actual API call ---
      const response = await axios.post(`${baseUrl}${formConfig.apiEndpoint}`, {body:encryptBody}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:token
          // Add any other headers like Authorization if needed
        }
      });
      setIsSubmitting(false);

      if (!response.ok) {
        // Try to get error message from backend response
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // If response is not JSON, use status text
          errorData = { message: response.statusText || "An unknown error occurred." };
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Assuming backend sends JSON response
      console.log("Backend response:", result);
      setSubmissionStatus('success');
      setSubmissionMessage(result.message || 'Verification successful!');
      if (onFormSubmit) {
        onFormSubmit(formConfig.title, formData, result); // Pass form title, data, and result
      }
       // Optionally reset form on success
      // const initialData = {};
      // formConfig.fields.forEach(field => { initialData[field.name] = ''; });
      // setFormData(initialData);

    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setSubmissionStatus('error');
      setSubmissionMessage(error.message || 'Submission failed. Please try again.');
      // You might want to set specific field errors here if the backend provides them
      // For example: if (error.fieldErrors) setErrors(error.fieldErrors);
    }
  };

  if (!formConfig) {
    return <p>No form configuration provided.</p>;
  }

  return (
    <div style={{  padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
      <h2 className=' text-center mb-4 text-xl font-bold'>{formConfig.title}</h2>
      <form onSubmit={handleSubmit} noValidate>
        {formConfig.fields.map(field => (
          <div key={field.name} style={{ marginBottom: '15px' }}>
            <label htmlFor={field.name} style={{ display: 'block', marginBottom: '5px' }}>
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                aria-invalid={!!errors[field.name]}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              >
                {field.options.map(option => (
                  <option key={option} value={option}>
                    {option === "" ? (field.placeholder || "-- Select --") : option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ width: 'calc(100% - 18px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                aria-invalid={!!errors[field.name]}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              />
            )}
            {errors[field.name] && <p id={`${field.name}-error`} style={{ color: 'red', fontSize: '0.9em', marginTop: '4px' }}>{errors[field.name]}</p>}
          </div>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '1em'
          }}
        >
          {isSubmitting ? 'Verifying...' : formConfig.buttonText}
        </button>
      </form>
      {submissionStatus === 'success' && (
        <p style={{ color: 'green', marginTop: '15px' }}>{submissionMessage}</p>
      )}
      {submissionStatus === 'error' && (
        <p style={{ color: 'red', marginTop: '15px' }}>{submissionMessage}</p>
      )}
    </div>
  );
};

export default DynamicForm;