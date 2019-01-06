const http = require('http');
const express = require('express');
const path = require('path');
const app = express();



// send react app on / GET
app.use(express.static(path.resolve(__dirname, './public/build/')));
app.use(express.static(path.resolve(__dirname, './public/assets/')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/build/', './index.html'));
});

const server = http.createServer(app, console.log);
server.listen('3001', function () {
  console.log('Server app listening on port 3001!');
});
