const Note = require('../model/emailTemplate');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { name, subject, body, category } = req.body;

    if (!name || !subject || !body || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const note = new Note({
      name,
      subject,
      body,
      category
    });

    await note.save();
    res.status(201).json({ message: 'Note created successfully', data: note });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate('category', 'emailCategory');
    res.status(200).json({ message: 'Notes fetched successfully', data: notes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.query;

    const note = await Note.findById(id).populate("category", "emailCategory"); // Populate category field

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note fetched successfully", data: note });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update a note by ID
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, subject, body, category } = req.body;

    const note = await Note.findByIdAndUpdate(
      id,
      { name, subject, body, category },
      { new: true, runValidators: true }
    ).populate('category', 'emailCategory');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note updated successfully', data: note });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a note by ID
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.query;

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
