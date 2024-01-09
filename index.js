const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const port = 3000;

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
  region: 'your-region',
});

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Serve HTML form for file upload
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const { file } = req;

  // Read the file content
  const fileContent = require('fs').readFileSync(file.path);

  // Upload the file to S3
  const params = {
    Bucket: 'your-bucket-name',
    Key: file.originalname,
    Body: fileContent,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file to S3');
    }

    // Delete the temporary file
    require('fs').unlinkSync(file.path);

    res.send(`File uploaded successfully to ${data.Location}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
