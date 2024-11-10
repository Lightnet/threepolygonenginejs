// simple test character controller

// EXAMPLES
// https://rapier.rs/demos3d/index.html
// https://sbcode.net/threejs/physics-rapier-debugRenderer/
//

import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'

const {div, button} = van.tags;

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
camera.position.set( 10, 10, -10 );
const scene = new THREE.Scene();
var cube;

var world;
var rigidBody;
var rapierDebugRenderer

var cube_block01;
var rigidBody01;
var character;
var characterController;
var characterCollider;

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

function setup_cube(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  //const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material0 = new THREE.MeshLambertMaterial( { color: 0x00ffff } );
  cube = new THREE.Mesh( geometry, material0 );
  scene.add( cube );
  //cube.position.y = 2;
}

function setup_ground(){
  const geometry = new THREE.BoxGeometry( 20, 0.2, 20 );
  //const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material0 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  cube_block01 = new THREE.Mesh( geometry, material0 );
  scene.add( cube_block01 );
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

function animate() {
  // Step the simulation forward.  
  if(world){
    world.step();
    update_rigid_body();
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

  // Create the ground
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
    world.createCollider(groundColliderDesc);

  // Create a dynamic rigid-body.
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 5.0, 0.0);
  rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  let collider = world.createCollider(colliderDesc, rigidBody);

  block_rigid();
  create_plyaer_rigid();

  rapierDebugRenderer = new RapierDebugRenderer(scene, world)
}

// https://github.com/dimforge/rapier.js/blob/master/testbed3d/src/demos/characterController.ts
// https://stackoverflow.com/questions/75453473/how-do-i-control-the-movement-of-a-cube
function create_plyaer_rigid(){

  // Initialize your character rigid body and collider
  let rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyDesc.kinematicPositionBased())
    .setGravityScale(0.0)
    .setTranslation(0.0, 7.0, 0.0);
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

}

document.addEventListener("input", onInputKey);

function onInputKey(event){
  console.log(event);
}

document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
  update_press_down_move(event.key);
};

function update_press_down_move(key){
  if(!characterController){return;}
  if(!characterCollider){return;}
  let movementDirection = {x: 0.0, y: 0.0, z: 0.0};
  //console.log(key);
  if(key == 'a'){
    console.log('Left');
    movementDirection.x = 0.1;
  }else if(key == 'd'){
    movementDirection.x = -0.1;
  }
  if(key == 'w'){
    movementDirection.z = -0.1;
  }else if(key == 's'){
    movementDirection.z = 0.1;
  }
  characterController.computeColliderMovement(
    characterCollider,    // The collider we would like to move.
    movementDirection, // The movement we would like to apply if there wasn’t any obstacle.
  );
}

document.addEventListener("keyup", onDocumentKeyUp, false);

function onDocumentKeyUp(event) {
  if(!characterController){return;}
  if(!characterCollider){return;}
  let movementDirection = {x: 0.0, y: 0.0, z: 0.0};
  //console.log(event.key);
  if(
    (event.key == 'w')||
    (event.key == 'a')||
    (event.key == 's')||
    (event.key == 'd')
  ){
    console.log('Left');
    characterController.computeColliderMovement(
      characterCollider,    // The collider we would like to move.
      movementDirection, // The movement we would like to apply if there wasn’t any obstacle.
    );
  }
}

function update_character_move(){
  if(!characterController){return;}
  if(!character){return;}
  if(!characterCollider){return;}

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

function update_rigid_body(){
  // Get and print the rigid-body's position.
  if(rigidBody){
    let position = rigidBody.translation();
    let rotation = rigidBody.rotation();
    //console.log(rigidBody);
    //console.log("Rigid-body position: ", position.x, position.y);
    cube.position.copy(position);
    cube.quaternion.copy(rotation);
  }
}
//===============================================
// 
//===============================================
function c_reset(){
  rigidBody.setTranslation({ x: 0.0, y: 2.0, z: 0.0 }, true);
}

const closed = van.state(false)
van.add(document.body, FloatingWindow(
  {title: "Debug", closed, width:210, height:260, closeCross: null,x:0,y:0},
  div(
    button({onclick:c_reset},'reset')
  )
))

run_simulation();
setup_ground();
setup_cube();
setup_lights();
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

console.log("three rapier test");