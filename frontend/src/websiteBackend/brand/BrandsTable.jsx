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
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrandsList = () => {
  const [formData, setFormData] = useState({ name: '', slug: '', photo: null });
  const [preview, setPreview] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await axios.get('/api/brand');
      setBrands(res.data.data || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'photo') {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    } else if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/^-+|-+$/g, ''); // Trim leading or trailing hyphens
      setFormData({ ...formData, name: value, slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'photo') {
      const file = e.target.files[0];
      setEditingBrand({ ...editingBrand, photo: file });
      setPreview(URL.createObjectURL(file));
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
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('photo', formData.photo);
      await axios.post('/api/brand/addBrand', data);
      setFormData({ name: '', slug: '', photo: null });
      setPreview(null);
      fetchBrands();
    } catch (err) {
      console.error('Error adding brand:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/brand/${id}`);
      alert('Deleted successfully');
      fetchBrands();
    } catch (err) {
      console.error('Error deleting brand:', err);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const res = await axios.get(`/api/brand/${id}`);
      const brand = res.data.data;
      setEditingBrand({ ...brand, photo: null }); // prepare to allow new upload
      setPreview(`/api/logo/download/${brand.photo}`);
      setIsEditing(true);
    } catch (err) {
      console.error('Error fetching brand for edit:', err);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
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
      fetchBrands();
    } catch (err) {
      console.error('Error updating brand:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="text-sm mb-4">
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
                  <Label htmlFor="name">Brand Name</Label>
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
                  <Label htmlFor="slug">Brand Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="Enter brand slug"
                    value={formData.slug}
                    onChange={handleChange} // Allows manual editing of the slug
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="photo">Brand Photo</Label>
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    required
                  />
                  {preview && !isEditing && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 h-24 w-24 object-cover rounded-lg border"
                    />
                  )}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-1/4">
                {loading ? 'Submitting...' : 'Add Brand'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="p-6 rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">All Brands</h2>
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
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>{brand.slug}</TableCell>
                    <TableCell>
                      {brand.photo ? (
                        <img
                          src={`/api/logo/download/${brand.photo}`}
                          alt={brand.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        'No Image'
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(brand._id)}
                      >
                        <Pencil className="h-5 w-5 text-black" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(brand._id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Edit Brand</h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Brand Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingBrand.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-slug">Brand Slug</Label>
                  <Input
                    id="edit-slug"
                    name="slug"
                    value={editingBrand.slug}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-photo">Brand Photo</Label>
                  <Input
                    id="edit-photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setEditingBrand({ ...editingBrand, photo: file });
                      setPreview(URL.createObjectURL(file));
                    }}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 h-24 w-24 object-cover rounded-lg border"
                    />
                  )}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Updating...' : 'Update Brand'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BrandsList;