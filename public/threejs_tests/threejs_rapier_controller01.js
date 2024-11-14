/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// simple test character controller

// EXAMPLES
// https://rapier.rs/demos3d/index.html
// https://sbcode.net/threejs/physics-rapier-debugRenderer/
// https://github.com/dimforge/rapier.js/blob/master/testbed3d/src/demos/characterController.ts
// https://stackoverflow.com/questions/75453473/how-do-i-control-the-movement-of-a-cube

import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
const {div, button} = van.tags;

const gui = new GUI();
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
camera.position.set( 0, 5, 10 );
const scene = new THREE.Scene();

var world;
var rigidBodies = [];
var rapierDebugRenderer;

var character; //rigid body
var characterController; // controller input
var characterCollider; //collision

var characterInput = new THREE.Vector3();

const renderer = new THREE.WebGLRenderer();
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

//SETUP PHYSICS
async function run_simulation() {
  await RAPIER.init();
  // Run the simulation.
  _run_simulation(RAPIER);
}

function _run_simulation(RAPIER){
  console.log("RAPIER...");
  // Use the RAPIER module here.
  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  world = new RAPIER.World(gravity);

  createPhysicsCube();
  create_player_rigid();

  rapierDebugRenderer = new RapierDebugRenderer(scene, world);
  gui.add(rapierDebugRenderer, 'enabled').name('Physics Debug Render');
}

function createPhysicsCube(){
  let rigidCube = create_physics_cube({x:3,gravityScale:0.0});
  let meshCube = create_cube({color:'gray'});
  rigidBodies.push({rigid:rigidCube,mesh:meshCube});
}

function create_physics_cube(args){
  console.log(args);
  let x  = args?.x || 0;
  let y  = args?.y || 0;
  let z  = args?.z || 0;
  let width  = args?.width || 0.5;
  let height  = args?.width || 0.5;
  let depth  = args?.width || 0.5;
  let gravityScale = args?.gravityScale || 1.0;
  if(args.gravityScale == 0){
    gravityScale = 0;
  }
  console.log(gravityScale);

  // Create a dynamic rigid-body.
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setGravityScale(gravityScale)
    .setTranslation(x, y, z);
  let rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(width, height, depth);
  let collider = world.createCollider(colliderDesc, rigidBody);
  return rigidBody;
}

function create_cube(args){
  let color = args?.color || 0x00ffff;
  let x  = args?.x || 0;
  let y  = args?.x || 0;
  let z  = args?.x || 0;

  let width  = args?.width || 1;
  let height  = args?.height || 1;
  let depth  = args?.depth || 1;
  const geometry = new THREE.BoxGeometry( width, height, depth );
  //const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material0 = new THREE.MeshLambertMaterial( { color: color } );
  const cube = new THREE.Mesh( geometry, material0 );
  cube.position.set(x,y,z);
  scene.add( cube );
  return cube;
}

function create_player_rigid(){

  // Initialize your character rigid body and collider
  let rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyDesc.kinematicPositionBased())
    .setGravityScale(0.0)
    .setTranslation(0.0, 0.0, 0.0);
  character = world.createRigidBody(rigidBodyDesc);

  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  characterCollider = world.createCollider(colliderDesc, character);

  // The gap the controller will leave between the character and its environment.
  let offset = 0.01;
  // Create the controller.
  characterController = world.createCharacterController(offset);

  // FOR UPDATE AREA testing
  // let movementDirection = {x: 0.0, y: 0, z: 0.0};
  // characterController.computeColliderMovement(
  //   characterCollider,    // The collider we would like to move.
  //   movementDirection, // The movement we would like to apply if there wasn’t any obstacle.
  // );
  //const cube = create_cube({color:'red'});
  const cube = create_cube();
  rigidBodies.push({rigid:character,mesh:cube});
}

function Update_Rigid_Bodies(){
  for(const enitity of rigidBodies){
    enitity.mesh.position.copy(enitity.rigid.translation());
    enitity.mesh.quaternion.copy(enitity.rigid.rotation());
  }
}
//===============================================
// RIGID BODY TEST
//===============================================
function block_rigid(){
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(1.0, 1.0, 1.0)
    .setTranslation(0.0, 0.0, 1.4);
    world.createCollider(groundColliderDesc);
}

function rigid_body_logs(){
  // Get and print the rigid-body's position.
  if(rigidBody){
    let position = rigidBody.translation();
    console.log("Rigid-body position: ", position.x, position.y);
  }
}

//===============================================
// DOC INPUT
//===============================================
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  onKeyDownMove(event.code);
};
function onKeyDownMove(key){
  if(key == 'KeyA'){
    //console.log('Left');
    characterInput.x = -0.1;
  }else if(key == 'KeyD'){
    characterInput.x = 0.1;
  }
  if(key == 'KeyW'){
    characterInput.z = -0.1;
  }else if(key == 'KeyS'){
    characterInput.z = 0.1;
  }
}
document.addEventListener("keyup", onKeyUp, false);
function onKeyUp(event) {
  onKeyUpMove(event.code);
}
function onKeyUpMove(key) {
  if(key == 'KeyA'){
    //console.log('Left');
    characterInput.x = 0;
  }
  if(key == 'KeyD'){
    characterInput.x = 0;
  }
  if(key == 'KeyW'){
    characterInput.z = 0;
  }
  if(key == 'KeyS'){
    characterInput.z = 0;
  }
}
//===============================================
// CHARACTER INPUT UPDATE POSITION
//===============================================
function update_character_move(){
  if(!characterController){return;}
  if(!character){return;}
  if(!characterCollider){return;}

  characterController.computeColliderMovement(
    characterCollider,    // The collider we would like to move.
    characterInput, // The movement we would like to apply if there wasn’t any obstacle.
  );

  let movement = characterController.computedMovement();
  //console.log(movement);
  let newPos = character.translation();
  newPos.x += movement.x;
  newPos.y += movement.y;
  newPos.z += movement.z;
  //console.log(newPos.y)
  //character.setNextKinematicTranslation(newPos);
  character.setTranslation({x:newPos.x,y:newPos.y,z:newPos.z}, true);
}
//===============================================
// GRID HELPER
//===============================================
function setup_GridHelper(){
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );

  const axesHelper = new THREE.AxesHelper( 5 );
  axesHelper.position.set(0.5,0.5,0.5)
  scene.add( axesHelper );
}

//===============================================
// SETUP
//===============================================
const myObject ={
  reset:function(){
    console.log('reset');
    character.setTranslation({x:0,y:0,z:0}, true);
  }
}
// load error not sync...
function createUI(){
  gui.add(myObject, 'reset');
}

//===============================================
// LOOP RENDER
//===============================================
function animate() {
  // Step the simulation forward.  
  if(world){
    world.step();
    //update_rigid_body();
    Update_Rigid_Bodies();
  }
  //draw physics
  if(rapierDebugRenderer){
    rapierDebugRenderer.update();
  }
  
  update_character_move();
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}

run_simulation();
setup_lights();

setup_GridHelper();
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
createUI();
console.log("three rapier controller test");