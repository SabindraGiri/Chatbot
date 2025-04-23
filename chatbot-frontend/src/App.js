import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // ✅ Load chat history on component mount
  useEffect(() => {
    fetch("/history") // 👈 This works due to the proxy in package.json
      .then(res => res.json())
      .then(data => setHistory(data));
  }, []);

  // ✅ Send message to chatbot
  const sendMessage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      setReply(data.reply);

      // ✅ Add latest message to local state
      setHistory(prev => [...prev, { user: message, bot: data.reply }]);
      setMessage('');
    } catch (err) {
      setReply("❌ Error connecting to chatbot: " + err.message);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Clear chat history
  const clearHistory = async () => {
    try {
      await fetch("/history", { method: "DELETE" });
      setHistory([]);
      setReply('');
    } catch (err) {
      console.error("❌ Failed to clear history:", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🤖 Chatbot Interface</h1>

      <textarea
        rows={4}
        cols={50}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
      />
      <br />

      <button onClick={sendMessage} style={{ marginTop: '1rem', marginRight: '1rem' }} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send"}
      </button>

      <button onClick={clearHistory} style={{ marginTop: '1rem' }} disabled={isLoading}>
        🧹 Clear Chat
      </button>

      <h3>Bot's Reply:</h3>
      <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
        {isLoading ? "⌛ Loading..." : reply}
      </div>

      <h3 style={{ marginTop: '2rem' }}>Chat History:</h3>
      <div style={{ background: '#eee', padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
        {history.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          history.map((msg, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <strong>You:</strong> {msg.user}<br />
              <strong>Bot:</strong> {msg.bot}
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
