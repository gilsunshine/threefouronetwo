var WebSocketServer = require('ws').Server
const express = require('express');
const uuidv4 = require('uuid/v4');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

var wss = new WebSocketServer({server})

let allConnections = []

wss.on('connection', (ws, req) => {
  const ip = req.connection.remoteAddress
  console.log(`${ip} just made a WS connection`);
  allConnections.push(ws)

  ws.on('close', function close(){

    let index = allConnections.indexOf(ws)
    if (index > -1) {
      allConnections.splice(index, 1);
    }
  })

  ws.on('message', (payload) => {
    allConnections.forEach(client => {
        if (client !== ws){
          client.send(payload)
        }
      })
    })
})

console.log("LISTENING FOR WS CONNECTIONS ON PORT: ", PORT);
