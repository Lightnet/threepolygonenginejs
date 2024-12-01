/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// simple test cube gravity drop to ground

// EXAMPLES
// https://rapier.rs/demos3d/index.html
// https://sbcode.net/threejs/physics-rapier-debugRenderer/
//

import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
//import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

//const {div, button} = van.tags;

//DRAW PHYSICS VERTICES
class RapierDebugRenderer {
  mesh
  world
  enabled = true

  constructor(scene, world) {
    this.world = world
    this.mesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true }))
    this.mesh.frustumCulled = false
    scene.add(this.mesh)
  }

  update() {
    if (this.enabled) {
      const { vertices, colors } = this.world.debugRender()
      this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
      this.mesh.visible = true
    } else {
      this.mesh.visible = false
    }
  }
}

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 5, -5 );
const scene = new THREE.Scene();

var world;
var rigidBodies = [];

var rigidBodyCube;
var rapierDebugRenderer;

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
//===============================================
// SET UP FOR SCENE TO RENDER
//===============================================

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

//===============================================
// LOOP RENDER
//===============================================
function animate() {
  // Step the simulation forward.  
  if(world){
    world.step();
    Update_Rigid_Bodies();
  }
  //draw physics
  if(rapierDebugRenderer){
    rapierDebugRenderer.update();
  }
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}

async function run_simulation() {
  await RAPIER.init();
  // Run the simulation.
  _run_simulation(RAPIER);
}

function _run_simulation(RAPIER){
  //console.log("RAPIER...");
  // Use the RAPIER module here.
  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  world = new RAPIER.World(gravity);
  rapierDebugRenderer = new RapierDebugRenderer(scene, world);

  create_Rigid_Ground();
  create_Rigid_Cube();
  createGUI();
}

function create_Rigid_Ground(){
  // Create the ground
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
    .setTranslation(0.0, -1.0, 0.0);
  world.createCollider(groundColliderDesc);
  let _meshCube = create_cube({width:20,height:0.2,depth:20,color:0x00ff00});
  _meshCube.position.set(0,-1,0);
}

function create_Rigid_Cube(){
  // Create a dynamic rigid-body.
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 1.0, 0.0);
  rigidBodyCube = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  let collider = world.createCollider(colliderDesc, rigidBodyCube);
  let _meshCube = create_cube({color:0x00ffff});
  rigidBodies.push({rigid:rigidBodyCube,mesh:_meshCube});
}

function rigid_body_logs(){
  // Get and print the rigid-body's position.
  if(rigidBody){
    let position = rigidBody.translation();
    console.log("Rigid-body position: ", position.x, position.y);
  }
}

//===============================================
// UPDATE MESH WITH RIGID BODY
//===============================================
function Update_Rigid_Bodies(){
  for(const enitity of rigidBodies){
    enitity.mesh.position.copy(enitity.rigid.translation());
    enitity.mesh.quaternion.copy(enitity.rigid.rotation());
  }
}
//===============================================
// GUI
//===============================================
const myWorld = {
  pos:{x:0,y:5,z:0},
  rot:{x:0,y:0,z:0,w:1},
  linear:{x:0,y:0,z:0},
  angular:{x:0,y:0,z:0},
  reset:function(){
    rigidBodyCube.setTranslation({ x: this.pos.x, y: this.pos.y, z: this.pos.z }, true);
    rigidBodyCube.setRotation({ x: this.rot.x, y: this.rot.y, z: this.rot.z,w:this.rot.w }, true);

    rigidBodyCube.setLinvel({ x: this.linear.x, y: this.linear.y, z: this.linear.z }, true);
    rigidBodyCube.setAngvel({ x: this.angular.x, y: this.angular.y, z: this.angular.z }, true);
  }
}

function createGUI(){
  const gui = new GUI();
  const cubeFolder = gui.addFolder('Cube');
  
  const cubePosFolder = cubeFolder.addFolder('Position');
  cubePosFolder.add(myWorld.pos,'x',-10, 10).name('X: ');
  cubePosFolder.add(myWorld.pos,'y',-10, 10).name('Y: ');
  cubePosFolder.add(myWorld.pos,'z',-10, 10).name('Z: ');

  const cubeRotFolder = cubeFolder.addFolder('Rotation');
  cubeRotFolder.add(myWorld.rot,'x',-2, 2).name('X: ');
  cubeRotFolder.add(myWorld.rot,'y',-2, 2).name('Y: ');
  cubeRotFolder.add(myWorld.rot,'z',-2, 2).name('Z: ');

  const cubeVelFolder = cubeFolder.addFolder('Velocity');
  cubeVelFolder.add(myWorld.linear,'x',-30, 30).name('X: ');
  cubeVelFolder.add(myWorld.linear,'y',-30, 30).name('Y: ');
  cubeVelFolder.add(myWorld.linear,'z',-30, 30).name('Z: ');

  const cubeAngVelFolder = cubeFolder.addFolder('Angular Velocity ');
  cubeAngVelFolder.add(myWorld.angular,'x',-50, 50).name('X: ');
  cubeAngVelFolder.add(myWorld.angular,'y',-50, 50).name('Y: ');
  cubeAngVelFolder.add(myWorld.angular,'z',-50, 50).name('Z: ');

  cubeFolder.add(myWorld,'reset');

  const debugFolder = gui.addFolder('Debug');
  debugFolder.add(rapierDebugRenderer,'enabled').name('Physics Render Wirefame');
}

//===============================================
// SETUP
//===============================================

run_simulation();
setup_lights();
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

console.log("three rapier test");