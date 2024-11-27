/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://medium.com/@bluemagnificent/intro-to-javascript-3d-physics-using-ammo-js-and-three-js-dd48df81f591
// https://medium.com/@bluemagnificent/moving-objects-in-javascript-3d-physics-using-ammo-js-and-three-js-6e39eff6d9e5
// 
// https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

let moveDirection = { left: 0, right: 0, forward: 0, back: 0 };
const STATE = { DISABLE_DEACTIVATION : 4 }
const FLAGS = { CF_KINEMATIC_OBJECT: 2  }
let kObject = null;
let objectPlayer = null;
let kMoveDirection = { left: 0, right: 0, forward: 0, back: 0 };
let tmpPos = new THREE.Vector3(), tmpQuat = new THREE.Quaternion();
let ammoTmpPos = null, ammoTmpQuat = null;
let kController;

let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4;
var bodies = [];
var ghostBodies = [];
var physicsWorld;
var tmpTrans;
var cube;
var gridHelper;

var clock = new THREE.Clock();
const stats = new Stats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 5, 5);

const renderer = new THREE.WebGLRenderer();
var controls = new OrbitControls( camera, renderer.domElement );

renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

function createMeshCube(args){
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
// https://threejs.org/docs/?q=cap#api/en/geometries/CapsuleGeometry
function createMeshSphere(args){
  args = args || {};
  const radius  = args?.radius  || 1;
  const length  = args?.length  || 1;
  const capSegments  = args?.capSegments || 4;
  const radialSegments   = args?.radialSegments  || 8;
  const color = args?.color || 0x00ff00;
  const geometry = new THREE.CapsuleGeometry( radius, length, capSegments, radialSegments );
  const material = new THREE.MeshBasicMaterial( { color: color } );
  const cube = new THREE.Mesh( geometry, material );
  return cube;
}

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

const myObject ={
  isRotate:true,
  gravity:{x:0,y:-9.81,z:0},
  test:()=>{
    console.log('test');
  },
  resetRotation(){
    cube.rotation.set(0,0,0)
  },
  addPhysicsBox(args){
    args = args || {};
    const width = args?.width || 2;
    const height = args?.height || 2;
    const depth = args?.depth || 2;
    const color = args?.color || 0x00ffff;

    let pos={
      x:args?.x || 0,
      y:args?.y || 5,
      z:args?.z || 0,
    }
    let quat={
      x:0,
      y:0,
      z:0,
      w:1
    }
    const mass = 1;

    let mesh = createMeshCube({width:width,height:height,depth:depth,color:color});
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData.physics = { mass: 1 };
    mesh.userData.objectType = 'box';
    scene.add( mesh );

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );
    //shape

    let blockColShape = new Ammo.btBoxShape( new Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
    blockColShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    blockColShape.calculateLocalInertia( mass, localInertia );
    //info
    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, blockColShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );
    physicsWorld.addRigidBody( body);

    bodies.push({
      mesh:mesh,
      rigid:body,
    })

  },
  removePhysicsBox(){
    let removeBodies = [];
    for(const _entity of bodies) {
      if(_entity.mesh.userData?.objectType=='box'){
        scene.remove(_entity.mesh);
        physicsWorld.removeRigidBody(_entity.rigid)
        removeBodies.push(_entity);
      }
    }

    for(let i=0; i< removeBodies.length;i++){
      let index = bodies.indexOf(removeBodies[i]);
      if(index > -1){
        bodies.splice(index,1);
      }
    }
    console.log(bodies);
  },
  lenPhysicsWorld(){
    console.log(bodies);
  },
  addPhysicsGround(args){
    args = args || {};
    let isFound = false;
    for(const _entity of bodies) {
      if(_entity.mesh.userData?.objectType=='ground'){
        isFound=true;
      }
    }

    if(isFound){
      console.log("FOUND GROUND")
      return;
    }

    const width = args?.width || 10;
    const height = args?.height || 1;
    const depth = args?.depth || 10;

    let pos={
      x:0,
      y:0,
      z:0,
    }
    let quat={
      x:0,
      y:0,
      z:0,
      w:1
    }

    let mass = 0;
    let color= 0x00ffff;
    color=0x444444;

    let mesh = createMeshCube({width:width,height:height,depth:depth,color:color});
    //floor.position.y = - 2.5;
    mesh.receiveShadow = true;
    mesh.userData.physics = { mass: 0 };
    mesh.userData.objectType = 'ground';
    scene.add( mesh );

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );
    //shape

    let blockColShape = new Ammo.btBoxShape( new Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
    blockColShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    blockColShape.calculateLocalInertia( mass, localInertia );
    //info
    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, blockColShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );
    physicsWorld.addRigidBody( body);

    console.log(body);

    bodies.push({
      mesh:mesh,
      rigid:body,
    })

  },
  removePhysicsGround(){
    let removeBodies = [];
    for(const _entity of bodies) {
      if(_entity.mesh.userData?.objectType=='ground'){
        scene.remove(_entity.mesh);
        physicsWorld.removeRigidBody(_entity.rigid)
        removeBodies.push(_entity);
      }
    }

    for(let i=0; i< removeBodies.length;i++){
      let index = bodies.indexOf(removeBodies[i]);
      if(index > -1){
        bodies.splice(index,1);
      }
    }
    console.log(bodies);
  },
  resetPhysicsGround(){
    
  },
  addPhysicsPlayer(args){
    args = args || {};
    const width = args?.width || 2;
    const height = args?.height || 2;
    const depth = args?.depth || 2;
    const color = args?.color || 0x00ffff;

    let pos={
      x:args?.x || 0,
      y:args?.y || 5,
      z:args?.z || 0,
    }
    let quat={
      x:0,
      y:0,
      z:0,
      w:1
    }
    const mass = 1;

    let mesh = createMeshCube({width:width,height:height,depth:depth,color:color});
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData.physics = { mass: 1 };
    mesh.userData.objectType = 'player';
    objectPlayer = mesh;
    scene.add( mesh );

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );
    //shape

    let blockColShape = new Ammo.btBoxShape( new Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
    blockColShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    blockColShape.calculateLocalInertia( mass, localInertia );
    //info
    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, blockColShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );
    //disable sleep
    body.setActivationState( STATE.DISABLE_DEACTIVATION );
    physicsWorld.addRigidBody( body);

    mesh.userData.physicsBody = body;

    bodies.push({
      mesh:mesh,
      rigid:body,
    })
  },
  removePhysicsPlayer(){
    let removeBodies = [];
    for(const _entity of bodies) {
      if(_entity.mesh.userData?.objectType=='player'){
        scene.remove(_entity.mesh);
        physicsWorld.removeRigidBody(_entity.rigid)
        removeBodies.push(_entity);
      }
    }

    for(let i=0; i< removeBodies.length;i++){
      let index = bodies.indexOf(removeBodies[i]);
      if(index > -1){
        bodies.splice(index,1);
      }
    }
    console.log(bodies);
  },
  resetPhysicsPlayer(){

  },
  addPhysicsKPlayer(args){
    args = args || {};
    const width = args?.width || 2;
    const height = args?.height || 2;
    const depth = args?.depth || 2;
    const color = args?.color || 0x30ab78;

    let pos={
      x:args?.x || -3,
      y:args?.y || 1.5,
      z:args?.z || 0,
    }
    let quat={
      x:0,
      y:0,
      z:0,
      w:1
    }
    const mass = 1;

    let mesh = createMeshCube({width:width,height:height,depth:depth,color:color});
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData.physics = { mass: 1 };
    mesh.userData.objectType = 'kPlayer';
    kObject = mesh;
    scene.add(mesh)

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btBoxShape( new Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    body.setFriction(4);
    body.setRollingFriction(10);

    body.setActivationState( STATE.DISABLE_DEACTIVATION );
    body.setCollisionFlags( FLAGS.CF_KINEMATIC_OBJECT );

    physicsWorld.addRigidBody( body );
    kObject.userData.physicsBody = body;

    bodies.push({
      mesh:mesh,
      rigid:body,
    })

  },
  addPhysicsKController(args){
    args = args || {};
    const radius = args?.width || 1;
    const length = args?.height || 1;
    const capSegments  = args?.capSegments || 4;
    const radialSegments   = args?.radialSegments  || 8;
    const color = args?.color || 0x30ab78;

    let pos={
      x:args?.x || -3,
      y:args?.y || 1.5,
      z:args?.z || 0,
    }
    let quat={
      x:0,
      y:0,
      z:0,
      w:1
    }
    const mass = 1;

    let mesh = createMeshSphere({radius:radius,length:length,capSegments:capSegments,radialSegments:radialSegments,color:color});
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData.physics = { mass: 1 };
    mesh.userData.objectType = 'kPlayer';
    kObject = mesh;
    scene.add(mesh)

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );

    const colShape = new Ammo.btCapsuleShape(radius, length*0.5)

    const ghostObject = new Ammo.btPairCachingGhostObject()
    ghostObject.setWorldTransform(transform)
    ghostObject.setCollisionShape(colShape)
    ghostObject.setCollisionFlags(ghostObject.getCollisionFlags() | 16) //CHARACTER_OBJECT
    // https://discourse.threejs.org/t/ammo-js-with-three-js/12530/15
    const ghostController = new Ammo.btKinematicCharacterController(ghostObject, colShape, 0.35, 1)
    ghostController.setUseGhostSweepTest(true)
    ghostController.setGravity(0)
    //ghostController.setJumpSpeed(0)
    //ghostController.setMaxSlope(0)
    //ghostController.setFallSpeed(0)

    //ghostController.setWalkDirection(new Ammo.btVector3(0.05, 0, 0))
    physicsWorld.addCollisionObject(ghostObject)
    physicsWorld.addAction(ghostController)
    // physicsWorld.removeCollisionObject( ghostObject );
    // physicsWorld.removeAction( character );
    console.log(ghostObject);
    console.log(ghostController);
    kController=ghostController

    ghostBodies.push({
      mesh:mesh,
      rigid:ghostController,
    })
  },
  kContollerInfo(){
    console.log(kController);
    console.log(kController.getGhostObject());
    //console.log(kController.getGhostObject().getWorldTransform());
    console.log(kController.getGhostObject().getWorldTransform().getOrigin());
    let pos = kController.getGhostObject().getWorldTransform().getOrigin()
    console.log("x: ", pos.x()," y: ", pos.x()," z: ", pos.z())
  }
}

