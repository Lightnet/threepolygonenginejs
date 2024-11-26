/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

const JOLT_PATH = 'https://cdn.jsdelivr.net/npm/jolt-physics@0.29.0/dist/jolt-physics.wasm-compat.js';

const {div,style} = van.tags;

var gridHelper;
var cube;
let Jolt; // upper case API
var jolt; // lower case world and objects
var bodyInterface;
var physicsSystem;
// Object layers
const LAYER_NON_MOVING = 0;
const LAYER_MOVING = 1;
const NUM_OBJECT_LAYERS = 2;
//var gravity = {x:0,y:-9.8,z:0}

var bodies = [];

// https://github.com/jrouwe/JoltPhysics.js/blob/main/Examples/js/example.js
const DegreesToRadians = (deg) => deg * (Math.PI / 180.0);

const wrapVec3 = (v) => new THREE.Vector3(v.GetX(), v.GetY(), v.GetZ());
const unwrapVec3 = (v) => new Jolt.Vec3(v.x, v.y, v.z);
const wrapRVec3 = wrapVec3;
const unwrapRVec3 = (v) => new Jolt.RVec3(v.x, v.y, v.z);
const wrapQuat = (q) => new THREE.Quaternion(q.GetX(), q.GetY(), q.GetZ(), q.GetW());
const unwrapQuat = (q) => new Jolt.Quat(q.x, q.y, q.z, q.w);

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

const myObject ={
  isRotate:true,
  gravity:{x:0,y:-9.81,z:0},
  test:()=>{
    console.log('test');
  },
  resetRotation(){
    cube.rotation.set(0,0,0)
  },
  addPhysicsBox(args={}){
    console.log("Box: ", args)
    let width = args?.width || 2;
    let height = args?.height || 2;
    let depth = args?.depth || 2;

    let x = args?.x || 0;
    let y = args?.y || 5;
    let z = args?.z || 0;

    //threejs mesh
    const mesh = createCube({width:width,height:height,depth:height});
    mesh.userData.objectType='box';
    mesh.position.set(x,y,z);
    scene.add(mesh);

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

    bodies.push({
      mesh:mesh,
      rigid:body,
    });
  },
  removePhysicsBox(){
    let removeBodies = [];
    for (const entity of bodies){
      console.log(entity);

      if(entity.mesh.userData?.objectType=='box'){
        scene.remove(entity.mesh);
        if(entity?.rigid){
          //console.log("this.physics.bodyInterface: ", this.physics.bodyInterface)
          bodyInterface.RemoveBody(entity.rigid.GetID());
          bodyInterface.DestroyBody(entity.rigid.GetID());
        }
        
        removeBodies.push(entity);
        //break;
      }
    }

    for(let i = 0; i < removeBodies.length;i++){
      let index = bodies.indexOf(removeBodies[i]);
      if(index > -1){
        bodies.splice(index, 1);
      }
    }
  },
  addPhysicsGround(args={}){

    let width = args?.width || 10;
    let height = args?.height || 1;
    let depth = args?.depth || 10;

    let x = args?.x || 0;
    let y = args?.y || -1;
    let z = args?.z || 0;

    const mesh = createCube({width:width,height:height,depth:depth,color:'gray'});
    mesh.userData.objectType='ground';
    mesh.position.set(x,y,z);
    scene.add(mesh);
    

    var shape = new Jolt.BoxShape(new Jolt.Vec3(width*0.5, height*0.5, depth*0.5), 0.05, null);
  	var creationSettings = new Jolt.BodyCreationSettings(shape, new Jolt.RVec3(x, y, z), new Jolt.Quat(0, 0, 0, 1), Jolt.EMotionType_Static, LAYER_NON_MOVING);
  	let body = bodyInterface.CreateBody(creationSettings);
  	Jolt.destroy(creationSettings);

    bodyInterface.AddBody(body.GetID(), Jolt.EActivation_Activate);

    bodies.push({
      mesh:mesh,
      rigid:body,
    })

  },
  removePhysicsGround(){
    let removeBodies = [];
    for (const entity of bodies){
      console.log(entity);

      if(entity.mesh.userData?.objectType=='ground'){
        scene.remove(entity.mesh);
        if(entity?.rigid){
          //console.log("this.physics.bodyInterface: ", this.physics.bodyInterface)
          bodyInterface.RemoveBody(entity.rigid.GetID());
          bodyInterface.DestroyBody(entity.rigid.GetID());
        }
        
        removeBodies.push(entity);
        //break;
      }
    }

    for(let i = 0; i < removeBodies.length;i++){
      let index = bodies.indexOf(removeBodies[i]);
      if(index > -1){
        bodies.splice(index, 1);
      }
    }
  },
  addPhysicsPlayer(){

  },
  removePhysicsPlayer(){

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
  const physicsGravityFolder = physicsFolder.addFolder('Gravity');

  physicsGravityFolder.add(myObject.gravity,'x').onChange(value=>{
    console.log("test x: ",value)
    myObject.gravity.x = value;
    let gravity = myObject.gravity;
    physicsSystem.SetGravity(unwrapVec3(gravity));
  });
  physicsGravityFolder.add(myObject.gravity,'y').onChange(value=>{
    console.log("test x: ",value)
    myObject.gravity.y = value;
    let gravity = myObject.gravity;
    physicsSystem.SetGravity(unwrapVec3(gravity));
  });
  physicsGravityFolder.add(myObject.gravity,'z').onChange(value=>{
    console.log("test x: ",value)
    myObject.gravity.z = value;
    let gravity = myObject.gravity;
    physicsSystem.SetGravity(unwrapVec3(gravity));
  });
  

  const physicsBoxFolder = physicsFolder.addFolder('Box')
  physicsBoxFolder.add(myObject,'addPhysicsBox')
  physicsBoxFolder.add(myObject,'removePhysicsBox')
  const physicsGroundFolder = physicsFolder.addFolder('Ground')
  physicsGroundFolder.add(myObject,'addPhysicsGround')
  physicsGroundFolder.add(myObject,'removePhysicsGround')
  const physicsPlayerFolder = physicsFolder.addFolder('Player')
  physicsPlayerFolder.add(myObject,'addPhysicsPlayer')
  physicsPlayerFolder.add(myObject,'removePhysicsPlayer')

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

async function initPhysics(){
  const { default: initJolt } = await import( `${JOLT_PATH}` );
  Jolt = await initJolt();
  setupPhysics();
}

function setupPhysics(){
  const settings = new Jolt.JoltSettings();
  setupCollisionFiltering(settings);
  jolt = new Jolt.JoltInterface( settings );// world physics
  console.log("jolt: ", jolt);
  
  Jolt.destroy( settings );
  physicsSystem = jolt.GetPhysicsSystem();
  physicsSystem.SetGravity(unwrapVec3(myObject.gravity));
  bodyInterface = physicsSystem.GetBodyInterface();

  setupScene();
}

function updatePhysics(deltaTime){
  // Don't go below 30 Hz to prevent spiral of death
  deltaTime = Math.min( deltaTime, 1.0 / 30.0 );
  // When running below 55 Hz, do 2 steps instead of 1
  const numSteps = deltaTime > 1.0 / 55.0 ? 2 : 1;

  jolt.Step( deltaTime, numSteps );
  for(const _entity of bodies){
    if((_entity?.mesh !=null)&&(_entity?.rigid !=null)){
      _entity.mesh.position.copy(wrapVec3(_entity.rigid.GetPosition()));
	    _entity.mesh.quaternion.copy(wrapQuat(_entity.rigid.GetRotation()));
    }
  }
}

//setupScene()
initPhysics()