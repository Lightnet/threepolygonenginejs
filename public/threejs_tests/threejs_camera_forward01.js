/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Information: Simple camera control test movment input no rotate camera.
*/
// https://discourse.threejs.org/t/move-the-camera-forward-in-the-direction-its-facing/8364/5
// https://discourse.threejs.org/t/sprite-facing-camera-always/42788/6
// https://discourse.threejs.org/t/how-can-i-rotate-a-sprite-to-face-particular-x-y-coordinates/44629
// https://stackoverflow.com/questions/69196643/threejs-how-to-move-the-camera-to-the-left-or-right-independent-of-its-rotation
// https://threejs.org/docs/#api/en/core/Object3D
// Translate an object by distance along an axis in object space. The axis is assumed to be normalized.
// .translateX ( distance : Float ) : this


//import { THREE, OrbitControls, ECS, van } from "/dps.js";
//import { FloatingWindow } from "vanjs-ui";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

const {div, button, label, img} = van.tags;
const stats = new Stats();
van.add(document.body, stats.dom);

//const direction = new THREE.Vector3();
//const velocity = new THREE.Vector3();
const input = new THREE.Vector3();
let speed = 1.0;

const scene = new THREE.Scene();
const orbit_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//orbit_camera.position.z = 5;
orbit_camera.position.set( 0, 1, 5 );
var controls;
var cube;

const renderer = new THREE.WebGLRenderer();
//renderer.setClearColor( 0xffffff, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

function setup_cube(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00,wireframe:true } );
  cube = new THREE.Mesh( geometry, material0 );
  scene.add( cube );
}

function setup_GridHelper(){
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

function setup_WorldDir(){
  const dir = new THREE.Vector3( 0, 0, 0 );
  let obj3d = new THREE.Object3D();
  obj3d.getWorldDirection(dir);
  console.log("getWorldDirection : ",dir);
}
//===============================================
// INPUT
//===============================================
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

//===============================================
// LOOP RENDER
//===============================================
// https://stackoverflow.com/questions/45343673/three-js-animate-in-real-time
var clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  //console.log("delta: ", delta);
  if(stats){
    stats.update();
  }
  if(cube){
    //cube.rotation.x += 0.01;
	  //cube.rotation.y += 0.01;
  }

  update_camera_move(delta)
  // required if controls.enableDamping or controls.autoRotate are set to true
  if(controls){
    //controls.update();
  }
	
	renderer.render( scene, orbit_camera );
}
//===============================================
// SETUP ELEMENT DISPLAY
//===============================================
function setup_el(){
  van.add(document.body,div({style:`
    position:absolute;
  left:0;
  top:60px;
  fontsize:24px;
  color:white;
  margin:8px;
    `},
    div('W,A,S,D KEY = Move Camera'),
  ))
}
//===============================================
// GUI
//===============================================
const myWorld ={
  pos:{x:0,y:0,z:0},
  getCameraDir:function(){
    const dir = new THREE.Vector3( 0, 0, 0 );
    orbit_camera.getWorldDirection(dir);
    console.log("get Camera Direction : ",dir);
  },
  getCameraPos:function(){
    let pos = new THREE.Vector3( 0, 0, 0 );
    orbit_camera.getWorldPosition(pos);
    console.log("get Camera Direction : ",pos);
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.pos.z = pos.z;
  },
  resetCamera:function(){
    orbit_camera.position.set(0,1,3)
    orbit_camera.rotation.set(0,0,0)
  }
}
function createUI(){
  const gui = new GUI();
  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(myWorld,'getCameraDir').name('Get Dir')
  cameraFolder.add(myWorld,'getCameraPos').name('Get Pos')
  const camPosFolder = cameraFolder.addFolder('Position');
  camPosFolder.add(orbit_camera.position,'x',-10,10).name('X: ')
  camPosFolder.add(orbit_camera.position,'y',-10,10).name('Y: ')
  camPosFolder.add(orbit_camera.position,'z',-10,10).name('Z: ')
  const camRotFolder = cameraFolder.addFolder('Rotate');
  camRotFolder.add(orbit_camera.rotation,'x',-3,3).name('X: ')
  camRotFolder.add(orbit_camera.rotation,'y',-3,3).name('Y: ')
  camRotFolder.add(orbit_camera.rotation,'z',-3,3).name('Z: ')
  gui.add(myWorld,'resetCamera')

  //gui.onChange(()=>{
    //change
  //});
}
//===============================================
// SETUP
//===============================================
function setup(){
  setup_el();
  setup_cube();
  setup_GridHelper();
  setup_WorldDir();
  createUI();
}

setup();

renderer.setAnimationLoop( animate );
van.add(document.body, renderer.domElement );