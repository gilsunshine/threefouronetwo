const WebSocket = require('ws')
server = new WebSocket.Server({ port: 3000, headers: {
  "Access-Control-Allow-Headers": "http://localhost:3000",
}})

function broadcast(data){
  server.clients.forEach(client => {
    client.send(data)
  })
}

server.on('connection', ws => {
  ws.on('message', data => {
    broadcast(data)
  })
})



// const express = require('express');
// const http = require('http');
// const url = require('url');
// const WebSocket = require('ws');
//
// const app = express();
//
// // app.use(function (req, res) {
// //   res.send({ msg: "hello" });
// // });
//
// app.use(express.static('public'));
//
// // const server = http.createServer(app);
// // const wss = new WebSocket.Server({ server });
//
// const wss = new WebSocket.Server({ port: 8080 });
//
// wss.on('connection', function connection(ws, req) {
//   console.log('hello world')
//   const location = url.parse(req.url, true);
//
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//
//   ws.send('something');
// });
//
// server.listen(8080, function listening() {
//   // console.log('Listening on %d', server.address().port);
//   console.log("listening");
// });
