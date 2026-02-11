import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { 
  useCreateStatusMutation, 
  useUpdateStatusMutation,
  useGetStatusByIdQuery 
} from '@/slice/status/status';
import { Button } from '@/components/ui/button';

const StatusForm = ({ closeModal, statusToEdit = null }) => {
  // Safely log props with serialization
  console.log('StatusForm props:', {
    closeModal: typeof closeModal,
    statusToEdit: statusToEdit ? JSON.parse(JSON.stringify(statusToEdit)) : null
  });
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      status: ''
    }
  });

  // Only fetch if we have a valid ID and it's an edit operation
  const shouldSkip = !statusToEdit?._id || typeof statusToEdit._id !== 'string';
  const { 
    data: existingStatus,
    isLoading: isLoadingStatus,
    error: fetchError
  } = useGetStatusByIdQuery(statusToEdit?._id, {
    skip: shouldSkip
  });

  // Safely log existing status
  console.log('Existing status data:', existingStatus ? JSON.parse(JSON.stringify(existingStatus)) : null);

  const [createStatus, { 
    isLoading: isCreating, 
    isSuccess: isCreateSuccess, 
    isError: isCreateError,
    error: createError
  }] = useCreateStatusMutation();

  const [updateStatus, { 
    isLoading: isUpdating, 
    isSuccess: isUpdateSuccess, 
    isError: isUpdateError,
    error: updateError
  }] = useUpdateStatusMutation();

  // Memoize the form submission handler
  const onSubmit = useCallback(async (data) => {
    try {
      console.log('Form submission data:', data);
      
      // Validate form data
      if (!data.status || typeof data.status !== 'string' || data.status.trim().length < 2) {
        console.error('Invalid form data:', data);
        return;
      }

      const cleanData = {
        status: data.status.trim()
      };
      
      if (statusToEdit?._id) {
        // Update existing status
        const updatePayload = { 
          id: statusToEdit._id, 
          ...cleanData
        };
        console.log('Update payload:', updatePayload);
        await updateStatus(updatePayload).unwrap();
      } else {
        // Create new status
        console.log('Create payload:', cleanData);
        await createStatus(cleanData).unwrap();
      }
      
      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error('Failed to save status:', error);
    }
  }, [statusToEdit, updateStatus, createStatus, reset]);

  // Handle success states
  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      console.log('Operation successful, closing modal');
      if (typeof closeModal === 'function') {
        closeModal();
      }
    }
  }, [isCreateSuccess, isUpdateSuccess, closeModal]);

  // Populate form with existing data
  useEffect(() => {
    try {
      // Determine which data to use for populating the form
      let statusData = null;
      
      if (existingStatus?.data) {
        statusData = existingStatus.data;
      } else if (existingStatus) {
        statusData = existingStatus;
      } else if (statusToEdit) {
        statusData = statusToEdit;
      }
      
      console.log('Populating form with:', statusData);
      
      if (statusData?.status) {
        const statusValue = String(statusData.status);
        setValue('status', statusValue);
        console.log('Set form value:', statusValue);
      }
    } catch (error) {
      console.error('Error populating form:', error);
    }
  }, [existingStatus, statusToEdit, setValue]);

  // Show loading state while fetching existing data
  if (isLoadingStatus) {
    return (
      <div className="p-4 text-center">
        <div className="text-sm text-gray-500">Loading status data...</div>
      </div>
    );
  }

  // Show error if there's a fetch error
  if (fetchError) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-700 text-sm">
            Failed to load status data. Please try again.
          </p>
        </div>
        <Button 
          onClick={() => typeof closeModal === 'function' && closeModal()}
          variant="outline"
          className="w-full"
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-2">
            Status Name
          </label>
          <input
            id="status"
            type="text"
            {...register('status', { 
              required: 'Status is required',
              minLength: { 
                value: 2, 
                message: 'Status must be at least 2 characters' 
              },
              maxLength: {
                value: 50,
                message: 'Status must be less than 50 characters'
              },
              validate: value => {
                if (typeof value !== 'string') {
                  return 'Status must be a valid string';
                }
                if (value.trim() !== value) {
                  return 'Status cannot start or end with spaces';
                }
                return true;
              }
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter status name (e.g., Active, Pending, Completed)"
            disabled={isCreating || isUpdating}
          />
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.status.message || 'Invalid status')}
            </p>
          )}
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating 
              ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Submitting...
                </>
              )
              : statusToEdit 
                ? 'Update Status' 
                : 'Add Status'
            }
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              console.log('Cancel button clicked');
              if (typeof closeModal === 'function') {
                closeModal();
              }
            }}
            disabled={isCreating || isUpdating}
          >
            Cancel
          </Button>
        </div>

        {/* Success Messages */}
        {(isCreateSuccess || isUpdateSuccess) && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">
              {statusToEdit ? 'Status updated successfully!' : 'Status added successfully!'}
            </p>
          </div>
        )}
        
        {/* Error Messages */}
        {(isCreateError || isUpdateError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">
              Error processing status: {String(createError?.data?.message || updateError?.data?.message || 'Please try again.')}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

// Default export
export default StatusForm;

// Named export for compatibility
export { StatusForm };