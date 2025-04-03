import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { CategorySelectionForm } from "./CategorySelect";
import { ChemicalInfoForm } from "./ChemicalInfo";
import { ChemicalPropertiesForm } from "./ChemicalProperties";
import { MetaInformationForm } from "./MetaInfo";
import { Button } from "@/components/ui/button";
import ImageUploadForm from './ImageUpload';

export const ChemicalFormPage = () => {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      category: "",
      sub_category: "",
      subsub_category_id: "",
      categorySlug: "",
      subCategorySlug: "",
      subSubCategorySlug: "",
      name: "",
      slug: "",
      images: [],
      catalog: "",
      msds: "",
      specs: "",
      table:"",
      synonyms: [],
      application: [],
      chemical_industries: [],
      product_code: "",
      auto_p_code: "",
     
      metatitle: "",
      metadescription: "",
      metakeywords: "",
      metacanonical: "",
      metalanguage: "",
      metaschema: "",
      otherMeta: "",
      imagesToDelete: {}
    }
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [chemicalData, setChemicalData] = useState(null); // Store fetched data

  useEffect(() => {
    const fetchChemicalData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/chemical/getChemicalById?id=${id}`);
          const data = response.data;
          setChemicalData(data); // Store the data

          // Set category-related fields
          if (data.category) {
            setValue("category", data.category._id);
            setValue("categorySlug", data.category.slug);
          }
          if (data.sub_category) {
            setValue("sub_category", data.sub_category._id);
            setValue("subCategorySlug", data.sub_category.slug);
          }
          if (data.subsub_category_id) {
            setValue(
              "subsub_category_id",
              typeof data.subsub_category_id === "object" ? data.subsub_category_id._id : data.subsub_category_id
            );
            setValue("subSubCategorySlug", data.subsub_category_id.slug || "");
          }

          // Set other fields
          Object.entries(data).forEach(([key, value]) => {
            if (
              key !== "category" &&
              key !== "sub_category" &&
              key !== "subsub_category_id" &&
              key !== "images"
            ) {
              setValue(key, value);
            }
          });

          if (data.images && data.images.length > 0) {
            setValue("images", data.images);
          }
        } catch (error) {
          console.error("Error fetching chemical data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchChemicalData();
  }, [id, setValue]);

  const onSubmitForm = async (data) => {
    try {
      const formData = new FormData();

      // Handle images
      data.images.forEach((image, index) => {
        if (image.file instanceof File) {
          formData.append("images", image.file);
          formData.append(`altText-${index}`, image.altText || "");
          formData.append(`title-${index}`, image.title || "");
        } else if (image.url) {
          formData.append(`existingImages[${index}][url]`, image.url);
          formData.append(`existingImages[${index}][altText]`, image.altText || "");
          formData.append(`existingImages[${index}][title]`, image.title || "");
        }
      });

      // Append images to delete
      Object.keys(data.imagesToDelete).forEach((imageId) => {
        formData.append("imagesToDelete[]", imageId);
      });

      // Append other form data
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "images" &&
          key !== "imagesToDelete" &&
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (key === "molecular_weight" && value) {
            formData.append(key, Number(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      let response;
      if (id) {
        response = await axios.put(`/api/chemical/updateChemicalById?id=${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("/api/chemical/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("Form submitted successfully", response.data);
      navigate("/chemical-table");
    } catch (err) {
      console.error("Error submitting form:", err.response?.data?.message || err.message);
    }
  };

  if (isLoading) {
    return <div>Loading existing chemical data...</div>;
  }

  return (
    <>
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:text-purple-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/chemical-table" className="hover:text-purple-600">Chemicals</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{id ? "Edit Chemical" : "New Chemical"}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Category Information</h2>
            <CategorySelectionForm control={control} watch={watch} setValue={setValue} chemicalData={chemicalData} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Chemical Details</h2>
            <ChemicalInfoForm control={control} setValue={setValue} chemicalData={chemicalData} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Chemical Properties</h2>
            <ChemicalPropertiesForm control={control} chemicalData={chemicalData} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
            <ImageUploadForm control={control} setValue={setValue} chemicalData={chemicalData} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Meta Information</h2>
            <MetaInformationForm control={control} chemicalData={chemicalData} />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            className="px-8 py-3 w-1/4 text-white rounded-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {id ? "Update Chemical" : "Submit Chemical"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ChemicalFormPage;