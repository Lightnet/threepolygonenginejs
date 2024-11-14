/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Information: Simple camera control test movment input no rotate camera.
*/

// https://discourse.threejs.org/t/sprite-facing-camera-always/42788/6
// https://discourse.threejs.org/t/how-can-i-rotate-a-sprite-to-face-particular-x-y-coordinates/44629
// 

import { THREE, OrbitControls, ECS, van } from "/dps.js";
//import { FloatingWindow } from "vanjs-ui";

const {div, button, label, img} = van.tags;

//const direction = new THREE.Vector3();
//const velocity = new THREE.Vector3();
const input = new THREE.Vector3();
let speed = 1.0;

const scene = new THREE.Scene();
const orbit_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
orbit_camera.position.z = 5;
//orbit_camera.position.set( 0, 0, 5 );
var controls;
var cube;

const renderer = new THREE.WebGLRenderer();
//renderer.setClearColor( 0xffffff, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );

function setup_cube(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material0 );
  scene.add( cube );
}

function setup_dir(){
  const dir = new THREE.Vector3( 1, 2, 0 );
  //normalize the direction vector (convert to vector of length 1)
  dir.normalize();

  const origin = new THREE.Vector3( 0, 0, 0 );
  const length = 1;
  const hex = 0xffff00;

  const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
  scene.add( arrowHelper );
}

function setup_GridHelper(){
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}
// https://stackoverflow.com/questions/69196643/threejs-how-to-move-the-camera-to-the-left-or-right-independent-of-its-rotation
// https://threejs.org/docs/#api/en/core/Object3D
// Translate an object by distance along an axis in object space. The axis is assumed to be normalized.
// .translateX ( distance : Float ) : this
function setup_WorldDir(){
  const dir = new THREE.Vector3( 0, 0, 0 );
  let obj3d = new THREE.Object3D();
  obj3d.getWorldDirection(dir);
  console.log("getWorldDirection : ",dir);
}

window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

document.addEventListener("keydown", onKeyDown, false);
function onKeyDown(event) {
  //console.log(event)
  if(event.code == 'KeyW'){
    input.z = -speed;
  }
  if(event.code == 'KeyA'){
    input.x = -speed;
  }
  if(event.code == 'KeyS'){
    input.z = speed;
  }
  if(event.code == 'KeyD'){
    input.x = speed;
  }
};
document.addEventListener("keyup", onKeyUp, false);
function onKeyUp(event) {
  //console.log(event)
  if(event.code == 'KeyW'){
    input.z = 0;
  }
  if(event.code == 'KeyA'){
    input.x = 0;
  }
  if(event.code == 'KeyS'){
    input.z = 0;
  }
  if(event.code == 'KeyD'){
    input.x = 0;
  }
};

function update_camera_move(dt){
  //console.log(direction);
  //console.log("input:", input);
  if(input.z !=0 ){
    //console.log("move z?");
    orbit_camera.translateZ(input.z * dt);
  }
  if(input.x !=0 ){ 
    //console.log("move x?");
    orbit_camera.translateX(input.x * dt);
  }
}

//https://discourse.threejs.org/t/move-the-camera-forward-in-the-direction-its-facing/8364/5

//controls = new OrbitControls( orbit_camera, renderer.domElement );
//must be called after any manual changes to the camera's transform
//controls.update();
// https://stackoverflow.com/questions/45343673/three-js-animate-in-real-time
var clock = new THREE.Clock();
function animate() {
  const deltaTime = clock.getDelta();
  //console.log("delta: ", delta);
  if(cube){
    //cube.rotation.x += 0.01;
	  //cube.rotation.y += 0.01;
  }

  update_camera_move(deltaTime)
	
  // required if controls.enableDamping or controls.autoRotate are set to true
  if(controls){
    //controls.update();
  }
	
	renderer.render( scene, orbit_camera );
}

//setup_cube();
setup_dir();
setup_GridHelper();
setup_WorldDir();
renderer.setAnimationLoop( animate );
van.add(document.body, renderer.domElement );