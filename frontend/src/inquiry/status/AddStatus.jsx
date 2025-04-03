import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  useCreateStatusMutation, 
  useUpdateStatusMutation,
  useGetStatusByIdQuery 
} from '@/slice/status/status';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';

export const StatusForm = ({ closeModal, statusToEdit }) => {
    console.log(statusToEdit)
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm();

  // Fetch existing status data
  const { data: existingStatus } = useGetStatusByIdQuery(statusToEdit?._id, {
    skip: !statusToEdit
  });
console.log(existingStatus)
  const [createStatus, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError }] = useCreateStatusMutation();
  const [updateStatus, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateStatusMutation(statusToEdit?._id);

  const onSubmit = async (data) => {
    try {
      if (statusToEdit) {
        await updateStatus({ id: statusToEdit._id, ...data }).unwrap();
      } else {
        await createStatus(data).unwrap();
      }
      reset();
    } catch (error) {
      console.error('Failed to save status:', error);
    }
  };

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      closeModal();
    }
  }, [isCreateSuccess, isUpdateSuccess, closeModal]);

  useEffect(() => {
    const statusToPopulate = existingStatus || statusToEdit;
    if (statusToPopulate) {
      reset({ status: statusToPopulate.status });
    }
  }, [existingStatus, statusToEdit, reset]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{statusToEdit ? 'Edit Status' : 'Add Status'}</DialogTitle>
        <DialogDescription>
          {statusToEdit ? 'Edit the status details below.' : 'Fill out the form below to create a new status.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-2">
            Status
          </label>
          <input
            id="status"
            {...register('status', { 
              required: 'Status is required',
              minLength: { value: 2, message: 'Status must be at least 2 characters' }
            })}
            className={`w-full px-3 py-2 border rounded ${errors.status ? 'border-red-500' : ''}`}
            placeholder="Enter status name"
          />
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? 'Submitting...' : statusToEdit ? 'Update' : 'Submit'}
        </Button>

        {(isCreateSuccess || isUpdateSuccess) && (
          <p className="text-green-500">
            {statusToEdit ? 'Status updated successfully!' : 'Status added successfully!'}
          </p>
        )}
        {(isCreateError || isUpdateError) && (
          <p className="text-red-500">Error processing status.</p>
        )}
      </form>

      <DialogClose />
    </DialogContent>
  );
};