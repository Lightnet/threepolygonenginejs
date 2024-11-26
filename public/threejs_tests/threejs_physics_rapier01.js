/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
import {
  van,
  THREE,
  OrbitControls,
  Stats,
  GUI,
  RAPIER,
} from "/dps.js"
// import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
// import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
// import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
// import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
// import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

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

var bodies = [];
var physicsWorld;
var gridHelper;
var rapierDebugRenderer;
var cube;

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

    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(pos.x, pos.y, pos.x);
    let rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.cuboid(width * 0.5, height * 0.5, depth * 0.5);
    let collider = physicsWorld.createCollider(colliderDesc, rigidBody);

    bodies.push({
      mesh:mesh,
      rigid:rigidBody,
      colliderDesc:colliderDesc,
      collider:collider,
    })

  },
  removePhysicsBox(){
    let removeBodies = [];
    for(const _entity of bodies) {
      if(_entity.mesh.userData?.objectType=='box'){
        
        if(_entity?.rigid){
          physicsWorld.removeRigidBody(_entity.rigid)
        }
        if(_entity?.collider){
          physicsWorld.removeCollider(_entity.collider)
        }
        scene.remove(_entity.mesh);
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
      y:-1,
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
    mesh.position.set(pos.x,pos.y,pos.z)
    mesh.receiveShadow = true;
    mesh.userData.physics = { mass: 0 };
    mesh.userData.objectType = 'ground';
    scene.add( mesh );

    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(width*0.5, height*0.5, depth*0.5)
      .setTranslation(pos.x, pos.y, pos.z);
    let collider = physicsWorld.createCollider(groundColliderDesc);

    bodies.push({
      mesh:mesh,
      //rigid:body,
      collider:collider,
    })

  },
  removePhysicsGround(){
    let removeBodies = [];
    for(const _entity of bodies) {
      if(_entity.mesh.userData?.objectType=='ground'){
        scene.remove(_entity.mesh);
        if(_entity?.rigid){
          physicsWorld.removeRigidBody(_entity.rigid)
        }
        if(_entity?.collider){
          physicsWorld.removeCollider(_entity.collider)
        }
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
  debugFolder.add(rapierDebugRenderer,'enabled').name('Rapier Debug Renderer')
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
    //console.log(physicsWorld);
    physicsWorld.gravity.x = myObject.gravity.x;
  });
  physicsGravityFolder.add(myObject.gravity,'y').onChange(value=>{
    physicsWorld.gravity.y = myObject.gravity.y;
  });
  physicsGravityFolder.add(myObject.gravity,'z').onChange(value=>{
    physicsWorld.gravity.z = myObject.gravity.z;
  });

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
	if(rapierDebugRenderer){
    rapierDebugRenderer.update()
  }
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}

async function initPhysics(){

  await RAPIER.init();
  setupPhysics()

}

function setupPhysics(){

  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  physicsWorld = new RAPIER.World(gravity);
  rapierDebugRenderer = new RapierDebugRenderer(scene, physicsWorld);

  setupScene()
}

function updatePhysics(deltaTime){

  if(physicsWorld){
    physicsWorld.step();
  }
  
  for(const _entity of bodies){
    if((_entity?.mesh !=null)&&(_entity?.rigid !=null)){
      _entity.mesh.position.copy(_entity.rigid.translation())
      _entity.mesh.quaternion.copy(_entity.rigid.rotation())
    }
  }
}

//setupScene()
initPhysics()

