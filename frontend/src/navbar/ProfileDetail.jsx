import React from 'react';
import { X } from 'lucide-react';
import { Label } from "@/components/ui/label";

const ProfileDetailsModal = ({ userData, setIsProfileDetailsOpen }) => {
    console.log(userData)
    return (
        <div className="absolute right-0 top-16  bg-white rounded-md shadow-lg p-4 z-20">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Profile Details</h3>
                <X
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => setIsProfileDetailsOpen(false)}
                />
            </div>
            <div className="space-y-2">
                <div className="flex gap-1 items-center">
                    <Label className=" text-gray-700">Name :</Label>
                    <span className="text-gray-900">{userData.admin.firstname} {userData.admin.lastname}</span>
                </div>
                <div className="flex gap-1 items-center">
                    <Label className=" text-gray-700">Email :</Label>
                    <span className="text-gray-900">{userData.admin.email}</span>
                </div>
               
            </div>
        </div>
    );
};

export default ProfileDetailsModal;