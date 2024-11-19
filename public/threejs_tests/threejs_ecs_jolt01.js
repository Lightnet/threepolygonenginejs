/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// Notes:
// did not find right example well there is github but there no docs how correct setup.

// https://www.npmjs.com/package/ecs
// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/physics/JoltPhysics.js
// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/physics/JoltPhysics.js
// https://jrouwe.github.io/JoltPhysics.js/
// https://github.com/jrouwe/JoltPhysics.js/?tab=readme-ov-file
// 
// https://github.com/jrouwe/JoltPhysics.js/blob/main/helloworld/HelloWorld.js

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import ECS from "https://unpkg.com/ecs@0.23.0/ecs.js";

//import initJolt from 'https://cdn.jsdelivr.net/npm/jolt-physics@0.23.0/dist/jolt-physics.wasm-compat.js';
// const Jolt = await initJolt();
// console.log(Jolt);
const RENDERABLE_FILTER = [ 'renderable' ];
const CUBE_FILTER = [ 'cube' ];
const PHYSICSABLE_FILTER = [ 'rigidcube' ];

const JOLT_PATH = 'https://cdn.jsdelivr.net/npm/jolt-physics@0.29.0/dist/jolt-physics.wasm-compat.js';
//===============================================
// VARIABLES
//===============================================
const { default: initJolt } = await import( `${JOLT_PATH}` );

const stats = new Stats();
let gridHelper;
let axesHelper;

const world = ECS.addWorld();

// Create very simple object layer filter with only a single layer
const MY_LAYER = 0;
let Jolt; // upper case API
let jolt; // lower case world and objects
let bodyInterface;
//test 
let TestRigidBody;

let bodies = [];
//===============================================
// CREATE THREEJS
//===============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x666666 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
//camera.position.set(0, 5, 5);
camera.position.set(0, 30, 30);
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});
//===============================================
// CREATE CUBE
//===============================================
function createCube(args){
  args = args || {};
  const width = args?.width || 1;
  const height = args?.height || 1;
  const depth = args?.depth || 1;
  const color = args?.color || 0x00ff00;
  const geometry = new THREE.BoxGeometry( width, height, depth );
  const material = new THREE.MeshBasicMaterial( { color: color } );
  const cube = new THREE.Mesh( geometry, material );
  return cube;
}
//===============================================
// SETUP CUBE
//===============================================
// set up the cube
function setupCube(){
  const cube = createCube();
  scene.add(cube);
}
//===============================================
// CREATE LIGHTS
//===============================================
function createLights(){
  const hemiLight = new THREE.HemisphereLight();
	scene.add( hemiLight );

	const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
	dirLight.position.set( 5, 5, 5 );
	dirLight.castShadow = true;
	dirLight.shadow.camera.zoom = 2;
	scene.add( dirLight );

	const floor = new THREE.Mesh(
		new THREE.BoxGeometry( 10, 5, 10 ),
		//new THREE.ShadowMaterial( { color: 0x444444 } )
    new THREE.MeshBasicMaterial( { color: 0x444444 } )
	);
	floor.position.y = - 2.5;
	//floor.receiveShadow = true;
	//floor.userData.physics = { mass: 0 };
	scene.add( floor );
}

//===============================================
// SETUP SCENE
//===============================================
function setupScene(){

  setupCube();
  createLights();

  //ECS.addSystem(world, rotateSystem)//simple rotate test mesh cube
  ECS.addSystem(world, physicsUpdateSystem)// update position and rotation
  //ECS.addSystem(world, physicsSystem)// event when add and remove//add ingore? since add to physics world objects.
  ECS.addSystem(world, rendererSystem)// add and remove object3d from the scene

  van.add(document.body, renderer.domElement);
  van.add(document.body, stats.dom);
  renderer.setAnimationLoop( appLoop );
  createGUI();

  //createShapes();
}

