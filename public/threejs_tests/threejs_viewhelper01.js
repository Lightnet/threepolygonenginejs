/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// note some changes?
// viewhelper remove letter?

// https://discourse.threejs.org/t/changing-position-of-viewhelper/59992/2
// https://codesandbox.io/p/sandbox/xenodochial-aryabhata-pcdb5v?file=%2Fsrc%2Findex.js%3A69%2C19
// https://jsfiddle.net/7rdv6ox3/
// https://codesandbox.io/p/sandbox/muddy-butterfly-65r8hq?file=%2Fsrc%2FViewHelper.js
// 

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

import { ViewHelper  } from 'https://unpkg.com/three@0.170.0/examples/jsm/helpers/ViewHelper.js';

const {div,style} = van.tags;

const stats = new Stats();

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 0, 5);
var gridHelper;

const renderer = new THREE.WebGLRenderer({ 
  antialias: true 
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.autoClear = false;
//renderer.setClearColor( 0xffffff, 1 );

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
var controls;
var viewhelper;

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );

  controls = new OrbitControls( camera, renderer.domElement );

  viewhelper = new ViewHelper( camera, renderer.domElement );
  console.log(viewhelper);
  viewhelper.setLabels("X","Y","Z");//not set to default that depend on the what program.
  viewhelper.controls = controls;
  viewhelper.controls.center = controls.target;

  const divHelper = div({id:'viewHelper',style:`position:absolute;right:0px;bottom:0px;width:128px;height:128px;`})
  van.add(document.body,divHelper);
  
  divHelper.addEventListener( 'pointerup', (event) => viewhelper.handleClick( event ) );

  // axes
  scene.add( new THREE.AxesHelper( 20 ) );
}

const myObject ={
  isRotate:true,
  test:()=>{
    console.log('test');
  }
}

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
}

function setup_scene(){

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);

  // ambient
  scene.add( new THREE.AmbientLight( 0x222222 ) );
    
  // light
  const light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 20,20, 0 );
  scene.add( light );

  setup_Helpers()
  
  renderer.setAnimationLoop( animate );
  createGUI();
}

function animate() {
  const delta = clock.getDelta();
  if ( viewhelper.animating ) viewhelper.update( delta );
  if(myObject.isRotate){
    cube.rotation.x += 0.01;
	  cube.rotation.y += 0.01;
  }
	
  stats.update();
  controls.update();
  renderer.clear();
  
	renderer.render( scene, camera );
  viewhelper.render( renderer );
  
  //viewhelper.render();
}


setup_scene()