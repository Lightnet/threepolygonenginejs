/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

const {div,style} = van.tags;

const stats = new Stats();

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
//                                             direction
var plane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 0, 5);
var gridHelper;
var axesHelper;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

//var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  gridHelper.rotation.x = Math.PI / 180 * 90
  scene.add( gridHelper );

  axesHelper = new THREE.AxesHelper( 5 );

  scene.add(axesHelper);
}

const myObject ={
  isRotate:true,
  test:()=>{
    console.log('test');
  },
  resetRotation(){
    cube.rotation.set(0,0,0)
  }
}

var pointer = new THREE.Vector3();

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'test')
  const debugFolder = gui.addFolder('Debug')
  debugFolder.add(gridHelper,'visible').name('is Grid')
  //debugFolder.add(gridHelper,'visible').name('is Grid')
  const orbitControlsFolder = gui.addFolder('Orbit Controls')
  orbitControlsFolder.add(controls, 'autoRotate')
  orbitControlsFolder.add(controls, 'autoRotateSpeed')
  orbitControlsFolder.add(controls, 'dampingFactor')
  orbitControlsFolder.add(controls, 'enableDamping')
  orbitControlsFolder.add(controls, 'enablePan')
  orbitControlsFolder.add(controls, 'enableRotate')
  orbitControlsFolder.add(controls, 'enableZoom')
  orbitControlsFolder.add(controls, 'panSpeed')
  orbitControlsFolder.add(controls, 'rotateSpeed')
  orbitControlsFolder.add(controls, 'screenSpacePanning')
  orbitControlsFolder.add(controls, 'zoomToCursor')
  orbitControlsFolder.add(controls, 'enabled')
  
  const cubeFolder = gui.addFolder('Cube')
  cubeFolder.add(cube,'visible')
  cubeFolder.add(myObject,'isRotate')
  cubeFolder.add(myObject,'resetRotation')

  const pointerFolder = gui.addFolder('Pointer')
  pointerFolder.add(pointer, 'x').listen().disable();
  pointerFolder.add(pointer, 'y').listen().disable();
  pointerFolder.add(pointer, 'z').listen().disable();
}

function onPointerMove(event){
  //console.log("mouse move?");
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  //console.log("mouse: ",mouse)
	raycaster.setFromCamera( mouse, camera );
  let intersects = new THREE.Vector3();
  raycaster.ray.intersectPlane( plane, intersects );
  //console.log( raycaster.ray ); 
	//console.log("hit?", intersects );
  if(intersects){
    //console.log("intersects: ",intersects)
    cube.position.copy(intersects);
    pointer.copy(intersects);
  }
}

function setup_scene(){

  setup_Helpers()

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);

  window.addEventListener( 'pointermove', onPointerMove, { passive: false } );
  
  renderer.setAnimationLoop( animate );
  createGUI();
}

function animate() {

  if(myObject.isRotate){
    cube.rotation.x += 0.01;
	  cube.rotation.y += 0.01;
  }
	
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}


setup_scene()