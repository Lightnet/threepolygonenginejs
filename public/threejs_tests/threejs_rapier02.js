// TRIMESH TEST

// EXAMPLES
// https://rapier.rs/demos3d/index.html
// https://sbcode.net/threejs/physics-rapier-debugRenderer/
// https://sbcode.net/threejs/physics-rapier/

import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

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
camera.position.set( -5, 10, -5 );
const scene = new THREE.Scene();
var cube;

let gridHelper;
let axesHelper;

var rigidBodies = [];
var world;
var rigidBody;
var rigidBodyTri;
var rapierDebugRenderer

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
  world = new RAPIER.World(gravity);
  rapierDebugRenderer = new RapierDebugRenderer(scene, world);

  create_rigid_ground();
  create_rigid_cube();
  create_TriMesh();
  createGUI();
}

function create_rigid_ground(){
  // Create the ground
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
    .setTranslation(0.0, -1.0, 0.0);
  world.createCollider(groundColliderDesc);

  let _meshCube = create_cube({width:20,height:0.2,depth:20,color:'darkgreen'});
  _meshCube.position.set(0,-1,0);
}

function create_rigid_cube(){
  // Create a dynamic rigid-body.
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 1.0, 0.0);
  rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  let collider = world.createCollider(colliderDesc, rigidBody);
  let _meshCube = create_cube({color:'gray'});
  rigidBodies.push({rigid:rigidBody,mesh:_meshCube});
}

function create_TriMesh(){
  // https://sbcode.net/threejs/physics-rapier/
  // TEST TRI MESH
  const rigidTri = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0));
  rigidBodyTri = rigidTri;
  let _meshTri = create_cube({color:'lightgray'});

  const vertices = new Float32Array(_meshTri.geometry.attributes.position.array);
  let indices = new Uint32Array((_meshTri.geometry.index).array)
  const trimeshShape = RAPIER.ColliderDesc.trimesh(vertices, indices);
  world.createCollider(trimeshShape, rigidTri);

  rigidBodies.push({rigid:rigidTri,mesh:_meshTri});
  //console.log(RAPIER.ColliderDesc.trimesh);
}

function create_cube(args){
  let color = args?.color || 0x00ffff;
  let x  = args?.x || 0;
  let y  = args?.y || 0;
  let z  = args?.z || 0;

  let width  = args?.width || 1;
  let height  = args?.height || 1;
  let depth  = args?.depth || 1;
  console.log("args: ",args)
  console.log("depth: ",depth)
  const _geometry = new THREE.BoxGeometry( width, height, depth );
  const _material = new THREE.MeshLambertMaterial( { color: color } );
  const _mesh = new THREE.Mesh( _geometry, _material );
  _mesh.position.set(x,y,z);
  scene.add( _mesh );
  return _mesh;
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
// SETUP GUI
//===============================================
const myWorld = {
  pos:{x:0,y:2,z:0},
  posTri:{x:0,y:5,z:0},
  reset:function(){
    rigidBody.setTranslation({ x: this.pos.x, y: this.pos.y, z: this.pos.z }, true);
  },
  reset_tri:function(){
    rigidBodyTri.setTranslation({ x: this.posTri.x, y: this.posTri.y, z: this.posTri.z }, true);
  }
}

function createGUI(){
  const gui = new GUI();
  //gui.add(myWorld,'reset')
  gui.add(rapierDebugRenderer, 'enabled').name('Physics Debug Render');
  gui.add(gridHelper, 'visible').name('Debug Grid Helper');
  gui.add(axesHelper, 'visible').name('Debug Axes Helper');

  const characterFolder = gui.addFolder('Cube')
  characterFolder.add(myWorld, 'reset').name('Reset');
  characterFolder.add(myWorld.pos, 'x', -10, 10).name('X: ');
  characterFolder.add(myWorld.pos, 'y', -10, 10).name('Y: ');
  characterFolder.add(myWorld.pos, 'z', -10, 10).name('Z: ');

  const cubeFolder = gui.addFolder('Cube Tri');
  cubeFolder.add(myWorld, 'reset_tri').name('Reset');;
  cubeFolder.add(myWorld.posTri, 'x', -10, 10).name('X: ');
  cubeFolder.add(myWorld.posTri, 'y', -10, 10).name('Y: ');
  cubeFolder.add(myWorld.posTri, 'z', -10, 10).name('Z: ');
}

//===============================================
// LOOP RENDER
//===============================================
function animate() {
  // Step the simulation forward.  
  if(world){
    world.step();
    Update_Rigid_Bodies();
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
setup_GridHelper();
setup_lights();
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

console.log("three rapier test");