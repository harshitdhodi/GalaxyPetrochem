import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateSourceMutation, useGetSourceByIdQuery, useUpdateSourceMutation } from '@/slice/source/source';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const SourceForm = ({ closeModal, sourceToEdit = null }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: sourceToEdit ? {
      name: sourceToEdit.source // Adjust this based on your actual source object structure
    } : {}
  });

  const [createSource, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError }] = useCreateSourceMutation();
  const [updateSource, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateSourceMutation(sourceToEdit?._id);

  const { data: sourceData, isLoading: isLoadingSource } = useGetSourceByIdQuery(sourceToEdit?._id, {
    skip: !sourceToEdit?._id, // Don't fetch if no sourceToEdit is passed
  });

  useEffect(() => {
    if (sourceData) {
      reset({ source: sourceData.data.source }); // Reset the form with the fetched source data
    }
  }, [sourceData, reset]);

  const onSubmit = async (data) => {
    try {
      if (sourceToEdit) {
        // Handle update logic if editing
        await updateSource({ id: sourceToEdit._id, ...data }).unwrap();
      } else {
        // Handle create logic
        await createSource(data).unwrap();
      }
      reset();
      closeModal();
      alert(sourceToEdit ? 'Source updated successfully!' : 'Source created successfully!');
    } catch (error) {
      alert(sourceToEdit ? 'Failed to update source.' : 'Failed to create source.');
    }
  };

  if (isLoadingSource) {
    return <p>Loading source data...</p>;
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{sourceToEdit ? 'Edit Source' : 'Add Source'}</DialogTitle>
        <DialogDescription>
          {sourceToEdit ? 'Update the existing source.' : 'Fill out the form below to add a new source.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            {...register('source', { required: 'Name is required' })}
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter source name"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? 'Submitting...' : (sourceToEdit ? 'Update' : 'Submit')}
        </Button>

        {isCreateSuccess && !sourceToEdit && <p className="text-green-500">Source added successfully!</p>}
        {isUpdateSuccess && sourceToEdit && <p className="text-green-500">Source updated successfully!</p>}
        {(isCreateError || isUpdateError) && (
          <p className="text-red-500">
            Error {sourceToEdit ? 'updating' : 'adding'} source.
          </p>
        )}
      </form>

      <DialogClose />
    </DialogContent>
  );
};
