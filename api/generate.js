module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
  }

  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent';

  try {
    var apiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(req.body)
    });

    var data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message || 'Gemini API request failed' });
  }
};
