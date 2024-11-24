/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://sbcode.net/threejs/transform-controls/
// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_transform.html
// 

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import { TransformControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/TransformControls.js';

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
var orbitControls;
var transformControls;
var gridHelper;

function animate() {
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
  stats.update();
  orbitControls.update();
	renderer.render( scene, camera );
}

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );

  orbitControls = new OrbitControls( camera, renderer.domElement );

  transformControls = new TransformControls(camera, renderer.domElement )
  transformControls.addEventListener( 'dragging-changed', function ( event ) {
    orbitControls.enabled = ! event.value;
  })
  transformControls.attach(cube);
  const gizmo = transformControls.getHelper();
  scene.add(gizmo)

  window.addEventListener( 'keydown', function ( event ) {
    switch ( event.key ) {
      case 'q':
				transformControls.setSpace( transformControls.space === 'local' ? 'world' : 'local' );
				break;
      case 'w':
        transformControls.setMode( 'translate' );
        break;

      case 'e':
        transformControls.setMode( 'rotate' );
        break;

      case 'r':
        transformControls.setMode( 'scale' );
        break;
      case '+':
      case '=':
        transformControls.setSize( transformControls.size + 0.1 );
        break;
      case '-':
      case '_':
        transformControls.setSize( Math.max( transformControls.size - 0.1, 0.1 ) );
        break;

      case 'x':
        transformControls.showX = ! transformControls.showX;
        break;

      case 'y':
        transformControls.showY = ! transformControls.showY;
        break;

      case 'z':
        transformControls.showZ = ! transformControls.showZ;
        break;

      case ' ':
        transformControls.enabled = ! transformControls.enabled;
        break;

      case 'Escape':
        transformControls.reset();
        break;

    }
  })
}

const myObject ={
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
  orbitControlsFolder.add(orbitControls, 'autoRotate')
  orbitControlsFolder.add(orbitControls, 'autoRotateSpeed')
  orbitControlsFolder.add(orbitControls, 'dampingFactor')
  orbitControlsFolder.add(orbitControls, 'enableDamping')
  orbitControlsFolder.add(orbitControls, 'enablePan')
  orbitControlsFolder.add(orbitControls, 'enableRotate')
  orbitControlsFolder.add(orbitControls, 'enableZoom')
  orbitControlsFolder.add(orbitControls, 'panSpeed')
  orbitControlsFolder.add(orbitControls, 'rotateSpeed')
  orbitControlsFolder.add(orbitControls, 'screenSpacePanning')
  orbitControlsFolder.add(orbitControls, 'zoomToCursor')
  orbitControlsFolder.add(orbitControls, 'enabled')
  
  const cubeFolder = gui.addFolder('Cube')
  cubeFolder.add(cube,'visible')
}

function setup_scene(){

  setup_Helpers()

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}


setup_scene()