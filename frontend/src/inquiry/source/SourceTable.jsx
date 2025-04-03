import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllSourcesQuery, useDeleteSourceMutation, useUpdateSourceMutation } from '@/slice/source/source';
import { Plus, Edit, Trash } from 'lucide-react'; // Importing the Edit and Trash icons from lucide-react
import React, { useState } from 'react';
import { SourceForm } from './AddSource';

export const SourceTable = () => {
  const { data: sourcesResponse, isLoading, isError } = useGetAllSourcesQuery();
  const [deleteSource] = useDeleteSourceMutation();
  const [updateSource] = useUpdateSourceMutation();
  const [sourceToEdit, setSourceToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state to control edit modal
  const sources = sourcesResponse?.data;

  const handleDelete = async (id) => {
    try {
      await deleteSource(id).unwrap();
      alert('Source deleted successfully!');
    } catch (error) {
      alert('Failed to delete source.');
    }
  };

  const handleEdit = (source) => {
    setSourceToEdit(source);
    setIsEditModalOpen(true); // Open the edit modal
  };

  const handleCloseModal = () => {
    setSourceToEdit(null);
    setIsEditModalOpen(false); // Close the edit modal
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching sources.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Source List</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Source
            </Button>
          </DialogTrigger>
          <SourceForm closeModal={handleCloseModal} />
        </Dialog>
      </div>

      <table className="table-auto border-collapse border border-gray-300 w-1/3 text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sources?.map((source) => (
            <tr key={source._id}>
              <td className="border border-gray-300 px-4 py-2">{source.source}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Edit
                  className="inline-block mx-2 cursor-pointer text-blue-500"
                  title="Edit"
                  onClick={() => handleEdit(source)}
                />
                <Trash
                  className="inline-block mx-2 cursor-pointer text-red-500"
                  title="Delete"
                  onClick={() => handleDelete(source._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal - now controlled by isEditModalOpen */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseModal}>
        <SourceForm 
          closeModal={handleCloseModal} 
          sourceToEdit={sourceToEdit} 
        />
      </Dialog>
    </div>
  );
};