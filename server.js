const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));

// Endpoint for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully!');
});

// Endpoint to get the list of available files
app.get('/files', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.json(files);
        }
    });
});

// Endpoint to download files
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, req.params.filename);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
