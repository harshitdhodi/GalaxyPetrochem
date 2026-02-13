import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { X } from "lucide-react";
import { useCreateInquiryMutation } from '@/slice/inquiry/productInquiry';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

function InquiryForm({ productName, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [openThankYouModal, setOpenThankYouModal] = useState(false);
  const [createInquiry] = useCreateInquiryMutation();

  // Validation rules
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name must contain letters only';
      if (value.trim().length > 50) return 'Name must not exceed 50 characters';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) return 'Invalid email format. Please enter a valid email like name@example.com';
      return '';
    },
    phone: (value) => {
      if (!value.trim()) return 'Phone number is required';
      if (!/^\d+$/.test(value)) return 'Phone number must contain digits only';
      if (value.length < 10 || value.length > 12) return 'Phone number must be 10-12 digits';
      return '';
    },
    subject: (value) => {
      if (!value.trim()) return 'Subject is required';
      if (value.trim().length < 5) return 'Subject must be at least 5 characters';
      if (value.trim().length > 100) return 'Subject must not exceed 100 characters';
      return '';
    },
    message: (value) => {
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      if (value.trim().length > 500) return 'Message must not exceed 500 characters';
      return '';
    },
  };

  // Validate single field
  const validateField = (name, value) => {
    return validators[name] ? validators[name](value) : '';
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone - only allow digits
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      
      // Validate on change if field was touched
      if (touched[name]) {
        const error = validateField(name, digitsOnly);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Validate on change if field was touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const newErrors = validateForm();
    setErrors(newErrors);

    // Check for validation errors
    if (Object.keys(newErrors).length > 0) {
      setServerError('Please fix the errors above before submitting.');
      return;
    }

    // Check captcha
    if (!captchaValue) {
      setServerError('Please complete the reCAPTCHA verification.');
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const inquiryData = {
        ...formData,
        productName,
        captchaToken: captchaValue,
      };

      await createInquiry(inquiryData).unwrap();
      
      // Show success modal
      setOpenThankYouModal(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});
      setTouched({});
      setCaptchaValue(null);
      setIsSubmitting(false);
      
      // Close form after short delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      setServerError(error.data?.message || 'Failed to submit inquiry. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Input field component with error handling
  const InputField = ({ label, name, type = "text", maxLength, rows }) => {
    const hasError = touched[name] && errors[name];
    const InputComponent = rows ? 'textarea' : 'input';
    
    return (
      <div className={rows ? 'md:col-span-2' : ''}>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <InputComponent
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={maxLength}
          rows={rows}
          className={`w-full border ${
            hasError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
          } p-2 rounded-lg focus:ring-2 focus:border-transparent transition duration-200 ${
            rows ? 'resize-none' : ''
          }`}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${name}-error` : undefined}
        />
        {hasError && (
          <p id={`${name}-error`} className="text-red-500 text-sm mt-1 flex items-start">
            <span className="mr-1">⚠️</span>
            <span>{errors[name]}</span>
          </p>
        )}
        {name === 'phone' && !hasError && (
          <p className="text-gray-500 text-xs mt-1">Enter 10-12 digit phone number</p>
        )}
        {name === 'message' && (
          <p className="text-gray-500 text-xs mt-1 text-right">
            {formData.message.length}/500 characters
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 top-[16%] flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-white p-6 rounded-md shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {`Inquiry for ${productName}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close form"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Name" name="name" maxLength={50} />
            <InputField label="Email" name="email" type="email" />
            <InputField label="Phone No" name="phone" type="tel" maxLength={12} />
            <InputField label="Subject" name="subject" maxLength={100} />
            <InputField label="Message" name="message" rows={4} maxLength={500} />
          </div>

          <div className="flex flex-col space-y-4 pt-2">
            <div className="flex items-start">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_SITE_KEY}
                onChange={(value) => {
                  setCaptchaValue(value);
                  if (value) setServerError('');
                }}
                className="transform scale-90 origin-left md:scale-100"
              />
            </div>
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <span className="mr-2">⚠️</span>
                <span className="text-sm">{serverError}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 w-1/3 md:w-1/4 text-white px-4 py-2 rounded-md transition duration-200 disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-1/3 md:w-1/4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Thank You Dialog */}
      <Dialog open={openThankYouModal} onOpenChange={setOpenThankYouModal}>
        <DialogContent className="bg-white max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-green-700 text-xl font-bold flex items-center">
              <span className="mr-2">✓</span> Thank You!
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-gray-700 hover:text-gray-900">
              <X size={20} />
            </DialogClose>
          </DialogHeader>
          <div className="text-gray-800 mt-4 space-y-2">
            <p className="font-medium">Your inquiry has been submitted successfully.</p>
            <p className="text-sm text-gray-600">We will get back to you soon via email or phone.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InquiryForm;