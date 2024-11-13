/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// https://gist.github.com/rytsh/36ff12416d91aaf7e4f1e7ca0cdbd75d
// https://jsfiddle.net/7rdv6ox3/

//import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import { THREE } from "./dps.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
//import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'
import { ViewHelper } from 'https://unpkg.com/three@0.170.0/examples/jsm/helpers/ViewHelper.js'
import BaseTurret from "./base_turret.js";
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';

const {div} = van.tags;

const stats = new Stats();
van.add(document.body, stats.dom);
console.log(THREE.ViewHelper)
//===============================================
// SETUP RENDER
//===============================================
let cube;
let gridHelper;
let axesHelper;
let helper;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0,5,5);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.autoClear = false;
renderer.setClearColor( 0x80a0e0);//blue sky

// CAMERA CONTROL
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
//console.log(controls);

function threejs_resize(_event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
};

//===============================================
// SETUP SCENE
//===============================================
function create_cube(args){
  let color = args?.color || 0x00ffff;
  let x  = args?.x || 0;
  let y  = args?.y || 0;
  let z  = args?.z || 0;

  let width  = args?.width || 1;
  let height  = args?.height || 1;
  let depth  = args?.depth || 1;
  //console.log("args: ",args)
  //console.log("depth: ",depth)
  const _geometry = new THREE.BoxGeometry( width, height, depth );
  const _material = new THREE.MeshLambertMaterial( { color: color } );
  const _mesh = new THREE.Mesh( _geometry, _material );
  _mesh.position.set(x,y,z);
  scene.add( _mesh );
  return _mesh;
}

function setup_lights(){
  const light1 = new THREE.DirectionalLight();
  light1.position.set(1, 1, 1);
  scene.add( light1 );

  const light2 = new THREE.DirectionalLight();
  light2.position.set(-1, 1, -0.5);
  scene.add( light2 );

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add( light1 );
}

//===============================================
// SETUP HELPER
//===============================================
function setup_Helper(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );

  axesHelper = new THREE.AxesHelper( 5 );
  axesHelper.position.set(0.5,0.5,0.5)
  scene.add( axesHelper );

  //=============================================
  const vHelper = div({id:'viewHelper',style:`
    position:absolute;
    right:0px;
    bottom:0px;
    width:128px;
    height:128px;
`});
  van.add(document.body,vHelper);

  helper = new ViewHelper( camera, renderer.domElement );
  helper.controls = controls;
  helper.controls.center = controls.target;
  console.log(helper);
  vHelper.addEventListener('pointerup', (event) => helper.handleClick( event ) );
  console.log(vHelper);

  
}

//===============================================
// TEST SETUP
//===============================================

let baseTurret;
let point_cube;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var point3d = new THREE.Vector3();
var plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 );

function setup_BaseTurret(){
  baseTurret = new BaseTurret(scene);
}

function setupPointer(){
  point_cube = create_cube({width:0.1, height:0.1, depth:0.1,color:0xff0000})
}

function onPointerMove(event){
  //console.log("mouse move?");
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  //console.log("mouse: ",mouse)
  // mouse.x = ( event.clientX  ) ;
	// mouse.y = - ( event.clientY  ) ;
	raycaster.setFromCamera( mouse, camera );

  let intersects = new THREE.Vector3();
  raycaster.ray.intersectPlane( plane, intersects );
  //console.log( raycaster.ray ); 
	//console.log("hit?", intersects );
  if(intersects){
    //point_cube.position.set(intersects)
    let grid_x = Math.floor(intersects.x+0.5);
    let grid_y = Math.floor(intersects.y+0.5);
    let grid_z = Math.floor(intersects.z+0.5);
    point_cube.position.x = grid_x
    point_cube.position.y = grid_y
    point_cube.position.z = grid_z
    
    if(baseTurret){
      point3d.x = intersects.x;
      point3d.y = intersects.y;
      point3d.z = intersects.z;
      baseTurret.setTargetVector3(point3d);
    }
    // if(placeholder){
    //   placeholder.position.x = grid_x
    //   placeholder.position.y = grid_y
    // }
  }
}
//===============================================
// MAIN SETUP
//===============================================
function setupScene(){
  setup_lights();
  //cube = create_cube({width:1,height:1,depth:1,color:0x00ff00});
  window.addEventListener('resize', threejs_resize);
  window.addEventListener( 'pointermove', onPointerMove, { passive: false } );
  setup_Helper();
  setupPointer();

  setup_BaseTurret();


  createGUI();
}
//===============================================
// LOOP RENDER
//===============================================
const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  renderer.clear();
  // if(cube){
  //   cube.rotation.x += 0.01;
	//   cube.rotation.y += 0.01;
  // }
  if(stats){
    stats.update();
  }
  if ( helper.animating ) helper.update( delta );
  // if(controls){
  //   controls.update();
  // }
  
	renderer.render( scene, camera );
  helper.render( renderer );

}

//===============================================
// DEBUG GUI
//===============================================
const myWorld = {
  test:function(){
    console.log('Test GUI');
  }
}

function createGUI(){
  const gui = new  GUI();
  const debugFolder = gui.addFolder('Debug');
  debugFolder.add(myWorld,'test').name("TEST");
  debugFolder.add(gridHelper, 'visible').name('Grid Helper');
  debugFolder.add(axesHelper, 'visible').name('Axes Helper');
  debugFolder.add(controls,'enabled').name("Orbit Control");
}
//===============================================
// SET UP DOCS AND RENDER
//===============================================

renderer.setAnimationLoop( animate );
van.add(document.body, renderer.domElement );
setupScene();