// routes/serverRoutes.js
const express = require('express');
const router = express.Router();
const serverController = require('../controller/smtp_setting');

router.post('/add', serverController.createServer); // Create server
router.get('/get', serverController.getAllServers); // Get all servers
router.get('/getById', serverController.getServerById); // Get server by ID
router.put('/update', serverController.updateServer); // Update server
router.delete('/delete', serverController.deleteServer); // Delete server

module.exports = router;
