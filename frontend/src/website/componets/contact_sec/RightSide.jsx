'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-toastify'
import { useAddInquiryMutation } from '@/slice/inquiry/inquiry'
import ReCAPTCHA from 'react-google-recaptcha'
import { useNavigate } from 'react-router-dom'

export default function RightSection() {
  const [loading, setLoading] = useState(false)
  const [captchaValue, setCaptchaValue] = useState(null)
  const [addInquiry] = useAddInquiryMutation()
  const recaptchaRef = useRef(null)
  const navigate = useNavigate()

  // Form validation errors state
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Validation functions
  const validateName = (name, fieldName) => {
    if (!name || name.trim().length === 0) {
      return `${fieldName} is required.`
    }
    if (name.trim().length < 2) {
      return `${fieldName} must be at least 2 characters.`
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return `Please enter a valid ${fieldName.toLowerCase()} using letters only.`
    }
    return ''
  }

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return 'Email is required.'
    }
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return 'Invalid email format. Please enter a valid email like name@example.com.'
    }
    return ''
  }

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
      return '' // Phone is optional
    }
    
    // Check for invalid test/placeholder numbers
    const testNumbers = ['0000000000', '1111111111', '2222222222', '3333333333', 
                         '4444444444', '5555555555', '6666666666', '7777777777', 
                         '8888888888', '9999999999', '1234567890', '0987654321',
                         '1231231234', '9876543210']
    
    if (testNumbers.includes(phone)) {
      return 'Please enter a valid phone number. Placeholder or test numbers are not allowed.'
    }
    
    if (!/^\d{10}$/.test(phone)) {
      return 'Please enter a valid 10-digit phone number.'
    }
    
    // Check for valid starting digits (most Indian mobile numbers start with 6-9)
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return 'Please enter a valid phone number starting with 6, 7, 8, or 9.'
    }
    
    return ''
  }

  const validateMessage = (message) => {
    if (!message || message.trim().length === 0) {
      return 'Message is required.'
    }
    if (message.trim().length < 10) {
      return 'Message must be at least 10 characters.'
    }
    if (message.trim().length > 500) {
      return 'Message must not exceed 500 characters.'
    }
    return ''
  }

  const validateAddress = (address) => {
    if (!address || address.trim().length === 0) {
      return '' // Address is optional
    }
    if (address.trim().length < 5) {
      return 'Address must be at least 5 characters if provided.'
    }
    return ''
  }

  // Validate all fields
  const validateForm = (formData) => {
    const newErrors = {}
    
    newErrors.firstName = validateName(formData.firstName, 'First Name')
    newErrors.lastName = validateName(formData.lastName, 'Last Name')
    newErrors.email = validateEmail(formData.email)
    newErrors.phone = validatePhone(formData.phone)
    newErrors.message = validateMessage(formData.message)
    newErrors.address = validateAddress(formData.address)
    
    return newErrors
  }

  // Handle field blur
  const handleBlur = (fieldName, value) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    
    let error = ''
    switch (fieldName) {
      case 'firstName':
        error = validateName(value, 'First Name')
        break
      case 'lastName':
        error = validateName(value, 'Last Name')
        break
      case 'email':
        error = validateEmail(value)
        break
      case 'phone':
        error = validatePhone(value)
        break
      case 'message':
        error = validateMessage(value)
        break
      case 'address':
        error = validateAddress(value)
        break
      default:
        break
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: error }))
  }

  // Handle field change (real-time validation after touch)
  const handleChange = (fieldName, value) => {
    if (touched[fieldName]) {
      handleBlur(fieldName, value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!captchaValue) {
      toast.error('Please complete the reCAPTCHA')
      return
    }

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    
    // Validate all fields
    const validationErrors = validateForm(data)
    const hasErrors = Object.values(validationErrors).some(error => error !== '')
    
    if (hasErrors) {
      setErrors(validationErrors)
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        message: true,
        address: true
      })
      toast.error('Please fix the errors in the form before submitting.')
      return
    }

    setLoading(true)

    try {
      // Add reCAPTCHA token to the form data
      const formDataWithCaptcha = {
        ...data,
        'g-recaptcha-response': captchaValue
      }

      // Send the form data with reCAPTCHA token to the server
      const result = await addInquiry(formDataWithCaptcha).unwrap()
      
      // Show success message
      toast.success('Thank you! Your inquiry has been submitted successfully.')
      
      // Navigate to thank you page
      navigate('/thank-you')

      // Reset the form
      e.target.reset()
      // Clear the CAPTCHA state
      setCaptchaValue(null)
      // Clear errors and touched state
      setErrors({})
      setTouched({})

      // Reset the reCAPTCHA widget
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error.data?.message || error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onCaptchaChange = (value) => {
    setCaptchaValue(value)
  }

  return (
    <div className="bg-blue-50 p-6 rounded-lg">
      <h2 className="text-xl text-primary font-semibold mb-4">
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
            <Input 
              required 
              name="firstName"
              onBlur={(e) => handleBlur('firstName', e.target.value)}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={touched.firstName && errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {touched.firstName && errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name<span className="text-red-500">*</span>
            </label>
            <Input 
              required 
              name="lastName"
              onBlur={(e) => handleBlur('lastName', e.target.value)}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={touched.lastName && errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {touched.lastName && errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mt-3 font-medium mb-1">
            Address
          </label>
          <Textarea 
            name="address" 
            rows={3}
            onBlur={(e) => handleBlur('address', e.target.value)}
            onChange={(e) => handleChange('address', e.target.value)}
            className={touched.address && errors.address ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {touched.address && errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mt-3 font-medium mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <Input 
              required 
              name="email" 
              type="email"
              onBlur={(e) => handleBlur('email', e.target.value)}
              onChange={(e) => handleChange('email', e.target.value)}
              className={touched.email && errors.email ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mt-3 font-medium mb-1">
              Phone
            </label>
            <Input
              name="phone"
              type="tel"
              maxLength={10}
              onBlur={(e) => handleBlur('phone', e.target.value)}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={touched.phone && errors.phone ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {touched.phone && errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm mt-3 font-medium mb-1">
            Your Message<span className="text-red-500">*</span>
          </label>
          <Textarea 
            required 
            name="message" 
            rows={4}
            maxLength={500}
            onBlur={(e) => handleBlur('message', e.target.value)}
            onChange={(e) => handleChange('message', e.target.value)}
            className={touched.message && errors.message ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {touched.message && errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {document.querySelector('[name="message"]')?.value?.length || 0}/500 characters
          </p>
        </div>

        <div className="w-full mb-3">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_SITE_KEY}
            onChange={onCaptchaChange}
          />
        </div>

        <div className="flex gap-4 pb-10">
          <Button
            type="submit"
            className="w-1/4 mt-3 bg-primary hover:bg-[#ee451b]"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  )
}