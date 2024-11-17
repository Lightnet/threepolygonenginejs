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


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 0, 5);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );

function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

const myObject ={
  test:()=>{
    console.log('test');
  }
}

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'test')
}

function setup_scene(){

  setup_Helpers()

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}


setup_scene()