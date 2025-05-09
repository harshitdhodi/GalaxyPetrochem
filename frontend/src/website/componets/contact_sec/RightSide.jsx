'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-toastify'
import { useAddInquiryMutation } from '@/slice/inquiry/inquiry'
import Swal from 'sweetalert2'
import ReCAPTCHA from 'react-google-recaptcha'

export default function RightSection() {
  const [loading, setLoading] = useState(false)
  const [captchaValue, setCaptchaValue] = useState(null)
  const [addInquiry] = useAddInquiryMutation()
  const recaptchaRef = useRef(null) // Reference to the ReCAPTCHA component

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!captchaValue) {
      toast.error('Please complete the reCAPTCHA')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData(e.target)
      const data = Object.fromEntries(formData.entries())

      const result = await addInquiry(data).unwrap()

      Swal.fire({
        title: 'Success!',
        text: 'Your message has been sent successfully',
        icon: 'success',
        confirmButtonColor: '#2c4899',
        timer: 3000,
        timerProgressBar: true
      })

      // Reset the form
      e.target.reset()
      // Clear the CAPTCHA state
      setCaptchaValue(null)

      // Reset the reCAPTCHA widget
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Something went wrong')
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
            <Input required name="firstName" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name<span className="text-red-500">*</span>
            </label>
            <Input required name="lastName" />
          </div>
        </div>

        <div>
          <label className="block text-sm mt-3 font-medium mb-1">
            Address
          </label>
          <Textarea name="address" rows={3} />
        </div>

        <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mt-3 font-medium mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <Input required name="email" type="email" />
          </div>
          <div>
            <label className="block text-sm mt-3 font-medium mb-1">
              Phone
            </label>
            <Input
              name="phone"
              type="tel"
              maxLength={10}
              pattern="\d{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>
        </div>

        <div className="mb-3 ">
          <label className="block text-sm mt-3 font-medium mb-1">
            Your Message<span className="text-red-500">*</span>
          </label>
          <Textarea required name="message" rows={4} />
        </div>

        <div className="w-full  mb-3">
          <ReCAPTCHA
            ref={recaptchaRef} // Attach the ref to the ReCAPTCHA component
            sitekey={import.meta.env.VITE_SITE_KEY}
            onChange={onCaptchaChange} // Use a named function for clarity
          />
        </div>

        <div className="flex gap-4 pb-10 ">
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