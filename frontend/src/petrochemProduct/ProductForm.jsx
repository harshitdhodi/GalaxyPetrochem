"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BasicInformation from "./product-form/BasicInformation.jsx";
import CategoryInformation from "./product-form/CategoryInformation.jsx";
import ProductDetails from "./product-form/ProductDetails.jsx";
import MediaFiles from "./product-form/MediaFiles.jsx";
import SeoInformation from "./product-form/SeoInformation.jsx";
import FormActions from "./product-form/FormActions.jsx";
import MessageAlert from "./common/MessageAlert.jsx";
import { useGetAllChemicalCategoriesQuery } from "@/slice/chemicalSlice/chemicalCategory.js";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editProduct, setEditProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetAllChemicalCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  const categories = useMemo(() => categoryData || [], [categoryData]);

  const [productState, setProductState] = useState({
    categorySlug: "",
    subCategorySlug: "",
    slug: "",
    name: "",
    tagline: "",
    specifiction: "",
    details: "",
    tableInfo: "",
    images: [],
    pdf: "",
    msds: "",
    brandId: "",
    categoryId: "",
    subCategoryId: "",
    metaTitle: "",
    metaDescription: "",
    metaKeyword: "",
    metaSchema: "",
  });

  const product = useMemo(() => productState, [productState]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brand");
        const data = await res.json();
        setBrands(data.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchProductById = async (productId) => {
      try {
        const res = await fetch(`/api/petrochemProduct/${productId}`);
        const data = await res.json();
        if (res.ok) {
          setEditProduct(data.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchBrands();
    if (id) fetchProductById(id);
  }, [id]);

  useEffect(() => {
    if (editProduct) {
      const mappedImages = editProduct.images?.map((img) => ({
        url: img.url,
        altText: img.altText || "",
        title: img.title || "",
        _id: img._id,
      })) || [];
  
      // Extract IDs from objects if needed
      const productData = {
        ...editProduct,
        images: mappedImages,
        // Convert object references to IDs if they are objects
        brandId: typeof editProduct.brandId === 'object' ? editProduct.brandId._id : editProduct.brandId,
        categoryId: typeof editProduct.categoryId === 'object' ? editProduct.categoryId._id : editProduct.categoryId,
        subCategoryId: typeof editProduct.subCategoryId === 'object' ? editProduct.subCategoryId._id : editProduct.subCategoryId,
      };
  
      setProductState(productData);
      
      // Fetch subcategories if categoryId exists
      if (productData.categoryId) {
        fetchSubCategories(productData.categoryId);
      }
    }
  }, [editProduct]);

  const fetchSubCategories = async (categoryId) => {
    try {
      const res = await fetch(`/api/subcategories?categoryId=${categoryId}`);
      const data = await res.json();
      setSubCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setProductState((prev) => {
        if (prev[name] === value) return prev;
        return { ...prev, [name]: value };
      });

      if (name === "categoryId") {
        fetchSubCategories(value);
      }
    },
    []
  );

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setProductState((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setProductState((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleImageChange = (images, isUpdate = false) => {
    if (isUpdate) {
      setProductState((prev) => ({
        ...prev,
        images,
      }));
    } else {
      const newImages = images.map((img) => ({
        file: img.file,
        url: URL.createObjectURL(img.file),
        altText: img.altText || "",
        title: img.title || "",
      }));
      setProductState((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();

      Object.keys(product).forEach((key) => {
        if (key !== "images" && key !== "pdf" && key !== "msds") {
          formData.append(key, product[key]);
        }
      });

      if (product.images && product.images.length) {
        let imageCount = 0;
        product.images.forEach((image) => {
          if (image.file) {
            formData.append("images", image.file);
            formData.append(`altText${imageCount}`, image.altText || "");
            formData.append(`title${imageCount}`, image.title || "");
            imageCount++;
          }
        });
        formData.append("imageCount", imageCount.toString());

        const existingImages = product.images
          .filter((img) => !img.file && img.url)
          .map((img) => ({
            url: img.url,
            altText: img.altText || "",
            title: img.title || "",
            _id: img._id || "",
          }));

        if (existingImages.length > 0) {
          formData.append("existingImages", JSON.stringify(existingImages));
        }
      }

      if (product.pdf instanceof File) formData.append("pdf", product.pdf);
      if (product.msds instanceof File) formData.append("msds", product.msds);

      const url = id
        ? `/api/petrochemProduct/${id}`
        : "/api/petrochemProduct/addProduct";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: id ? "Product updated successfully!" : "Product created successfully!",
        });

        if (!id) {
          setProductState({
            categorySlug: "",
            subCategorySlug: "",
            slug: "",
            name: "",
            tagline: "",
            specifiction: "",
            details: "",
            tableInfo: "",
            images: [],
            pdf: "",
            msds: "",
            brandId: "",
            categoryId: "",
            subCategoryId: "",
            metaTitle: "",
            metaDescription: "",
            metaKeyword: "",
            metaSchema: "",
          });
        }

        setTimeout(() => {
          navigate("/products");
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.message || "An error occurred" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({ type: "error", text: "An error occurred while saving the product" });
    } finally {
      setLoading(false);
    }
  };

  if (categoryLoading) {
    return <div>Loading categories...</div>;
  }

  if (categoryError) {
    return <div className="text-red-500">Error loading categories: {categoryError.message}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{id ? "Edit Product" : "Add New Product"}</h2>

      {message.text && <MessageAlert message={message} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryInformation
            product={product}
            categories={categories}
            subCategories={subCategories}
            handleChange={handleChange}
          />
          <BasicInformation
            product={product}
            brands={brands}
            handleChange={handleChange}
            handleNameChange={handleNameChange}
          />
        </div>

        <ProductDetails product={product} handleChange={handleChange} />

        <MediaFiles
          product={product}
          handleImageChange={handleImageChange}
          handleFileChange={handleFileChange}
        />

        <SeoInformation product={product} handleChange={handleChange} />

        <FormActions navigate={navigate} loading={loading} isEdit={!!id} />
      </form>
    </div>
  );
};

export default ProductForm;
