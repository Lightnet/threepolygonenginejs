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

  const instanceMeshFolder = gui.addFolder('Instance Mesh').show()
  instanceMeshFolder.add(meshInstance, 'count', 0, 5, 1)
  
  // const cubeFolder = gui.addFolder('Cube').show(false)
  // cubeFolder.add(cube,'visible')
  // cubeFolder.add(myObject,'isRotate')
  // cubeFolder.add(myObject,'resetRotation')
}
let meshInstance;
var dummy = new THREE.Object3D();
var sectionWidth = 1;

// https://stackoverflow.com/questions/68828386/change-color-of-instancedmesh-dynamically-in-three-js
// 
function setupInstanceMesh(){


  const spritePlane = new THREE.PlaneGeometry(1, 1);
  console.log("spritePlane: ", spritePlane);
  const spriteMaterial = new THREE.MeshBasicMaterial({
    //map: mapTexture,
    color:'blue',
    side: THREE.DoubleSide,
    transparent:true,
  });

  const spriteMaterial02 = new THREE.MeshBasicMaterial({
    //map: mapTexture,
    color:'red',
    side: THREE.DoubleSide,
    transparent:true,
  });
  const mesh = new THREE.Mesh(spritePlane, spriteMaterial);
  const mesh02 = new THREE.Mesh(spritePlane, spriteMaterial02);
  console.log("mesh02:", mesh02)
  console.log("mesh02 morphTargetInfluences:", mesh02.morphTargetInfluences)
  // mesh02 morphTargetInfluences

  //meshInstance = new THREE.InstancedMesh(new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshNormalMaterial(), 4);
  meshInstance = new THREE.InstancedMesh(spritePlane, spriteMaterial, 5);
  scene.add(meshInstance);
  //setInstancedMeshPositions(meshInstance);
  console.log("meshInstance.count: ", meshInstance.count)
  //meshInstance.count = 1
  
  for ( var i = 0; i < meshInstance.count; i ++ ) {
    var xStaticPosition = -sectionWidth * (i - 1)
    dummy.position.set(xStaticPosition, 0, 0);
    dummy.updateMatrix();
    meshInstance.setMatrixAt( i, dummy.matrix );
    meshInstance.setColorAt(i, new THREE.Color(0xffffff * Math.random()));
    //meshInstance.setMorphAt(i, spritePlane);
    //meshInstance.getMorphAt(i, spritePlane);
  }
  meshInstance.instanceMatrix.needsUpdate = true;
  //meshInstance.morphTexture.needsUpdate = true;
  meshInstance.instanceColor.needsUpdate = true
}


function setInstancedMeshPositions(mesh) {
  for ( var i = 0; i < mesh.count; i ++ ) {
    // we add 200 units of distance (the width of the section) between each.
    var xStaticPosition = -sectionWidth * (i - 1)
    dummy.position.set(xStaticPosition, 0, 0);
    dummy.updateMatrix();
    mesh.setMatrixAt( i, dummy.matrix );
  }
  mesh.instanceMatrix.needsUpdate = true;
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

  // if(myObject.isRotate){
  //   cube.rotation.x += 0.01;
	//   cube.rotation.y += 0.01;
  // }
	
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}


setup_scene()