/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// three/addons/ = https://unpkg.com/three@0.170.0/examples/jsm/
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

import * as CameraUtils from 'https://unpkg.com/three@0.170.0/examples/jsm/utils/CameraUtils.js';
import { TransformControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/TransformControls.js';




const {div,style} = van.tags;
var gridHelper;

let portalCamera, leftPortal, rightPortal, leftPortalTexture, reflectedPosition,
  rightPortalTexture, bottomLeftCorner, bottomRightCorner, topLeftCorner;

let smallSphereOne, smallSphereTwo;

const stats = new Stats();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
//camera.position.set(0, 0, 5);
camera.position.set( 0, 75, 160 );

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x80a0e0);

renderer.localClippingEnabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;


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
// let cube = createMeshBox();
// scene.add( cube );

var orbitControls = new OrbitControls( camera, renderer.domElement );
orbitControls.target.set( 0, 40, 0 );
orbitControls.maxDistance = 400;
orbitControls.minDistance = 10;
orbitControls.update();

const transformControls = new TransformControls(camera, renderer.domElement);
console.log(transformControls);
const gizmo = transformControls.getHelper();
scene.add(gizmo);

//transformControls.attach(cube)

transformControls.addEventListener( 'dragging-changed', function ( event ) {
  orbitControls.enabled = ! event.value;
});

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

function setupHelpers(){
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
    //cube.rotation.set(0,0,0)
  }
}

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'test')
  const debugFolder = gui.addFolder('Debug')
  debugFolder.add(gridHelper,'visible').name('is Grid')
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
  
  // const cubeFolder = gui.addFolder('Cube')
  // cubeFolder.add(cube,'visible')
  // cubeFolder.add(myObject,'isRotate')
  // cubeFolder.add(myObject,'resetRotation')
}

function setupTest(){

  const planeGeo = new THREE.PlaneGeometry( 100.1, 100.1 );

  // bouncing icosphere
  const portalPlane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0.0 );
  const geometry = new THREE.IcosahedronGeometry( 5, 0 );
  const material = new THREE.MeshPhongMaterial( {
    color: 0xffffff, emissive: 0x333333, flatShading: true,
    clippingPlanes: [ portalPlane ], clipShadows: true });
  smallSphereOne = new THREE.Mesh( geometry, material );
  scene.add( smallSphereOne );
  transformControls.attach(smallSphereOne)

  smallSphereTwo = new THREE.Mesh( geometry, material );
  scene.add( smallSphereTwo );

  //transformControls.attach(smallSphereTwo)

  // portals
  portalCamera = new THREE.PerspectiveCamera( 45, 1.0, 0.1, 500.0 );
  scene.add( portalCamera );
  //frustumHelper = new THREE.CameraHelper( portalCamera );
  //scene.add( frustumHelper );
  bottomLeftCorner = new THREE.Vector3();
  bottomRightCorner = new THREE.Vector3();
  topLeftCorner = new THREE.Vector3();
  reflectedPosition = new THREE.Vector3();

  leftPortalTexture = new THREE.WebGLRenderTarget( 256, 256 );
  leftPortal = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { map: leftPortalTexture.texture } ) );
  leftPortal.position.x = - 30;
  leftPortal.position.y = 20;
  leftPortal.scale.set( 0.35, 0.35, 0.35 );
  scene.add( leftPortal );

  rightPortalTexture = new THREE.WebGLRenderTarget( 256, 256 );
  rightPortal = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { map: rightPortalTexture.texture } ) );
  rightPortal.position.x = 30;
  rightPortal.position.y = 20;
  rightPortal.scale.set( 0.35, 0.35, 0.35 );
  scene.add( rightPortal );

  // walls
  const planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
  planeTop.position.y = 100;
  planeTop.rotateX( Math.PI / 2 );
  scene.add( planeTop );

  const planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
  planeBottom.rotateX( - Math.PI / 2 );
  scene.add( planeBottom );

  const planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7f7fff } ) );
  planeFront.position.z = 50;
  planeFront.position.y = 50;
  planeFront.rotateY( Math.PI );
  scene.add( planeFront );

  const planeBack = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff7fff } ) );
  planeBack.position.z = - 50;
  planeBack.position.y = 50;
  //planeBack.rotateY( Math.PI );
  scene.add( planeBack );

  const planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x00ff00 } ) );
  planeRight.position.x = 50;
  planeRight.position.y = 50;
  planeRight.rotateY( - Math.PI / 2 );
  scene.add( planeRight );

  const planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff0000 } ) );
  planeLeft.position.x = - 50;
  planeLeft.position.y = 50;
  planeLeft.rotateY( Math.PI / 2 );
  scene.add( planeLeft );

  // lights
  const mainLight = new THREE.PointLight( 0xe7e7e7, 2.5, 250, 0 );
  mainLight.position.y = 60;
  scene.add( mainLight );

  const greenLight = new THREE.PointLight( 0x00ff00, 0.5, 1000, 0 );
  greenLight.position.set( 550, 50, 0 );
  scene.add( greenLight );

  const redLight = new THREE.PointLight( 0xff0000, 0.5, 1000, 0 );
  redLight.position.set( - 550, 50, 0 );
  scene.add( redLight );

  const blueLight = new THREE.PointLight( 0xbbbbfe, 0.5, 1000, 0 );
  blueLight.position.set( 0, 50, 550 );
  scene.add( blueLight );
}

