'use client'

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { useAddInquiryMutation } from '@/slice/inquiry/inquiry';
import ReCAPTCHA from 'react-google-recaptcha';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingInquiry = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [addInquiry] = useAddInquiryMutation();
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      toast.error('Please complete the reCAPTCHA');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Add reCAPTCHA token to the form data
      const formDataWithCaptcha = {
        ...data,
        'g-recaptcha-response': captchaValue
      };

      // Send the form data with reCAPTCHA token to the server
      const result = await addInquiry(formDataWithCaptcha).unwrap();

      // Navigate to thank you page on successful submission
      navigate('/thank-you');

      // Reset the form
      e.target.reset();
      // Clear the CAPTCHA state
      setCaptchaValue(null);
      // Reset the reCAPTCHA widget
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error(error.data?.message || error.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (
    <div className="z-[40]">
    {!isOpen ? (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed right-[25px]  top-1/2 transform -rotate-90 -translate-y-1/2 bg-primary hover:bg-orange-600 text-white rounded-md py-4 md:py-6 px-3 md:px-4 shadow-lg transition-all duration-300 origin-right"
      >
        <span className="block whitespace-nowrap text-xs md:text-sm font-semibold">
          INQUIRY NOW
        </span>
      </Button>
    ) : (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-4 md:p-6 relative my-4 max-h-[90vh] overflow-y-auto">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X size={20} />
          </button>
          <div className="mb-4 pr-8">
            <h3 className="text-base md:text-lg text-primary font-semibold">
              Please fill in the form below to send us your enquiries.
            </h3>
            <p className="text-sm text-secondary mt-2">
              Fields marked <span className="text-red-500">*</span> are mandatory.
            </p>
          </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <Input required name="firstName" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <Input required name="lastName" className="w-full" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <Textarea name="address" rows={3} className="w-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <Input required name="email" type="email" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    maxLength={10}
                    pattern="\d{10}"
                    title="Please enter a valid 10-digit phone number"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Message<span className="text-red-500">*</span>
                </label>
                <Textarea required name="message" rows={4} className="w-full" />
              </div>

              <div className="flex justify-start overflow-x-auto">
                <div className="scale-[0.85] origin-left sm:scale-100">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_SITE_KEY}
                    onChange={onCaptchaChange}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-[#ee451b] text-white"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingInquiry;