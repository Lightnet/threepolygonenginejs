/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// Notes:
// simple ground and cube button create test 
// create box on gui
// 

// https://www.npmjs.com/package/ecs
// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/physics/JoltPhysics.js
// https://jrouwe.github.io/JoltPhysics.js/
// https://github.com/jrouwe/JoltPhysics.js/?tab=readme-ov-file
// https://github.com/jrouwe/JoltPhysics.js/blob/main/helloworld/HelloWorld.js
// 

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import ECS from "https://unpkg.com/ecs@0.23.0/ecs.js";
const {div,textarea} = van.tags;
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
// let gridHelper;
// let axesHelper;

const world = ECS.addWorld();

// Create very simple object layer filter with only a single layer
const MY_LAYER = 0;
let Jolt; // upper case API
var jolt; // lower case world and objects
var bodyInterface;
var physicsSystem;
// https://github.com/jrouwe/JoltPhysics.js/blob/main/Examples/js/example.js
const DegreesToRadians = (deg) => deg * (Math.PI / 180.0);

const wrapVec3 = (v) => new THREE.Vector3(v.GetX(), v.GetY(), v.GetZ());
const unwrapVec3 = (v) => new Jolt.Vec3(v.x, v.y, v.z);
const wrapRVec3 = wrapVec3;
const unwrapRVec3 = (v) => new Jolt.RVec3(v.x, v.y, v.z);
const wrapQuat = (q) => new THREE.Quaternion(q.GetX(), q.GetY(), q.GetZ(), q.GetW());
const unwrapQuat = (q) => new Jolt.Quat(q.x, q.y, q.z, q.w);

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
  //console.log(args);
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
}
function setupLogs(){
  van.add(document.body,div({style:`position:fixed;top:60px;left:0px;`},
    div(' Contact collision'),
    textarea({id:'collision-log',style:``,rows:"5",cols:"60"})
  ))
}
//===============================================
// SETUP SCENE
//===============================================
function setupScene(){
  
  createLights();
  ECS.addSystem(world, physicsUpdateSystem)// update position and rotation
  ECS.addSystem(world, physicsSystemECS)// event when add and remove//add ingore? since add to physics world objects.
  ECS.addSystem(world, rendererSystem)// add and remove object3d from the scene

  van.add(document.body, renderer.domElement);
  van.add(document.body, stats.dom);
  renderer.setAnimationLoop( appLoop );
  createGUI();
  //physics
  createFloor();
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
// ECS PHYSICS UPDATE SYSTEM
//===============================================
function physicsUpdateSystem(world) {
  const onUpdate = function (dt) {
    for (const entity of ECS.getEntities(world, ['mesh', 'rigid'])) {
      //console.log(entity);
      if((entity?.mesh !=null)&&(entity?.rigid !=null)){
        
        //wrapVec3 helper
        //wrapQuat helper
        entity.mesh.position.copy(wrapVec3(entity.rigid.GetPosition()));
	      entity.mesh.quaternion.copy(wrapQuat(entity.rigid.GetRotation()));

        //let pos = entity.rigid.GetPosition();
        //console.log("X: ",pos.GetX()," Y:",pos.GetY()," :", pos.GetZ())
        // entity.mesh.position.set(
        //   pos.GetX(),
        //   pos.GetY(),
        //   pos.GetZ()
        // );
        // let rot = entity.rigid.GetPosition();
        //entity.mesh.position.copy(entity.rigid.translation())
        //entity.mesh.quaternion.copy(entity.rigid.rotation())
      }
    }
  }
  return { onUpdate }
}

function physicsSystemECS (world) {
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
      console.log("Physics remove???");
      
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

//===============================================
// SETUP PHYSICS INIT AWAIT
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
// https://github.com/jrouwe/JoltPhysics.js/blob/main/Examples/js/example.js
function setupCollisionFiltering( settings ) {

  // Layer that objects can be in, determines which other objects it can collide with
	// Typically you at least want to have 1 layer for moving bodies and 1 layer for static bodies, but you can have more
	// layers if you want. E.g. you could have a layer for high detail collision (which is not used by the physics simulation
	// but only if you do collision testing).
	let objectFilter = new Jolt.ObjectLayerPairFilterTable(NUM_OBJECT_LAYERS);
	objectFilter.EnableCollision(LAYER_NON_MOVING, LAYER_MOVING);
	objectFilter.EnableCollision(LAYER_MOVING, LAYER_MOVING);

	// Each broadphase layer results in a separate bounding volume tree in the broad phase. You at least want to have
	// a layer for non-moving and moving objects to avoid having to update a tree full of static objects every frame.
	// You can have a 1-on-1 mapping between object layers and broadphase layers (like in this case) but if you have
	// many object layers you'll be creating many broad phase trees, which is not efficient.
	const BP_LAYER_NON_MOVING = new Jolt.BroadPhaseLayer(0);
	const BP_LAYER_MOVING = new Jolt.BroadPhaseLayer(1);
	const NUM_BROAD_PHASE_LAYERS = 2;
	let bpInterface = new Jolt.BroadPhaseLayerInterfaceTable(NUM_OBJECT_LAYERS, NUM_BROAD_PHASE_LAYERS);
	bpInterface.MapObjectToBroadPhaseLayer(LAYER_NON_MOVING, BP_LAYER_NON_MOVING);
	bpInterface.MapObjectToBroadPhaseLayer(LAYER_MOVING, BP_LAYER_MOVING);

	settings.mObjectLayerPairFilter = objectFilter;
	settings.mBroadPhaseLayerInterface = bpInterface;
	settings.mObjectVsBroadPhaseLayerFilter = new Jolt.ObjectVsBroadPhaseLayerFilterTable(settings.mBroadPhaseLayerInterface, NUM_BROAD_PHASE_LAYERS, settings.mObjectLayerPairFilter, NUM_OBJECT_LAYERS);

}
//===============================================
// _ RUN SIMULATION
//===============================================
//var dynamicObjects = [];

function _run_simulation(){
  //console.log("SETUP...");
  setupLogs();
  const settings = new Jolt.JoltSettings();
  setupCollisionFiltering(settings);
  jolt = new Jolt.JoltInterface( settings );// world physics
  
  Jolt.destroy( settings );
  physicsSystem = jolt.GetPhysicsSystem();
  bodyInterface = physicsSystem.GetBodyInterface();
  //detect collision
  setupContactListener();
  setupScene();
}

function setupContactListener(){
  var collisionLog = document.getElementById('collision-log');
  // Register contact listener
  const contactListener = new Jolt.ContactListenerJS();
	contactListener.OnContactValidate = (body1, body2, baseOffset, collideShapeResult) => {
		body1 = Jolt.wrapPointer(body1, Jolt.Body);
		body2 = Jolt.wrapPointer(body2, Jolt.Body);
    console.log("body1:",body1);
    console.log("body2:",body2);
		collideShapeResult = Jolt.wrapPointer(collideShapeResult, Jolt.CollideShapeResult);
		collisionLog.value += 'OnContactValidate ' + body1.GetID().GetIndex() + ' ' + body2.GetID().GetIndex() + ' ' + collideShapeResult.mPenetrationAxis.ToString() + '\n';
		return Jolt.ValidateResult_AcceptAllContactsForThisBodyPair;
	};
	contactListener.OnContactAdded = (body1, body2, manifold, settings) => {
		body1 = Jolt.wrapPointer(body1, Jolt.Body);
		body2 = Jolt.wrapPointer(body2, Jolt.Body);
		manifold = Jolt.wrapPointer(manifold, Jolt.ContactManifold);
		settings = Jolt.wrapPointer(settings, Jolt.ContactSettings);
		collisionLog.value += 'OnContactAdded ' + body1.GetID().GetIndex() + ' ' + body2.GetID().GetIndex() + ' ' + manifold.mWorldSpaceNormal.ToString() + '\n';

		// Override the restitution to 0.5
		//settings.mCombinedRestitution = 0.5;
	};
	contactListener.OnContactPersisted = (body1, body2, manifold, settings) => {
		body1 = Jolt.wrapPointer(body1, Jolt.Body);
		body2 = Jolt.wrapPointer(body2, Jolt.Body);
		manifold = Jolt.wrapPointer(manifold, Jolt.ContactManifold);
		settings = Jolt.wrapPointer(settings, Jolt.ContactSettings);
		collisionLog.value += 'OnContactPersisted ' + body1.GetID().GetIndex() + ' ' + body2.GetID().GetIndex() + ' ' + manifold.mWorldSpaceNormal.ToString() + '\n';

		// Override the restitution to 0.5
		//settings.mCombinedRestitution = 0.5;
	};
	contactListener.OnContactRemoved = (subShapePair) => {
		subShapePair = Jolt.wrapPointer(subShapePair, Jolt.SubShapeIDPair);
		collisionLog.value += 'OnContactRemoved ' + subShapePair.GetBody1ID().GetIndex() + ' ' + subShapePair.GetBody2ID().GetIndex() + '\n';
	};
	physicsSystem.SetContactListener(contactListener);
}

function getThreeObjectForBody(body, color) {
	let material = new THREE.MeshPhongMaterial({ color: color });

	let threeObject;

	let shape = body.GetShape();
	switch (shape.GetSubType()) {
		case Jolt.EShapeSubType_Box:
			let boxShape = Jolt.castObject(shape, Jolt.BoxShape);
			let extent = wrapVec3(boxShape.GetHalfExtent()).multiplyScalar(2);
			threeObject = new THREE.Mesh(new THREE.BoxGeometry(extent.x, extent.y, extent.z, 1, 1, 1), material);
			break;
		case Jolt.EShapeSubType_Sphere:
			let sphereShape = Jolt.castObject(shape, Jolt.SphereShape);
			threeObject = new THREE.Mesh(new THREE.SphereGeometry(sphereShape.GetRadius(), 32, 32), material);
			break;
		case Jolt.EShapeSubType_Capsule:
			let capsuleShape = Jolt.castObject(shape, Jolt.CapsuleShape);
			threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(capsuleShape.GetRadius(), 2 * capsuleShape.GetHalfHeightOfCylinder(), 20, 10), material);
			break;
		case Jolt.EShapeSubType_Cylinder:
			let cylinderShape = Jolt.castObject(shape, Jolt.CylinderShape);
			threeObject = new THREE.Mesh(new THREE.CylinderGeometry(cylinderShape.GetRadius(), cylinderShape.GetRadius(), 2 * cylinderShape.GetHalfHeight(), 20, 1), material);
			break;
		default:
			if (body.GetBodyType() == Jolt.EBodyType_SoftBody)
				threeObject = getSoftBodyMesh(body, material);
			else
				threeObject = new THREE.Mesh(createMeshForShape(shape), material);
			break;
	}

	threeObject.position.copy(wrapVec3(body.GetPosition()));
	threeObject.quaternion.copy(wrapQuat(body.GetRotation()));

	return threeObject;
}
// https://github.com/jrouwe/JoltPhysics.js/blob/main/Examples/js/example.js
function createMeshForShape(shape) {
	// Get triangle data
	let scale = new Jolt.Vec3(1, 1, 1);
	let triContext = new Jolt.ShapeGetTriangles(shape, Jolt.AABox.prototype.sBiggest(), shape.GetCenterOfMass(), Jolt.Quat.prototype.sIdentity(), scale);
	Jolt.destroy(scale);

	// Get a view on the triangle data (does not make a copy)
	let vertices = new Float32Array(Jolt.HEAPF32.buffer, triContext.GetVerticesData(), triContext.GetVerticesSize() / Float32Array.BYTES_PER_ELEMENT);

	// Now move the triangle data to a buffer and clone it so that we can free the memory from the C++ heap (which could be limited in size)
	let buffer = new THREE.BufferAttribute(vertices, 3).clone();
	Jolt.destroy(triContext);

	// Create a three mesh
	let geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', buffer);
	geometry.computeVertexNormals();

	return geometry;
}

function addToThreeScene(body, color) {
	let threeObject = getThreeObjectForBody(body, color);
	threeObject.userData.body = body;

	scene.add(threeObject);
	//dynamicObjects.push(threeObject);
}

function addToScene(body, color) {
	bodyInterface.AddBody(body.GetID(), Jolt.EActivation_Activate);

	addToThreeScene(body, color);
}

function createFloor(size = 50) {
	var shape = new Jolt.BoxShape(new Jolt.Vec3(size, 0.5, size), 0.05, null);
	var creationSettings = new Jolt.BodyCreationSettings(shape, new Jolt.RVec3(0, -0.5, 0), new Jolt.Quat(0, 0, 0, 1), Jolt.EMotionType_Static, LAYER_NON_MOVING);
	let body = bodyInterface.CreateBody(creationSettings);
	Jolt.destroy(creationSettings);
	addToScene(body, 0xc7c7c7);
	return body;
}

//===============================================
// LOOP RENDER
//===============================================
const clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );

