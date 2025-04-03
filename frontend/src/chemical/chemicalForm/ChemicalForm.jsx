'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'

import { Textarea } from '@/components/ui/textarea'
import { ImageUploadForm } from './ImageUpload'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  category: z.string().min(1, { message: 'Category is required' }),
  categorySlug: z.string().optional(),
  sub_category: z.string().optional(),
  subCategorySlug: z.string().optional(),
  subsub_category_id: z.string().optional(),
  subSubCategorySlug: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  slug: z.string().optional(),
  image: z.array(z.instanceof(File)).optional(),
  unit: z.string().min(1, { message: 'Unit is required' }),
  chemical_type: z.string().min(1, { message: 'Chemical type is required' }),
  cas_number: z.string().optional(),
  h_bond_acceptor: z.string().optional(),
  h_bond_donor: z.string().optional(),
  iupac: z.string().optional(),
  inchikey: z.string().optional(),
  molecular_weight: z.number().optional(),
  molecular_formula: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  chemical_industries: z.array(z.string()).optional(),
  product_code: z.string().optional(),

  packing: z.string().optional(),
  grade: z.string().optional(),
  hs_code: z.string().optional(),
  metatitle: z.string().optional(),
  metadescription: z.string().optional(),
  metakeywords: z.string().optional(),
  metacanonical: z.string().optional(),
  metalanguage: z.string().optional(),
  metaschema: z.string().optional(),
  otherMeta: z.string().optional(),
  global_tagline: z.string().optional(),
}).refine(data => {
  // Optional: Add additional custom validations if needed
  return true;
}, {
  message: "Validation failed"
});

