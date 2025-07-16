// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const { OpenAI } = require('openai');

// Init Express app
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serves index.html and assets from root

// Init OpenAI with API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Serve index.html on root access
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST /ask endpoint
app.post('/ask', async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }

  // Only allow questions related to Tholkappiyam
  const prompt = `You are Tholkappiyam AI, an expert in the ancient Tamil grammar text called Tholkappiyam. Only answer questions that are related to Tholkappiyam. Respond clearly and concisely.\n\nUser: ${question}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Tholkappiyam AI, a Tamil grammar expert. Only answer questions about Tholkappiyam." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error("❌ OpenAI error:", error.message);
    res.status(500).json({ error: 'Failed to fetch answer from AI.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Tholkappiyam AI running at http://localhost:${PORT}`);
});
