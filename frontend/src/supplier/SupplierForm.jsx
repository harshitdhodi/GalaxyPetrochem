"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { BreadcrumbWithCustomSeparator } from "@/breadCrumb/BreadCrumb"
import { useGetSuppliersQuery } from '@/slice/supplierSlice/SupplierSlice'
import Swal from 'sweetalert2'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Supplier Table", href: "/supplier-table" },
  { label: "Supplier Form", href: "/supplier-form" }, // No `href` indicates the current page
]

export default function SupplierForm() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null) // State for image preview
  const { refetch } = useGetSuppliersQuery()
  const form = useForm({
    defaultValues: {
      supplierName: "",
      contactPerson: "",
      email: "",
      website: "",
      mobileNumber: "",
      phoneNumber: "",
      address: "",
      country: "",
      city: "",
      description: "",
      image: null, // For image file input
    },
  })
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  
  // Fetch countries when component mounts
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const sortedCountries = data
          .map(country => ({
            name: country.name.common,
            code: country.cca2
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  // Fetch cities when country changes
  const handleCountryChange = async (countryName) => {
    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/city?country=${countryName}&limit=30`, {
        headers: {
          'X-Api-Key': 'YOUR_API_NINJAS_KEY'
        }
      });
      const data = await response.json();
      const cityNames = data.map(city => city.name).sort();
      setCities(cityNames);
      form.setValue('city', ''); // Reset city when country changes
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file)) // Set the preview URL
    }
  }

  async function onSubmit(values) {
    setIsSubmitting(true)
    setSubmitError(null)

    const formData = new FormData();
    // Append form data, including image files
    Object.keys(values).forEach(key => {
      if (key === 'image' && values.image) {
        formData.append('image', values.image[0]); // Assuming a single image file is selected
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      const response = await fetch('/api/supplier/add', {
        method: 'POST',
        body: formData, // Send the FormData object
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const data = await response.json()
      
      // Refetch suppliers data after successful submission
      await refetch()
      
      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'Supplier added successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      navigate("/supplier-table")
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError('Failed to submit form. Please try again.')
      
      // Show error message
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to add supplier',
        icon: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="ml-1">
        <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
      </div> 

      <Card className="max-w-8xl mt-3 mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Add Supplier</CardTitle>
        </CardHeader>
        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Supplier Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact person" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter website URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleCountryChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!form.watch('country')}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image upload input */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} onChange={handleImageChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show the image preview if available */}
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Image preview" className="w-32 h-32 object-cover rounded-lg" />
                  <Button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" className="bg-green-500 w-1/4 font-medium hover:bg-green-600 text-lg" disabled={isSubmitting}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
