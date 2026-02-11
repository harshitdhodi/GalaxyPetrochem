import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUpdateCategoryMutation, useUpdateSubCategoryMutation, useUpdateSubSubCategoryMutation } from '@/slice/chemicalSlice/chemicalCategory';

const EditCategory = () => {
  const { categoryId, subCategoryId, subSubCategoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const [altText, setAltText] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const editor = useRef(null);
  const [details, setDetails] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [slug, setSlug] = useState("");
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetadescription] = useState("");
  const [metakeywords, setMetakeywords] = useState("");
  const [metalanguage, setMetalanguage] = useState("");
  const [metacanonical, setMetacanonical] = useState("");
  const [metaschema, setMetaschema] = useState("");
  const [otherMeta, setOthermeta] = useState("");
  const [url, setUrl] = useState();
  const [changeFreq, setChangeFreq] = useState();
  const [priority, setPriority] = useState(0);
  const [status, setStatus] = useState("active");
  const [fileError, setFileError] = useState("");
  const activeInputRef = useRef(null);

  const [updateCategory] = useUpdateCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [updateSubSubCategory] = useUpdateSubSubCategoryMutation();

  useEffect(() => {
    const fetchData = async () => {
      let urls = "";
      if (categoryId && subCategoryId && subSubCategoryId) {
        urls = `/api/chemicalCategory/getSpecificSubSubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`;
      } else if (categoryId && subCategoryId) {
        urls = `/api/chemicalCategory/getSpecificSubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
      } else if (categoryId) {
        urls = `/api/chemicalCategory/getSpecificCategoryById?categoryId=${categoryId}`;
      }

      try {
        // toast.loading("Loading category data...");
        const response = await axios.get(urls, { withCredentials: true });
        const {
          category,
          details,
          photo,
          alt,
          imgtitle,
          slug,
          metatitle,
          metadescription,
          metakeywords,
          metalanguage,
          metacanonical,
          metaschema,
          otherMeta,
          changeFreq,
          priority,
          status,
        } = response.data;

        setCategory(category);
        setCurrentPhoto(photo);
        setAltText(alt);
        setImgtitle(imgtitle);
        setSlug(slug);
        setStatus(status);
        setDetails(details);
        setMetatitle(metatitle);
        setMetadescription(metadescription);
        setMetakeywords(metakeywords);
        setMetalanguage(metalanguage);
        setMetacanonical(metacanonical);
        setMetaschema(metaschema);
        setOthermeta(otherMeta);
        setChangeFreq(changeFreq || '');
        setPriority(Number(priority) || 0);

        // toast.success("Category data loaded successfully!");
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage = error?.response?.data?.message || "Failed to load category data";
        toast.error(errorMessage);
      }
    };

    fetchData();
  }, [categoryId, subCategoryId, subSubCategoryId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        const errorMsg = `File size exceeds 1 MB limit. Please upload a smaller image. (File size: ${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        setFileError(errorMsg);
        toast.error(errorMsg);
        setPhoto("");
        return;
      }
      setFileError("");
      setPhoto(file);
      toast.success("Image selected successfully!");
    }
  };

  const handleDeleteImage = () => {
    setPhoto("");
    setAltText("");
    setImgtitle("");
    setFileError("");
    toast.info("Image removed");
  };

  const generateUrl = () => {
    let baseUrl = "https://www.galaxypetro.in";
    if (categoryId && !subCategoryId) {
      return `${baseUrl}/${slug}`;
    } else if (categoryId && subCategoryId) {
      return `${baseUrl}/${slug}`;
    }
    return `${baseUrl}/${slug}`;
  };

  useEffect(() => {
    setUrl(generateUrl());
  }, [slug, categoryId, subCategoryId]);

  // Debounced slug generation
  useEffect(() => {
    const handler = setTimeout(() => {
      setSlug(
        category
          .replace(/\s+/g, "-")
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "")
          .replace(/--+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "")
      );
    }, 300);

    return () => clearTimeout(handler);
  }, [category]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSlug((prevSlug) =>
        prevSlug
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "")
          .replace(/--+/g, "-")
      );
    }, 300);

    return () => clearTimeout(handler);
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category", category);
    formData.append("alt", altText);
    formData.append("imgtitle", imgtitle);
    formData.append("slug", slug);
    formData.append("metatitle", metatitle || "");
    formData.append("metakeywords", metakeywords || "");
    formData.append("metadescription", metadescription || "");
    formData.append("metalanguage", metalanguage || "");
    formData.append("metacanonical", metacanonical || "");
    formData.append("metaschema", metaschema || "");
    formData.append("otherMeta", otherMeta || "");
    formData.append("url", url);
    formData.append("changeFreq", changeFreq || "");
    formData.append("priority", Number(priority) || 0);
    formData.append("status", status);
    formData.append("details", details);

    if (photo) {
      console.log("Photo file:", photo);
      console.log("Photo file name:", photo.name);
      console.log("Photo file type:", photo.type);
      console.log("Photo file size:", photo.size);
      formData.append("photo", photo);
    }

    try {
      if (categoryId && subCategoryId && subSubCategoryId) {
        await updateSubSubCategory({
          categoryId,
          subCategoryId,
          subSubCategoryId,
          formData
        }).unwrap();
      } else if (categoryId && subCategoryId) {
        await updateSubCategory({
          categoryId,
          subCategoryId,
          formData
        }).unwrap();
      } else if (categoryId) {
        await updateCategory({
          categoryId,
          formData
        }).unwrap();
      }

      toast.success("Category updated successfully!");
      setTimeout(() => navigate("/chemical-category"), 1500);
    } catch (error) {
      console.error("Error updating data:", error);
      const errorMessage = error?.data?.message || error?.response?.data?.message || error?.response?.data?.error || "An error occurred while updating the category";
      toast.error(errorMessage);
    }
  };

  // Handle input changes and stop event propagation
  const handleInputChange = (setter) => (e) => {
    e.stopPropagation(); // Prevent event from reaching JoditEditor
    const input = e.target;
    const value = e.target.value;
    setter(value);
    // Restore focus if lost
    if (document.activeElement !== input) {
      setTimeout(() => {
        input.focus();
      }, 0);
    }
  };

  // Memoize JoditEditor to prevent unnecessary re-renders
  const joditEditor = useMemo(
    () => (
      <JoditEditor
        ref={editor}
        value={details}
        tabIndex={-1} // Prevent focus via tab
        onBlur={(newContent) => {
          console.log("JoditEditor onBlur triggered");
          setDetails(newContent);
        }}
        config={{
          readonly: false,
          toolbarSticky: false,
          autofocus: false, // Explicitly disable autofocus
          uploader: {
            insertImageAsBase64URI: true,
          },
          buttons: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "|",
            "ul",
            "ol",
            "|",
            "font",
            "fontsize",
            "brush",
            "paragraph",
            "|",
            "image",
            "table",
            "link",
            "|",
            "align",
            "undo",
            "redo",
          ],
          style: {
            backgroundColor: "white",
          },
          events: {
            afterPaste: (event) => {
              const editorContent = event.editor.editor;
              const pastedElements = editorContent.querySelectorAll("*");
              pastedElements.forEach((element) => {
                if (!element.style.backgroundColor) {
                  element.style.backgroundColor = "white";
                }
              });
            },
          },
        }}
      />
    ),
    [details]
  );

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <form onSubmit={handleSubmit} className="p-4">
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Category</h1>
        
        <div className="mb-4">
          <label htmlFor="category" className="block font-semibold mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            value={category}
            onChange={handleInputChange(setCategory)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            ref={activeInputRef}
          />
        </div>

        <div className="mb-8">
          <label htmlFor="photo" className="block font-semibold mb-2">
            Photo 
          </label>
          <input
            type="file"
            name="photo"
            id="photo"
            onChange={handlePhotoChange}
            className="border rounded focus:outline-none"
            accept="image/*"
          />
          {fileError && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {fileError}
            </div>
          )}
          {(photo || currentPhoto) && (
            <div className="mt-2 w-56 relative group">
              <img
                src={photo ? URL.createObjectURL(photo) : `/api/logo/download/${currentPhoto}`}
                alt={altText || "Category Image"}
                className="h-32 w-56 object-cover rounded"
              />
             
              <div className="mb-4 mt-2">
                <label htmlFor="alt" className="block font-semibold mb-2">
                  Alternative Text <span className="text-red-500">*</span>
                </label>
                <input
                  id="alt"
                  value={altText}
                  onChange={handleInputChange(setAltText)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="imgtitle" className="block font-semibold mb-2">
                  Image Title Text <span className="text-red-500">*</span>
                </label>
                <input
                  id="imgtitle"
                  value={imgtitle}
                  onChange={handleInputChange(setImgtitle)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Details</label>
          {joditEditor}
        </div>

        <div className="mb-4 mt-4">
          <label htmlFor="slug" className="block font-semibold mb-2">
            Slug
          </label>
          <input
            id="slug"
            value={slug}
            onChange={handleInputChange(setSlug)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4 mt-4">
          <label htmlFor="url" className="block font-semibold mb-2">
            URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="metatitle" className="block font-semibold mb-2">
            Meta Title
          </label>
          <input
            id="metatitle"
            value={metatitle}
            onChange={handleInputChange(setMetatitle)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="metadescription" className="block font-semibold mb-2">
            Meta Description
          </label>
          <textarea
            id="metadescription"
            value={metadescription}
            onChange={handleInputChange(setMetadescription)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="metakeywords" className="block font-semibold mb-2">
            Meta Keywords
          </label>
          <textarea
            id="metakeywords"
            value={metakeywords}
            onChange={handleInputChange(setMetakeywords)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="metacanonical" className="block font-semibold mb-2">
            Meta Canonical
          </label>
          <textarea
            id="metacanonical"
            value={metacanonical}
            onChange={handleInputChange(setMetacanonical)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="metalanguage" className="block font-semibold mb-2">
            Meta Language
          </label>
          <textarea
            id="metalanguage"
            value={metalanguage}
            onChange={handleInputChange(setMetalanguage)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="otherMeta" className="block font-semibold mb-2">
            Other Meta
          </label>
          <textarea
            id="otherMeta"
            value={otherMeta}
            onChange={handleInputChange(setOthermeta)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="metaschema" className="block font-semibold mb-2">
            Schema
          </label>
          <textarea
            id="metaschema"
            value={metaschema}
            onChange={handleInputChange(setMetaschema)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="priority" className="block font-semibold mb-2">
            Priority
          </label>
          <input
            type="number"
            id="priority"
            min={0}
            max={1}
            step={0.01}
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value) || 0)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="changeFreq" className="block font-semibold mb-2">
            Change Frequency
          </label>
          <select
            id="changeFreq"
            value={changeFreq}
            onChange={(e) => setChangeFreq(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Change Frequency</option>
            <option value="always">Always</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block font-semibold mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Update Category
        </button>
      </form>
    </>
  );
};

export default EditCategory;