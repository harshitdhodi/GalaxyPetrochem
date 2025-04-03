const express = require('express');
const router = express.Router();
const eventController = require('../controller/events');

// Get all events
router.get('/getEvent', eventController.getAllEvents);

// Get a single event by ID
router.get('/events/:id', eventController.getEventById);

// Create a new event
router.post('/addEvent', eventController.createEvent);

// Update an event by ID
router.put('/editEvent/:id', eventController.updateEvent);

// Delete an event by ID
router.delete('/:id', eventController.deleteEvent);

module.exports = router;