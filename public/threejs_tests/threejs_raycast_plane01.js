/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// ray cast plane for 2d X,Y

import { 
  THREE, 
  ECS, 
  van,
  GUI,
  OrbitControls,
} from "/dps.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls( camera, renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const point_geometry = new THREE.BoxGeometry( .1, 0.1, 0.1 );
const point_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const point_cube = new THREE.Mesh( point_geometry, point_material );
scene.add( point_cube );
point_cube.position.x = 1;

const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

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

function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}

const myObject = {

};

const gui = new GUI();
gui.add(gridHelper,'visible').name('gridHelper')