export function ChemicalForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [subSubCategories, setSubSubCategories] = useState([])

  // Add state for selected values
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('')

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/chemicalCategory/getall', { withCredentials: true });
        // Map the categories to match the expected structure
        const mappedCategories = response.data.map(cat => ({
          _id: cat._id,
          name: cat.name || cat.category, // Handle both name and category properties
          slug: cat.slug,
          subCategories: cat.subCategories || []
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        });
      }
    };
    fetchCategories();
  }, []);

  // Initialize form with react-hook-form and zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      sub_category: '',
      subsub_category_id: '',
      name: '',
      slug: '',
      image: [],
      unit: '',
      chemical_type: '',
      cas_number: '',
      h_bond_acceptor: '',
      h_bond_donor: '',
      iupac: '',
      inchikey: '',
      molecular_weight: '',
      molecular_formula: '',
      synonyms: [],
      chemical_industries: [],
      product_code: '',

      packing: '',
      grade: '',
      hs_code: '',
      metatitle: '',
      metadescription: '',
      metakeywords: '',
      metacanonical: '',
      metalanguage: '',
      metaschema: '',
      otherMeta: '',
      global_tagline: '',
    },
  })

  // If editing existing chemical, populate form
  useEffect(() => {
    if (chemical) {
      form.reset({
        category: chemical.category?._id || '',
        sub_category: chemical.sub_category?._id || '',
        subsub_category_id: chemical.subsub_category_id?._id || '',
        categorySlug: chemical.categorySlug || '',
        subCategorySlug: chemical.subCategorySlug || '',
        subSubCategorySlug: chemical.subSubCategorySlug || '',
        name: chemical.name || '',
        // ... rest of your form fields
      });

      // Set selected categories for dropdowns
      setSelectedCategory(chemical.category?._id || '');
      setSelectedSubCategory(chemical.sub_category?._id || '');
      setSelectedSubSubCategory(chemical.subsub_category_id?._id || '');

      // Update sub-categories if category exists
      if (chemical.category?._id) {
        const selectedCat = categories.find(cat => cat._id === chemical.category._id);
        if (selectedCat) {
          setSubCategories(selectedCat.subCategories.map(subCat => ({
            _id: subCat._id,
            name: subCat.name || subCat.category,
            slug: subCat.slug,
            subSubCategory: subCat.subSubCategory || []
          })));
        }
      }

      // Update sub-sub-categories if sub-category exists
      if (chemical.sub_category?._id) {
        const selectedSubCat = subCategories.find(subCat => subCat._id === chemical.sub_category._id);
        if (selectedSubCat) {
          setSubSubCategories(selectedSubCat.subSubCategory.map(subSubCat => ({
            _id: subSubCat._id,
            name: subSubCat.name || subSubCat.category,
            slug: subSubCat.slug
          })));
        }
      }
    }
  }, [chemical, categories]);

  // Get setValue from form
  const { control, setValue } = form;

  // Enhanced submit handler with comprehensive error handling
  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Handle arrays that come as strings
      Object.keys(values).forEach(key => {
        if (key === 'images') {
          // Handle images array separately
          values.images.forEach((image, index) => {
            if (image.file) {
              formData.append('images', image.file);
              formData.append(`altText-${index}`, image.altText || '');
              formData.append(`title-${index}`, image.title || '');
            }
          });
        } else if (key === 'specs' && values[key]) {
          formData.append('specs', values[key]);
        } else if (key === 'msds' && values[key]) {
          formData.append('msds', values[key]);
        } else if (key === 'packings') {
          // Send packings as comma-separated string
          const packingsString = Array.isArray(values[key]) 
            ? values[key].join(',') 
            : values[key];
          formData.append('packings', packingsString);
        } else if (key === 'application') {
          // Send application as comma-separated string
          const applicationString = Array.isArray(values[key])
            ? values[key].join(',')
            : values[key];
          formData.append('application', applicationString);
        } else if (values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post('/api/chemical/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Add this if using cookies
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload Progress:', percentCompleted);
        },
      });

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Chemical added successfully",
          variant: "success",
        });
        form.reset();
        // Optionally redirect or update UI
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add chemical",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          console.log('Form submission attempted');
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-8"
      >
        <div className="grid grid-cols-3 gap-4">
          {/* Category Dropdown */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCategory(value);
                    // Find selected category and update sub-categories
                    const selectedCat = categories.find(cat => cat._id === value);
                    setSubCategories(selectedCat?.subCategories || []);
                    // Reset dependent fields
                    setSelectedSubCategory('');
                    setSelectedSubSubCategory('');
                    form.setValue('sub_category', '');
                    form.setValue('subsub_category_id', '');
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sub-Category Dropdown */}
          <FormField
            control={form.control}
            name="sub_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedSubCategory(value);
                    // Find selected sub-category and update sub-sub-categories
                    const selectedSubCat = subCategories.find(subCat => subCat._id === value);
                    setSubSubCategories(selectedSubCat?.subSubCategory || []);
                    // Reset dependent field
                    setSelectedSubSubCategory('');
                    form.setValue('subsub_category_id', '');
                  }}
                  value={field.value}
                  disabled={!selectedCategory}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sub category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subCategories.map((subCategory) => (
                      <SelectItem key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sub-Sub Category Dropdown */}
          <FormField
            control={form.control}
            name="subsub_category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub-sub Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedSubSubCategory(value);
                  }}
                  value={field.value}
                  disabled={!selectedSubCategory}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sub-sub category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subSubCategories.map((subSubCategory) => (
                      <SelectItem key={subSubCategory._id} value={subSubCategory._id}>
                        {subSubCategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name Input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Chemical name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug Input */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="chemical-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          {/* <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    {...field}
                    onChange={(e) => {
                      // Convert FileList to an array of files
                      const files = e.target.files ? Array.from(e.target.files) : []
                      onChange(files)
                    }}
                  />
                </FormControl>
                {value && value.length > 0 && (
                  <FormDescription>
                    {value.length} file(s) selected
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <ImageUploadForm 
            control={control} 
            setValue={setValue}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., kg, L" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chemical_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chemical Type</FormLabel>
                <FormControl>
                  <Input placeholder="Chemical type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cas_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CAS Number</FormLabel>
                <FormControl>
                  <Input placeholder="CAS number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="h_bond_acceptor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>H Bond Acceptor</FormLabel>
                <FormControl>
                  <Input placeholder="H bond acceptor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="h_bond_donor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>H Bond Donor</FormLabel>
                <FormControl>
                  <Input placeholder="H bond donor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="iupac"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IUPAC</FormLabel>
                <FormControl>
                  <Input placeholder="IUPAC name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inchikey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>InChIKey</FormLabel>
                <FormControl>
                  <Input placeholder="InChIKey" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="molecular_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Molecular Weight</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Molecular weight" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="molecular_formula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Molecular Formula</FormLabel>
                <FormControl>
                  <Input placeholder="Molecular formula" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="synonyms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Synonyms</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated synonyms" {...field} onChange={(e) => field.onChange(e.target.value.split(','))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chemical_industries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chemical Industries</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated industries" {...field} onChange={(e) => field.onChange(e.target.value.split(','))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="product_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code</FormLabel>
                <FormControl>
                  <Input placeholder="Unique product code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="packing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Packing</FormLabel>
                <FormControl>
                  <Input placeholder="Packing information" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <Input placeholder="Chemical grade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hs_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HS Code</FormLabel>
                <FormControl>
                  <Input placeholder="Harmonized System code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="metatitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input placeholder="Meta title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metadescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter meta description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metakeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Keywords</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated keywords" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metacanonical"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Canonical</FormLabel>
                <FormControl>
                  <Input placeholder="Canonical URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metalanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Language</FormLabel>
                <FormControl>
                  <Input placeholder="Language code (e.g., en-US)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaschema"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Schema</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter JSON-LD schema"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otherMeta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Meta</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter other meta information"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  )
}