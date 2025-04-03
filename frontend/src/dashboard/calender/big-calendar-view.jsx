import React, { useState, useMemo, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import EventModal from './event-modal'
import CalendarControls from './calendar-controls'
import { useGetMessagesQuery } from '@/slice/followUp/followUp'

const localizer = momentLocalizer(moment)

const BigCalendarView = () => {
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())
  const [filter, setFilter] = useState('all')
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalMode, setModalMode] = useState('add')

  // Fetch messages using RTK Query
  const { data: messages, isLoading } = useGetMessagesQuery()

  useEffect(() => {
    if (messages) {
      // Transform messages to calendar events with null checks
      const transformedEvents = messages.data.map((message) => ({
        id: message._id,
        title: `${message.message} ${message.inquiryId?.name ? `- ${message.inquiryId.name}` : ''}`, // Add null check
        start: new Date(message.date),
        end: new Date(message.date),
        // Optionally add more properties you need
        inquiryDetails: message.inquiryId || {}, // Store the full inquiry object if needed
      }));
      setEvents(transformedEvents);
    }
  }, [messages]);
  

  const filteredEvents = useMemo(() => {
    const now = new Date()
    switch (filter) {
      case 'past':
        return events.filter(event => event.end < now)
      case 'upcoming':
        return events.filter(event => event.start >= now)
      default:
        return events
    }
  }, [filter, events])

  const handleNavigate = (newDate) => setDate(newDate)

  const handleSelectSlot = (slotInfo) => {
    setSelectedEvent(null)
    setModalMode('add')
    setIsModalOpen(true)
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleSaveEvent = (eventData) => {
    if (modalMode === 'add') {
      setEvents([...events, eventData])
    } else {
      setEvents(events.map(event => 
        event.id === eventData.id ? eventData : event
      ))
    }
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId))
    setIsModalOpen(false)
  }

  const handleAddNewFromList = () => {
    setSelectedEvent({
      id: uuidv4(),
      title: '',
      start: new Date(),
      end: new Date(),
    })
    setModalMode('add')
  }

  return (
    <div className="h-screen p-4">
      <CalendarControls
        onToday={() => handleNavigate(new Date())}
        filter={filter}
        onFilterChange={setFilter}
        view={view}
        onViewChange={setView}
      />
      {isLoading ? (
        <div>Loading follow-ups...</div>
      ) : (
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 100px)' }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={handleNavigate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          // Optional: Add custom event rendering
          eventPropGetter={(event) => ({
            className: 'custom-event',
            style: {
              backgroundColor: event.inquiryDetails?.status === 'completed' ? '#4CAF50' : '#2196F3',
            },
          })}
        />
      )}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent || {}}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        onAddNew={handleAddNewFromList}
        mode={modalMode}
      />
    </div>
  )
}

export default BigCalendarView
