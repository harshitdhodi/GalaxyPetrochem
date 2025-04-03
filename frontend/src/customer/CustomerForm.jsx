"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddCustomerMutation } from '@/slice/customerSlice/customerApiSlice';
import { useNavigate } from 'react-router-dom';
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb';
import { toast } from 'react-toastify';

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Customer Table", href: "/customer-table" },
  { label: "Customer Form", href: null },
];

export default function CustomerForm() {
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    mobile: '',
    website: '',
    address: '',
    country: '',
    state: '',
    city: '',
    description: '',
    image: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'email', 'mobile'];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          if (key === 'image' && formData[key]) {
            submitData.append(key, formData[key]);
          } else if (key === 'description') {
            submitData.append(key, formData[key] || '');
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      const result = await addCustomer(submitData);

      if (result.data) {
        toast({
          title: "Success",
          description: "Customer added successfully",
        });

        setFormData({
          name: '',
          contactPerson: '',
          email: '',
          mobile: '',
          website: '',
          address: '',
          country: '',
          state: '',
          city: '',
          description: '',
          image: null,
        });

        navigate('/customer-table');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to add customer",
        variant: "destructive",
      });
      console.error("Submission Error:", err);
    }
  };

  return (
    <>
      <div className="ml-1">
        <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
      </div>
      <Card className="w-full mt-4 mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-purple-700">Manage Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobile">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                className="min-h-[100px]"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            {/* Upload image */}
            <div className="space-y-2">
              <Label>Upload image</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                <div className="w-32 h-32 mx-auto mb-4">
                  <img
                    src={formData.image ? URL.createObjectURL(formData.image) : "/placeholder.svg"}
                    alt="image preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={() => document.getElementById('imageUpload').click()}
                >
                  Add image
                </Button>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[200px]"
                placeholder="Enter customer description"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  setFormData({
                    name: '',
                    contactPerson: '',
                    email: '',
                    mobile: '',
                    website: '',
                    address: '',
                    country: '',
                    state: '',
                    city: '',
                    description: '',
                    image: null,
                  })
                }
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}