function createGUI(){
  const gui = new GUI();
  //gui.add(myObject,'test')
  const debugFolder = gui.addFolder('Debug')
  debugFolder.add(gridHelper,'visible').name('is Grid')
  //debugFolder.add(gridHelper,'visible').name('is Grid')
  const orbitControlsFolder = gui.addFolder('Orbit Controls').show(false)
  orbitControlsFolder.add(controls, 'autoRotate')
  orbitControlsFolder.add(controls, 'autoRotateSpeed')
  orbitControlsFolder.add(controls, 'dampingFactor')
  orbitControlsFolder.add(controls, 'enableDamping')
  orbitControlsFolder.add(controls, 'enablePan')
  orbitControlsFolder.add(controls, 'enableRotate')
  orbitControlsFolder.add(controls, 'enableZoom')
  orbitControlsFolder.add(controls, 'panSpeed')
  orbitControlsFolder.add(controls, 'rotateSpeed')
  orbitControlsFolder.add(controls, 'screenSpacePanning')
  orbitControlsFolder.add(controls, 'zoomToCursor')
  orbitControlsFolder.add(controls, 'enabled')
  
  const cubeFolder = gui.addFolder('Cube').show(false)
  cubeFolder.add(cube,'visible')
  cubeFolder.add(myObject,'isRotate')
  cubeFolder.add(myObject,'resetRotation')

  const physicsFolder = gui.addFolder('Physics').show()
  physicsFolder.add(myObject,'lenPhysicsWorld')
  const physicsGravityFolder = physicsFolder.addFolder('Gravity');
  physicsGravityFolder.add(myObject.gravity,'x').onChange(value=>{
    //console.log("x:", value);
    let gravity = myObject.gravity;
    physicsWorld.setGravity(new Ammo.btVector3(gravity.x, gravity.y, gravity.z));
  });
  physicsGravityFolder.add(myObject.gravity,'y').onChange(value=>{
    console.log("y:", value);
    let gravity = myObject.gravity;
    physicsWorld.setGravity(new Ammo.btVector3(gravity.x, gravity.y, gravity.z));
  });
  physicsGravityFolder.add(myObject.gravity,'z').onChange(value=>{
    console.log("z:", value);
    let gravity = myObject.gravity;
    physicsWorld.setGravity(new Ammo.btVector3(gravity.x, gravity.y, gravity.z));
  });

  const physicsBoxFolder = physicsFolder.addFolder('Box')
  physicsBoxFolder.add(myObject,'addPhysicsBox')
  physicsBoxFolder.add(myObject,'removePhysicsBox')
  const physicsGroundFolder = physicsFolder.addFolder('Ground')
  physicsGroundFolder.add(myObject,'addPhysicsGround')
  physicsGroundFolder.add(myObject,'removePhysicsGround')
  physicsGroundFolder.add(myObject,'resetPhysicsGround')
  const physicsPlayerFolder = physicsFolder.addFolder('Player')
  //physicsPlayerFolder.add(myObject,'addPhysicsPlayer')
  //physicsPlayerFolder.add(myObject,'removePhysicsPlayer')
  //physicsPlayerFolder.add(myObject,'resetPhysicsPlayer')
  //physicsPlayerFolder.add(myObject,'addPhysicsKPlayer')
  physicsPlayerFolder.add(myObject,'addPhysicsKController')
  physicsPlayerFolder.add(myObject,'kContollerInfo')

}

