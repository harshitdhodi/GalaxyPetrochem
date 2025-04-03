import React from 'react';
import { ChevronDown, User, Edit, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API requests

const UserInfoDropdown = ({ 
    userData, 
    isUserInfoOpen, 
    toggleUserInfo, 
    openProfileDetails, 
    setIsEditProfileOpen 
}) => {
const Navigate = useNavigate()
console.log(userData)
    // Logout handler
    const handleLogout = async () => {
        try {
            // Make API call to logout
            await axios.post('/api/admin/logout');  // Assuming this endpoint handles the server-side logout
            // Optionally, redirect to login page or handle client-side logout here (clear tokens, etc.)
           Navigate('/login')
        } catch (error) {
            console.error("Logout error:", error);
            // Optionally show a message to the user
        }
    };

    return (
        <div className="relative">
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleUserInfo}
            >
                <img
                    src={`/api/image/download/${userData.admin.photo}`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                />
                <ChevronDown className={`w-4 h-4 transition-transform ${isUserInfoOpen ? 'rotate-180' : ''}`} />
            </div>

            {isUserInfoOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-semibold">{userData.name}</p>    
                        <p className="text-xs text-gray-500">{userData.email}</p>
                    </div>
                    <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:flex items-center"
                        onClick={openProfileDetails}
                    >
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                    </Link>
                    <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:flex items-center"
                        onClick={() => {
                            setIsEditProfileOpen(true);
                        }}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Link>
                    <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:flex items-center"
                        onClick={handleLogout}  // Call the handleLogout function
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Link>
                </div>
            )}
        </div>
    );
};

export default UserInfoDropdown;
