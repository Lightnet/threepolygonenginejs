// simple test cube gravity drop to ground

// EXAMPLES
// https://rapier.rs/demos3d/index.html
// https://sbcode.net/threejs/physics-rapier-debugRenderer/
//
// https://github.com/dimforge/rapier.js/blob/master/testbed3d/src/demos/characterController.ts
// https://stackoverflow.com/questions/75453473/how-do-i-control-the-movement-of-a-cube

import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'

const {div, button} = van.tags;
let gridHelper;
let axesHelper;

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
// PHYSICS
var world;
var rapierDebugRenderer
var rigidBodies = [];

var cube;
// CHARACTER
var character;
var characterController;
var characterCollider;
var characterInput = new THREE.Vector3();

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

// 0x00ffff
// 0x00ff00
function create_cube(args){
  let color = args?.color || 0x00ffff;
  let x  = args?.x || 0;
  let y  = args?.y || 0;
  let z  = args?.z || 0;

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

async function run_simulation() {
  await RAPIER.init();
  // Run the simulation.
  _run_simulation(RAPIER);
}

function _run_simulation(RAPIER){
  console.log("RAPIER...");
  // Use the RAPIER module here.
  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  //let gravity = { x: 0.0, y: 0, z: 0.0 };
  world = new RAPIER.World(gravity);
  rapierDebugRenderer = new RapierDebugRenderer(scene, world)

  create_Rigid_Body_Cube();
  create_Physics_Ground();
  create_Rigid_Cube_Test();

  create_player_rigid();

  createUI();

}

function create_Physics_Ground(){
  // Create the ground
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
    .setTranslation(0.0, -1, .0)
    ;
  world.createCollider(groundColliderDesc);

  const meshCube = create_cube({width:20,height:0.2,depth:20,color:'gray'});
  meshCube.position.set(0,-1,0);

}

//drop cube test
function create_Rigid_Body_Cube(){
  // Create a dynamic rigid-body.
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setCanSleep(false)
    .setTranslation(0.0, 4.0, -2.0);
  let rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  let collider = world.createCollider(colliderDesc, rigidBody);
  cube = rigidBody;
  const meshCube = create_cube({color:0x00ff00});
  rigidBodies.push({rigid:rigidBody,mesh:meshCube});
}

function create_player_rigid(){

  // Initialize your character rigid body and collider
  let rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyDesc.kinematicPositionBased())
    //.setGravityScale(0.0)
    .setTranslation(0.0, 0.0, 0.0);
  character = world.createRigidBody(rigidBodyDesc);

  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  characterCollider = world.createCollider(colliderDesc, character);

  const meshCube = create_cube({color:'lightblue'});

  rigidBodies.push({rigid:character,mesh:meshCube});


  // The gap the controller will leave between the character and its environment.
  let offset = 0.01;
  // Create the controller.
  characterController = world.createCharacterController(offset);

  // let movementDirection = {x: 0.0, y: 0, z: 0.0};
  // characterController.computeColliderMovement(
  //   characterCollider,    // The collider we would like to move.
  //   movementDirection, // The movement we would like to apply if there wasn’t any obstacle.
  // );

}

function create_Rigid_Cube_Test(){
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(1.0, 1.0, 1.0)
    .setTranslation(0.0, 0.0, -3);
    world.createCollider(groundColliderDesc);

    const meshCube = create_cube({width:2,height:2,depth:2,color:'black'});
    meshCube.position.set(0,0,-3)
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

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );

  axesHelper = new THREE.AxesHelper( 5 );
  axesHelper.position.set(0.5,0.5,0.5)
  scene.add( axesHelper );
}

//===============================================
// LOOP RENDER
//===============================================
const myObject ={
  pos:{x:0,y:0,z:0},
  pos_cube:{x:0,y:4,z:-2},
  reset:function(){
    console.log('reset');
    character.setTranslation({x:this.pos.x,y:this.pos.y,z:this.pos.z}, true);
  },
  resetCube:function(){
    console.log('reset');
    cube.setTranslation({x:this.pos_cube.x,y:this.pos_cube.y,z:this.pos_cube.z}, true);
  }
}
// load error not sync...
function createUI(){

  gui.add(rapierDebugRenderer, 'enabled').name('Physics Debug Render');
  gui.add(gridHelper, 'visible').name('Debug Grid Helper');
  gui.add(axesHelper, 'visible').name('Debug Axes Helper');

  const characterFolder = gui.addFolder('Character')
  characterFolder.add(myObject, 'reset').name('Reset');
  characterFolder.add(myObject.pos, 'x', -10, 10).name('X: ');
  characterFolder.add(myObject.pos, 'y', -10, 10).name('Y: ');
  characterFolder.add(myObject.pos, 'z', -10, 10).name('Z: ');

  const cubeFolder = gui.addFolder('Cube');
  cubeFolder.add(myObject, 'resetCube').name('Reset');;
  cubeFolder.add(myObject.pos_cube, 'x', -10, 10).name('X: ');
  cubeFolder.add(myObject.pos_cube, 'y', -10, 10).name('Y: ');
  cubeFolder.add(myObject.pos_cube, 'z', -10, 10).name('Z: ');
}

//===============================================
// LOOP RENDER
//===============================================
function animate() {
  // Step the simulation forward.  
  if(world){
    world.step();
    Update_Rigid_Bodies();
    update_character_move();
  }
  //draw physics
  if(rapierDebugRenderer){
    rapierDebugRenderer.update();
  }
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}
//===============================================
// SETUP
//===============================================
run_simulation();
//setup_ground();
//setup_cube();
setup_lights();
setup_GridHelper();
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

console.log("three rapier test");