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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openThankYouModal, setOpenThankYouModal] = useState(false);
  const [createInquiry] = useCreateInquiryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setErrorMessage('Please complete the reCAPTCHA.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const inquiryData = {
        name,
        email,
        phone,
        subject,
        message,
        productName,
        captchaToken: captchaValue,
      };

      await createInquiry(inquiryData).unwrap();
      setOpenThankYouModal(true);
      setIsSubmitting(false);

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setCaptchaValue(null);
      onClose();
    } catch (error) {
      setErrorMessage(error.data?.message || 'Failed to submit inquiry. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 top-[16%] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-md shadow-2xl w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">{`Inquiry for ${productName}`}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Phone No</label>
              <input
                type="text"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg transition duration-200 h-24"
              required
            />
          </div>

          <div className="flex flex-col  space-y-4">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_SITE_KEY}
              onChange={(value) => setCaptchaValue(value)}
              className="w-full max-w-xs"
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 w-1/3 md:w-1/4 text-white px-4 py-2 rounded-md transition duration-200"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-1/3 md:w-1/4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!captchaValue || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Thank You Dialog */}
      <Dialog open={openThankYouModal} onOpenChange={setOpenThankYouModal}>
        <DialogContent className="bg-white max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-green-700 text-xl font-bold">Thank You!</DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-gray-700">
              <X size={20} />
            </DialogClose>
          </DialogHeader>
          <div className="text-gray-800 mt-2">
            <p className="mb-2">Your message has been successfully sent.</p>
            <p>We will get back to you soon.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InquiryForm;