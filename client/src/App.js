import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        setMessages(data.data);
      }

      if (data.type === "message") {
        setMessages((prev) => [...prev, data.data]);
      }
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "" && username.trim() !== "") {
      socket.send(
        JSON.stringify({
          text: input,
          sender: username,
        })
      );
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Real-Time Chat Application</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="username-input"
      />

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}</strong>: {msg.text}
            <div className="time">{msg.time}</div>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;