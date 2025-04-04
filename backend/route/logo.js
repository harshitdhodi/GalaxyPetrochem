const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const logoPath = path.join(__dirname, '../logos', filename);
  const tempPath = path.join(__dirname, '../temp', filename);

  // Check if the file exists in the logos directory
  if (fs.existsSync(logoPath)) {
    return res.download(logoPath, (err) => {
      if (err && !res.headersSent) {
        console.error(err);
        return res.status(500).json({ message: 'File download failed' });
      }
    });
  }

  // Check if the file exists in the temp directory
  if (fs.existsSync(tempPath)) {
    return res.download(tempPath, (err) => {
      if (err && !res.headersSent) {
        console.error(err);
        return res.status(500).json({ message: 'File download failed' });
      }
    });
  }

  // If file not found in either location
  return res.status(404).json({ message: 'File not found' });
});


module.exports = router;