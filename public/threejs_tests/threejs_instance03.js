/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://codeburst.io/infinite-scene-with-threejs-and-instancedmesh-adc74b8efcf4
// https://threejs.org/examples/webgl_instancing_dynamic
// https://discourse.threejs.org/t/directly-remove-instancedmesh-instance/25504/2

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
camera.position.set(0, 10, 10);
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
  genMeshInstance(){
    for ( let i = 0; i < count; i++ ) {
      for ( let j = 0; j < count; j++ ) {
        dummy.position.set( i * spacing, j * spacing, 0 );
        //dummy.position.set( i + 1,0, 0 );
        dummy.rotation.y = 2 * Math.PI * Math.random();
        //dummy.scale.multiplyScalar( Math.random() );
        dummy.updateMatrix();
        //console.log("POS:", dummy.position)
        console.log("COUNT:", i * count + j)
        meshInstance.setMatrixAt( i * count + j, dummy.matrix );
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

  gui.add(myObject,'genMeshInstance');
  
  // const cubeFolder = gui.addFolder('Cube').show(false)
  // cubeFolder.add(cube,'visible')
  // cubeFolder.add(myObject,'isRotate')
  // cubeFolder.add(myObject,'resetRotation')
}
let meshInstance;
// https://stackoverflow.com/questions/68828386/change-color-of-instancedmesh-dynamically-in-three-js
// 

const spacing = 1;
const dummy = new THREE.Object3D();
const count = 5;
function setupInstanceMesh(){

  const count = 5;
  const geoBox = new THREE.BoxGeometry();
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
      //dummy.position.set( i + 1,0, 0 );
      dummy.rotation.y = 2 * Math.PI * Math.random();
      //dummy.scale.multiplyScalar( Math.random() );
      dummy.updateMatrix();
      //console.log("POS:", dummy.position)
      meshInstance.setMatrixAt( i * count + j, dummy.matrix );
    }
  }
  meshInstance.instanceMatrix.needsUpdate = true;
  //meshInstance.instanceColor.needsUpdate = true;
}
let countTime = 0;
let z = 0;
function update_inMesh(){
  countTime++;
  if(countTime> 100){
    countTime = 0;
    // z+=0.1;
    // if(z>5){
    //   z=0;
    // }
    for ( let i = 0; i < count; i++ ) {
      for ( let j = 0; j < count; j++ ) {
        dummy.position.set( i * spacing, j * spacing, z );
        dummy.rotation.y = 2 * Math.PI * Math.random();
        dummy.updateMatrix();
        //console.log("POS:", dummy.position)
        meshInstance.setMatrixAt( i * count + j, dummy.matrix );
      }
    }
    meshInstance.instanceMatrix.needsUpdate = true;
  }
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

  update_inMesh();
	
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}


setup_scene()