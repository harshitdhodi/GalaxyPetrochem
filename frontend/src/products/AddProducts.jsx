import React, { useState, useEffect } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import { Link, useNavigate } from "react-router-dom";

const ProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    categorySlug: "", // Category slug
    name: "",
    slug: "", // Auto-generated slug for the product
    price: "",
    images: [],
    imageMetadata: [],
    details: "",
    table: "", // New table field using JoditEditor
    metaTitle: "",
    metaDescription: "",
    metaKeyword: "",
    metaSchema: "",
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/chemicalCategory/getall")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat._id === value);
      setFormData({
        ...formData,
        category: value,
        categorySlug: selectedCategory ? selectedCategory.slug : "",
      });
    } else if (name === "name") {
      setFormData({ ...formData, name: value, slug: generateSlug(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    const newImageMetadata = files.map(() => ({ imgTitle: "", altName: "" }));

    setFormData({
      ...formData,
      images: [...formData.images, ...files],
      imageMetadata: [...formData.imageMetadata, ...newImageMetadata],
    });

    setImagePreviews([...imagePreviews, ...previews]);
  };

  const handleMetadataChange = (index, field, value) => {
    const updatedMetadata = [...formData.imageMetadata];
    updatedMetadata[index][field] = value;
    setFormData({ ...formData, imageMetadata: updatedMetadata });
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedMetadata = formData.imageMetadata.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData({ ...formData, images: updatedImages, imageMetadata: updatedMetadata });
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formData.images.forEach((file) => {
      formDataToSend.append("images", file);
    });
    formDataToSend.append("imageMetadata", JSON.stringify(formData.imageMetadata));

    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "imageMetadata") {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.post("/api/product/create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product created successfully!");
      navigate("/products"); // Redirect to the /product page
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  return (
    <div className="max-w-3xl mx-auto  bg-white ">
      <nav>
        <ul className="flex gap-2 mb-5 flex-wrap">
        <li>
          <Link to="/" className="text-gray-500 hover:text-main">
            Dashboard
          </Link>
        </li>
        <li className="text-gray-500">&gt;</li>
        <li>
          <Link to="/products" className="text-gray-500 hover:text-main">
            Products
          </Link>
        </li>
        <li className="text-gray-500">&gt;</li>
        <li>
          <Link to="/products" className="text-main hover:text-main">
           Add Products
          </Link>
        </li>
        </ul>
      </nav>
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Images</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
       <div className="mt-2 flex flex-wrap gap-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <img src={src} alt={formData.imageMetadata[index]?.altName || `Image ${index}`} className="w-24 h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                >
                  X
                </button>
                <input
                  type="text"
                  placeholder="Image Title"
                  value={formData.imageMetadata[index]?.imgTitle || ""}
                  onChange={(e) => handleMetadataChange(index, "imgTitle", e.target.value)}
                  className="mt-1 p-1 border rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={formData.imageMetadata[index]?.altName || ""}
                  onChange={(e) => handleMetadataChange(index, "altName", e.target.value)}
                  className="mt-1 p-1 border rounded w-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Details</label>
          <JoditEditor value={formData.details} onChange={(content) => setFormData({ ...formData, details: content })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Table</label>
          <JoditEditor value={formData.table} onChange={(content) => setFormData({ ...formData, table: content })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Meta Keyword</label>
          <input
            type="text"
            name="metaKeyword"
            value={formData.metaKeyword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Meta Schema</label>
          <textarea
            name="metaSchema"
            value={formData.metaSchema}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