function setupEventHandlers(){
  window.addEventListener( 'keydown', handleKeyDown, false);
  window.addEventListener( 'keyup', handleKeyUp, false);
}

function handleKeyDown(event){
  let keyCode = event.keyCode;
  switch(keyCode){
    case 87: //W: FORWARD
      //moveDirection.forward = 1
      kMoveDirection.forward = 1
      break;
    case 83: //S: BACK
      //moveDirection.back = 1
      kMoveDirection.back = 1
      break;
    case 65: //A: LEFT
      //moveDirection.left = 1
      kMoveDirection.left = 1
      break;
    case 68: //D: RIGHT
      //moveDirection.right = 1
      kMoveDirection.right = 1
      break;
  }
}

function handleKeyUp(event){

  let keyCode = event.keyCode;
  switch(keyCode){
    case 87: //FORWARD
      //moveDirection.forward = 0
      kMoveDirection.forward = 0
      break;
    case 83: //BACK
      //moveDirection.back = 0
      kMoveDirection.back = 0
      break;
    case 65: //LEFT
      //moveDirection.left = 0
      kMoveDirection.left = 0
      break;
    case 68: //RIGHT
      //moveDirection.right = 0
      kMoveDirection.right = 0
      break;
  }
}

function KGhostControllerMove(){
  if(!kController)return;

  let scalingFactor = 0.03;

  let moveX =  kMoveDirection.right - kMoveDirection.left;
  let moveZ =  kMoveDirection.back - kMoveDirection.forward;
  let moveY =  0;

  let translateFactor = tmpPos.set(moveX, moveY, moveZ);// THREE POS
  translateFactor.multiplyScalar(scalingFactor);//control move speed from scalingFactor
  ammoTmpPos.setValue(translateFactor.x, translateFactor.y, translateFactor.z); // AMMO POS

  //required x() and not x
  kController.setWalkDirection(ammoTmpPos)//pass

  //console.log(kController)
}

