const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const apicache = require("apicache");

// Initialize api-cache
const cache = apicache.middleware;

router.get("/download/:filename", cache("1 day"), async (req, res) => {
  const { filename } = req.params;
  const { w = 1200, q = 80 } = req.query;
  const filePath = path.join(__dirname, "../uploads/images", `${filename.split(".")[0]}-${w}.webp`);
  const originalPath = path.join(__dirname, "../uploads/images", filename);

  const startTime = Date.now();

  try {
    // Serve pre-generated file if it exists
    if (fs.existsSync(filePath)) {
      console.log(`Pre-generated file served in ${Date.now() - startTime}ms`);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.type("image/webp").sendFile(filePath);
      return;
    }

    // Fallback to dynamic processing
    if (!fs.existsSync(originalPath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const optimizedImage = await sharp(originalPath)
      .resize({ width: parseInt(w, 10), withoutEnlargement: true })
      .webp({ quality: parseInt(q, 10) })
      .toBuffer();

    res.setHeader("X-Cache", "MISS");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.type("image/webp").send(optimizedImage);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "File download failed" });
  }
});

// PDF Viewing
router.get("/view/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/images", filename);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "File display failed" });
    }
  });
});

// PDF Download
router.get("/pdf/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/images", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "PDF download failed" });
    }
  });
});

// PDF View (including catalogs fallback)
router.get("/pdf/view/:filename", (req, res) => {
  const { filename } = req.params;
  let filePath = path.join(__dirname, "../uploads/images", filename);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, "../uploads/catalogs", filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "PDF display failed" });
    }
  });
});

// MSDS and Specs Viewing
router.get("/:docType/view/:filename", (req, res) => {
  const { docType, filename } = req.params;

  if (!["msds", "specs"].includes(docType)) {
    return res.status(400).json({ message: "Invalid document type" });
  }

  const filePath = path.join(__dirname, `../uploads/${docType}`, filename);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "File display failed" });
    }
  });
});

module.exports = router;
