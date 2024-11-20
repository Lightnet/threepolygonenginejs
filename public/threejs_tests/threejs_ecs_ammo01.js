/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://www.npmjs.com/package/ecs
// https://codepen.io/rvcristiand/pen/pogXXyB?editors=1111
// https://stackoverflow.com/questions/18260307/dat-gui-update-the-dropdown-list-values-for-a-controller
// https://stackoverflow.com/questions/34278474/module-exports-and-es6-import
// https://medium.com/@bluemagnificent/intro-to-javascript-3d-physics-using-ammo-js-and-three-js-dd48df81f591
// https://medium.com/@bluemagnificent/collision-detection-in-javascript-3d-physics-using-ammo-js-and-three-js-31a5569291ef
// 

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import ECS from "https://unpkg.com/ecs@0.23.0/ecs.js";

//does not work here need html to load script
//import * as Ammo from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/ammo.wasm.js';

//console.log(Ammo);
//var AMMO;
let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4;

const RENDERABLE_FILTER = [ 'renderable' ];
const CUBE_FILTER = [ 'cube' ];

const PHYSICSABLE_FILTER = [ 'rigidcube' ];

const STATE = { DISABLE_DEACTIVATION : 4 };

const stats = new Stats();
let gridHelper;
let axesHelper;

// generates a new entity component system
const world = ECS.addWorld();
var physicsWorld;
var tmpTrans;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
//camera.position.set(0, 5, 5);
camera.position.set(0, 30, 30);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

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

function setupHelper(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );

  axesHelper = new THREE.AxesHelper( 5 );
  //axesHelper.position.set(0.5,0.5,0.5)
  scene.add( axesHelper );
}

function createRigidGround(){
  let pos = {x: 0, y: 0, z: 0};
  let scale = {x: 50, y: 2, z: 50};
  let quat = {x: 0, y: 0, z: 0, w: 1};
  let mass = 0;
  //threeJS Section
  let blockPlane = new THREE.Mesh(
    new THREE.BoxGeometry(), 
    //new THREE.MeshPhongMaterial({color: 0xa0afa4})
    new THREE.MeshBasicMaterial( { color: 0xa0afa4 } )
  );
  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.scale.set(scale.x, scale.y, scale.z);
  blockPlane.castShadow = true;
  blockPlane.receiveShadow = true;
  scene.add(blockPlane);

  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
  transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
  let motionState = new Ammo.btDefaultMotionState( transform );

  let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
  colShape.setMargin( 0.05 );

  let localInertia = new Ammo.btVector3( 0, 0, 0 );
  colShape.calculateLocalInertia( mass, localInertia );

  let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
  let body = new Ammo.btRigidBody( rbInfo );


  physicsWorld.addRigidBody( body );
}

function createRigidBall(){

  const SPHERE = ECS.addEntity(world)

  let pos = {x: 0, y: 20, z: 0};
  let radius = 2;
  let quat = {x: 0, y: 0, z: 0, w: 1};
  let mass = 1;
  //threeJS Section
  //let ball = new THREE.Mesh(new THREE.SphereGeometry(radius,6,6), new THREE.MeshPhongMaterial({color: 0x00ff08}));
  let ball = new THREE.Mesh(
    new THREE.SphereGeometry(radius,6,6),
    //new THREE.MeshPhongMaterial({color: 0x00ff08})
    new THREE.MeshBasicMaterial( { color: 'blue' } )
  );
  ball.position.set(pos.x, pos.y, pos.z);
  ball.castShadow = true;
  ball.receiveShadow = true;
  //scene.add(ball);
  ECS.addComponent(world, SPHERE, 'mesh', ball);
  ECS.addComponentToEntity(world, SPHERE, 'renderable');

  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
  transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
  let motionState = new Ammo.btDefaultMotionState( transform );

  let colShape = new Ammo.btSphereShape( radius );
  colShape.setMargin( 0.05 );

  let localInertia = new Ammo.btVector3( 0, 0, 0 );
  colShape.calculateLocalInertia( mass, localInertia );

  let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
  let body = new Ammo.btRigidBody( rbInfo );
  physicsWorld.addRigidBody( body, colGroupGreenBall, colGroupRedBall);
  console.log(physicsWorld);
  
  //ball.userData.physicsBody = body;
  ECS.addComponent(world, SPHERE, 'rigid', body);
  //rigidBodies.push(ball);
}

function rotateSystem(world){
  const onUpdate = function (dt) {
    for (const entity of ECS.getEntities(world, [ 'rotation','mesh', 'isRotate'])) {
      if(entity.isRotate){
        entity.rotation.x += 0.01;
        entity.rotation.y += 0.01;
        entity.mesh.rotation.x = entity.rotation.x % Math.PI;
        entity.mesh.rotation.y = entity.rotation.y % Math.PI;
        //console.log(entity.mesh.rotation.x);
      }
    }
  }
  return {onUpdate}
}

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

