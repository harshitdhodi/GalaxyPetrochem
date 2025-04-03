import React from 'react'
import moment from 'moment'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus } from 'lucide-react'

const EventModal = ({ isOpen, onClose, event, events, onSave, onDelete, onEdit, onAddNew, mode }) => {
  const [eventData, setEventData] = React.useState({
    title: '',
    start: new Date(),
    end: new Date(),
    ...event
  })

  React.useEffect(() => {
    setEventData({
      title: '',
      start: new Date(),
      end: new Date(),
      ...event
    })
  }, [event])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEventData(prev => ({ ...prev, [name]: name === 'title' ? value : new Date(value) }))
  }

  const handleSave = () => {
    onSave(eventData)
    onClose()
  }

  const renderEventForm = () => (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="start" className="text-right">
            Start
          </Label>
          <Input
            id="start"
            name="start"
            type="datetime-local"
            value={moment(eventData.start).format('YYYY-MM-DDTHH:mm')}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="end" className="text-right">
            End
          </Label>
          <Input
            id="end"
            name="end"
            type="datetime-local"
            value={moment(eventData.end).format('YYYY-MM-DDTHH:mm')}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        {mode === 'edit' && (
          <Button variant="destructive" onClick={() => onDelete(eventData.id)}>
            Delete
          </Button>
        )}
        <Button onClick={handleSave}>Save</Button>
      </DialogFooter>
    </>
  )

  const renderEventList = () => (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={onAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Event
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{moment(event.start).format('LT')}</TableCell>
              <TableCell>{moment(event.end).format('LT')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(event)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Event' : mode === 'add' ? 'Add New Event' : 'Events for Selected Date'}
          </DialogTitle>
        </DialogHeader>
        {mode === 'list' ? renderEventList() : renderEventForm()}
      </DialogContent>
    </Dialog>
  )
}

export default EventModal

