/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://codeburst.io/infinite-scene-with-threejs-and-instancedmesh-adc74b8efcf4

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

//const {div,style} = van.tags;
const stats = new Stats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 0, 5);
var gridHelper;

console.log("window.devicePixelRatio: ", window.devicePixelRatio)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 'lightblue', 1 );
renderer.setPixelRatio( window.devicePixelRatio || 1);
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

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
  meshtest(){
    console.log('test');
    let _dummy = new THREE.Object3D();
    for ( let i = 0; i < count; i++ ) {
      for ( let j = 0; j < count; j++ ) {
    
        _dummy.position.set( i * spacing, j * spacing, 0 );
        _dummy.rotation.y = 2 * Math.PI * Math.random();
        //_dummy.scale.multiplyScalar( Math.random() );
        _dummy.updateMatrix();
        meshInstance.setMatrixAt( i * count + j, _dummy.matrix );
      }
    }
    meshInstance.instanceMatrix.needsUpdate = true;
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

  gui.add(myObject,'meshtest');
  gui.add(meshInstance,'count',0,30,1);
}
let meshInstance;
// https://stackoverflow.com/questions/68828386/change-color-of-instancedmesh-dynamically-in-three-js
// 

const count = 5;
const spacing = 1;
const dummy = new THREE.Object3D();
function setupInstanceMesh(){
  const geoBox = new THREE.BoxGeometry(1,1,1);
  const spriteMaterial = new THREE.MeshBasicMaterial({
    //map: mapTexture,
    color:'blue',
    //side: THREE.DoubleSide,
    //transparent:true,
  });

  meshInstance = new THREE.InstancedMesh(geoBox, spriteMaterial, 30);
  
  scene.add(meshInstance);

  for ( let i = 0; i < count; i++ ) {
    for ( let j = 0; j < count; j++ ) {
      dummy.position.set( i * spacing, j * spacing, 0 );
      dummy.rotation.y = 2 * Math.PI * Math.random();
      //dummy.scale.multiplyScalar( Math.random() *1);
      dummy.updateMatrix();
      meshInstance.setMatrixAt( i * count + j, dummy.matrix );
    }
  }
  meshInstance.instanceMatrix.needsUpdate = true;
  //meshInstance.instanceColor.needsUpdate = true;
}

function setup_scene(){

  setup_Helpers();
  setupInstanceMesh();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}

function animate() {
	
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}


setup_scene()