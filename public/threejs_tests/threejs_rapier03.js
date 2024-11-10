// VEHICLE TEST

// EXAMPLES
// https://rapier.rs/demos3d/index.html
// https://sbcode.net/threejs/physics-rapier-debugRenderer/


import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'

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
var world;
var rigidBody;
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
// https://sbcode.net/threejs/physics-rapier/
function setup_cube(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  //const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material0 = new THREE.MeshLambertMaterial( { color: 0x00ffff } );
  cube = new THREE.Mesh( geometry, material0 );
  scene.add( cube );
  //cube.position.y = 2;
}

function setup_ground(){
  const geometry = new THREE.BoxGeometry( 20, 0.2, 20 );
  //const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material0 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material0 );
  scene.add( cube );
  //cube.position.y = 2;
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

function animate() {
  // Step the simulation forward.  
  if(world){
    world.step();
    update_rigid_body();
  }
  //draw physics
  if(rapierDebugRenderer){
    rapierDebugRenderer.update();
  }
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
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

  // Create the ground
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
  world.createCollider(groundColliderDesc);

  // for cube
  // Create a dynamic rigid-body.
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 5.0, 0.0);
  rigidBody = world.createRigidBody(rigidBodyDesc);
  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  let collider = world.createCollider(colliderDesc, rigidBody);

  //setup_triMesh();
  setup_vehicle();

  rapierDebugRenderer = new RapierDebugRenderer(scene, world)
}

function setup_triMesh(){
  // https://sbcode.net/threejs/physics-rapier/
  // TEST TRI MESH
  const trimeshBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0))
  const vertices = new Float32Array(cube.geometry.attributes.position.array);
  let indices = new Uint32Array((cube.geometry.index).array)
  const trimeshShape = RAPIER.ColliderDesc.trimesh(vertices, indices);
  world.createCollider(trimeshShape, trimeshBody);
  //console.log(RAPIER.ColliderDesc.trimesh);
}

function setup_vehicle(){
  console.log("vehicle...")
}

function rigid_body_logs(){
  // Get and print the rigid-body's position.
  if(rigidBody){
    let position = rigidBody.translation();
    console.log("Rigid-body position: ", position.x, position.y);
  }
}

function update_rigid_body(){
  // Get and print the rigid-body's position.
  if(rigidBody){
    let position = rigidBody.translation();
    //console.log("Rigid-body position: ", position.x, position.y);
    cube.position.copy(position);
  }
}

function c_reset(){
  rigidBody.setTranslation({ x: 0.0, y: 2.0, z: 0.0 }, true);
}

const closed = van.state(false)
van.add(document.body, FloatingWindow(
  {title: "Debug", closed, width:210, height:260, closeCross: null,x:0,y:0},
  div(
    button({onclick:c_reset},'reset')
  )
))

run_simulation();
setup_ground();
setup_cube();
setup_lights();
document.body.appendChild( renderer.domElement );
renderer.setAnimationLoop( animate );

console.log("three rapier test");