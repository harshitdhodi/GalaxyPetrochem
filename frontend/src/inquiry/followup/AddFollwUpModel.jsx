import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function AddFollowUpModal({ isOpen, onClose, onAddFollowUp }) {
    const [newFollowUp, setNewFollowUp] = useState({
        date: '',
        message: ''
    });

    const handleAddFollowUp = () => {
        onAddFollowUp(newFollowUp);
        setNewFollowUp({ date: '', message: '' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Follow Up</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <Input
                        className=" w-auto md:w-[4cm]"
                            id="date"
                            type="date"
                            value={newFollowUp.date ? new Date(newFollowUp.date).toISOString().slice(0, 10) : ''}
                            onChange={(e) => setNewFollowUp({ ...newFollowUp, date: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                            Message
                        </Label>
                        <Textarea
                            id="message"
                            value={newFollowUp.message}
                            onChange={(e) => setNewFollowUp({ ...newFollowUp, message: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button className="bg-red-600" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddFollowUp}>
                        Add
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}