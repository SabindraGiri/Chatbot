const express = require('express');
const cors = require('cors');
const { PythonShell } = require('python-shell');

let chatHistory = []; // 🧠 Store user-bot message pairs

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get('/health', (req, res) => {
  res.send({ status: 'ok' });
});

// ✅ Get full chat history
app.get('/history', (req, res) => {
  res.send(chatHistory);
});

// ✅ Clear chat history (optional)
app.delete('/history', (req, res) => {
  chatHistory = [];
  res.send({ status: "Chat history cleared." });
});

// ✅ Chat route that runs Python model
app.post('/chat', (req, res) => {
  const userMessage = req.body.message;
  console.log("📨 Received:", userMessage);

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: './',
    args: [userMessage],
  };

  console.log("⚙️ Launching chatbot.py with options:", options);

  PythonShell.run('chatbot.py', options)
    .then(results => {
      console.log("✅ PythonShell success");
      console.log("🐍 Raw Python results:", results);

      const botReply = results?.slice(-1)[0] || "🤖 No response from Python";

      // 🧠 Store chat message pair
      chatHistory.push({ user: userMessage, bot: botReply });

      // 🔁 Send reply to frontend
      res.send({ reply: botReply });
    })
    .catch(err => {
      console.error("❌ PythonShell error:", err);
      res.status(500).send({ reply: "PythonShell exception: " + err.message });
    });
});

// ✅ Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

