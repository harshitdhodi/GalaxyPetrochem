import React, { useState, useEffect } from 'react';
import { useUpdateLogoMutation, useGetLogoQuery } from '@/slice/logo/LogoSlice';

const LogoForm = () => {
    const [updateLogo, { isLoading }] = useUpdateLogoMutation();
    const { data: existingLogo, isFetching } = useGetLogoQuery();
    
    const [formData, setFormData] = useState({
        headerLogo: null,
        headerLogoName: '',
        headerLogoAltName: '',
        favIcon: null,
        favIconName: '',
        favIconAltName: ''
    });

    const [preview, setPreview] = useState({
        headerLogo: null,
        favIcon: null
    });

    useEffect(() => {
        if (existingLogo) {
            setFormData(prev => ({
                ...prev,
                headerLogoName: existingLogo.headerLogoName || '',
                headerLogoAltName: existingLogo.headerLogoAltName || '',
                favIconName: existingLogo.favIconName || '',
                favIconAltName: existingLogo.favIconAltName || ''
            }));
            setPreview({
                headerLogo: existingLogo.headerLogo ? `/api/logo/download/${existingLogo.headerLogo}` : null,
                favIcon: existingLogo.favIcon ? `/api/logo/download/${existingLogo.favIcon}` : null
            });
        }
    }, [existingLogo]);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [type]: file }));
            setPreview(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            await updateLogo(formDataToSend).unwrap();
            alert('Logo updated successfully!');
        } catch (err) {
            console.error('Failed to update logo:', err);
            alert('Failed to update logo. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Update Company Logo</h2>
            
            {isFetching ? (
                <p className="text-gray-500">Loading logo data...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {[
                        { label: 'Header Logo', name: 'headerLogo', previewKey: 'headerLogo' },
                        { label: 'Favicon', name: 'favIcon', previewKey: 'favIcon' }
                    ].map(({ label, name, previewKey }) => (
                        <div key={name} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                            <input 
                                type="file" 
                                name={name} 
                                accept="image/*" 
                                onChange={(e) => handleFileChange(e, name)} 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:text-gray-700 file:bg-white hover:file:bg-gray-100"
                            />
                            {preview[previewKey] && (
                                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                    <img src={preview[previewKey]} alt={label || "img"} className="h-20 object-contain" />
                                </div>
                            )}
                            <input 
                                type="text" 
                                name={`${name}Name`} 
                                value={formData[`${name}Name`]} 
                                onChange={handleInputChange} 
                                placeholder={`${label} Name`} 
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                            />
                            <input 
                                type="text" 
                                name={`${name}AltName`} 
                                value={formData[`${name}AltName`]} 
                                onChange={handleInputChange} 
                                placeholder={`${label} Alt Name`} 
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                            />
                        </div>
                    ))}
                    
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                        {isLoading ? 'Updating...' : 'Update Logo'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default LogoForm;