function appLoop(){
  let deltaTime = clock.getDelta();
  myScene.delta = deltaTime.toFixed(4);
  // Don't go below 30 Hz to prevent spiral of death
  deltaTime = Math.min( deltaTime, 1.0 / 30.0 );
  // When running below 55 Hz, do 2 steps instead of 1
  const numSteps = deltaTime > 1.0 / 55.0 ? 2 : 1;
  myScene.step = numSteps.toFixed(4);
  // update...
  stats.update();
  controls.update();
  ECS.update(world, deltaTime);

  // Step the physics world
  jolt.Step( deltaTime, numSteps );

  renderer.render( scene, camera );

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world)
}

function createBodyBox(args={}){

  //console.log(args);
  let width = args?.width || 2;
  let height = args?.height || 2;
  let depth = args?.depth || 2;

  let x = args?.x || 0;
  let y = args?.y || 0;
  let z = args?.z || 0;

  // Create a box
	let material = new Jolt.PhysicsMaterial();
	let size = new Jolt.Vec3(width/2, height/2, depth/2);
	let box = new Jolt.BoxShapeSettings(size, 0.05, material); // 'material' is now owned by 'box'
	Jolt.destroy(size);

  // Create a compound
	let compound = new Jolt.StaticCompoundShapeSettings();
	let boxPosition = new Jolt.Vec3(0, 0, 0);
	compound.AddShape(boxPosition, Jolt.Quat.prototype.sIdentity(), box); // 'box' is now owned by 'compound'
	Jolt.destroy(boxPosition);
	let shapeResult = compound.Create();
	let shape = shapeResult.Get();
	shapeResult.Clear(); // We no longer need the shape result, it keeps a reference to 'shape' (which it will also release the next time you create another shape)
	shape.AddRef(); // We want to own this shape so we can delete 'compound' which internally keeps a reference
	Jolt.destroy(compound);

  // Create the body
	let bodyPosition = new Jolt.RVec3(x, y, z);
	let bodyRotation = new Jolt.Quat(0, 0, 0, 1);
	let creationSettings = new Jolt.BodyCreationSettings(shape, bodyPosition, bodyRotation, Jolt.EMotionType_Dynamic, LAYER_MOVING); // 'creationSettings' now holds a reference to 'shape'
	Jolt.destroy(bodyPosition);
	Jolt.destroy(bodyRotation);
	shape.Release(); // We no longer need our own reference to 'shape' because 'creationSettings' now has one
	let body = bodyInterface.CreateBody(creationSettings);
	Jolt.destroy(creationSettings); // 'creationSettings' no longer needed, all settings and the shape reference went to 'body'

	// Add the body
	bodyInterface.AddBody(body.GetID(), Jolt.EActivation_Activate);

  const CUBE = ECS.addEntity(world);// entity
  const cube = createCube({width:width,height:height,depth:height});//threejs mesh
  ECS.addComponent(world, CUBE, 'mesh', cube);
  ECS.addComponentToEntity(world, CUBE, 'renderable'); // tag
  ECS.addComponent(world, CUBE, 'rigid', body); // jolt body
  ECS.addComponentToEntity(world, CUBE, 'rigidcube'); // tag
  console.log("CUBE: ", body);
  return body
}

