import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EventForm = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState('');
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/getEvent?t=${new Date().getTime()}`);
      const eventData = response.data[0];
      setEventId(eventData._id);
      setEvents(eventData.events);
      form.setFieldsValue({ events: eventData.events });
    } catch (error) {
      console.error('Failed to fetch event:', error);
      message.error('Failed to fetch event.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [form]);

  const handleChange = (newContent) => {
    setEvents(newContent);
    form.setFieldsValue({ events: newContent });
  };

  const onFinish = async () => {
    try {
      if (!eventId) {
        message.error('No event ID available');
        return;
      }
      setLoading(true);
      await axios.put(`/api/events/editEvent/${eventId}`, { events });
      message.success('Event updated successfully!');
      await fetchEvent();
    } catch (error) {
      console.error('Failed to update event:', error);
      message.error('Failed to update event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} name="event_form">
      <Form.Item name="events" label="Event Description" rules={[{ required: true, message: 'Please input the event details!' }]}> 
        <ReactQuill 
          value={events} 
          onChange={handleChange} 
          modules={{ toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image']] }} 
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Update Event</Button>
        <Button onClick={fetchEvent} style={{ marginLeft: 8 }} loading={loading}>Refresh Data</Button>
      </Form.Item>
    </Form>
  );
};

export default EventForm;