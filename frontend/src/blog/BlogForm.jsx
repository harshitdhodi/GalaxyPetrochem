'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateBlogMutation, useGetBlogByIdQuery, useUpdateBlogMutation } from '@/slice/blog/blog';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useGetAllCategoriesQuery } from '@/slice/blog/blogCategory';
import { ChevronRight } from 'lucide-react';
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    details: '',
    image: [],
    alt: [],
    imageTitle: [],
    slug: '',
    postedBy: '',
    visits: 0,
    metatitle: '',
    metadescription: '',
    metakeywords: '',
    metacanonical: '',
    metalanguage: '',
    metaschema: '',
    otherMeta: '',
    url: '',
    priority: 0,
    changeFreq: '',
    lastmod: new Date(),
    status: '',
    category: '',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const { data: blog, isLoading: isFetching, error: fetchError } = useGetBlogByIdQuery(id, {
    skip: !id,
  });
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const { data: categories } = useGetAllCategoriesQuery();

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear error for the field being changed
    setFormErrors(prev => ({ ...prev, [name]: '' }));

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      if (name === 'title') {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleDetailsChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      details: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      image: files,
    }));

    // Create image previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.details.trim()) errors.details = 'Details are required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image') {
        value.forEach((file) => {
          formDataToSubmit.append('image', file);
        });
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          formDataToSubmit.append(key, item);
        });
      } else {
        formDataToSubmit.append(key, value.toString());
      }
    });

    if (id) {
      formDataToSubmit.append('id', id);
    }

    try {
      if (id) {
        await updateBlog({ id, formData: formDataToSubmit }).unwrap();
        console.log('Blog updated successfully');
      } else {
        await createBlog(formDataToSubmit).unwrap();
        console.log('Blog created successfully');
      }
      navigate('/blog-table');
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  };

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        date: blog.date || '',
        details: blog.details || '',
        image: [],
        alt: blog.alt || [],
        imageTitle: blog.imageTitle || [],
        slug: blog.slug || '',
        postedBy: blog.postedBy || '',
        visits: blog.visits || 0,
        metatitle: blog.metatitle || '',
        metadescription: blog.metadescription || '',
        metakeywords: blog.metakeywords || '',
        metacanonical: blog.metacanonical || '',
        metalanguage: blog.metalanguage || '',
        metaschema: blog.metaschema || '',
        otherMeta: blog.otherMeta || '',
        url: blog.url || '',
        priority: blog.priority || 0,
        changeFreq: blog.changeFreq || '',
        lastmod: blog.lastmod || new Date(),
        status: blog.status || '',
        category: blog.category?._id || '',
        createdAt: blog.createdAt || new Date(),
        updatedAt: blog.updatedAt || new Date()
      });

      // Set image previews for existing images
      if (blog.image && Array.isArray(blog.image)) {
        setImagePreviews(blog.image.map((img) => `/api/image/download/${img}`));
      }
    }
  }, [blog]);

  useEffect(() => {
    // Cleanup function to revoke object URLs
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  if (id && isFetching) return <div>Loading...</div>;
  if (fetchError) return <div>Error: {fetchError.message || 'An error occurred'}</div>;

  return (
    <>
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span
          onClick={() => navigate('/dashboard')}
          className="cursor-pointer hover:text-primary"
        >
          Dashboard
        </span>
        <ChevronRight className="h-4 w-4" />
        <span
          onClick={() => navigate('/blog-table')}
          className="cursor-pointer hover:text-primary"
        >
          Blogs
        </span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-muted-foreground">
          {id ? 'Edit Blog' : 'Create Blog'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Blog Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              category: e.target.value
            }))}
            className={`w-full rounded-md border ${formErrors.category ? "border-red-500" : "border-gray-300"
              } p-2`}
            required
          >
            <option value="">Select a category</option>
            {categories?.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.category}
              </option>
            ))}
          </select>
          {formErrors.category && (
            <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            required
            className={formErrors.title ? 'border-red-500' : ''}
          />
          {formErrors.title && (
            <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Details</label>
          <ReactQuill
            modules={modules}
            theme="snow"
            value={formData.details}
            onChange={handleDetailsChange} 
            placeholder="Enter blog details"
          /> 
        </div>

        <div>
          <label className="block text-sm font-medium">Images</label>
          <Input type="file" multiple onChange={handleFileChange} />
          <div className="mt-2 flex flex-wrap gap-2">
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-16 w-16 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div key="slug">
          <label className="block text-sm font-medium">Slug</label>
          <Input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Slug will be generated automatically"
            readOnly
          />
        </div>

        {['alt', 'imageTitle', 'postedBy', 'metatitle', 'metadescription', 'metakeywords', 'metacanonical', 'metalanguage', 'metaschema', 'otherMeta', 'priority', 'status'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <Input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/blogs')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {id ? 'Update Blog' : 'Create Blog'}
          </Button>
        </div>
      </form>
    </>
  );
}

