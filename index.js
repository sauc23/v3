const path = require("node:path");
const http = require("node:http");
const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const fs = require("fs");

const __dirname = process.cwd();
const server = http.createServer();
const app = express();
const bareServer = createBareServer("/bare/");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "static"));

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/app.html'));
});

app.get('/~', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/loader.html'));
});

app.get('/credits', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/credits.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'static/404.html'));
});

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(`Doge Unblocker running at port 8000`);
});

server.listen(8000);