//===============================================
// VAR FOR GUI
//===============================================
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var controller;
var EntitiesFolder;
const myScene = {
  delta:0,
  step:0,
  currentEntity:0,
  isRandom:false,
  width:4,
  height:4,
  depth:4,
  pos:{x:0,y:20,z:0},
  min:{x:-20,y:0,z:-20},
  max:{x:20,y:20,z:20},
  createRigidBodyCube:function(){
    if(myScene.isRandom){
      createBodyBox({
        width:this.width,
        height:this.height,
        depth:this.depth,
        x:getRandomArbitrary(this.min.x,this.max.x),
        y:getRandomArbitrary(this.min.y,this.max.y),
        z:getRandomArbitrary(this.min.z,this.max.z),
      })
    }else{
      createBodyBox({
        width:this.width,
        height:this.height,
        depth:this.depth,
        x:this.pos.x,
        y:this.pos.y,
        z:this.pos.z,
      })
    }
  },
  create_rigid_body:function(){
    createBodyBox({
      width:4,
      height:4,
      depth:4,
      x:0,
      y:20,
      z:0,
    })
  },
  remove_rigid_bodies:function(){
    ECS.removeEntities(world, ['rigidcube']);
  },
  get_rigidBodies:function(){

    let entityIds = [];
    for (const entity of ECS.getEntities(world, [ 'rigidcube' ])){
      const entity_id = ECS.getEntityId(world, entity)
      //console.log(entity_id);
      entityIds.push(entity_id); 
    }

    if(controller){
      controller.destroy()//delete ui
      controller = EntitiesFolder.add(myScene, 'currentEntity', entityIds);
    }else{
      controller = EntitiesFolder.add(myScene,'currentEntity', entityIds)
    }
  },
  remove_rigid_body:function(){
    console.log("this.currentEntity: ", this.currentEntity)
    const entity = ECS.getEntityById(world, this.currentEntity);
    const deferredRemoval = false  // by default this is true. setting it to false immediately removes the component
    ECS.removeEntity(world, entity, deferredRemoval)
  },
};
//===============================================
// CREATE GUI
//===============================================
function createGUI(){

  const gui = new GUI();
  const timeFolder = gui.addFolder('Time');
  timeFolder.add(myScene,'delta').listen().disable();
  timeFolder.add(myScene,'step').listen().disable();
  const randomFolder = gui.addFolder('Random');
  const rangeFolder = randomFolder.addFolder('Range');
  rangeFolder.add(myScene.min, 'x',-100,0).name('Min x:');
  rangeFolder.add(myScene.min, 'y',-100,0).name('Min y:');
  rangeFolder.add(myScene.min, 'z',-100,0).name('Min z:');
  rangeFolder.add(myScene.max, 'x',0,100).name('Max x:');
  rangeFolder.add(myScene.max, 'y',0,100).name('Max y:');
  rangeFolder.add(myScene.max, 'z',0,100).name('Max z:');
  
  const cubeFolder = gui.addFolder('Cube');
  const sizeFolder = cubeFolder.addFolder('Size');
  sizeFolder.add(myScene, 'height',0.1,50)
  sizeFolder.add(myScene, 'width',0.1,50)
  sizeFolder.add(myScene, 'depth',0.1,50)
  const positionFolder = cubeFolder.addFolder('Position');
  positionFolder.add(myScene.pos, 'x',-50,50).name('x:')
  positionFolder.add(myScene.pos, 'y',-50,50).name('y:')
  positionFolder.add(myScene.pos, 'z',-50,50).name('z:')
  cubeFolder.add(myScene, 'isRandom');
  cubeFolder.add(myScene,'createRigidBodyCube').name('Create Box');

  const physicsSceneFolder = gui.addFolder('Physics Scene');
  physicsSceneFolder.add(myScene,'create_rigid_body').name('Create Box');
  physicsSceneFolder.add(myScene,'remove_rigid_bodies').name('Delete Boxes');
  EntitiesFolder = gui.addFolder('Entities Box');
  EntitiesFolder.add(myScene,'remove_rigid_body').name('Remove Box');
  EntitiesFolder.add(myScene,'get_rigidBodies').name('Get RigidBodies');

}
//===============================================
// INIT
//===============================================
run_simulation();