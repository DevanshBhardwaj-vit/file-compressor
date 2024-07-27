const express = require('express');
const multer = require('multer');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

const app = express();
const port = 3000;

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ensure upload directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// API to handle file uploads and compression
app.post('/upload', upload.array('files'), (req, res) => {
  const files = req.files;
  const zipFilename = `compressed-${Date.now()}.zip`;
  const output = fs.createWriteStream(path.join(__dirname, 'uploads', zipFilename));
  const archive = archiver('zip', {
    zlib: { level: 9 } // Set the compression level to the highest
  });

  output.on('close', () => {
    res.download(path.join(__dirname, 'uploads', zipFilename), zipFilename, (err) => {
      if (err) {
        console.error(err);
      }
      // Clean up the files after download
      files.forEach(file => fs.unlinkSync(file.path));
      fs.unlinkSync(path.join(__dirname, 'uploads', zipFilename));
    });
  });

  archive.pipe(output);

  files.forEach(file => {
    archive.file(file.path, { name: file.originalname });
  });

  archive.finalize();
});

app.use(express.static(path.join(__dirname, 'frontend')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
