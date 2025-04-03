import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTemplateByIdQuery, useUpdateTemplateMutation } from "@/slice/template/emailTemplate";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useGetEmailCategoriesQuery } from "@/slice/emailCategory/emailCategory";

const EditTemplateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();
  const { data: template, isLoading: isFetching, error } = useGetTemplateByIdQuery(id, { skip: !id });
  const { data: categories, isLoading: categoriesLoading } = useGetEmailCategoriesQuery();
console.log(categories)
  useEffect(() => {
    if (template?.data) {
      reset({
        name: template.data.name,
        subject: template.data.subject,
        body: template.data.body,
        category: template.data.category?._id || "" // Ensure category is correctly set
      });
      setValue("body", template.data.body);
    }
  }, [template, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      await updateTemplate({ id, ...data }).unwrap();
      navigate('/email-template-table');
    } catch (error) {
      alert("Failed to update template: " + error.message);
    }
  };

  const handleEditorChange = (value) => {
    setValue("body", value);
  };

  if (isFetching) return <div>Loading template...</div>;
  if (error) return <div>Error fetching template: {error.message}</div>;

  return (
    <div className="p-4 mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Template</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
          <label className="block text-sm font-medium mb-1" htmlFor="category">Category</label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            {!categoriesLoading && categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.emailCategory}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter template name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="subject">Subject</label>
          <input
            id="subject"
            {...register("subject", { required: "Subject is required" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter template subject"
          />
          {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="body">Body</label>
          <ReactQuill
            value={template?.data?.body || ""}
            onChange={handleEditorChange}
            placeholder="Enter template body"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.body && <p className="text-red-500 text-sm">{errors.body.message}</p>}
        </div>

      
        <button
          type="submit"
          className={`w-1/4 bg-blue-500 text-white px-4 py-2 rounded ${isUpdating ? "opacity-50" : ""}`}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Template"}
        </button>
      </form>
    </div>
  );
};

export default EditTemplateForm;
