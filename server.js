const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
        console.log('Received:', message); // This will print the message sent from the client
    });

    ws.send('Server: You are connected');

    ws.on('close', function () {
        console.log('Client disconnected');
    });
});

// Start the HTTP server on port 8000 and bind to the specific IP address
const port = 8000;
server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
