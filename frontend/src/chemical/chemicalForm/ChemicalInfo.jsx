import React, { useEffect, useRef } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import slugify from 'slugify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const ChemicalInfoForm = ({ control, setValue }) => {
  const name = useWatch({
    control,
    name: 'name',
  });

  useEffect(() => {
    if (name) {
      const generatedSlug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });
      setValue('slug', generatedSlug);
    }
  }, [name, setValue]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'link', 'image',
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-none border-none">
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Input id="name" {...field} />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Input
                id="slug"
                {...field}
                onChange={(e) => {
                  const customSlug = slugify(e.target.value, {
                    lower: true,
                    strict: true,
                    trim: true,
                  });
                  field.onChange(customSlug);
                }}
              />
            )}
          />
        </div>

        {/* Quill Editor for Rich Text */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <ReactQuill
                value={field.value || ''}
                onChange={field.onChange}
                modules={modules}
                formats={formats}
                theme="snow"
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChemicalInfoForm;