//===============================================
// RENDER SYSTEM ECS
//===============================================
// https://github.com/mreinstein/ecs
function rendererSystem (world) {
  // data structure to store all entities that were added or removed last frame
  const result = {
    count: 0,
    entries: new Array(100)
  }
  const onUpdate = function (dt) {
    // optional 3rd parameter, can be 'added' or 'removed'. populates the list of entities that were
    // added since the last ECS.cleanup(...) call
    ECS.getEntities(world, RENDERABLE_FILTER, 'added', result);
    for (let i=0; i < result.count; i++){
      //console.log('added new entity:', result.entries[i])
      //console.log(result.entries[i])
      scene.add(result.entries[i].mesh);
    }

    ECS.getEntities(world, RENDERABLE_FILTER, 'removed', result);
    for (let i=0; i < result.count; i++){
      //console.log('removed entity:', result.entries[i])
      scene.remove(result.entries[i].mesh);
    }
  }

  return { onUpdate }
}
//===============================================
// PHYSICS UPDATE SYSTEM ECS
//===============================================
function physicsUpdateSystem(world) {
  const onUpdate = function (dt) {
    for (const entity of ECS.getEntities(world, ['mesh', 'rigid'])) {
      //console.log(entity);
      if((entity?.mesh !=null)&&(entity?.rigid !=null)){
        let pos = entity.rigid.GetPosition();
        //console.log("X: ",pos.GetX()," Y:",pos.GetY()," :", pos.GetZ())
        entity.mesh.position.set(
          pos.GetX(),
          pos.GetY(),
          pos.GetZ()
        );
        let rot = entity.rigid.GetPosition();
        //entity.mesh.position.copy(entity.rigid.translation())
        //entity.mesh.quaternion.copy(entity.rigid.rotation())
        
      }
    }
  }
  return { onUpdate }
}

function physicsSystem (world) {
  // data structure to store all entities that were added or removed last frame
  const result = {
    count: 0,
    entries: new Array(100)
  }

  const onUpdate = function (dt) {

    ECS.getEntities(world, PHYSICSABLE_FILTER, 'added', result);
    for (let i=0; i < result.count; i++){
      //console.log("physicsSystem add");
      //console.log('[physicsSystem] added new entity:', result.entries[i]);
    }

    ECS.getEntities(world, PHYSICSABLE_FILTER, 'removed', result);
    for (let i=0; i < result.count; i++){
      //console.log('removed entity:', result.entries[i])
      //scene.remove(result.entries[i].mesh);
      
      if(result.entries[i]?.rigid){
        let body = result.entries[i].rigid;
        bodyInterface.RemoveBody(body.GetID())
        bodyInterface.DestroyBody(body.GetID())
      }
      if(result.entries[i]?.mesh){
        scene.remove(result.entries[i].mesh);
      }
    }
  }
  return { onUpdate }
}

// function setupGround(){
//   // Create a compound
// 	let compound = new Jolt.StaticCompoundShapeSettings();
// 	let boxPosition = new Jolt.Vec3(5, 0, 0);
// 	compound.AddShape(boxPosition, Jolt.Quat.prototype.sIdentity(), box); // 'box' is now owned by 'compound'
// 	Jolt.destroy(boxPosition);
// 	let shapeResult = compound.Create();
// 	let shape = shapeResult.Get();
// 	shapeResult.Clear(); // We no longer need the shape result, it keeps a reference to 'shape' (which it will also release the next time you create another shape)
// 	shape.AddRef(); // We want to own this shape so we can delete 'compound' which internally keeps a reference
// 	Jolt.destroy(compound);
// }

// function createBody( position, rotation, mass, restitution, shape ) {
//   const pos = new Jolt.Vec3( position.x, position.y, position.z );
// 	const rot = new Jolt.Quat( rotation.x, rotation.y, rotation.z, rotation.w );

// 	const motion = mass > 0 ? Jolt.EMotionType_Dynamic : Jolt.EMotionType_Static;
// 	const layer = mass > 0 ? LAYER_MOVING : LAYER_NON_MOVING;

// 	const creationSettings = new Jolt.BodyCreationSettings( shape, pos, rot, motion, layer );
// 	creationSettings.mRestitution = restitution;

// 	const body = bodyInterface.CreateBody( creationSettings );

// 	bodyInterface.AddBody( body.GetID(), Jolt.EActivation_Activate );

// 	Jolt.destroy( creationSettings );

// 	return body;
// }

