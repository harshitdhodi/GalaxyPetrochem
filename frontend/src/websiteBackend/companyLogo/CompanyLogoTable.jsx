import React from 'react';
import { useGetLogoQuery, useUpdateLogoMutation, useDeleteLogoMutation } from '@/slice/logo/LogoSlice';

const Logo = () => {
    // Query hook for getting logo
    const { data: logo, isLoading, isError, error } = useGetLogoQuery();
    
    // Mutation hooks
    const [updateLogo, { isLoading: isUpdating }] = useUpdateLogoMutation();
    const [deleteLogo, { isLoading: isDeleting }] = useDeleteLogoMutation();

    // Handle logo update
    const handleUpdate = async (logoData) => {
        try {
            await updateLogo(logoData).unwrap();
            // Success handling
        } catch (error) {
            // Error handling
            console.error('Failed to update logo:', error);
        }
    };

    // Handle logo deletion
    const handleDelete = async () => {
        try {
            await deleteLogo().unwrap();
            // Success handling
        } catch (error) {
            // Error handling
            console.error('Failed to delete logo:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div>
            {logo && (
                <>
                    <img src={logo.headerLogo} alt="Header Logo" />
                    <link rel="icon" href={logo.favIcon} />
                    
                    {/* Update Form Example */}
                    <button 
                        onClick={() => handleUpdate({ 
                            headerLogo: 'new-header.png', 
                            favIcon: 'new-favicon.ico' 
                        })}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Update Logo'}
                    </button>

                    {/* Delete Button */}
                    <button 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Logo'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Logo;