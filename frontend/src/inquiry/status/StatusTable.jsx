import React, { useState } from 'react';
import { useGetAllStatusesQuery, useDeleteStatusMutation } from '@/slice/status/status';
import { Button } from '@/components/ui/button';
import { Plus,Edit, Trash } from 'lucide-react';
import { StatusForm } from './AddStatus';
import {
  Dialog,
  DialogTrigger
} from '@/components/ui/dialog';

export const StatusTable = () => {
  const { data: statusesResponse, isLoading, isError } = useGetAllStatusesQuery();
  const [deleteStatus] = useDeleteStatusMutation(); // Hook for delete mutation
  const [statusToEdit, setStatusToEdit] = useState(null); // Track the status being edited
  const statuses = statusesResponse?.data;

  const handleDelete = async (id) => {
    try {
      await deleteStatus(id).unwrap(); // Perform the delete operation
      alert('Status deleted successfully!');
    } catch (error) {
      alert('Failed to delete status.');
    }
  };

  const handleEdit = (status) => {
    console.log(status)
    setStatusToEdit(status);  // Set the status being edited
  };

  const handleCloseModal = () => {
    setStatusToEdit(null);  // Clear the statusToEdit when modal is closed
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching statuses.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Status List</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Status
            </Button>
          </DialogTrigger>
          <StatusForm closeModal={handleCloseModal} />
        </Dialog>
      </div>
      
      <table className="table-auto border-collapse border border-gray-300 w-1/2 text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {statuses?.map((status) => (
            <tr key={status._id}>
              <td className="border border-gray-300 px-4 py-2">{status.status}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Edit 
                  className="inline-block mx-2 cursor-pointer text-blue-500" 
                  title="Edit" 
                  onClick={() => handleEdit(status)}  // Trigger edit when clicked
                />
                <Trash 
                  className="inline-block mx-2 cursor-pointer text-red-500" 
                  title="Delete" 
                  onClick={() => handleDelete(status._id)} // Trigger delete on click
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {statusToEdit && (
        <Dialog open={true} onOpenChange={handleCloseModal}>
          <StatusForm closeModal={handleCloseModal} statusToEdit={statusToEdit} />
        </Dialog>
      )}
    </div>
  );
};
