import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CalendarControls = ({ onToday, filter, onFilterChange, view, onViewChange }) => {
  return (
    <>
    <div>
    <h2 className='text-lg text-purple-800 mb-5 pb-1 font-semibold border-b border-purple-800'>Reminders</h2>
    </div>
    <div className="mb-4 flex justify-between items-center">
       
      {/* <div>
        <Button onClick={onToday}>Today</Button>
      </div> */}
      <div className="flex gap-2">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="past">Past Events</SelectItem>
            <SelectItem value="upcoming">Upcoming Events</SelectItem>
          </SelectContent>
        </Select>
        <Select value={view} onValueChange={onViewChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    </>
  )
}

export default CalendarControls

