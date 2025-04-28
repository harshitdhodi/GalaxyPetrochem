import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {  Link, useLocation } from "react-router-dom";
import { useGetBannerByPageSlugQuery } from "@/slice/banner/banner";
import { Banner } from "../componets/Banner";
import axios from 'axios';
import career from '../images/career.jpg';
import ReCAPTCHA from "react-google-recaptcha";

export default function CareerForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    contactNo: '',
    postAppliedFor: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '') || 'career';
  const { data: banners, isLoading: isBannerLoading } = useGetBannerByPageSlugQuery(path);
  const [careerInfo, setCareerInfo] = useState(null);

  // Create refs for form and reCAPTCHA
  const formRef = useRef(null);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    axios.get('/api/careerInfo')
      .then(response => {
        if (response.data.length > 0) {
          setCareerInfo(response.data[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching career info:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only PDF, DOC, or DOCX files');
        e.target.value = null;
        return;
      }
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        e.target.value = null;
        return;
      }
      setResumeFile(file);
    }
  };

  const resetForm = () => {
    // Reset state
    setFormData({
      name: '',
      address: '',
      email: '',
      contactNo: '',
      postAppliedFor: '',
    });
    setResumeFile(null);

    // Reset the actual form element
    if (formRef.current) {
      formRef.current.reset();
    }

    // Reset reCAPTCHA
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setCaptchaValue(null);
  };

  const handleReset = (e) => {
    e.preventDefault();
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      alert('Please complete the reCAPTCHA');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setIsUploading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (resumeFile) {
        formDataToSend.append('resumeFile', resumeFile);
      }

      // Directly send data using axios
      const response = await axios.post('/api/career/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      resetForm();
      if (response.status === 201) {
        alert('Application submitted successfully!');
        resetForm(); // Use the new resetForm function
      } else {
        // alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      alert('Failed to submit application: ' + error.response?.data?.message || error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {isBannerLoading ? (
        <div>Loading banner...</div>
      ) : (
        <Banner
          imageUrl={banners && banners.length > 0 ? `/api/image/download/${banners[0].image}` : career}
        />
      )}
      <div className="sm:max-w-[75rem] w-full mx-auto">
        <nav className="py-4 px-4 sm:px-0 md:px-6">
          <div className="flex border-b border-gray-300 pb-4 items-center space-x-2 text-sm">
            <Link to="/" className="text-primary hover:text-gray-900">Home</Link>
            <span className="text-primary">»</span>
            <span className="text-main">Careers</span>
          </div>
        </nav>
        <div className="mb-7 px-4 md:px-6 sm:px-0">
          <h1 className="text-3xl font-bold">Careers</h1>
          <div className="bg-primary h-1 w-12"></div>
        </div>
        {careerInfo && (
          <>
            <div className="mb-4">
              <div dangerouslySetInnerHTML={{ __html: careerInfo.info }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden w-full gap-7 px-4 md:px-6 sm:px-0">
              <form ref={formRef} className="space-y-6 w-full" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name*</Label>
                  <Input
                    id="name"
                    required
                    className="rounded-none"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address*</Label>
                  <Textarea
                    id="address"
                    required
                    className="rounded-none"
                    value={formData.address}
                    onChange={handleInputChange}
                    maxLength={500}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="rounded-none"
                    value={formData.email}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNo">Contact No*</Label>
                  <Input
                    id="contactNo"
                    type="tel"
                    required
                    className="rounded-none"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    maxLength={20}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Upload Your Resume*</Label>
                  <div className="text-sm text-gray-500">[doc, docx, or pdf, max 5MB]</div>
                  <Input
                    id="resume"
                    type="file"
                    accept=".doc,.docx,.pdf"
                    required
                    className="rounded-none"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postAppliedFor">Post Applied For*</Label>
                  <Input
                    id="postAppliedFor"
                    required
                    className="rounded-none"
                    value={formData.postAppliedFor}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2   ">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_SITE_KEY}
                    onChange={(value) => setCaptchaValue(value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    className="bg-main rounded-sm text-lg py-3 hover:bg-main_light"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Submitting...' : 'Submit'}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="bg-primary hover:bg-secondary text-lg py-3 rounded-sm"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </form>

              <div className="flex flex-col items-center justify-start w-full">
                <div className="w-full flex justify-center items-center">
                  <img
                    src={careerInfo.image ? `/api/image/download/${careerInfo.image}` : "no-image"}
                    alt="Career growth illustration"
                    className="object-contain w-full max-h-80"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}