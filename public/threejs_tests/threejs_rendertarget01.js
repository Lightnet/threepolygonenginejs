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
import * as CameraUtils from 'https://unpkg.com/three@0.170.0/examples/jsm/utils/CameraUtils.js';


const {div,style} = van.tags;
var gridHelper;

const stats = new Stats();
const clock = new THREE.Clock();
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

function createMeshBox(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const box = new THREE.Mesh( geometry, material );
  return box;
}
let cube = createMeshBox();
scene.add( cube );

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
}

var renderTarget;
var planeRenderTarget;

function setupTargetRender(){

  //const planeGeo = new THREE.PlaneGeometry( 100.1, 100.1 );
  const planeGeo = new THREE.PlaneGeometry( 4, 4 );

  renderTarget = new THREE.WebGLRenderTarget( 256, 256 );
  planeRenderTarget = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { map: renderTarget.texture } ) );
  //planeRenderTarget.position.x = - 30;
  //planeRenderTarget.position.y = 20;
  planeRenderTarget.position.y = 2;
  planeRenderTarget.scale.set( 0.35, 0.35, 0.35 );
  scene.add( planeRenderTarget );
}

function setup_scene(){

  setup_Helpers();

  setupTargetRender();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}

var portalCamera = new THREE.PerspectiveCamera( 45, 1.0, 0.1, 500.0 );
scene.add( portalCamera );
var bottomLeftCorner = new THREE.Vector3();
var bottomRightCorner = new THREE.Vector3();
var topLeftCorner = new THREE.Vector3();
var reflectedPosition = new THREE.Vector3();

function renderTargetTexture(meshRenderTarget, renderTarget){

  meshRenderTarget.worldToLocal( reflectedPosition.copy( camera.position ) );
  reflectedPosition.x *= - 1.0; reflectedPosition.z *= - 1.0;
  portalCamera.position.copy( reflectedPosition );

  // bottomLeftCorner.set( 50.05, - 50.05, 0.0 )
  // bottomRightCorner.set( - 50.05, - 50.05, 0.0 )
  // topLeftCorner.set( 50.05, 50.05, 0.0 )

  bottomLeftCorner.set(2.05, - 2.05, 0.0 )
  bottomRightCorner.set( - 2.05, - 2.05, 0.0 )
  topLeftCorner.set( 2.05, 2.05, 0.0 )

  CameraUtils.frameCorners( portalCamera, bottomLeftCorner, bottomRightCorner, topLeftCorner, false );

  // render the portal
  renderTarget.texture.colorSpace = renderer.outputColorSpace;
  renderer.setRenderTarget( renderTarget );
  renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897
  if ( renderer.autoClear === false ) renderer.clear();
  meshRenderTarget.visible = false; // hide this portal from its own rendering
  renderer.render( scene, portalCamera );
  meshRenderTarget.visible = true; // re-enable this portal's visibility for general rendering


}

function updateRenderTarget(){
  // save the original camera properties
  const currentRenderTarget = renderer.getRenderTarget();
  const currentXrEnabled = renderer.xr.enabled;
  const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
  renderer.xr.enabled = false; // Avoid camera modification
  renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

  //rendertarget here...
  renderTargetTexture(planeRenderTarget, renderTarget);

  // restore the original rendering properties
  renderer.xr.enabled = currentXrEnabled;
  renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
  renderer.setRenderTarget( currentRenderTarget );
}

function animate() {

  if(myObject.isRotate){
    cube.rotation.x += 0.01;
	  cube.rotation.y += 0.01;
  }
	
  stats.update();
  controls.update();

  updateRenderTarget();


	renderer.render( scene, camera );
}

setup_scene()