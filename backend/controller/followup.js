const Message = require('../model/followUp');
const Inquiry = require('../model/inquiry')
// Create a new message
const createMessage = async (req, res) => {
  try {
    const { message, date,status, inquiryId } = req.body;

    // Ensure the inquiryId is provided
    if (!inquiryId) {
      return res.status(400).json({
        success: false,
        message: 'inquiryId is required',
      });
    }

    const newMessage = new Message({
      message,
      date: date || Date.now(), // Use provided date or default to now
      inquiryId, // Store the inquiryId reference
      status
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).populate('inquiryId'); // Populate inquiryId reference

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single message by ID
const getMessageById = async (req, res) => {
  try {
    const { id } = req.query;
    const message = await Message.findById(id).populate('inquiryId'); // Populate inquiryId reference

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a message by ID
const updateMessage = async (req, res) => {
  try {
    const { id } = req.query;
    const { message, date ,status } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { message, date ,status },
      { new: true } // Return the updated document
    ).populate('inquiryId'); // Populate inquiryId reference

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a message by ID
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.query;

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMessagesByInquiryId = async (req, res) => {
  try {
    const { id } = req.query; // Get the inquiryId from the URL parameters
    const messageCount = await Message.countDocuments({ inquiryId: id });

    // Find messages that match the inquiryId, and populate any references if needed
    const messages = await Message.find({ inquiryId :id }).populate('inquiryId'); 

    if (!messages || messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No messages found for this inquiryId',
      });
    }

    res.status(200).json({
      success: true,
      data: messages,
      count:messageCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMessagesCountByInquiryId = async (req, res) => {
  try {
    const { id } = req.query; // Get the inquiryId from the query parameters
    
    // Count messages that match the inquiryId
    const messageCount = await Message.countDocuments({ inquiryId: id });

    if (messageCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No messages found for this inquiryId',
      });
    }

    res.status(200).json({
      success: true,
      count: messageCount, // Return the count of messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTodayMessages = async (req, res) => {
  try {
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to 12:00:00 AM
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to 11:59:59 PM

    // Fetch messages created today
    const todayMessages = await Message.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .sort({ createdAt: -1 }) // Sort in descending order by creation time
      .populate('inquiryId'); // Populate the inquiryId reference

    res.status(200).json({
      success: true,
      data: todayMessages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
  getMessagesByInquiryId ,
  getMessagesCountByInquiryId,
  getTodayMessages
};
