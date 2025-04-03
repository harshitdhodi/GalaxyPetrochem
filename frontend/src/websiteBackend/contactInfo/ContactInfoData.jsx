import React, { useState, useEffect } from 'react';
import { useAddUserMutation, useUpdateUserMutation, useGetAllUsersQuery } from '@/slice/contactInfo/contactInfo';

const ContactInfoForm = () => {
    const [formData, setFormData] = useState({
        address: '',
        mobiles: [''],
        emails: [''],
        imgTitle: [''],
        altName: [''],
        photo: [],
        previewUrls: []
    });

    const [addUser] = useAddUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const { data: allUsers } = useGetAllUsersQuery();

    // Populate form with existing data when component loads
    useEffect(() => {
        if (allUsers && allUsers.length > 0) {
            const existingData = allUsers[0];
            setFormData({
                address: existingData.address,
                mobiles: existingData.mobiles,
                emails: existingData.emails,
                imgTitle: existingData.imgTitle || [''],
                altName: existingData.altName || [''],
                photo: [],
                previewUrls: existingData.photo ? existingData.photo.map(p => `/api/image/download/${p}`) : []
            });
        }
    }, [allUsers]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        
        setFormData(prev => ({
            ...prev,
            photo: files,
            previewUrls: [...newPreviewUrls],
            imgTitle: files.map(() => ''),
            altName: files.map(() => '')
        }));
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            formData.previewUrls.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [formData.previewUrls]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submitFormData = new FormData();
        submitFormData.append('address', formData.address);
        formData.mobiles.forEach(mobile => {
            submitFormData.append('mobiles[]', mobile);
        });
        formData.emails.forEach(email => {
            submitFormData.append('emails[]', email);
        });
        
        // Handle arrays for image-related fields
        formData.imgTitle.forEach((title, index) => {
            submitFormData.append('imgTitle[]', title);
        });
        
        formData.altName.forEach((alt, index) => {
            submitFormData.append('altName[]', alt);
        });
        
        // Handle multiple photo uploads
        if (formData.photo.length > 0) {
            formData.photo.forEach(file => {
                submitFormData.append('photo[]', file);
            });
        } else if (allUsers && allUsers[0]?.photo) {
            // If no new photos selected, keep the existing ones
            allUsers[0].photo.forEach(photoUrl => {
                submitFormData.append('photo[]', photoUrl);
            });
        }

        try {
            if (allUsers && allUsers.length > 0) {
                await updateUser({ 
                    id: allUsers[0]._id, 
                    formData: submitFormData 
                }).unwrap();
            } else {
                await addUser(submitFormData).unwrap();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Address Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Mobile Numbers */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Numbers</label>
                    {formData.mobiles.map((mobile, index) => (
                        <div key={index} className="flex gap-2 mt-1">
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setFormData(prev => {
                                    const newArray = [...prev.mobiles];
                                    newArray[index] = e.target.value;
                                    return {
                                        ...prev,
                                        mobiles: newArray
                                    };
                                })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                            {formData.mobiles.length > 1 && (
                                <button type="button" onClick={() => setFormData(prev => {
                                    const newArray = [...prev.mobiles];
                                    newArray.splice(index, 1);
                                    return {
                                        ...prev,
                                        mobiles: newArray
                                    };
                                })} className="text-red-500">
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => setFormData(prev => ({
                        ...prev,
                        mobiles: [...prev.mobiles, '']
                    }))} className="mt-2 text-indigo-600">
                        Add Mobile
                    </button>
                </div>

                {/* Emails */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Emails</label>
                    {formData.emails.map((email, index) => (
                        <div key={index} className="flex gap-2 mt-1">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setFormData(prev => {
                                    const newArray = [...prev.emails];
                                    newArray[index] = e.target.value;
                                    return {
                                        ...prev,
                                        emails: newArray
                                    };
                                })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                            {formData.emails.length > 1 && (
                                <button type="button" onClick={() => setFormData(prev => {
                                    const newArray = [...prev.emails];
                                    newArray.splice(index, 1);
                                    return {
                                        ...prev,
                                        emails: newArray
                                    };
                                })} className="text-red-500">
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => setFormData(prev => ({
                        ...prev,
                        emails: [...prev.emails, '']
                    }))} className="mt-2 text-indigo-600">
                        Add Email
                    </button>
                </div>

                {/* Multiple image upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Logo Images</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                        className="mt-1 block w-full"
                    />
                    <div className="mt-2 grid grid-cols-3 gap-4">
                        {formData.previewUrls.map((url, index) => (
                            <div key={index} className="space-y-2">
                                <img
                                    src={url}
                                    alt={formData.altName[index] || `Preview ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Image Title"
                                    value={formData.imgTitle[index] || ''}
                                    onChange={(e) => {
                                        const newImgTitles = [...formData.imgTitle];
                                        newImgTitles[index] = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            imgTitle: newImgTitles
                                        }));
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Alt Text"
                                    value={formData.altName[index] || ''}
                                    onChange={(e) => {
                                        const newAltNames = [...formData.altName];
                                        newAltNames[index] = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            altName: newAltNames
                                        }));
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            previewUrls: prev.previewUrls.filter((_, i) => i !== index),
                                            photo: Array.from(prev.photo).filter((_, i) => i !== index),
                                            imgTitle: prev.imgTitle.filter((_, i) => i !== index),
                                            altName: prev.altName.filter((_, i) => i !== index)
                                        }));
                                    }}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    {allUsers && allUsers.length > 0 ? 'Update' : 'Submit'}
                </button>
            </form>

            {/* Display existing data */}
            {/* {allUsers && allUsers.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Current Contact Information</h2>
                    <div className="border p-4 rounded-lg">
                        <p><strong>Address:</strong> {allUsers[0].address}</p>
                        <p><strong>Mobiles:</strong> {allUsers[0].mobiles.join(', ')}</p>
                        <p><strong>Emails:</strong> {allUsers[0].emails.join(', ')}</p>
                        {allUsers[0].photo && allUsers[0].photo.length > 0 && (
                            <div className="mt-2">
                                <p><strong>Logos:</strong></p>
                                <div className="mt-1 grid grid-cols-3 gap-4">
                                    {allUsers[0].photo.map((photo, index) => (
                                        <div key={index} className="space-y-1">
                                            <img
                                                src={`/api/image/download/${photo}`}
                                                alt={allUsers[0].altName[index] || ''}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                            <p className="text-sm">{allUsers[0].imgTitle[index] || ''}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default ContactInfoForm;