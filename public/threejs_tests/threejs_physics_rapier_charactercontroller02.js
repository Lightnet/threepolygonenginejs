// https://www.youtube.com/watch?v=ipW-DUyPYlk
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


var rapierDebugRenderer;

const bodies = [];
var physicsWorld;

//const {div,style} = van.tags;
var gridHelper;

const stats = new Stats();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x80a0e0);
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});
const controls = new OrbitControls( camera, renderer.domElement );

function createMeshCube(args){
  args = args || {};
  const width = args?.width || 1;
  const height = args?.height || 1;
  const depth = args?.depth || 1;
  const color = args?.color || 0x00ff00;
  const geometry = new THREE.BoxGeometry( width, height, depth );
  const material = new THREE.MeshBasicMaterial( { color: color } );
  const mesh = new THREE.Mesh( geometry, material );
  return mesh;
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

    const width = args?.width || 50;
    const height = args?.height || 1;
    const depth = args?.depth || 50;

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
  addCharacterController(){

  }
}

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'test')
  const debugFolder = gui.addFolder('Debug')
  debugFolder.add(gridHelper,'visible').name('is Grid')
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
  
  const physicsFolder = gui.addFolder('Physics')
  physicsFolder.add(myObject,'addPhysicsGround');
  physicsFolder.add(myObject,'addCharacterController');

}

function setupScene(){

  setup_Helpers();

  const dirLight = new THREE.DirectionalLight('#ffffff', 1)
  dirLight.position.y += 1
  dirLight.position.x += 0.5

  const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
  // dirLight.add(dirLightHelper)

  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
  scene.add(dirLight, ambientLight)

  myObject.addPhysicsGround();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}

function animate() {

  stats.update();
  //physics
  updatePhysics()

  controls.update();
	renderer.render( scene, camera );
}

function updatePhysics(){

  if(physicsWorld){
    physicsWorld.step()
  }

  for(const po of bodies){
    //collider
    if(po.mesh !=null && po.rigid !=null){
      po.mesh.position.copy(po.rigid.translation())
      po.mesh.quaternion.copy(po.rigid.rotation())
    }
  }
}


const usePhysics = () => physicsWorld;
const usePhysicsObjects = ()=>bodies;

const addPhysics = (
  mesh,
  rigidBodyType,
  autoAnimate = true, // update the mesh's position and quaternion based on the physics world every frame
  postPhysics = ()=>{},
  colliderType = "",
  colliderSettings
)=>{
  const physics = usePhysics()
  const physicsObjects = usePhysicsObjects()

  const rigidBodyDesc = RAPIER.RigidBodyDesc[rigidBodyType]()
  rigidBodyDesc.setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)

  // * Responsible for collision response
  const rigidBody = physics.createRigidBody(rigidBodyDesc)

  let colliderDesc

  switch (colliderType) {
    case 'cuboid':
      {
        const { width, height, depth } = colliderSettings
        colliderDesc = RAPIER.ColliderDesc.cuboid(width, height, depth)
      }
      break

    case 'ball':
      {
        const { radius } = colliderSettings
        colliderDesc = RAPIER.ColliderDesc.ball(radius)
      }
      break

    case 'capsule':
      {
        const { halfHeight, radius } = colliderSettings
        colliderDesc = RAPIER.ColliderDesc.capsule(halfHeight, radius)
      }
      break

    default:
      {
        colliderDesc = RAPIER.ColliderDesc.trimesh(
          mesh.geometry.attributes.position.array,
          mesh.geometry.index?.array
        )
      }
      break
  }

  if (!colliderDesc) {
    console.error('Collider Mesh Error: convex mesh creation failed.')
  }

  // * Responsible for collision detection
  const collider = physics.createCollider(colliderDesc, rigidBody)

  const physicsObject = { mesh, collider, rigidBody, fn: postPhysicsFn, autoAnimate }

  physicsObjects.push(physicsObject)

  return physicsObject
}

function setupTest(){

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


//setup_scene()
initPhysics();