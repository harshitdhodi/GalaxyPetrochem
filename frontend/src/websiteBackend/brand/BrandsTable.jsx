import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Pencil, Trash2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BrandsList = () => {
  const [formData, setFormData] = useState({ name: '', slug: '', photo: null });
  const [preview, setPreview] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fileValidation, setFileValidation] = useState({ isValid: null, message: '' });
  const [editFileValidation, setEditFileValidation] = useState({ isValid: null, message: '' });

  // Constants for file validation
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  const fetchBrands = async () => {
    try {
      const res = await axios.get('/api/brand');
      setBrands(res.data.data || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
      toast.error("Failed to fetch brands");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  /**
   * Validates uploaded image file
   * @param {File} file - The file to validate
   * @returns {Object} - Validation result with isValid and message
   */
  const validateImageFile = (file) => {
    if (!file) {
      return { isValid: false, message: 'No file selected' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      return {
        isValid: false,
        message: `File too large! Maximum size is 1 MB. Your file is ${fileSizeMB} MB`
      };
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        message: `Invalid file type. Allowed formats: JPG, PNG, GIF, WEBP`
      };
    }

    // Check file extension (additional layer of validation)
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return {
        isValid: false,
        message: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
      };
    }

    return {
      isValid: true,
      message: 'File is valid and ready to upload'
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'photo') {
      const file = e.target.files?.[0];
      
      if (!file) {
        setFileValidation({ isValid: null, message: '' });
        setFormData({ ...formData, photo: null });
        setPreview(null);
        return;
      }

      const validation = validateImageFile(file);
      setFileValidation(validation);

      if (!validation.isValid) {
        toast.error(validation.message);
        e.target.value = ''; // Clear the invalid file from input
        setFormData({ ...formData, photo: null });
        setPreview(null);
        return;
      }

      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
      toast.success(validation.message);
    } else if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData({ ...formData, name: value, slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'photo') {
      const file = e.target.files?.[0];
      
      if (!file) {
        setEditFileValidation({ isValid: null, message: '' });
        setEditingBrand({ ...editingBrand, photo: null });
        return;
      }

      const validation = validateImageFile(file);
      setEditFileValidation(validation);

      if (!validation.isValid) {
        toast.error(validation.message);
        e.target.value = ''; // Clear the invalid file from input
        return;
      }

      setEditingBrand({ ...editingBrand, photo: file });
      setPreview(URL.createObjectURL(file));
      toast.success(validation.message);
    } else if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setEditingBrand({ ...editingBrand, name: value, slug });
    } else {
      setEditingBrand({ ...editingBrand, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation check before submission
    if (!formData.photo) {
      toast.error("Please select a brand photo");
      return;
    }

    const validation = validateImageFile(formData.photo);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('photo', formData.photo);

      await axios.post('/api/brand/addBrand', data);

      setFormData({ name: '', slug: '', photo: null });
      setPreview(null);
      setFileValidation({ isValid: null, message: '' });
      fetchBrands();

      toast.success("Brand added successfully");
    } catch (err) {
      console.error('Error adding brand:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add brand';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) {
      return;
    }

    try {
      await axios.delete(`/api/brand/${id}`);
      fetchBrands();
      toast.success("Brand deleted successfully");
    } catch (err) {
      console.error('Error deleting brand:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete brand';
      toast.error(errorMessage);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const res = await axios.get(`/api/brand/${id}`);
      const brand = res.data.data;
      setEditingBrand({ ...brand, photo: null });
      setPreview(`/api/logo/download/${brand.photo}`);
      setEditFileValidation({ isValid: null, message: '' });
      setIsEditing(true);
    } catch (err) {
      console.error('Error fetching brand for edit:', err);
      toast.error("Failed to fetch brand details");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    // If a new photo is selected, validate it
    if (editingBrand.photo) {
      const validation = validateImageFile(editingBrand.photo);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', editingBrand.name);
      data.append('slug', editingBrand.slug);
      if (editingBrand.photo) {
        data.append('photo', editingBrand.photo);
      }

      await axios.put(`/api/brand/${editingBrand._id}`, data);
      setIsEditing(false);
      setEditingBrand(null);
      setPreview(null);
      setEditFileValidation({ isValid: null, message: '' });
      fetchBrands();
      toast.success("Brand updated successfully");
    } catch (err) {
      console.error('Error updating brand:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update brand';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingBrand(null);
    setPreview(null);
    setEditFileValidation({ isValid: null, message: '' });
  };

  /**
   * FileUploadHint Component - Displays upload requirements and validation status
   */
  const FileUploadHint = ({ validation, isEditMode = false }) => {
    return (
      <div className="mt-2 space-y-2">
        {/* Requirements hint */}
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
          <div>
            <p className="font-medium">Requirements:</p>
            <ul className="list-disc list-inside ml-1 mt-1">
              <li>Max size: 1 MB</li>
              <li>Formats: JPG, PNG, GIF, WEBP</li>
            </ul>
          </div>
        </div>

        {/* Validation status */}
        {validation.isValid !== null && (
          <div className={`flex items-start gap-2 text-xs p-2 rounded-md ${
            validation.isValid 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {validation.isValid ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            )}
            <p>{validation.message}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="text-sm mb-4">
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ol className="flex space-x-2">
          <li>
            <Link to="/dashboard" className="text-purple-900 hover:underline">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700">Brand</li>
        </ol>
      </nav>
      <div className="max-w-7xl mx-auto mt-10 space-y-10">

        <Card className="p-6">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Add New Brand</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Brand Name <span className='text-red-500'>*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter brand name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Brand Slug <span className='text-red-500'>*</span>  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="Enter brand slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="photo">Brand Photo <span className='text-red-500'>*</span></Label>
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept={ALLOWED_EXTENSIONS.join(',')}
                    onChange={handleChange}
                    required
                    className="cursor-pointer"
                  />
                  <FileUploadHint validation={fileValidation} />
                  {preview && !isEditing && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !fileValidation.isValid} 
                className="w-full md:w-1/4"
              >
                {loading ? 'Submitting...' : 'Add Brand'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="p-6 rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">All Brands</h2>
            {brands.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No brands found. Add your first brand above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Photo</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brands.map((brand) => (
                      <TableRow key={brand._id}>
                        <TableCell className="font-medium">{brand.name}</TableCell>
                        <TableCell className="text-gray-600">{brand.slug}</TableCell>
                        <TableCell>
                          {brand.photo ? (
                            <img
                              src={`/api/logo/download/${brand.photo}`}
                              alt={brand.name}
                              className="h-12 w-12 object-cover rounded border"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">No Image</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(brand._id)}
                            title="Edit brand"
                          >
                            <Pencil className="h-5 w-5 text-black" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(brand._id)}
                            title="Delete brand"
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {isEditing && editingBrand && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={handleCancelEdit}
                className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Edit Brand</h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Brand Name <span className='text-red-500'>*</span> </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingBrand.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-slug">Brand Slug <span className='text-red-500'>*</span> </Label>
                  <Input
                    id="edit-slug"
                    name="slug"
                    value={editingBrand.slug}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-photo">
                    Brand Photo <span className='text-red-500'>*</span>
                    <span className="text-xs text-gray-500 ml-2">(Optional - leave empty to keep current)</span>
                  </Label>
                  <Input
                    id="edit-photo"
                    name="photo"
                    type="file"
                    accept={ALLOWED_EXTENSIONS.join(',')}
                    onChange={handleEditChange}
                    className="cursor-pointer"
                  />
                  <FileUploadHint validation={editFileValidation} isEditMode={true} />
                  {preview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {editingBrand.photo ? 'New Preview:' : 'Current Photo:'}
                      </p>
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    type="submit" 
                    disabled={loading || (editFileValidation.isValid === false)} 
                    className="flex-1"
                  >
                    {loading ? 'Updating...' : 'Update Brand'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BrandsList;