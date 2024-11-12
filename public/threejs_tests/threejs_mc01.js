/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// https://discourse.threejs.org/t/sprite-facing-camera-always/42788/6
// https://discourse.threejs.org/t/how-can-i-rotate-a-sprite-to-face-particular-x-y-coordinates/44629
// https://www.youtube.com/watch?v=tsOTCn0nROI&list=PLtzt35QOXmkKALLv9RzT8oGwN5qwmRjTo

//console.log("Test");

//import { THREE, OrbitControls, ECS, van } from "/dps.js";
//import { TriECSEngine } from "/components/triengine/triecsengine.js";

//import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );

class World extends THREE.Group{
  constructor(size = 32){
    super();
    this.size = size;
  }

  generate(){
    for (let x = 0; x < this.size;x++){
      for (let z = 0; z < this.size;z++){
        //console.log("block...")
        const block = new THREE.Mesh( geometry, material );
        block.position.set(x,0,z)
        this.add( block );
      }
    }
  }
}

const scene = new THREE.Scene();
const world = new World();
//console.log(world);
world.generate();
scene.add(world);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//var cube;
var point_cube;
// var raycaster = new THREE.Raycaster();
// var mouse = new THREE.Vector2();
// var plane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );

const renderer = new THREE.WebGLRenderer();
//renderer.setClearColor( 0xffffff, 0 );
renderer.setClearColor( 0x80a0e0);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
// CAMERA CONTROL
const controls = new OrbitControls( camera, renderer.domElement );
//APPEND RERENDER
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

function setup_point(){
  const point_geometry = new THREE.BoxGeometry( .1, 0.1, 0.1 );
  const point_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  point_cube = new THREE.Mesh( point_geometry, point_material );
  scene.add( point_cube );
  point_cube.position.y = 2;
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

//setup_point();
setup_lights();

//camera.position.z = 5;
//const textureLoader = new THREE.TextureLoader();

// window.addEventListener( 'pointermove', onPointerMove, { passive: false } );
// function onPointerMove(event){
//   //console.log("mouse move?");
// 	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
// 	raycaster.setFromCamera( mouse, camera );

//   let intersects = new THREE.Vector3();
//   raycaster.ray.intersectPlane( plane, intersects );
//   //console.log( raycaster.ray ); 
// 	//console.log("hit?", intersects );
//   if(intersects){
//     point_cube.position.x = intersects.x
//     point_cube.position.y = intersects.y
//   }
// }

//camera.position.set( 0, 0, -5 );
//camera.lookAt(0,0,0);
camera.position.set( -32, 16, -32 );
controls.target.set(16,0,16)
controls.update() // must be called after any manual changes to the camera's transform

function animate() {
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}







