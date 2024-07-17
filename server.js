const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Serve the HTML file for the root request
  if (req.url === "/") {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading index.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    console.log("Received:", message);

    // Broadcast the message to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }   
      
    });
  }); 

  ws.send(JSON.stringify({ message: 'You are connected!' }));

  ws.on("close", function () {
    console.log("Client disconnected");
  });
});

// Start the HTTP server on port 8080 and bind to the specific IP address
const host = "192.168.1.68";
const port = 8080;
server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`);
});
