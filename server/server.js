const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 5000 });

let messages = [];

server.on("connection", (socket) => {
  console.log("Client connected");

  // Send previous messages to new user
  socket.send(JSON.stringify({ type: "history", data: messages }));

  socket.on("message", (msg) => {
    const parsed = JSON.parse(msg);

    const newMessage = {
      text: parsed.text,
      sender: parsed.sender,
      time: new Date().toLocaleTimeString(),
    };

    messages.push(newMessage);

    // Send message to all connected clients
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ type: "message", data: newMessage })
        );
      }
    });
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("Server running on ws://localhost:5000");