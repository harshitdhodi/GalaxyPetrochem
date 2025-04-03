import React, { useEffect, useRef } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import slugify from 'slugify';
import JoditEditor from 'jodit-react';

export const ChemicalInfoForm = ({ control, setValue }) => {
  const editor = useRef(null);

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

        {/* Jodit Editor for Rich Text */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <JoditEditor
                ref={editor}
                value={field.value || ''} // Ensure controlled value
                onBlur={(newContent) => field.onChange(newContent)} // Use onBlur instead of onChange
                config={{
                  readonly: false,
                  toolbarButtonSize: 'small',
                  buttons: 'bold,italic,underline,ul,ol,table,link,image',
                  height: 300, // Optional: Set a height for better UX
                }}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChemicalInfoForm;