import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useGetMessageByIdQuery, useUpdateMessageMutation } from '@/slice/followUp/followUp';

export default function EditFollowUpModal({ 
  isOpen, 
  onClose, 
  followUpId, 
  onSave 
}) {
  const [editedFollowUp, setEditedFollowUp] = useState({
    date: '',
    message: ''
  });

  console.log('Follow Up ID:', followUpId);
  
  const { data: followUpData, isLoading, error: fetchError } = useGetMessageByIdQuery(followUpId, {
    skip: !isOpen || !followUpId,
  });

  const [updateMessage, { isLoading: isUpdating, error: updateError }] = useUpdateMessageMutation();

  useEffect(() => {
    if (followUpData) {
      // Format the date to mm/dd/yyyy
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
      };

      setEditedFollowUp({
        date: formatDate(followUpData?.data?.date || ''),
        message: followUpData?.data?.message || ''
      });
    }
  }, [followUpData]);

  const handleSave = async () => {
    console.log("Saving follow-up:", editedFollowUp);
    console.log("Follow Up ID in handleSave:", followUpId);

    if (!editedFollowUp.date) {
        alert("Please select a date.");
        return;
    }

    if (!editedFollowUp.message) {
        alert("Please enter a message.");
        return;
    }

    try {
        console.log("Attempting to update message");

        const result = await updateMessage({
            message: editedFollowUp.message,
            // Convert mm/dd/yyyy to yyyy-mm-dd before sending to API
            date: new Date(editedFollowUp.date).toISOString().split('T')[0],
            id: followUpId
        }).unwrap();

       

        onSave({
            ...followUpData?.data,
            date: editedFollowUp.date,
            message: editedFollowUp.message,
        });

        onClose();
    } catch (error) {
        console.error('Failed to update message:', error);
        alert(`Update failed: ${error.message || 'Unknown error'}`);
    }
  };

  useEffect(() => {
    if (fetchError) {
      console.error('Fetch Error:', fetchError);
      alert(`Fetch Error: ${fetchError.message}`);
    }
    if (updateError) {
      console.error('Update Error:', updateError);
      alert(`Update Error: ${updateError.message}`);
    }
  }, [fetchError, updateError]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Follow Up</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">
                Date
              </Label>
              <Input
                id="edit-date"
                type="text"
                placeholder="mm/dd/yyyy"
                value={editedFollowUp.date}
                onChange={(e) => setEditedFollowUp({
                  ...editedFollowUp, 
                  date: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-message" className="text-right">
                Message
              </Label>
              <Textarea
                id="edit-message"
                value={editedFollowUp.message}
                onChange={(e) => setEditedFollowUp({
                  ...editedFollowUp, 
                  message: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isUpdating}
                className="bg-red-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isUpdating}
              >
                <Save className="mr-2 h-4 w-4" /> {isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
