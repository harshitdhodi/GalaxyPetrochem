import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import JoditEditor from "jodit-react";

const EditProductForm = () => {
    const { id } = useParams();

    const [formData, setFormData] = useState({
        category: "",
        categorySlug: "",
        slug: "",
        name: "",
        price: "",
        images: [],
        imageMetadata: [],
        table: "",
        details: "",
        metaTitle: "",
        metaDescription: "",
        metaKeyword: "",
        metaSchema: ""
    });

    const [categories, setCategories] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        if (id) {
            const fetchProductDetails = async () => {
                try {
                    const productResponse = await axios.get(`/api/product/${id}`);
                    const product = productResponse.data;

                    const categoriesResponse = await axios.get("/api/chemicalCategory/getall");
                    setCategories(categoriesResponse.data);

                    setFormData({
                        category: product.category?._id || "",
                        categorySlug: product.categorySlug || "",
                        slug: product.slug || "",
                        name: product.name || "",
                        price: product.price || "",
                        images: [],
                        imageMetadata: product.images.map((img) => ({
                            imgTitle: img.title || "",
                            altName: img.altText || ""
                        })),
                        table: product.table || "",
                        details: product.details || "",
                        metaTitle: product.metaTitle || "",
                        metaDescription: product.metaDescription || "",
                        metaKeyword: product.metaKeyword || "",
                        metaSchema: product.metaSchema || ""
                    });

                    setImagePreviews(product.images.map((img) => `/api/image/download/${img.url}`));
                } catch (error) {
                    console.error("Error fetching product details:", error);
                }
            };

            fetchProductDetails();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "category") {
            const selectedCategory = categories.find((cat) => cat._id === value);
            setFormData({
                ...formData,
                category: value,
                categorySlug: selectedCategory ? selectedCategory.slug : ""
            });
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
            imageMetadata: [...formData.imageMetadata, ...newImageMetadata]
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
            await axios.put(`/api/product/${id}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Product updated successfully!");
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Category Slug</label>
                    <input
                        type="text"
                        name="categorySlug"
                        value={formData.categorySlug}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
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
                        required
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Product Images</h3>
                    <div className="space-y-2 mb-4">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="flex items-center space-x-4 p-2 border rounded">
                                <img src={src} alt={formData.imageMetadata[index]?.altName || `Image ${index}`} className="w-16 h-16 object-cover" />
                                <div className="flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Image Title"
                                        value={formData.imageMetadata[index]?.imgTitle || ""}
                                        onChange={(e) => handleMetadataChange(index, "imgTitle", e.target.value)}
                                        className="w-full p-1 border rounded"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Alt Text"
                                        value={formData.imageMetadata[index]?.altName || ""}
                                        onChange={(e) => handleMetadataChange(index, "altName", e.target.value)}
                                        className="w-full p-1 border rounded"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Table</label>
                    <JoditEditor
                        value={formData.table}
                        onChange={(content) => setFormData({ ...formData, table: content })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Details</label>
                    <JoditEditor
                        value={formData.details}
                        onChange={(content) => setFormData({ ...formData, details: content })}
                    />
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
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Meta Keywords</label>
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
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded mt-4"
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProductForm;