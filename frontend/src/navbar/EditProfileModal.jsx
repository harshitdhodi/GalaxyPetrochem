import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditProfileModal = ({
    isEditProfileOpen,
    setIsEditProfileOpen,
    editedUserData = { firstname: '', lastname: '', email: '', photo: '' },
    setEditedUserData,
    handleEditProfile,
}) => {
    const fileInputRef = useRef(null);

    // Handle photo upload and preview
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setEditedUserData(prev => ({
                ...prev,
                photo: file, // Store the file temporarily
            }));
        } else {
            alert('Please select a valid image file.');
        }
    };

    return (
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditProfile}>
                    <div className="grid gap-4 py-4">
                        {/* First Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstname" className="text-right">First Name</Label>
                            <Input
                                id="firstname"
                                value={editedUserData.firstname || ''}
                                onChange={(e) => setEditedUserData(prev => ({ ...prev, firstname: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastname" className="text-right">Last Name</Label>
                            <Input
                                id="lastname"
                                value={editedUserData.lastname || ''}
                                onChange={(e) => setEditedUserData(prev => ({ ...prev, lastname: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>

                        {/* Email */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input
                                id="email"
                                value={editedUserData.email || ''}
                                onChange={(e) => setEditedUserData(prev => ({ ...prev, email: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>

                        {/* Image Upload and Preview */}
                        <div className="space-y-2">
                            <Label>Upload Image</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                                <div className="w-32 h-32 mx-auto mb-4">
                                    <img
                                        src={editedUserData.photo instanceof File
                                            ? URL.createObjectURL(editedUserData.photo)
                                            : editedUserData.photo
                                                ? `/api/image/download/${editedUserData.photo}`
                                                : "/placeholder.svg"}
                                        alt="image preview"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-green-500 text-white hover:bg-green-600"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Add Image
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileModal;
