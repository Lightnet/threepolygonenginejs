/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';


let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4;
var bodies = [];
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

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

const myObject ={
  isRotate:true,
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
  addPhysicsPlayer(){
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

    let mesh = this.createMeshCube({width:width,height:height,depth:depth,color:color});
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData.physics = { mass: 1 };
    mesh.userData.objectType = 'player';
    this.scene.add( mesh );

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
    this.physicsWorld.addRigidBody( body);

    this.rigidBodies.push({
      mesh:mesh,
      rigid:body,
    })
  },
  removePhysicsPlayer(){

  },
  resetPhysicsPlayer(){

  },
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
  const physicsBoxFolder = physicsFolder.addFolder('Box')
  physicsBoxFolder.add(myObject,'addPhysicsBox')
  physicsBoxFolder.add(myObject,'removePhysicsBox')
  const physicsGroundFolder = physicsFolder.addFolder('Ground')
  physicsGroundFolder.add(myObject,'addPhysicsGround')
  physicsGroundFolder.add(myObject,'removePhysicsGround')
  physicsGroundFolder.add(myObject,'resetPhysicsGround')
  const physicsPlayerFolder = physicsFolder.addFolder('Player')
  physicsPlayerFolder.add(myObject,'addPhysicsPlayer')
  physicsPlayerFolder.add(myObject,'removePhysicsPlayer')
  physicsPlayerFolder.add(myObject,'resetPhysicsPlayer')

}

// SET UP SCENE
function setupScene(){
  cube = createMeshCube();
  scene.add(cube)
  setup_Helpers()

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
  tmpTrans = new Ammo.btTransform();

  setupScene()
}

function updatePhysics(deltaTime){

  if(physicsWorld){
    physicsWorld.stepSimulation(deltaTime,1);
    //detectCollision();
  }
  
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

//setupScene()
initPhysics()