import React, { useEffect, useState } from 'react';
import {
  useGetCompanyInfoQuery,
  useAddCompanyInfoMutation,
  useDeleteCompanyInfoMutation,
  useGetCompanyInfoByIdQuery,
  useUpdateCompanyInfoMutation
} from '@/slice/companyInfo/CompanyInfo';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'blockquote', 'code-block',
  'link', 'image'
];

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    brand: '',
    photo: null,
    altName: '',
    imgTitle: '',
    year: '',
    experts: '',
    details: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { data, refetch } = useGetCompanyInfoQuery();
  const [addCompanyInfo] = useAddCompanyInfoMutation();
  const [deleteCompanyInfo] = useDeleteCompanyInfoMutation();
  const [updateCompanyInfo] = useUpdateCompanyInfoMutation();
  const { data: editData } = useGetCompanyInfoByIdQuery(editingId, { skip: !editingId });

  useEffect(() => {
    if (editData) {
      setFormData({
        brand: editData.data.brand || '',
        altName: editData.data.altName || '',
        imgTitle: editData.data.imgTitle || '',
        year: editData.data.year || '',
        experts: editData.data.experts || '',
        details: editData.data.details || '',
        photo: null,
      });
      setPreviewUrl(`/api/image/download/${editData.data.photo}`);
    }
  }, [editData]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    if (editingId) {
      await updateCompanyInfo({ id: editingId, data: payload });
    } else {
      await addCompanyInfo(payload);
    }

    refetch();
    setFormData({ brand: '', photo: null, altName: '', imgTitle: '', year: '', experts: '', details: '' });
    setEditingId(null);
    setPreviewUrl(null);
  };

  const handleDelete = async (id) => {
    await deleteCompanyInfo(id);
    refetch();
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="border p-2 rounded" required />
        <input type="file" name="photo" onChange={handleChange} className="border p-2 rounded" />
        
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded border" />
        )}
        
        <input type="text" name="altName" value={formData.altName} onChange={handleChange} placeholder="Alt Name" className="border p-2 rounded" />
        <input type="text" name="imgTitle" value={formData.imgTitle} onChange={handleChange} placeholder="Image Title" className="border p-2 rounded" />
        <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="border p-2 rounded" />
        <input type="text" name="experts" value={formData.experts} onChange={handleChange} placeholder="Experts" className="border p-2 rounded" />

        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium">Details</label>
          <ReactQuill
            theme="snow"
            value={formData.details}
            onChange={(value) => setFormData({ ...formData, details: value })}
            modules={quillModules}
            formats={quillFormats}
            className="bg-white rounded"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4 col-span-1 md:col-span-2">
          {editingId ? 'Update' : 'Submit'}
        </button>
      </form>

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Brand</th>
            <th className="px-4 py-2">Year</th>
            <th className="px-4 py-2">Experts</th>
            <th className="px-4 py-2">Details</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="px-4 py-3">{item.brand}</td>
              <td className="px-4 py-3">{item.year}</td>
              <td className="px-4 py-3">{item.experts}</td>
              <td className="px-4 py-3 max-w-xs">
                <div dangerouslySetInnerHTML={{ __html: item.details }} />
              </td>
              <td className="px-4 py-3">
                {item.photo && <img src={`/api/image/download/${item.photo}`} alt="brand" className="w-16 h-16 object-cover rounded" />}
              </td>
              <td className="px-4 py-3 space-x-2">
                <button onClick={() => handleEdit(item._id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyForm;
