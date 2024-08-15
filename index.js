import { WebSocketServer, WebSocket } from "ws";

const PORT = 3000;
const wss = new WebSocketServer({ port: PORT });

// ws is the client's WebSocket instance
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send("Welcome to the chat!");

  ws.on("message", (data) => {
    let message;

    console.log("Received message: ", data);

    try {
      message = JSON.parse(data);
    } catch (e) {
      sendError(ws, "Wrong format");
      return;
    }

    // This is how the message object should look like
    // {
    //   "type": "NEW_MESSAGE",
    //   "payload": {
    //     "author": "User 1",
    //     "message": "This is a new message text"
    //   }
    // }
    if (message.type === "NEW_MESSAGE") {
      wss.clients.forEach((client) => {
        // Check if the client is not the sender and can receive messages
        // if (client !== ws && client.readyState === WebSocket.OPEN)
        if (client.readyState === WebSocket.OPEN) {
          client.send(`${message.payload.author}: ${message.payload.message}`);
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

console.log(`WebSocket server started on port ${PORT}`);
