var WebSocketServer = require('ws').Server
var http = require("http")
const express = require('express');
const uuidv4 = require('uuid/v4');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000
const BUILD = path.join(__dirname, './build');

app.use(express.static(BUILD))

let server = http.createServer(app)
server.listen(PORT)

let wss = new WebSocketServer({port: PORT})

let allConnections = []

wss.on('connection', (ws, req) => {
  const ip = req.connection.remoteAddress
  console.log(`${ip} just made a WS connection`);
  allConnections.push(ws)
  var id = setInterval(function() {
  ws.send(JSON.stringify(new Date()), function() {  })
    }, 1000)

  wss.on('close', function close(){
    let index = allConnections.indexOf(ws)
    if (index > -1) {
      allConnections.splice(index, 1);
    }
    clearInterval(id)
  })

  wss.on('message', (payload) => {
    allConnections.forEach(client => {
      if (client !== ws){
        client.send(payload)
      }
    })
  })
})

console.log("LISTENING FOR WS CONNECTIONS ON PORT: ", PORT);
