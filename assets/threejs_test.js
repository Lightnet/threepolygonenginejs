/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// https://discourse.threejs.org/t/sprite-facing-camera-always/42788/6
// https://discourse.threejs.org/t/how-can-i-rotate-a-sprite-to-face-particular-x-y-coordinates/44629
// 

console.log("Test");

import { THREE, OrbitControls, ECS, van } from "/dps.js";
//import { TriECSEngine } from "/components/triengine/triecsengine.js";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xffffff, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material0 );
scene.add( cube );
cube.position.y = 2;

const point_geometry = new THREE.BoxGeometry( .1, 0.1, 0.1 );
const point_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const point_cube = new THREE.Mesh( point_geometry, point_material );
scene.add( point_cube );
point_cube.position.y = 2;

camera.position.z = 5;

const textureLoader = new THREE.TextureLoader();

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_sprites.html
const mapB = textureLoader.load( '/textures/minimap/style_b/tile_0000.png' );
const mapC = textureLoader.load( '/textures/minimap/style_b/tile_0001.png' );
mapB.magFilter = THREE.NearestFilter;
mapC.magFilter = THREE.NearestFilter;
//const materialB = new THREE.SpriteMaterial( { map: mapB, color: 0xffffff, fog: true } );
// const materialB = new THREE.SpriteMaterial( { 
//   map: mapB, 
//   //color: 0xffffff 
// });
// const materialC = new THREE.SpriteMaterial( { 
//   map: mapC, 
//   //color: 0xffffff 
// });
// let materialBC;
// let materialCC;
// let materialDC;
// materialBC = materialB.clone();
// materialCC = materialC.clone();
// materialDC = materialC.clone();
// const spriteB = new THREE.Sprite( materialBC );
// const spriteC = new THREE.Sprite( materialCC );

//group.add( sprite );
//scene.add( spriteB );
//scene.add( spriteC );
//spriteC.position.x = 1;
// https://threejs.org/docs/#api/en/geometries/PlaneGeometry
// https://threejs.org/docs/#api/en/loaders/TextureLoader
var standardMat = new THREE.MeshStandardMaterial( { map: mapC } );
const basicmaterial = new THREE.MeshBasicMaterial( {
  map: mapC
});
//const materialm = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), 
  //materialm 
  //standardMat
  basicmaterial
);
let facedir = - Math.PI / 2;
//mesh.rotation.x = - Math.PI / 2;
console.log(facedir);
scene.add( mesh );

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );

window.addEventListener( 'pointermove', onPointerMove, { passive: false } );
function onPointerMove(event){
  //console.log("mouse move?");
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );

  let intersects = new THREE.Vector3();
  raycaster.ray.intersectPlane( plane, intersects );
  //console.log( raycaster.ray ); 
	//console.log("hit?", intersects );
  if(intersects){
    //point_cube.position.set(intersects)
    point_cube.position.x = intersects.x
    point_cube.position.y = intersects.y
  }
  

  // screen touch?
	// if(event.pointerType == 'pen' &&  event.pressure > 0) { // I am using pen on ms surface
	// 	var intersects = new THREE.Vector3();
	// 	raycaster.ray.intersectPlane(planeX, intersects);
  //   console.log(raycaster.ray);
	// 	console.log(intersects);
	// }
}

const controls = new OrbitControls( camera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 1, 1 );
controls.update();

function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	//mesh.rotation.y += 0.01;
  //mesh.rotation.x += 0.01;
  //spriteB.material.rotation += 0.01;
  //camera.rotation.y += 0.01;
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}







