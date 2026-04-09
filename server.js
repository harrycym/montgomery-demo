require('dotenv').config();
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

// Serve static files (index.html, avatar-widget.js, images, etc.)
app.use(express.static(__dirname, { index: 'index.html' }));

// Parse JSON bodies up to 10MB (base64 images are large)
app.use(express.json({ limit: '10mb' }));

// Proxy endpoint — keeps API key server-side
app.post('/api/generate', function(req, res) {
  var apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
  }

  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify(req.body)
  })
  .then(function(apiRes) {
    return apiRes.json().then(function(data) {
      res.status(apiRes.status).json(data);
    });
  })
  .catch(function(err) {
    res.status(502).json({ error: err.message || 'Gemini API request failed' });
  });
});

app.listen(PORT, '0.0.0.0', function() {
  console.log('Montgomery Demo running at http://localhost:' + PORT);
});
