const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILES_DIR = path.join(__dirname, 'files');

// Ensure the files directory exists
if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR);
}

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the NodeJS File System API! Use /create-file to create a file and /list-files to retrieve all files.');
});

// API Endpoint 1: Create a text file with current timestamp
app.post('/create-file', (req, res) => {
    const now = new Date();
    const timestamp = now.toISOString();
    const filename = `${now.toISOString().replace(/:/g, '-')}.txt`;
    const filePath = path.join(FILES_DIR, filename);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).json({ message: 'Error creating file' });
        }
        res.status(201).json({ message: 'File created', filename });
    });
});

// API Endpoint 2: Retrieve all text files
app.get('/list-files', (req, res) => {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(500).json({ message: 'Error reading files' });
        }

        // Filter for .txt files
        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.json({ files: textFiles });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