function setup_scene(){

  setupHelpers();

  setupTest();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);

  renderer.setAnimationLoop( animate );
  createGUI();
}

function renderPortal( thisPortalMesh, otherPortalMesh, thisPortalTexture ) {

  // set the portal camera position to be reflected about the portal plane
  thisPortalMesh.worldToLocal( reflectedPosition.copy( camera.position ) );
  reflectedPosition.x *= - 1.0; reflectedPosition.z *= - 1.0;
  otherPortalMesh.localToWorld( reflectedPosition );
  portalCamera.position.copy( reflectedPosition );

  // grab the corners of the other portal
  // - note: the portal is viewed backwards; flip the left/right coordinates
  otherPortalMesh.localToWorld( bottomLeftCorner.set( 50.05, - 50.05, 0.0 ) );
  otherPortalMesh.localToWorld( bottomRightCorner.set( - 50.05, - 50.05, 0.0 ) );
  otherPortalMesh.localToWorld( topLeftCorner.set( 50.05, 50.05, 0.0 ) );
  // set the projection matrix to encompass the portal's frame
  CameraUtils.frameCorners( portalCamera, bottomLeftCorner, bottomRightCorner, topLeftCorner, false );

  // render the portal
  thisPortalTexture.texture.colorSpace = renderer.outputColorSpace;
  renderer.setRenderTarget( thisPortalTexture );
  renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897
  if ( renderer.autoClear === false ) renderer.clear();
  thisPortalMesh.visible = false; // hide this portal from its own rendering
  renderer.render( scene, portalCamera );
  thisPortalMesh.visible = true; // re-enable this portal's visibility for general rendering

}

function updateRenderTarget(){

  // move the bouncing sphere(s)
  const timerOne = Date.now() * 0.01;
  const timerTwo = timerOne + Math.PI * 10.0;

  // smallSphereOne.position.set(
  //   Math.cos( timerOne * 0.1 ) * 30,
  //   Math.abs( Math.cos( timerOne * 0.2 ) ) * 20 + 5,
  //   Math.sin( timerOne * 0.1 ) * 30
  // );
  // smallSphereOne.rotation.y = ( Math.PI / 2 ) - timerOne * 0.1;
  // smallSphereOne.rotation.z = timerOne * 0.8;

  smallSphereTwo.position.set(
    Math.cos( timerTwo * 0.1 ) * 30,
    //Math.abs( Math.cos( timerTwo * 0.2 ) ) * 20 + 5,
    0,
    Math.sin( timerTwo * 0.1 ) * 30
  );
  smallSphereTwo.rotation.y = ( Math.PI / 2 ) - timerTwo * 0.1;
  smallSphereTwo.rotation.z = timerTwo * 0.8;


  // save the original camera properties
  const currentRenderTarget = renderer.getRenderTarget();
  const currentXrEnabled = renderer.xr.enabled;
  const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
  renderer.xr.enabled = false; // Avoid camera modification
  renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

  // render the portal effect
  renderPortal( leftPortal, rightPortal, leftPortalTexture );
  renderPortal( rightPortal, leftPortal, rightPortalTexture );

  // restore the original rendering properties
  renderer.xr.enabled = currentXrEnabled;
  renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
  renderer.setRenderTarget( currentRenderTarget );
}

function animate() {

  // if(myObject.isRotate){
  //   cube.rotation.x += 0.01;
	//   cube.rotation.y += 0.01;
  // }
	
  stats.update();
  //controls.update();
  updateRenderTarget();
  
	renderer.render( scene, camera );
}

setup_scene()