/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// EXAMPLES
// https://rapier.rs/demos3d/index.html
// https://sbcode.net/threejs/physics-rapier-debugRenderer/
//
// https://github.com/dimforge/rapier.js/blob/master/testbed3d/src/demos/characterController.ts
// https://stackoverflow.com/questions/75453473/how-do-i-control-the-movement-of-a-cube

import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';

const {div, button, style} = van.tags;
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
const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
const _PI_2 = Math.PI / 2;

class Player {
  //radius = 0.5;
  //height = 1.75;

  width = 1;
  height = 1;
  depth = 1;

  maxSpeed = 10;
  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 200 );
  controls = new PointerLockControls( this.camera,document.body );
  cameraHelper = new THREE.CameraHelper(this.camera);

  isLocked = false;
  enabled = true;

  mousePointer = new THREE.Vector3();
  pointerSpeed = 1.0;
  // Set to constrain the pitch of the camera
	// Range is 0 to Math.PI radians
	minPolarAngle = 0; // radians
	maxPolarAngle = Math.PI; // radians

  constructor(scene, world){
    //this.position.set(32,16,32);
    this.position.set(0,5,5);
    scene.add(this.camera);
    scene.add(this.cameraHelper);

    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));

    this.boundsHelper = new THREE.Mesh(
      //new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      new THREE.MeshBasicMaterial({wireframe:true})
    );
    scene.add(this.boundsHelper);
  }

  onMouseMove(event){
    //console.log(event.clientX)
    //console.log(event);
    if(this.isLocked == false){
      return;
    }
    this.mousePointer.x = event.clientX / window.innerWidth - 0.5;
    this.mousePointer.y = event.clientY / window.innerHeight - 0.5;
    //console.log(this.mousePointer)
    if(this.mousePointer.y > 0){
      //console.log("up?")
    }
    if(this.mousePointer.y < 0){
      //console.log("down?")
    }
    //console.log("x: ", event.movementX, " y: ", event.movementY)
    //= this.mesh;
     const camera = this.boundsHelper;
  	_euler.setFromQuaternion( camera.quaternion );

  	_euler.y -= event.movementX * 0.002 * this.pointerSpeed;
  	_euler.x -= event.movementY * 0.002 * this.pointerSpeed;

  	_euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );

  	camera.quaternion.setFromEuler( _euler );
  }

  update_camera(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  applyInputs(dt){

    if(this.controls.isLocked){
      //console.log('Player Update dt:', dt);
      this.velocity.x = this.input.x;
      this.velocity.z = this.input.z;
      this.controls.moveRight(this.velocity.x * dt);
      this.controls.moveForward(this.velocity.z * dt);

      document.getElementById('player-position').innerHTML = this.toString();
    }

  }

  onKeyDown(event){
    //console.log('key down');
    //this.isLocked = this.controls.isLocked;
    if(!this.controls.isLocked){
      this.controls.lock();
      console.log('locked');
      this.isLocked = true
    }
    console.log("event.code: ", event.code)
    switch(event.code){
      case 'KeyW':
        this.input.z = this.maxSpeed;
        break;
      case 'KeyA':
        this.input.x = -this.maxSpeed;
        break;
      case 'KeyS':
        this.input.z = -this.maxSpeed;
        break;
      case 'KeyD':
        this.input.x = this.maxSpeed;
        break;
      case 'KeyR':
        this.position.set(32,16,32);
        this.velocity.set(0, 0, 0);
        break;
      case 'Escape':
        console.log("ESCAPE...");
        this.isLocked = false;
        break;
    }
  }

  onKeyUp(event){
    //console.log('key up');
    switch(event.code){
      case 'KeyW':
        this.input.z = 0;
        break;
      case 'KeyA':
        this.input.x = 0;
        break;
      case 'KeyS':
        this.input.z = 0;
        break;
      case 'KeyD':
        this.input.x = 0;
        break;
      case 'Escape':
        console.log("ESCAPE...");
        this.isLocked = false;
        break;
    }

  }

  updateBoundsHelper(){
    this.boundsHelper.position.copy(this.position);
    this.boundsHelper.position.y -= this.height / 2;
  }

  get position(){
    return this.camera.position;
  }

  toString(){
    let str = '';
    str += `X: ${this.position.x.toFixed(3)}`;
    str += ` Y: ${this.position.y.toFixed(3)}`;
    str += ` Z: ${this.position.z.toFixed(3)}`;
    return str;
  }

}

const orbitCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
orbitCamera.position.set( 0, 5, 10 );
const scene = new THREE.Scene();
// PLAYER
let player;
// PHYSICS
var world;
var rapierDebugRenderer
var rigidBodies = [];

//var cube;
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
  orbitCamera.aspect = window.innerWidth / window.innerHeight;
  orbitCamera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  if(player){
    player.update_camera();
  }
  
});
// CAMERA CONTROL
const controls = new OrbitControls( orbitCamera, renderer.domElement );
controls.update()

// 0x00ffff
// 0x00ff00
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
  const mesh = new THREE.Mesh( geometry, material0 );
  mesh.position.set(x,y,z);
  scene.add( mesh );
  return mesh;
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
//document.addEventListener("keydown", onDocumentKeyDown, false);
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
//document.addEventListener("keyup", onKeyUp, false);
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
// GUI
//===============================================
const myWorld ={
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

  
  const debugFolder = gui.addFolder('Debug');
  debugFolder.add(rapierDebugRenderer, 'enabled').name('Physics Debug Render');
  debugFolder.add(gridHelper, 'visible').name('Debug Grid Helper');
  debugFolder.add(axesHelper, 'visible').name('Debug Axes Helper');
  debugFolder.add(controls,'enabled').name("Orbit Control");

  // const characterFolder = gui.addFolder('Character')
  // characterFolder.add(myWorld, 'reset').name('Reset');
  // characterFolder.add(myWorld.pos, 'x', -10, 10).name('X: ');
  // characterFolder.add(myWorld.pos, 'y', -10, 10).name('Y: ');
  // characterFolder.add(myWorld.pos, 'z', -10, 10).name('Z: ');

  // const cubeFolder = gui.addFolder('Cube');
  // cubeFolder.add(myWorld, 'resetCube').name('Reset');;
  // cubeFolder.add(myWorld.pos_cube, 'x', -10, 10).name('X: ');
  // cubeFolder.add(myWorld.pos_cube, 'y', -10, 10).name('Y: ');
  // cubeFolder.add(myWorld.pos_cube, 'z', -10, 10).name('Z: ');

  //debugFolder.add(myWorld,'test').name("TEST");

  const physicsFolder = gui.addFolder('Physics')
  
}
function setup_world(){
  run_simulation();
  //setup_ground();
  //setup_cube();
  setup_lights();
  setup_GridHelper();

  //physics control
  //document.addEventListener("keydown", onDocumentKeyDown, false);
  //document.addEventListener("keyup", onKeyUp, false);

  player = new Player(scene, world);
}

function currentCamera(){
  if(player){
    if(player.controls.isLocked){
      return player.camera;
    }else{
      return orbitCamera;
    }
  }
  return orbitCamera;
}
//===============================================
// LOOP RENDER
//===============================================
const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  // Step the simulation forward.  
  if(world){
    world.step();
    Update_Rigid_Bodies();
    update_character_move();
  }
  if(player){
    player.applyInputs(delta);
    player.updateBoundsHelper();
  }
  
  //draw physics
  if(rapierDebugRenderer){
    rapierDebugRenderer.update();
  }
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, currentCamera() );
}

function displayInfo(){
  van.add(document.body,div({style:`
position:fixed;
top:0px;
left:0px;

    `},
    div('W,A,S,D = movement'),
    div('mouse = rotate camera'),
    div('any key board = lock screen'),

  ))

  van.add(document.head,style(`
    #info{
      position:absolute;
      right:0;
      bottom:0;
      fontsize:24px;
      color:white;
      margin:8px;
    }
    `),'Position')

    van.add(document.body,div({id:'info'},
      div({id:'player-position'})
    ))
}

//===============================================
// SETUP
//===============================================


setup_world()
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
displayInfo();
console.log("three rapier spaceship");