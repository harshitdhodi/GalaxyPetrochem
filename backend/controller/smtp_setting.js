// controllers/serverController.js
const Server = require('../model/smtp_setting');

// Create a new server
exports.createServer = async (req, res) => {
  try {
    const server = new Server(req.body);
    const savedServer = await server.save();
    res.status(201).json({ message: 'Server created successfully', data: savedServer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating server', error });
  }
};

// Get all servers
exports.getAllServers = async (req, res) => {
  try {
    const servers = await Server.find();
    res.status(200).json({ message: 'Servers fetched successfully', data: servers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching servers', error });
  }
};

// Get a server by ID
exports.getServerById = async (req, res) => {
  try {
    const server = await Server.findById(req.query.id);
    if (!server) return res.status(404).json({ message: 'Server not found' });
    res.status(200).json({ message: 'Server fetched successfully', data: server });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching server', error });
  }
};

// Update a server
exports.updateServer = async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(req.query.id, req.body, { new: true });
    if (!server) return res.status(404).json({ message: 'Server not found' });
    res.status(200).json({ message: 'Server updated successfully', data: server });
  } catch (error) {
    res.status(500).json({ message: 'Error updating server', error });
  }
};

// Delete a server
exports.deleteServer = async (req, res) => {
  try {
    const server = await Server.findByIdAndDelete(req.query.id);
    if (!server) return res.status(404).json({ message: 'Server not found' });
    res.status(200).json({ message: 'Server deleted successfully', data: server });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting server', error });
  }
};
