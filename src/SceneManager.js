import * as THREE from 'three';
import Sound from './sound.js'
import notes from './notes.js'
import OrbitControls from 'three-orbitcontrols'
import uuidv4 from 'uuid/v4'

export default canvas => {

  let scene = new THREE.Scene();

  // Create a basic perspective camera
  let camera = new THREE.PerspectiveCamera( 15, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.z = 10;

  // Create a renderer with Antialiasing
  //This is where the canvas that is passed in gets used
  let renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

  //Create orbit controls for camera
  let controls = new OrbitControls( camera )

  // Set renderer clear color
  renderer.setClearColor("#000");

  // Set renderer size and resize
  renderer.setSize( window.innerWidth, window.innerHeight );
  window.addEventListener('resize', ()=>{
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })

   // var HOST = location.origin.replace(/^http/, 'ws')
  const connection = new WebSocket('ws://localhost:5000')

  connection.addEventListener('open', () => {
    console.log('connected')
    send(JSON.stringify(sphereObj()))
  })

  function send(data) {
    if(connection.readyState === 1){
      connection.send(data)
    } else {
      throw 'Not connected!'
    }
  }

  // connection.addEventListener('close', (data) => {
  //   removeSphere(JSON.parse(data.data))
  // })

  window.onbeforeunload = function(){
    let sphere = sphereObj()
    sphere.remove = true
    send(JSON.stringify(sphere))
  }

  connection.addEventListener('message', (data) => {
    let newData = JSON.parse(data.data)
    if(!newData.remove){
      if(getSphere(JSON.parse(data.data))){
        updateSphere(JSON.parse(data.data))
      }else{
        addSphere(JSON.parse(data.data))
        updateSphere(JSON.parse(data.data))
        send(JSON.stringify(sphereObj()))
      }
    } else {
      removeSphere(JSON.parse(data.data))
    }
  })

  let addSphere = (data) => {
    let sphereGeometry = new THREE.SphereGeometry( 0.02, 32, 32 );
    let sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
    let sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphere.name = data.name
    scene.add(sphere)
    spheres.push(sphere)
  }

  let removeSphere = (data) => {
    console.log('removing sphere')
    let sphere = scene.getObjectByName(data.name)
    let index = spheres.indexOf(sphere)
    spheres.splice(index, 1)
    scene.remove(sphere)
  }

  let updateSphere = (data) => {
    let sphere = scene.getObjectByName(data.name)
    sphere.position.set(data.x, data.y, data.z)
  }

  let getSphere = (data) => {
    let sphere = scene.getObjectByName(data.name)
    return sphere ? true : false
  }

  //creating materials
  let materials = []
  materials[0] = new THREE.MeshLambertMaterial({color: "#fff", transparent: true, opacity: 0.1, side: THREE.FrontSide})
  materials[1] = new THREE.MeshLambertMaterial({color: "#fff", transparent: true, opacity: 0.1, side: THREE.BackSide })

  //creating plane geometries
  let translation = 0
  let planes = new THREE.Group()
  for(let i = 0; i <= 15; i++){
    let plane = new THREE.BoxGeometry( 1, 1, 0.001 );
    plane.translate(0.0, 0.0, translation)
    translation += 0.0625
    let mesh0 = new THREE.Mesh( plane, materials[0] )
    let mesh1 = new THREE.Mesh( plane, materials[1] )
    planes.add(mesh0)
    planes.add(mesh1)
  }
  scene.add(planes)

  //creating counting plane
  let planeGeometry = new THREE.PlaneGeometry( 1, 1 );
  planeGeometry.translate(0.0, 0.0, -0.5625)
  let planeMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0} );
  let plane = new THREE.Mesh( planeGeometry, planeMaterial );
  scene.add( plane );

  let grid = new THREE.Group()
  let spacing = 0
  for(let i = 0; i < 49; i++){
    let material = new THREE.LineBasicMaterial( { color: 0xffff00 } );
    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( spacing - 0.5, -0.5, -0.5625) );
    geometry.vertices.push(new THREE.Vector3( spacing - 0.5, 0.5, -0.5625) );
    let geometry1 = new THREE.Geometry();
    geometry1.vertices.push(new THREE.Vector3(-0.5, spacing - 0.5, -0.5625) );
    geometry1.vertices.push(new THREE.Vector3(0.5, spacing - 0.5, -0.5625) );
    spacing += 1/48
    let line = new THREE.Line(geometry, material)
    let line1 = new THREE.Line(geometry1, material)
    grid.add(line)
    grid.add(line1)
  }
  scene.add(grid)

  //Creating sphere
  let sphereColor = 0x0000ff
  let sphereGeometry = new THREE.SphereGeometry( 0.04, 32, 32 );
  // sphereGeometry.translate(0.0, 0.0, 0.0)
  let sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
  let sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  sphere.name = uuidv4()
  scene.add( sphere );

  //Creating dummy spheres
  let spheres = []
  spheres.push(sphere)

  //creating and adding lighting
  let lights = [];
  for(let i = 0; i < 6; i++){
    let light = new THREE.DirectionalLight( 0xffffff, 1, 0 )
    lights.push(light)
  }

  lights[ 0 ].position.set( 0, 0, 1 );
  lights[ 1 ].position.set( 0, 0, -1 );
  lights[ 2 ].position.set( 0, 1, 0 );
  lights[ 3 ].position.set( 0, -1, 0 );
  lights[ 4 ].position.set( 1, 0, 0 );
  lights[ 5 ].position.set( -1, 0, 0 );

  lights.forEach(light => {
    scene.add(light)
  })

  //Sphere position controls
  let xSpeed = 0.02127659574
  let ySpeed = 0.02127659574
  let zSpeed = 0.0625;

  document.addEventListener("keydown", onDocumentKeyDown, false)
  function onDocumentKeyDown(event) {
    let keyCode = event.which
    if (keyCode === 87 && sphere.position.y < 0.5) {
      sphere.translateY(ySpeed)
      send(JSON.stringify(sphereObj()))
    } else if (keyCode === 83 && sphere.position.y > -0.5) {
      sphere.translateY(-ySpeed)
      send(JSON.stringify(sphereObj()))
    } else if (keyCode === 65 && sphere.position.x > -0.5) {
      sphere.translateX(-xSpeed)
      send(JSON.stringify(sphereObj()))
    } else if (keyCode === 68 && sphere.position.x < 0.5) {
      sphere.translateX(xSpeed)
      send(JSON.stringify(sphereObj()))
    } else if (keyCode === 90 && sphere.position.z < 0.4375) {
      sphere.translateZ(zSpeed)
      send(JSON.stringify(sphereObj()))
    }else if (keyCode === 88 && sphere.position.z > -0.5) {
      sphere.translateZ(-zSpeed)
      send(JSON.stringify(sphereObj()))
    }else if (keyCode === 32) {
      sphere.translate(0, 0, 0)
      send(JSON.stringify(sphereObj()))
    }else if(sphere.position.y > 0.5){
      sphere.position.y = 0.5
      send(JSON.stringify(sphereObj()))
    }else if(sphere.position.y < -0.5){
      sphere.position.y = -0.5
      send(JSON.stringify(sphereObj()))
    }else if(sphere.position.x > 0.5){
      sphere.position.x = 0.5
      send(JSON.stringify(sphereObj()))
    }else if(sphere.position.x < -0.5){
      sphere.position.x = -0.5
      send(JSON.stringify(sphereObj()))
    }
  }

  let mapNote = function (num, inMin, inMax, outMin, outMax) {
    return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  // Render Loop
  let zed = 0
  let zedMove = 0.0625/8
  let mappedX
  let mappedDistortion
  let howLong
  let context = new (window.AudioContext || window.webkitAudioContext)()

  let render = function () {
    requestAnimationFrame(render)
    controls.update()
    grid.translateZ(zedMove)
    plane.translateZ(zedMove)
    zed += zedMove
    if(zed >= 1){
      grid.position.set(0.0, 0.0, 0.0)
      plane.position.set(0.0, 0.0, 0.0)
      zed = 0
    }

    spheres.forEach(sphere => {

      if(sphere.position.z + 0.5 + zedMove + zedMove + zedMove === plane.position.z){
        mappedX = Math.floor(mapNote(sphere.position.x, -0.5, 0.5, 0, 48))
        mappedDistortion = mapNote(sphere.position.y, -0.5, 0.5, 0, 100)
        howLong = mapNote(sphere.position.y, -0.5, 0.5, 0.2, 1)
        let newSound = new Sound(context)
        newSound.play(notes[mappedX.toString()], context.currentTime, howLong, mappedDistortion)
      }
    })

    planes.translateZ(-0.5)
    renderer.render(scene, camera);
    planes.translateZ(0.5)
  };


  let sphereObj = function(){
    return {
      x: sphere.position.x,
      y: sphere.position.y,
      z: sphere.position.z,
      color: sphereColor,
      name: sphere.name,
      remove: false
    }
  }

    return {
      render,
      sphereObj,
      addSphere,
      updateSphere,
      getSphere,
      send
    }
}
