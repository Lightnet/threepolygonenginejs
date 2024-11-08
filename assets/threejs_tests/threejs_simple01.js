import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';


import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 0, -5 );
const scene = new THREE.Scene();

var cube;

const renderer = new THREE.WebGLRenderer();
//renderer.setClearColor( 0xffffff, 0 );
renderer.setClearColor( 0x80a0e0);//blue sky
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});
// CAMERA CONTROL
const controls = new OrbitControls( camera, renderer.domElement );
controls.update()

function setup_cube(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  //const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material0 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material0 );
  scene.add( cube );
  //cube.position.y = 2;
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

renderer.setAnimationLoop( animate );

function animate() {
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}


setup_cube();
setup_lights();
document.body.appendChild( renderer.domElement );
console.log("three rapier test");