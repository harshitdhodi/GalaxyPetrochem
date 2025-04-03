import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Upload, X } from 'lucide-react';
import { useGetAllTemplatesQuery } from '@/slice/template/emailTemplate';
import { useSendEmailMutation } from '@/slice/smtpSlice/email';
import { useGetEmailCategoriesQuery } from '@/slice/emailCategory/emailCategory';

const formSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  template: z.string().min(1, 'Please select a template'),
  email: z.string().min(1, 'To field is required').email('Invalid email format'),
  cc_email: z.array(z.string()).optional(),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  attachment: z.any().optional(),
});

export default function EmailForm({ defaultTo = "", onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: categories, isLoading: isCategoriesLoading } = useGetEmailCategoriesQuery();
  const { data: templates, isLoading: isTemplatesLoading } = useGetAllTemplatesQuery();
  const [sendEmail, { isLoading: isSending }] = useSendEmailMutation();
  const [attachment, setAttachment] = useState(null);
  const [ccEmails, setCcEmails] = useState([]); // Array to store CC emails
  const [filteredTemplates, setFilteredTemplates] = useState([]);
console.log(templates.data)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const selectedCategory = watch('category');
  const selectedTemplate = watch('template');
  const body = watch('body');

  // Update subject and body when template changes
  useEffect(() => {
    if (selectedTemplate && templates?.data) {
      const template = templates.data.find((t) => t._id === selectedTemplate);
      if (template) {
        setValue('subject', template.subject);
        setValue('body', template.body);
      }
    }
  }, [selectedTemplate, templates, setValue]);

  // Update the form when defaultTo changes
  useEffect(() => {
    if (defaultTo) {
      setValue('email', defaultTo);
    }
  }, [defaultTo, setValue]);

  // Handle file changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
  };

  // Remove an attachment
  const removeAttachment = () => {
    setAttachment(null);
  };

  // Add a new email to CC list
  const addCcEmail = (email) => {
    if (email && !ccEmails.includes(email)) {
      setCcEmails((prev) => [...prev, email]);
    }
  };

  // Remove an email from CC list
  const removeCcEmail = (index) => {
    setCcEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('cc_email', ccEmails);
    formData.append('subject', data.subject);
    formData.append('body', data.body);

    if (attachment) {
      formData.append('attachment', attachment);
    }

    setIsSubmitting(true);
    try {
      await sendEmail(formData).unwrap();
      alert('Email sent successfully!');
      reset();
      setAttachment(null);
      setCcEmails([]);
      onSuccess?.(); // Call the success callback if provided
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update filtered templates when category changes
  useEffect(() => {
    if (selectedCategory && templates?.data) {
      const filtered = templates.data.filter(
        (template) => template.category?.emailCategory === selectedCategory
      );
      setFilteredTemplates(filtered);
      setValue('template', '');
    }
  }, [selectedCategory, templates, setValue]);

  return (
    <Card className="w-full mx-auto max-h-[80vh] flex flex-col">
      <CardContent className="p-6 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category and Template Selection Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Select Category
              </label>
              <Select onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {isCategoriesLoading ? (
                    <SelectItem disabled>Loading categories...</SelectItem>
                  ) : categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category._id} value={category.emailCategory}>
                        {category.emailCategory}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No categories available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <label htmlFor="template" className="text-sm font-medium">
                Select Email Template
              </label>
              <Select 
                onValueChange={(value) => setValue('template', value)}
                disabled={!selectedCategory}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder={
                    selectedCategory 
                      ? "Select Email Template" 
                      : "Please select a category first"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {isTemplatesLoading ? (
                    <SelectItem disabled>Loading templates...</SelectItem>
                  ) : filteredTemplates.length === 0 ? (
                    <SelectItem disabled>No templates in this category</SelectItem>
                  ) : (
                    filteredTemplates.map((template) => (
                      <SelectItem key={template._id} value={template._id}>
                        {template.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.template && (
                <p className="text-sm text-red-500">{errors.template.message}</p>
              )}
            </div>
          </div>

          {/* Email Fields Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* To Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                To*
              </label>
              <Input
                id="email"
                type="text"
                placeholder="Recipient email"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* CC Field */}
            <div className="space-y-2">
              <label htmlFor="cc_email" className="text-sm font-medium">
                CC
              </label>
              <div className="relative">
                <Input
                  id="cc_email"
                  type="text"
                  placeholder="Enter CC email"
                  onBlur={(e) => {
                    addCcEmail(e.target.value);
                    e.target.value = ''; // Clear input after adding
                  }}
                />
                {ccEmails.length > 0 && (
                  <div className="absolute top-full mt-1 z-10 bg-white border rounded-md p-2 w-full shadow-sm">
                    {ccEmails.map((email, index) => (
                      <div key={index} className="flex items-center justify-between py-1">
                        <span className="text-sm">{email}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCcEmail(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject*
              </label>
              <Input
                id="subject"
                type="text"
                placeholder="Subject"
                {...register('subject')}
                aria-invalid={errors.subject ? 'true' : 'false'}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>
          </div>

          {/* Body Field */}
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              Body*
            </label>
            <ReactQuill
              value={body || ''}
              onChange={(content) => setValue('body', content)}
              className="bg-white"
            />
            {errors.body && <p className="text-sm text-red-500">{errors.body.message}</p>}
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <label htmlFor="file-upload" className="text-sm font-medium">
              Attachments
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop files here or click to browse
                </p>
              </label>
            </div>
            {attachment && (
              <div className="mt-2">
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span className="text-sm truncate">{attachment.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAttachment}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting || isSending}>
            {isSubmitting || isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
