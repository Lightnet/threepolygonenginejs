/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://www.youtube.com/watch?v=nwiaqLGAyjo


import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
const {div, button} = van.tags;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
//camera.position.set(0,0,100)
camera.position.set(0,0,5)

let cube;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// CAMERA CONTROL
const controls = new OrbitControls( camera, renderer.domElement );
controls.update()

function create_cube(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
}

function create_extrude(){
//Create a closed wavey loop
const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -10, 0, 10 ),
	new THREE.Vector3( -5, 5, 5 ),
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 5, -5, 5 ),
	new THREE.Vector3( 10, 0, 10 )
] );

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );

scene.add( curveObject );
}

function create_extrude2(){
  const randomPoints = [];
  for ( let i = 0; i < 10; i ++ ) {
    randomPoints.push( new THREE.Vector3( ( i - 4.5 ) * 50, THREE.MathUtils.randFloat( - 50, 50 ), THREE.MathUtils.randFloat( - 50, 50 ) ) );
  }
  const randomSpline = new THREE.CatmullRomCurve3( randomPoints );
  const extrudeSettings2 = {
    steps: 200,
    bevelEnabled: false,
    extrudePath: randomSpline
  };
  const pts2 = [], numPts = 5;
  for ( let i = 0; i < numPts * 2; i ++ ) {
    const l = i % 2 == 1 ? 10 : 20;
    const a = i / numPts * Math.PI;
    pts2.push( new THREE.Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) );
  }
  const shape2 = new THREE.Shape( pts2 );
	const geometry2 = new THREE.ExtrudeGeometry( shape2, extrudeSettings2 );
	const material2 = new THREE.MeshLambertMaterial( { color: 0xff8000, wireframe: false } );
	const mesh2 = new THREE.Mesh( geometry2, material2 );
	scene.add( mesh2 );
}

function create_extrude3(){
  const curve = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( -10, 0, 10 ),
    new THREE.Vector3( -5, 5, 5 ),
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 5, -5, 5 ),
    new THREE.Vector3( 10, 0, 10 )
  ] );

  const extrudeSettings2 = {
    //steps: 200,
    steps: 10,
    bevelEnabled: false,
    extrudePath: curve
  };

  const length = 12, width = 8;

  const shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, width );
  shape.lineTo( length, width );
  shape.lineTo( length, 0 );
  shape.lineTo( 0, 0 );

  const geometry2 = new THREE.ExtrudeGeometry( shape, extrudeSettings2 );
	const material2 = new THREE.MeshLambertMaterial( { color: 0xff8000, wireframe: false } );
	const mesh2 = new THREE.Mesh( geometry2, material2 );
	scene.add( mesh2 );

}
// https://stackoverflow.com/questions/63655534/how-to-use-three-meshline-in-my-javascript-project
function create_mesh_lines(){
  let points = [];
  points.push( new THREE.Vector3(-5, 0, 0 ) );
  points.push( new THREE.Vector3( 5, 0, 0 ) );
  points.push( new THREE.Vector3( 0, 5, 0 ) );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff
    //color: 'white'
  });

  const mesh = new THREE.Line( geometry, material );
  scene.add( mesh );

}

function create_light(){
  const light = new THREE.PointLight( 0xffffff, 3, 0, 0 );
	light.position.copy( camera.position );
	scene.add( light );
}

create_cube()
//create_extrude()
//create_extrude2()
//create_extrude3()
create_mesh_lines()
create_light();

function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

  controls.update();

	renderer.render( scene, camera );
}
