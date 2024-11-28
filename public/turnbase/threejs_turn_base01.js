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

import SpriteAnimation2DTileMap from './spriteanimation2dtilemap.js';

const {div,style} = van.tags;

var gridHelper;
const stats = new Stats();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x80a0e0);

window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

const myObject ={
  isRotate:true,
  test:()=>{
    console.log('test');
  },
  resetRotation(){
    cube.rotation.set(0,0,0)
  },
  playerAttack(){
    console.log('attack 1');
  },
  enemyAttack(){
    console.log('attack 2');
  }
}

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'test')
  const debugFolder = gui.addFolder('Debug')
  debugFolder.add(gridHelper,'visible').name('is Grid')
  //debugFolder.add(gridHelper,'visible').name('is Grid')
  const orbitControlsFolder = gui.addFolder('Orbit Controls').show(false)
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
  
  //const cubeFolder = gui.addFolder('Cube').show(false);
  // cubeFolder.add(cube,'visible')
  // cubeFolder.add(myObject,'isRotate')
  // cubeFolder.add(myObject,'resetRotation')

  const battleFolder = gui.addFolder('Battle').show();
  battleFolder.add(myObject,'playerAttack')
  battleFolder.add(myObject,'enemyAttack')
}

function setupEntities(){

  let playerSprite2D = new SpriteAnimation2DTileMap();
  scene.add(playerSprite2D.mesh);

}

function setup_scene(){

  setup_Helpers();

  setupEntities();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}

function animate() {

  // if(myObject.isRotate){
  //   cube.rotation.x += 0.01;
	//   cube.rotation.y += 0.01;
  // }
	
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}

setup_scene()