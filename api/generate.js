module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY', debug: 'env var not set' });
  }

  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent';

  try {
    var body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    var apiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: body
    });

    var text = await apiRes.text();
    try {
      var data = JSON.parse(text);
      res.status(apiRes.status).json(data);
    } catch (e) {
      res.status(apiRes.status).send(text);
    }
  } catch (err) {
    res.status(502).json({ error: err.message || 'Gemini API request failed', stack: err.stack });
  }
};
