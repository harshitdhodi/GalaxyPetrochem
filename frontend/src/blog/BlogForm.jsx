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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ─── Reusable required label helper ───────────────────────────────────────────
const RequiredLabel = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children} <span className="text-red-500" aria-hidden="true">*</span>
  </label>
);

const OptionalLabel = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    details: '',
    image: null,
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
    updatedAt: new Date(),
  });

  const [imagePreview, setImagePreview] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const { data: blog, isLoading: isFetching, error: fetchError } = useGetBlogByIdQuery(id, {
    skip: !id,
  });
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const { data: categories } = useGetAllCategoriesQuery();

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'title') updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleDetailsChange = (value) => {
    setFormErrors((prev) => ({ ...prev, details: '' }));
    setFormData((prev) => ({ ...prev, details: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFormErrors((prev) => ({ ...prev, image: '' }));
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image size must be 1MB or less.');
        e.target.value = null; // Clear the file input
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview('');
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ─── Validation ─────────────────────────────────────────────────────────────

  const validate = () => {
    const errors = {};
    if (!formData.title.trim())    errors.title    = 'Title is required';
    if (!formData.category)        errors.category = 'Category is required';
    if (!formData.date)            errors.date     = 'Date is required';
    if (!formData.details.trim() || formData.details === '<p><br></p>')
                                   errors.details  = 'Details are required';
    if (!id && !formData.image) {
      errors.image    = 'An image is required';
    } else if (formData.image && formData.image.size > MAX_FILE_SIZE) {
      errors.image = 'Image must be 1MB or less.';
    }
    if (!formData.postedBy.trim()) errors.postedBy = 'Posted By is required';
    if (!formData.status)          errors.status   = 'Status is required';
    return errors;
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields.', { autoClose: 4000 });
      return;
    }

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image') {
        if (value) formDataToSubmit.append('image', value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => formDataToSubmit.append(key, item));
      } else {
        formDataToSubmit.append(key, value.toString());
      }
    });

    if (id) formDataToSubmit.append('id', id);

    try {
      if (id) {
        await updateBlog({ id, formData: formDataToSubmit }).unwrap();
        toast.success('Blog updated successfully!', { autoClose: 4000 });
      } else {
        await createBlog(formDataToSubmit).unwrap();
        toast.success('Blog created successfully!', { autoClose: 4000 });
      }
      setTimeout(() => navigate('/blog-table'), 1500);
    } catch (error) {
      console.error('Error submitting blog:', error);
      
      // Handle validation errors from backend
      if (error?.data?.error?.errors) {
        const backendErrors = {};
        Object.entries(error.data.error.errors).forEach(([field, err]) => {
          backendErrors[field] = err.message;
          toast.error(`${field}: ${err.message}`, { autoClose: 5000 });
        });
        setFormErrors(backendErrors);
      } else {
        // Handle general errors
        const msg =
          error?.data?.message ||
          error?.error ||
          (id ? 'Failed to update blog.' : 'Failed to create blog.');
        toast.error(msg, { autoClose: 5000 });
      }
    }
  };

  // ─── Populate form on edit ───────────────────────────────────────────────────

  useEffect(() => {
    if (blog) {
      setFormData({
        title:           blog.title           || '',
        date:            blog.date            || '',
        details:         blog.details         || '',
        image:           null, // Always start with null for image file
        alt:             blog.alt             || [],
        imageTitle:      blog.imageTitle      || [],
        slug:            blog.slug            || '',
        postedBy:        blog.postedBy        || '',
        visits:          blog.visits          || 0,
        metatitle:       blog.metatitle       || '',
        metadescription: blog.metadescription || '',
        metakeywords:    blog.metakeywords    || '',
        metacanonical:   blog.metacanonical   || '',
        metalanguage:    blog.metalanguage    || '',
        metaschema:      blog.metaschema      || '',
        otherMeta:       blog.otherMeta       || '',
        url:             blog.url             || '',
        priority:        blog.priority        || 0,
        changeFreq:      blog.changeFreq      || '',
        lastmod:         blog.lastmod         || new Date(),
        status:          blog.status          || '',
        category:        blog.category?._id   || '',
        createdAt:       blog.createdAt       || new Date(),
        updatedAt:       blog.updatedAt       || new Date(),
      });

      const firstImage = Array.isArray(blog.image) ? blog.image[0] : blog.image;
      if (firstImage) {
        setImagePreview(`/api/image/download/${firstImage}`);
      }
    }
  }, [blog]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ─── Quill modules ──────────────────────────────────────────────────────────

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  // ─── Guards ─────────────────────────────────────────────────────────────────

  if (id && isFetching) return <div>Loading...</div>;
  if (fetchError) return <div>Error: {fetchError.message || 'An error occurred'}</div>;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
    <ToastContainer />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-primary">
          Dashboard
        </span>
        <ChevronRight className="h-4 w-4" />
        <span onClick={() => navigate('/blog-table')} className="cursor-pointer hover:text-primary">
          Blogs
        </span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-muted-foreground">{id ? 'Edit Blog' : 'Create Blog'}</span>
      </div>

      {/* Required fields note */}
      <p className="text-sm text-gray-500 mb-4">
        Fields marked with <span className="text-red-500">*</span> are required.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* Category — required */}
        <div>
          <RequiredLabel htmlFor="category">Blog Category</RequiredLabel>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => {
              setFormErrors((prev) => ({ ...prev, category: '' }));
              setFormData((prev) => ({ ...prev, category: e.target.value }));
            }}
            className={`w-full rounded-md border p-2 ${
              formErrors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category}
              </option>
            ))}
          </select>
          {formErrors.category && (
            <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
          )}
        </div>

        {/* Title — required */}
        <div>
          <RequiredLabel htmlFor="title">Title</RequiredLabel>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            className={formErrors.title ? 'border-red-500' : ''}
          />
          {formErrors.title && (
            <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
          )}
        </div>

        {/* Slug — auto-generated */}
        <div>
          <RequiredLabel htmlFor="slug">Slug</RequiredLabel>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Auto-generated from title"
          />
        </div>

        {/* Date — required */}
        <div>
          <RequiredLabel htmlFor="date">Date</RequiredLabel>
          <Input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={formErrors.date ? 'border-red-500' : ''}
          />
          {formErrors.date && (
            <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
          )}
        </div>

        {/* Details — required */}
        <div>
          <RequiredLabel htmlFor="details">Details</RequiredLabel>
          <div className={formErrors.details ? 'border border-red-500 rounded-md' : ''}>
            <ReactQuill
              id="details"
              modules={modules}
              theme="snow"
              value={formData.details}
              onChange={handleDetailsChange}
              placeholder="Enter blog details"
            />
          </div>
          {formErrors.details && (
            <p className="text-red-500 text-xs mt-1">{formErrors.details}</p>
          )}
        </div>

        {/* Image — required on create only */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Image{!id && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
          <Input
            id="image"
            type="file"
            onChange={handleFileChange}
            className={formErrors.image ? 'border-red-500' : ''}
            accept="image/*"
          />
          <p className="text-xs text-gray-500 mt-1">Image should be 1MB or less.</p>
          {formErrors.image && (
            <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>
          )}
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-16 w-16 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Posted By — required */}
        <div>
          <RequiredLabel htmlFor="postedBy">Posted By</RequiredLabel>
          <Input
            id="postedBy"
            name="postedBy"
            value={formData.postedBy}
            onChange={handleChange}
            placeholder="Enter author name"
            className={formErrors.postedBy ? 'border-red-500' : ''}
          />
          {formErrors.postedBy && (
            <p className="text-red-500 text-xs mt-1">{formErrors.postedBy}</p>
          )}
        </div>

        {/* Status — required */}
        <div>
          <RequiredLabel htmlFor="status">Status</RequiredLabel>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full rounded-md border p-2 ${
              formErrors.status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {formErrors.status && (
            <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>
          )}
        </div>

        {/* Optional fields */}
        {[
          { field: 'alt',             label: 'Alt Text'         },
          { field: 'imageTitle',      label: 'Image Title'      },
          { field: 'metatitle',       label: 'Meta Title'       },
          { field: 'metadescription', label: 'Meta Description' },
          { field: 'metakeywords',    label: 'Meta Keywords'    },
          { field: 'metacanonical',   label: 'Meta Canonical'   },
          { field: 'metalanguage',    label: 'Meta Language'    },
          { field: 'metaschema',      label: 'Meta Schema'      },
          { field: 'otherMeta',       label: 'Other Meta'       },
          { field: 'priority',        label: 'Priority'         },
        ].map(({ field, label }) => (
          <div key={field}>
            <OptionalLabel htmlFor={field}>{label}</OptionalLabel>
            <Input
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-2 text-black">
          <Button className="bg-gray-300 hover:bg-gray-600 text-black" type="button" variant="ghost" onClick={() => navigate('/blog-table')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating
              ? 'Saving...'
              : id
              ? 'Update Blog'
              : 'Create Blog'}
          </Button>
        </div>
      </form>
    </>
  );
}