import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  useGetAllSourcesQuery, 
  useDeleteSourceMutation, 
  useUpdateSourceMutation 
} from '@/slice/source/source';
import { Plus, Edit, Trash } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { SourceForm } from './AddSource';

export const SourceTable = () => {
  const { data: sourcesResponse, isLoading, isError, error } = useGetAllSourcesQuery();
  const [deleteSource] = useDeleteSourceMutation();
  const [sourceToEdit, setSourceToEdit] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Safely access the sources array with proper validation
  const sources = useMemo(() => {
    try {
      if (!sourcesResponse) return [];
      const data = sourcesResponse.data || sourcesResponse;
      return Array.isArray(data) 
        ? data.filter(item => item && typeof item === 'object' && item._id)
        : [];
    } catch (err) {
      console.error('Error processing sources:', err);
      return [];
    }
  }, [sourcesResponse]);

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error('Cannot delete: Invalid ID');
        return;
      }
      if (window.confirm('Are you sure you want to delete this source?')) {
        await deleteSource(id).unwrap();
      }
    } catch (error) {
      console.error('Failed to delete source:', error);
      alert('Failed to delete source. Please try again.');
    }
  };

  const handleEdit = (source) => {
    if (!source?._id) {
      console.error('Cannot edit: Invalid source data', source);
      return;
    }
    setSourceToEdit(source);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditModal = () => {
    setSourceToEdit(null);
    setIsEditDialogOpen(false);
  };

  const handleCloseAddModal = () => {
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-64">
        <div className="text-lg">Loading sources...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> Failed to load sources.</span>
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
        <h1 className="text-2xl font-bold">Source List</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Source
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
            {sources.length > 0 ? (
              sources.map((source) => {
                if (!source?._id) return null;
                return (
                  <tr key={source._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {String(source.source || 'N/A')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(source)}
                        className="text-blue-600 hover:text-blue-900 mr-4 p-1 rounded"
                        title="Edit"
                        type="button"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(source._id)}
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
                  No sources found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Source Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogTitle>Add New Source</DialogTitle>
          <DialogDescription>
            Create a new source for inquiries
          </DialogDescription>
          <SourceForm 
            closeModal={handleCloseAddModal}
            key="add-source-form"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Source Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogTitle>Edit Source</DialogTitle>
          <DialogDescription>
            Update the source details below
          </DialogDescription>
          {sourceToEdit && (
            <SourceForm 
              key={`edit-source-${sourceToEdit._id}`}
              closeModal={handleCloseEditModal}
              sourceToEdit={sourceToEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SourceTable;