//physics update mesh with position and rotation
function physicsUpdateSystem(world) {
  const onUpdate = function (dt) {
    for (const entity of ECS.getEntities(world, ['mesh', 'rigid'])) {
      if((entity?.mesh !=null)&&(entity?.rigid !=null)){
        let objThree = entity.mesh;
        let objAmmo = entity.rigid;
        let ms = objAmmo.getMotionState();
        if ( ms ) {
          ms.getWorldTransform( tmpTrans );
          let p = tmpTrans.getOrigin();
          let q = tmpTrans.getRotation();
          objThree.position.set( p.x(), p.y(), p.z() );
          objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
        }
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
      //console.log("physicsSystem add")
      //console.log('[physicsSystem] added new entity:', result.entries[i])
      // if((result.entries[i]?.mesh !=null)&&(result.entries[i]?.rigid !=null)){
      //   result.entries[i].mesh.position.copy(result.entries[i].rigid.translation())
      //   result.entries[i].mesh.quaternion.copy(result.entries[i].rigid.rotation())
      // }
      //console.log(result.entries[i])
      //scene.add(result.entries[i].mesh);
    }

    ECS.getEntities(world, PHYSICSABLE_FILTER, 'removed', result);
    for (let i=0; i < result.count; i++){
      //console.log('removed entity:', result.entries[i])
      //scene.remove(result.entries[i].mesh);
      
      if(result.entries[i]?.rigid){
        physicsWorld.removeRigidBody(result.entries[i].rigid);
      }
      if(result.entries[i]?.mesh){
        scene.remove(result.entries[i].mesh);
      }
    }
  }
  return { onUpdate }
}

let currentTime = performance.now();
var controls = new OrbitControls( camera, renderer.domElement );
function appLoop(){
  const newTime = performance.now()
  const frameTime = newTime - currentTime  // in milliseconds, e.g. 16.64356
  currentTime = newTime
  stats.update();
  controls.update();
  if(physicsWorld){
    physicsWorld.stepSimulation(frameTime,10);
    detectCollision();
  }
  // run onUpdate for all added systems
  ECS.update(world, frameTime);
  //draw physics
  // if(rapierDebugRenderer){
  //   rapierDebugRenderer.update();
  // }
  
  renderer.render( scene, camera );

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world)
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var controller;
var physicsFolder;
const myScene = {
  entity_id:0,
  pos:{x:0,y:10,z:0},
  min:{x:-15,y:1,z:-15},
  max:{x:15,y:15,z:15},
  width:1,
  height:1,
  depth:1,
  isRandom:true,
  isRotate:false,
  isCreateRotate:true,
  //entityIds:[],
  currentEntityId:0,
  //currentEntity:0,
  createRigidBodyCube:function(){
    if(this.isRandom){
      createRigidCube({
        width:this.width,
        height:this.height,
        depth:this.depth,
        x:getRandomArbitrary(this.min.x, this.max.x),
        y:getRandomArbitrary(this.min.y, this.max.y),
        z:getRandomArbitrary(this.min.z, this.max.z),
      });
    }else{
      createRigidCube({
        width:this.width,
        height:this.height,
        depth:this.depth,
        x:this.pos.x,
        y:this.pos.y,
        z:this.pos.z,
      });
    }
  },
  delete_cube:function(){
    console.log("this.entity_id: ", this.currentEntityId)
    const entity = ECS.getEntityById(world, this.currentEntityId);
    const deferredRemoval = false  // by default this is true. setting it to false immediately removes the component
    ECS.removeEntity(world, entity, deferredRemoval)
  },
  addRigidCube:function(){
    createRigidCube();
  },
  removeRigIdCubes(){
    ECS.removeEntities(world, ['rigidcube']);
  },
  getRigidBodies(){
    console.log(this);
    let entityIds = [];
    for (const entity of ECS.getEntities(world, [ 'rigidcube' ])){
      const entity_id = ECS.getEntityId(world, entity)
      //console.log(entity_id);
      entityIds.push(entity_id); 
    }

    if(controller){
      controller.destroy()//delete ui
      controller = physicsFolder.add(myScene, 'currentEntityId', entityIds);
    }else{
      controller = physicsFolder.add(myScene,'currentEntityId', entityIds)
    }
  },
  removeRigidBodyBoxId:function(){
    console.log("this.currentEntity: ", this.currentEntityId)
    const entity = ECS.getEntityById(world, this.currentEntityId);
    const deferredRemoval = false  // by default this is true. setting it to false immediately removes the component
    ECS.removeEntity(world, entity, deferredRemoval)
  },
}

function createGUI(){
  const gui = new GUI();
  const cubeFolder = gui.addFolder('Cube').show(true);
  const randomFolder = cubeFolder.addFolder('Random');
  const ranMinFolder = randomFolder.addFolder('Min');
  ranMinFolder.add(myScene.min, 'x',-100,10).name('X:');
  ranMinFolder.add(myScene.min, 'y',-100,10).name('Y:');
  ranMinFolder.add(myScene.min, 'z',-100,10).name('Z:');

  const ranMaxFolder = randomFolder.addFolder('Max');
  ranMaxFolder.add(myScene.max, 'x',0,100).name('X:');
  ranMaxFolder.add(myScene.max, 'y',0,100).name('Y:');
  ranMaxFolder.add(myScene.max, 'z',0,100).name('Z:');

  const positionFolder = cubeFolder.addFolder('Position');
  positionFolder.add(myScene.pos, 'x',-100,100).name('X:');
  positionFolder.add(myScene.pos, 'y',-100,100).name('Y:');
  positionFolder.add(myScene.pos, 'z',-100,100).name('Z:');
  const sizeFolder = cubeFolder.addFolder('Size');
  sizeFolder.add(myScene, 'width',0.01,100);
  sizeFolder.add(myScene, 'height',0.01,100);
  sizeFolder.add(myScene, 'depth',0.01,100);
  
  cubeFolder.add(myScene, 'isRandom').name('is Random');
  //cubeFolder.add(myScene, 'isCreateRotate').name('is Rotate');
  cubeFolder.add(myScene, 'createRigidBodyCube').name('Create');

  const debugFolder = gui.addFolder('Debug');
  // debugFolder.add(rapierDebugRenderer,'enabled').name('Physics Render Wirefame');
  physicsFolder = gui.addFolder('Physics');
  physicsFolder.add(myScene, 'removeRigIdCubes').name('Remove All Rigid Body Cubes');
  physicsFolder.add(myScene, 'getRigidBodies').name('Get Rigid Cubes');
  physicsFolder.add(myScene, 'currentEntityId').listen();
  physicsFolder.add(myScene, 'removeRigidBodyBoxId').name('Remove Box');
  
}

function setupScene(){
  //setupCube();

  ECS.addSystem(world, rotateSystem)//simple rotate test mesh cube
  ECS.addSystem(world, physicsUpdateSystem)// update position and rotation
  ECS.addSystem(world, physicsSystem)// event when add and remove//add ingore? since add to physics world objects.
  ECS.addSystem(world, rendererSystem)// add and remove object3d from the scene

  van.add(document.body, renderer.domElement);
  van.add(document.body, stats.dom);
  createGUI();
  setupHelper();

  createRigidGround();
  //createRigidBall();

  renderer.setAnimationLoop( appLoop );
}

async function run_simulation() {
  // Run the simulation.
  // Ammo().then( function(){
  //   console.log(Ammo);
  //   console.log("init...")
  // });
  let AMMO = await Ammo();
  console.log(AMMO);
  _run_simulation(AMMO)
  
}

function createRigidCube(args){
  args = args || {};
  const width = args?.width || 2;
  const height = args?.height || 2;
  const depth = args?.depth || 2;
  const color = args?.color || 0x00ffff;

  const x = args?.x || 0;
  const y = args?.y || 0;
  const z = args?.z || 0;
  
  let mesh = createCube({width:width,height:height,depth:depth,color:color});

  const CUBE = ECS.addEntity(world)
  ECS.addComponent(world, CUBE, 'mesh', mesh);
  ECS.addComponentToEntity(world, CUBE, 'renderable');

  let pos = {x: x, y: y, z: z};
  let quat = {x: 0, y: 0, z: 0, w: 1};
  let scale = {x: width, y:height, z: depth};
  let mass = 1;

  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
  transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
  let motionState = new Ammo.btDefaultMotionState( transform );
  //shape

  let blockColShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
  blockColShape.setMargin( 0.05 );

  let localInertia = new Ammo.btVector3( 0, 0, 0 );
  blockColShape.calculateLocalInertia( mass, localInertia );
  //info
  let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, blockColShape, localInertia );
  let body = new Ammo.btRigidBody( rbInfo );
  physicsWorld.addRigidBody( body);
  //physicsWorld.addRigidBody( body, colGroupGreenBall, colGroupRedBall);
  //console.log(physicsWorld);

  ECS.addComponent(world, CUBE, 'rigid', body);
  ECS.addComponentToEntity(world, CUBE, 'rigidcube');
}

function detectCollision(){
  let dispatcher = physicsWorld.getDispatcher();
	let numManifolds = dispatcher.getNumManifolds();

	for ( let i = 0; i < numManifolds; i ++ ) {

		let contactManifold = dispatcher.getManifoldByIndexInternal( i );
		let numContacts = contactManifold.getNumContacts();

		for ( let j = 0; j < numContacts; j++ ) {

			let contactPoint = contactManifold.getContactPoint( j );
			let distance = contactPoint.getDistance();
      //console.log("collision detected...",contactPoint)
      //console.log("collision detected...",contactManifold)
			//console.log({manifoldIndex: i, contactIndex: j, distance: distance});
		}
	}
}

function _run_simulation(){
  //console.log("RAPIER...");
  // Use the RAPIER module here.
  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  //physics = new AMMO.World(gravity);
  //console.log(Ammo);
  var collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
  var dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration);
  var overlappingPairCache    = new Ammo.btDbvtBroadphase();
  var solver                  = new Ammo.btSequentialImpulseConstraintSolver();
  physicsWorld                = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  physicsWorld.setGravity(new Ammo.btVector3(gravity.x, gravity.y, gravity.z));
  tmpTrans = new Ammo.btTransform();
  setupScene();
}

run_simulation();