// function getShape( geometry ) {
// 	const parameters = geometry.parameters;
// 	// TODO change type to is*
// 	if ( geometry.type === 'BoxGeometry' ) {
// 		const sx = parameters.width !== undefined ? parameters.width / 2 : 0.5;
// 		const sy = parameters.height !== undefined ? parameters.height / 2 : 0.5;
// 		const sz = parameters.depth !== undefined ? parameters.depth / 2 : 0.5;
// 		return new Jolt.BoxShape( new Jolt.Vec3( sx, sy, sz ), 0.05 * Math.min( sx, sy, sz ), null );
// 	} else if ( geometry.type === 'SphereGeometry' || geometry.type === 'IcosahedronGeometry' ) {
// 		const radius = parameters.radius !== undefined ? parameters.radius : 1;
// 		return new Jolt.SphereShape( radius, null );
// 	}
// 	return null;
// }

// function createShapes(){
//   let position = new THREE.Vector3(0,10,0);
//   const mesh = createCube();
//   const shape = getShape( mesh.geometry );
//   //let body2 = createBody( position, { x: 0, y: 0, z: 0, w: 1 }, physics.mass, physics.restitution, shape );
//   let body = createBody( position, { x: 0, y: 0, z: 0, w: 1 }, 0, 1, shape );
//   console.log("body:", body)
//   TestRigidBody = body
// }

//===============================================
// SETUP PHYSICS
//===============================================
async function run_simulation(){
  Jolt = await initJolt();
  //console.log(Jolt);
  if(Jolt){
    _run_simulation();
  }
}

// Object layers
const LAYER_NON_MOVING = 0;
const LAYER_MOVING = 1;
const NUM_OBJECT_LAYERS = 2;

function setupCollisionFiltering( settings ) {
  //let objectFilter = new Jolt.ObjectLayerPairFilterTable( NUM_OBJECT_LAYERS );
	//objectFilter.EnableCollision( LAYER_NON_MOVING, LAYER_MOVING );
	//objectFilter.EnableCollision( LAYER_MOVING, LAYER_MOVING );

  // const BP_LAYER_NON_MOVING = new Jolt.BroadPhaseLayer( 0 );
	// const BP_LAYER_MOVING = new Jolt.BroadPhaseLayer( 1 );
	// const NUM_BROAD_PHASE_LAYERS = 2;

  // let bpInterface = new Jolt.BroadPhaseLayerInterfaceTable( NUM_OBJECT_LAYERS, NUM_BROAD_PHASE_LAYERS );
	// bpInterface.MapObjectToBroadPhaseLayer( LAYER_NON_MOVING, BP_LAYER_NON_MOVING );
	// bpInterface.MapObjectToBroadPhaseLayer( LAYER_MOVING, BP_LAYER_MOVING );

  // settings.mObjectLayerPairFilter = objectFilter;
	// settings.mBroadPhaseLayerInterface = bpInterface;
	// settings.mObjectVsBroadPhaseLayerFilter = new Jolt.ObjectVsBroadPhaseLayerFilterTable( settings.mBroadPhaseLayerInterface, NUM_BROAD_PHASE_LAYERS, settings.mObjectLayerPairFilter, NUM_OBJECT_LAYERS );

  let objectFilter = new Jolt.ObjectLayerPairFilterTable(1);
	objectFilter.EnableCollision(MY_LAYER, MY_LAYER);

  // Create very simple broad phase layer interface with only a single layer
	const BP_LAYER = new Jolt.BroadPhaseLayer(0);
	let bpInterface = new Jolt.BroadPhaseLayerInterfaceTable(1, 1);
	bpInterface.MapObjectToBroadPhaseLayer(MY_LAYER, BP_LAYER);
	Jolt.destroy(BP_LAYER); // 'BP_LAYER' has been copied into bpInterface

	// Create broad phase filter
	let bpFilter = new Jolt.ObjectVsBroadPhaseLayerFilterTable(bpInterface, 1, objectFilter, 1);

	settings.mObjectLayerPairFilter = objectFilter;
	settings.mBroadPhaseLayerInterface = bpInterface;
	settings.mObjectVsBroadPhaseLayerFilter = bpFilter;

}
//===============================================
// _ RUN SIMULATION
//===============================================
function _run_simulation(){
  console.log("SETUP...");
  const settings = new Jolt.JoltSettings();
  setupCollisionFiltering(settings)
  jolt = new Jolt.JoltInterface( settings );
  
  Jolt.destroy( settings );
  const physicsSystem = jolt.GetPhysicsSystem();
  bodyInterface = physicsSystem.GetBodyInterface();

  setupScene();
}
//===============================================
// LOOP RENDER
//===============================================
const clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );

