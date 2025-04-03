import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import NotificationsDropdown from '@/navbar/NotificationDropdown';
import UserInfoDropdown from '@/navbar/UserInfoDropdown';
import ProfileDetailsModal from '@/navbar/ProfileDetail';
import EditProfileModal from '@/navbar/EditProfileModal';
import {
    useGetAdminProfileQuery,
    useUpdateAdminProfileMutation,
} from '@/slice/login/adminlogin';
import { useGetTodayMessagesQuery } from '@/slice/followUp/followUp';

const Navbar = () => {
    const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editedUserData, setEditedUserData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        photo: '',
    });

    // Fetch admin profile
    const { data: adminProfile, error, isLoading, refetch } = useGetAdminProfileQuery();
    const [updateAdminProfile] = useUpdateAdminProfileMutation();

    // Fetch today's messages (optional: skip if not needed until notifications open)
    const { data: messagesData, isLoading: isMessagesLoading } = useGetTodayMessagesQuery();

    // Update editedUserData when adminProfile changes
    useEffect(() => {
        if (adminProfile) {
            setEditedUserData(adminProfile.admin);
        }
    }, [adminProfile]);

    // Refetch admin profile when EditProfileModal opens
    useEffect(() => {
        if (isEditProfileOpen) {
            refetch(); // Trigger refetch when modal opens
        }
    }, [isEditProfileOpen, refetch]);

    const toggleUserInfo = () => {
        setIsUserInfoOpen(!isUserInfoOpen);
        setIsNotificationsOpen(false);
        setIsProfileDetailsOpen(false);
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        setIsUserInfoOpen(false);
        setIsProfileDetailsOpen(false);
    };

    const openProfileDetails = () => {
        setIsProfileDetailsOpen(true);
        setIsUserInfoOpen(false);
        setIsNotificationsOpen(false);
    };

    const handleEditProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('firstname', editedUserData.firstname);
        formData.append('lastname', editedUserData.lastname);
        formData.append('email', editedUserData.email);
        if (editedUserData.photo instanceof File) {
            formData.append('photo', editedUserData.photo);
        }

        try {
            await updateAdminProfile(formData).unwrap();
            // No need to call refetch here; tags will handle it (from previous solution)
            setIsEditProfileOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (isLoading || isMessagesLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading profile</p>;

    return (
        <>
            <nav className="bg-[#3b1f91] flex items-center justify-between text-white relative">
                <SidebarTrigger />
                <div className="flex w-full items-center justify-end space-x-8">
                    <NotificationsDropdown
                        notifications={messagesData?.data || []}
                        isNotificationsOpen={isNotificationsOpen}
                        toggleNotifications={toggleNotifications}
                    />

                    {adminProfile && (
                        <p className="text-gray-300">{adminProfile.admin.email}</p>
                    )}

                    <UserInfoDropdown
                        userData={adminProfile}
                        isUserInfoOpen={isUserInfoOpen}
                        toggleUserInfo={toggleUserInfo}
                        openProfileDetails={openProfileDetails}
                        setIsEditProfileOpen={setIsEditProfileOpen}
                    />

                    {isProfileDetailsOpen && (
                        <ProfileDetailsModal
                            userData={adminProfile}
                            setIsProfileDetailsOpen={setIsProfileDetailsOpen}
                        />
                    )}
                </div>
            </nav>

            <EditProfileModal
                isEditProfileOpen={isEditProfileOpen}
                setIsEditProfileOpen={setIsEditProfileOpen}
                editedUserData={editedUserData}
                setEditedUserData={setEditedUserData}
                handleEditProfile={handleEditProfile}
            />
        </>
    );
};

export default Navbar;