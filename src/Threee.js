
//**********************VISUALS**************************//
// Create an empty scene
let scene = new THREE.Scene();

// Create a basic perspective camera
let camera = new THREE.PerspectiveCamera( 15, window.innerWidth/window.innerHeight, 0.1, 1000 );

// Create a renderer with Antialiasing
let renderer = new THREE.WebGLRenderer({antialias:true});

//Create orbit controls for camera
let controls = new THREE.OrbitControls( camera )
camera.position.z = 10;

// Configure renderer clear color
renderer.setClearColor("#000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

//creating materials
let materials = []
materials[0] = new THREE.MeshLambertMaterial({color: "#fff", transparent: true, opacity: 0.1, side: THREE.FrontSide})
materials[1] = new THREE.MeshLambertMaterial({color: "#fff", transparent: true, opacity: 0.1, side: THREE.BackSide })

//creating plane geometries
let translation = 0
let planes = new THREE.Group()
for(let i = 0; i <= 16; i++){
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
var planeGeometry = new THREE.PlaneGeometry( 1, 1 );
planeGeometry.translate(0.0, 0.0, -0.5625)
var planeMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
scene.add( plane );

//Creating sphere
var sphereGeometry = new THREE.SphereGeometry( 0.05, 32, 32 );
sphereGeometry.translate(0.0, 0.0, 0.0)
var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add( sphere );

let clock = new THREE.Clock({autoStart: true})

//creating and adding lighting
let lights = [];
lights[ 0 ] = new THREE.DirectionalLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.DirectionalLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.DirectionalLight( 0xffffff, 1, 0 );
lights[ 3 ] = new THREE.DirectionalLight( 0xffffff, 1, 0 );
lights[ 4 ] = new THREE.DirectionalLight( 0xffffff, 1, 0 );
lights[ 5 ] = new THREE.DirectionalLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 0, 2 );
lights[ 1 ].position.set( 0, 0, -2 );
lights[ 2 ].position.set( 0, 2, 0 );
lights[ 3 ].position.set( 0, -2, 0 );
lights[ 4 ].position.set( 2, 0, 0 );
lights[ 5 ].position.set( -2, 0, 0 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );
scene.add( lights[ 3 ] );
scene.add( lights[ 4 ] );
scene.add( lights[ 5 ] );

//Sphere position controls
var xSpeed = 0.02040816326;
var ySpeed = 0.02040816326;
var zSpeed = 0.0625;
document.addEventListener("keydown", onDocumentKeyDown, false)
function onDocumentKeyDown(event) {
  var keyCode = event.which
  if (keyCode == 87 && sphere.position.y < 0.5) {
    sphere.translateY(ySpeed)
  } else if (keyCode == 83 && sphere.position.y > -0.5) {
    sphere.translateY(-ySpeed)
  } else if (keyCode == 65 && sphere.position.x > -0.5) {
    sphere.translateX(-xSpeed)
  } else if (keyCode == 68 && sphere.position.x < 0.5) {
    sphere.translateX(xSpeed)
  } else if (keyCode == 90 && sphere.position.z < 0.5) {
    sphere.translateZ(zSpeed)
  }else if (keyCode == 88 && sphere.position.z > -0.5) {
    sphere.translateZ(-zSpeed)
  }else if (keyCode == 32) {
    sphere.translate(0, 0, 0)
  }else if(sphere.position.y > 0.5){
    sphere.position.y = 0.5
  }else if(sphere.position.y < -0.5){
    sphere.position.y = -0.5
  }else if(sphere.position.x > 0.5){
    sphere.position.x = 0.5
  }else if(sphere.position.x < -0.5){
    sphere.position.x = -0.5
  }
}

let mapNote = function (num, inMin, inMax, outMin, outMax) {
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Render Loop
let zed = 0
let zedMove = 0.0625/8
let playsound = true
let mappedX
let context = new (window.AudioContext || window.webkitAudioContext)()

let render = function () {
  requestAnimationFrame( render );
  controls.update()

  plane.translateZ(zedMove)
  zed += zedMove
  if(zed >= 1){
    plane.position.set(0.0, 0.0, 0.0625)
    zed = 0
  }
  mappedX = Math.floor(mapNote(sphere.position.x, -0.5, 0.5, 0, 48))

  if(sphere.position.z + 0.5 === plane.position.z){
    let newSound = new Sound(context)
    console.log(mappedX.toString())
    console.log(sphere.position.x)
    newSound.play(notes[mappedX.toString()], context.currentTime)
  }

  planes.translateZ(-0.5)
  // Render the scene
  renderer.render(scene, camera);
  planes.translateZ(0.5)
};

render();