function appLoop(){
  let deltaTime = clock.getDelta();
  // Don't go below 30 Hz to prevent spiral of death
  deltaTime = Math.min( deltaTime, 1.0 / 30.0 );
  // When running below 55 Hz, do 2 steps instead of 1
  const numSteps = deltaTime > 1.0 / 55.0 ? 2 : 1;
  //
  stats.update();
  controls.update();
  ECS.update(world, deltaTime);
  // if(TestRigidBody){
  //   //console.log(TestRigidBody.GetPosition())
  //   let pos = TestRigidBody.GetPosition();
  //   console.log("X: ",pos.GetX()," Y:",pos.GetY()," :", pos.GetZ())
  // }

  // Step the physics world
  jolt.Step( deltaTime, numSteps );

  renderer.render( scene, camera );

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world)
}

function create_body(){

  // Create a box
	let material = new Jolt.PhysicsMaterial();
	let size = new Jolt.Vec3(4, 0.5, 0.5);
	let box = new Jolt.BoxShapeSettings(size, 0.05, material); // 'material' is now owned by 'box'
	Jolt.destroy(size);

  // Create a compound
	let compound = new Jolt.StaticCompoundShapeSettings();
	let boxPosition = new Jolt.Vec3(5, 0, 0);
	compound.AddShape(boxPosition, Jolt.Quat.prototype.sIdentity(), box); // 'box' is now owned by 'compound'
	Jolt.destroy(boxPosition);
	let shapeResult = compound.Create();
	let shape = shapeResult.Get();
	shapeResult.Clear(); // We no longer need the shape result, it keeps a reference to 'shape' (which it will also release the next time you create another shape)
	shape.AddRef(); // We want to own this shape so we can delete 'compound' which internally keeps a reference
	Jolt.destroy(compound);

  // Create the body
	let bodyPosition = new Jolt.RVec3(1, 2, 3);
	let bodyRotation = new Jolt.Quat(0, 0, 0, 1);
	let creationSettings = new Jolt.BodyCreationSettings(shape, bodyPosition, bodyRotation, Jolt.EMotionType_Dynamic, MY_LAYER); // 'creationSettings' now holds a reference to 'shape'
	Jolt.destroy(bodyPosition);
	Jolt.destroy(bodyRotation);
	shape.Release(); // We no longer need our own reference to 'shape' because 'creationSettings' now has one
	let body = bodyInterface.CreateBody(creationSettings);
	Jolt.destroy(creationSettings); // 'creationSettings' no longer needed, all settings and the shape reference went to 'body'

	// Add the body
	bodyInterface.AddBody(body.GetID(), Jolt.EActivation_Activate);

  const CUBE = ECS.addEntity(world);
  const cube = createCube();
  ECS.addComponent(world, CUBE, 'mesh', cube);
  ECS.addComponentToEntity(world, CUBE, 'renderable');

  ECS.addComponent(world, CUBE, 'rigid', body);
  ECS.addComponentToEntity(world, CUBE, 'rigidcube');
  console.log(body);
}

//===============================================
// VAR FOR GUI
//===============================================
const myScene = {
  test:function(){
    console.log('TEST...')
  },
  create_rigid_body:function(){
    create_body()
  },
  remove_rigid_body:function(){

  },
  remove_rigid_bodies:function(){
    ECS.removeEntities(world, ['rigidcube']);
  }
};
//===============================================
// CREATE GUI
//===============================================
function createGUI(){

  const gui = new GUI();
  gui.add(myScene,'test');
  const physicsFolder = gui.addFolder('Physics');
  physicsFolder.add(myScene,'create_rigid_body').name('Create Box');
  physicsFolder.add(myScene,'remove_rigid_body').name('Remove Box');
  physicsFolder.add(myScene,'remove_rigid_bodies').name('Delete Boxes');

}
//===============================================
// INIT
//===============================================
run_simulation();