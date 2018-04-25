import SceneManager from './SceneManager.js'

const connection = new WebSocket('ws://localhost:5000')
const sceneManager = new SceneManager()

connection.addEventListener('open', () => {
  console.log('connected')
  send(JSON.stringify(sceneManager.sphereObj()))
})

function send(data) {
  if(connection.readyState === 1){
    connection.send(data)
  } else {
    throw 'Not connected!'
  }
}

document.body.addEventListener('keydown', e =>{
  send(JSON.stringify(sceneManager.sphereObj()))
})

connection.addEventListener('message', (data) => {
  if(sceneManager.getSphere(JSON.parse(data.data))){
    sceneManager.updateSphere(JSON.parse(data.data))
  }else{
    sceneManager.addSphere(JSON.parse(data.data))
  }
})
