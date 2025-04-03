import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const SupplierForm = ({ onClose, fetchChemicals, chemicalId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    website: '',
    contact_person: '',
    address: '',
    country: '',
    city: '',
    description: '',
    image: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'image') {
          if (formData[key]) {
            formDataToSend.append('image', formData[key]);
          }
        } else if (formData[key] !== null) {
          formDataToSend.append(key, formData[key])
        }
      })
      
      // Append chemicalId separately
      formDataToSend.append('chemicalId', chemicalId)

      const response = await axios.post('/api/supplier/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        await Swal.fire({
          title: 'Success!',
          text: 'Supplier added successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        
        await fetchChemicals()
        onClose()
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to add supplier',
        icon: 'error'
      })
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    })
  }

  const handleCountryChange = (value) => {
    setFormData({
      ...formData,
      country: value
    })
  }

  return (
    <div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input 
            placeholder="Name" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input 
            placeholder="Email" 
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input 
            placeholder="Mobile" 
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          <Input 
            placeholder="Website" 
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
          <Input 
            placeholder="Contact Person" 
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
          />
          <Input 
            placeholder="City" 
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <Select 
            onValueChange={handleCountryChange}
            value={formData.country}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pk">Pakistan</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
          <Textarea 
            placeholder="Address" 
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Textarea 
            placeholder="Description" 
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Input 
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
          <Button type="submit" className="bg-[#3b1f91] hover:bg-purple-700">
            Save Supplier
          </Button>
        </form>
      </DialogContent>
    </div>
  )
}

export default SupplierForm