// SET UP SCENE
function setupScene(){
  cube = createMeshCube();
  scene.add(cube)
  setup_Helpers()

  setupEventHandlers();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}
// LOOP RENDERER AND UPDATE
function animate() {
  let deltaTime = clock.getDelta();
  if(myObject.isRotate){
    cube.rotation.x += 0.01;
	  cube.rotation.y += 0.01;
  }

  KGhostControllerMove();
  updatePhysics(deltaTime);
	
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}

async function initPhysics(){
  let AMMO = await Ammo();

  setupPhysics()
}

function setupPhysics(){
  let gravity = { x: 0.0, y: -9.81, z: 0.0 };

  var collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
  var dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration);
  var overlappingPairCache    = new Ammo.btDbvtBroadphase();
  var solver                  = new Ammo.btSequentialImpulseConstraintSolver();
  physicsWorld                = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  physicsWorld.setGravity(new Ammo.btVector3(gravity.x, gravity.y, gravity.z));

  physicsWorld
    .getBroadphase()
    .getOverlappingPairCache()
    .setInternalGhostPairCallback(new Ammo.btGhostPairCallback());
  tmpTrans = new Ammo.btTransform();
  ammoTmpPos = new Ammo.btVector3();
  ammoTmpQuat = new Ammo.btQuaternion();

  setupScene()
}

function updatePhysics(deltaTime){

  if(physicsWorld){
    physicsWorld.stepSimulation(deltaTime,1);
    //detectCollision();
  }

  // kinematics body
  for(const _entity of ghostBodies){// for kcontroller
    if((_entity?.mesh !=null)&&(_entity?.rigid !=null)){
      let transform = _entity.rigid.getGhostObject().getWorldTransform();
      let p = transform.getOrigin();
      let q = transform.getRotation();
      _entity.mesh.position.set( p.x(), p.y(), p.z() );
      _entity.mesh.quaternion.set( q.x(), q.y(), q.z(),q.w() );
    }
  }
  
  //dynamic body
  for(const _entity of bodies){
    if((_entity?.mesh !=null)&&(_entity?.rigid !=null)){
      let ms = _entity.rigid.getMotionState();
      if ( ms ) {
        ms.getWorldTransform( tmpTrans );
        let p = tmpTrans.getOrigin();
        let q = tmpTrans.getRotation();
        _entity.mesh.position.set( p.x(), p.y(), p.z() );
        _entity.mesh.quaternion.set( q.x(), q.y(), q.z(),q.w() );
      }
    }
  }
}

initPhysics()