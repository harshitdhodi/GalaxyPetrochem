'use client'

import React, { useState } from 'react'
import { Button } from '@/website/componets/components/ui/button'

import ReCAPTCHA from 'react-google-recaptcha'

export default function RightSection() {
  const [loading, setLoading] = useState(false)
  const [captchaValue, setCaptchaValue] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!captchaValue) {
      alert('Please complete the reCAPTCHA before submitting.');
      return;
    }
  
    const isConfirmed = window.confirm('Are you sure you want to submit this inquiry?');
  
    if (!isConfirmed) {
      return;
    }
  
    setLoading(true);
  
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
  
      const response = await fetch('/api/inquiry/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit inquiry');
      }
  
      alert('Your message has been sent successfully!');
  
      e.target.reset();
      setCaptchaValue(null);
    } catch (error) {
      alert(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="bg-blue-50 p-6 rounded-lg">
      <h2 className="text-xl text-main font-semibold mb-4">
        Please fill in the form below to send us your enquiries.
      </h2>
      
      <p className="text-secondary mb-6">
        Fields marked <span className="text-red-500">*</span> are mandatory.
      </p>

      <form onSubmit={handleSubmit} className="space-y-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              First Name<span className="text-red-500">*</span>
            </label>
            <input required name="firstName" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input required name="lastName" />
          </div>

         
        </div>

        <div>
          <label className="block text-sm mt-3 font-medium mb-1">
            Address
          </label>
          <textarea name="address" rows={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Country
            </label>
            <input name="country" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input name="phone" type="tel" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email<span className="text-red-500">*</span>
          </label>
          <input required name="email" type="email" />
        </div>

        <div className='mb-3'>
          <label className="block text-sm font-medium mb-1">
            Your Message<span className="text-red-500">*</span>
          </label>
          <textarea required name="message" rows={4} />
        </div>
        <div className="w-full mb-3">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_SITE_KEY}
            onChange={(value) => setCaptchaValue(value)}
          />
        </div>
        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="w-1/4 mt-3 bg-main hover:bg-main_light"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  )
}