import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });

// ws is the client's WebSocket instance
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send("Welcome to the chat!");

  ws.on("message", (data) => {
    let message;

    try {
      message = JSON.parse(data);
    } catch (e) {
      sendError(ws, "Wrong format");
      return;
    }

    if (message.type === "NEW_MESSAGE") {
      wss.clients.forEach((client) => {
        // Check if the client is not the sender and can receive messages
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client has disconnected");
  });

  const sendError = (ws, message) => {
    const messageObject = {
      type: "ERROR",
      payload: message,
    };

    ws.send(JSON.stringify(messageObject));
  };
});

console.log("WebSocket server started on port 8080");
