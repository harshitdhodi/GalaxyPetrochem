import React, { useState, Suspense } from 'react';
import { useGetAllStatusesQuery, useDeleteStatusMutation } from '@/slice/status/status';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import StatusForm from './AddStatus';

const StatusTable = () => {
  const { data: statusesResponse, isLoading, isError, error } = useGetAllStatusesQuery();
  const [deleteStatus] = useDeleteStatusMutation();
  const [statusToEdit, setStatusToEdit] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const statuses = React.useMemo(() => {
    try {
      if (!statusesResponse) return [];
      const data = statusesResponse.data || statusesResponse;
      return Array.isArray(data) 
        ? data.filter(item => item && typeof item === 'object' && item._id)
        : [];
    } catch (err) {
      console.error('Error processing statuses:', err);
      return [];
    }
  }, [statusesResponse]);

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error('Cannot delete: Invalid ID');
        return;
      }
      if (window.confirm('Are you sure you want to delete this status?')) {
        await deleteStatus(id).unwrap();
      }
    } catch (error) {
      console.error('Failed to delete status:', error);
      alert('Failed to delete status. Please try again.');
    }
  };

  const handleEdit = (status) => {
    if (!status?._id) {
      console.error('Cannot edit: Invalid status data', status);
      return;
    }
    setStatusToEdit(status);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditModal = () => {
    setStatusToEdit(null);
    setIsEditDialogOpen(false);
  };

  const handleCloseAddModal = () => {
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-64">
        <div className="text-lg">Loading statuses...</div>
      </div>
    );
  }

  if (isError) {
    console.error('Error fetching statuses:', error);
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> Failed to load statuses.</span>
          {error?.data?.message && (
            <div className="mt-2 text-sm">{String(error.data.message)}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Status List</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Status
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statuses.length > 0 ? (
              statuses.map((status) => {
                if (!status?._id) return null;
                return (
                  <tr key={status._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {String(status.status || 'N/A')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(status)}
                        className="text-blue-600 hover:text-blue-900 mr-4 p-1 rounded"
                        title="Edit"
                        type="button"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(status._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                        type="button"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                  No statuses found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogTitle>Add New Status</DialogTitle>
          <DialogDescription>
            Create a new status for inquiries
          </DialogDescription>
          <StatusForm 
            closeModal={handleCloseAddModal}
            key="add-status-form"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogTitle>Edit Status</DialogTitle>
          <DialogDescription>
            Update the status details below
          </DialogDescription>
          {statusToEdit && (
            <StatusForm 
              key={`edit-status-${statusToEdit._id}`}
              closeModal={handleCloseEditModal}
              statusToEdit={statusToEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatusTable;