/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// https://discourse.threejs.org/t/sprite-facing-camera-always/42788/6
// https://discourse.threejs.org/t/how-can-i-rotate-a-sprite-to-face-particular-x-y-coordinates/44629
// 

import { THREE, OrbitControls, ECS, van } from "/dps.js";

const {div, button, label, img} = van.tags;
const direction = new THREE.Vector3();
let speed = 1.0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
//camera.position.set( 0, 0, 5 );
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

function setup_PlaneHelper(){
  const plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 );
  const helper = new THREE.PlaneHelper( plane, 1, 0xffff00 );
  scene.add( helper );
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
  var keyCode = event.which;
  if(event.key == 'w'){
    move_forward();
  }
  if(event.key == 's'){
    move_backward();
  }

  if(event.key == 'a'){
    camera.translateX(-0.5); 
  }

  if(event.key == 'd'){
    camera.translateX(0.5);
  }
};

function move_forward(){
  //camera.getWorldDirection(direction);
  console.log(direction);
  //camera.position.addScaledVector(direction, speed);
  camera.translateZ(-0.5);
}

function move_backward(){
  camera.getWorldDirection(direction);
  console.log(direction);
  camera.position.addScaledVector(direction, speed * -1);
}

//https://discourse.threejs.org/t/move-the-camera-forward-in-the-direction-its-facing/8364/5

controls = new OrbitControls( camera, renderer.domElement );
//must be called after any manual changes to the camera's transform
controls.update();

function animate() {
  if(cube){
    //cube.rotation.x += 0.01;
	  //cube.rotation.y += 0.01;
  }
	
  // required if controls.enableDamping or controls.autoRotate are set to true
  if(controls){
    //controls.update();
  }
	
	renderer.render( scene, camera );
}

//setup_cube();
setup_dir();
//setup_PlaneHelper();
setup_GridHelper();
setup_WorldDir();
renderer.setAnimationLoop( animate );
van.add(document.body, renderer.domElement );