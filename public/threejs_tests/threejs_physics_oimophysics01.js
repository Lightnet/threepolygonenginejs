// 
// https://www.jsdelivr.com/package/npm/oimophysics
// https://codepen.io/yamazaki3104/pen/jjZyLX sample test
// 

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

//import * as OimoPhysics from  'https://cdn.jsdelivr.net/npm/oimophysics@1.2.2/OimoPhysics.min.js'
//import OimoPhysics from  'https://cdn.jsdelivr.net/npm/oimophysics@1.2.2/OimoPhysics.min.js'//nope

//IMPORT PHYSICS
import * as OimoPhysics from  'https://cdn.jsdelivr.net/npm/oimophysics@1.2.2/OimoPhysics.min.js'
const OIMO = OimoPhysics.oimo;
console.log(OIMO);

var physicsWorld;
var gridHelper;
var controls;
var bodies = [];

var rigidBody_test;
var rigidBody_box;

const stats = new Stats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 5, 5);

const renderer = new THREE.WebGLRenderer();
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

const myObject ={
  isRotate:true,
  gravity:{x:0,y:-9.81,z:0},
  test:()=>{
    console.log('Oimo: ', OIMO);
  },
  test_body(){
    //console.log(rigidBody_test);
    //console.log(rigidBody_test.getPosition());
    console.log(rigidBody_box.getPosition());
  },
  addPhysicsBox(args={}){
    let width = args?.width || 2;
    let height = args?.height || 2;
    let depth = args?.depth || 2;
    let color = args?.color || 0x00ffff;

    let x = args?.x || 0;
    let y = args?.y || 5;
    let z = args?.z || 0;

    let quat={
      x:0,
      y:0,
      z:0,
      w:1
    }

    let mesh = createMeshCube({
      width:width,
      height:height,
      depth:depth,
      color:color,
    });
    mesh.userData.objectType='box';
    mesh.position.set(x,y,z);
    scene.add(mesh);

    console.log('ADD BOX')
    let ground_cnf      = new OIMO.dynamics.rigidbody.RigidBodyConfig();
    ground_cnf.type     = OIMO.dynamics.rigidbody.RigidBodyType.DYNAMIC;
    ground_cnf.position = new OIMO.common.Vec3( x, y, z );
    let rigid_body = new OIMO.dynamics.rigidbody.RigidBody( ground_cnf )

    let ground_shape_cnf = new OIMO.dynamics.rigidbody.ShapeConfig()
    ground_shape_cnf.geometry = new OIMO.collision.geometry.BoxGeometry( new OIMO.common.Vec3( width*0.5, height*0.5, depth*0.5 ) );
    rigid_body.addShape( new OIMO.dynamics.rigidbody.Shape( ground_shape_cnf ) )
    physicsWorld.addRigidBody( rigid_body )
    rigidBody_box = rigid_body;

    bodies.push({
      mesh:mesh,
      rigid:rigid_body,
    })

  },
  removePhysicsBox(){
    let removeBodies = [];
    for (const entity of bodies){
      //console.log(entity);
      if(entity.mesh.userData?.objectType=='box'){
        scene.remove(entity.mesh);
        if(entity?.rigid){
          //console.log("this.physics.bodyInterface: ", this.physics.bodyInterface)
          physicsWorld.removeRigidBody(entity.rigid);
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
    console.log('ADD GROUND')
    let width = args?.width || 10;
    let height = args?.height || 1;
    let depth = args?.depth || 10;
    let color = args?.color || 0x00ffff;
    color='gray';

    let x = args?.x || 0;
    let y = args?.y || 0;
    let z = args?.z || 0;

    let quat={
      x:0,
      y:0,
      z:0,
      w:1
    }

    let mesh = createMeshCube({
      width:width,
      height:height,
      depth:depth,
      color:color,
    });
    mesh.userData.objectType='ground';
    mesh.position.set(x,y,z);
    scene.add(mesh);

    let ground_cnf      = new OIMO.dynamics.rigidbody.RigidBodyConfig();
    ground_cnf.type     = OIMO.dynamics.rigidbody.RigidBodyType.STATIC;
    ground_cnf.position = new OIMO.common.Vec3( x, y, z );
    let rigid_body = new OIMO.dynamics.rigidbody.RigidBody( ground_cnf )

    let ground_shape_cnf = new OIMO.dynamics.rigidbody.ShapeConfig()
    ground_shape_cnf.geometry = new OIMO.collision.geometry.BoxGeometry( new OIMO.common.Vec3( width*0.5, height*0.5, depth*0.5 ) )
    rigid_body.addShape( new OIMO.dynamics.rigidbody.Shape( ground_shape_cnf ) )
    physicsWorld.addRigidBody( rigid_body )
    rigidBody_test = rigid_body;

    bodies.push({
      mesh:mesh,
      rigid:rigid_body,
    })
  },
  removePhysicsGround(){
    let removeBodies = [];
    for (const entity of bodies){
      //console.log(entity);
      if(entity.mesh.userData?.objectType=='ground'){
        scene.remove(entity.mesh);
        if(entity?.rigid){
          //console.log("this.physics.bodyInterface: ", this.physics.bodyInterface)
          physicsWorld.removeRigidBody(entity.rigid);
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
  }
}

function initPhysics(){
  physicsWorld = new OIMO.dynamics.World()
  console.log(physicsWorld);

  //myObject.gravity={x:0,y:0,z:0};

  physicsWorld.setGravity(new OIMO.common.Vec3( myObject.gravity.x, myObject.gravity.y, myObject.gravity.z ))

  setupScene()
}

function updatePhysiscs(delta){
  if(!physicsWorld)return;

  physicsWorld.step(delta) // OIMO Physics
  for(const _entity of bodies){
    if((_entity?.mesh !=null)&&(_entity?.rigid !=null)){
      //console.log(_entity.rigid);
      //console.log(_entity.rigid.getRotation());
      _entity.mesh.position.copy(_entity.rigid.getPosition());
      _entity.mesh.quaternion.copy(_entity.rigid.getOrientation());
    }
  }
}

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'test')
  const physicsFolder = gui.addFolder('Physics')
  physicsFolder.add(myObject,'test_body');
  const physicsGravityFolder = physicsFolder.addFolder('Gravity');
  physicsGravityFolder.add(myObject.gravity,'x').onChange(value=>{
    //console.log(physicsWorld);
    //physicsWorld.gravity.x = myObject.gravity.x;
    physicsWorld.setGravity(new OIMO.common.Vec3( myObject.gravity.x, myObject.gravity.y, myObject.gravity.z ))
  });
  physicsGravityFolder.add(myObject.gravity,'y').onChange(value=>{
    //physicsWorld.gravity.y = myObject.gravity.y;
    physicsWorld.setGravity(new OIMO.common.Vec3( myObject.gravity.x, myObject.gravity.y, myObject.gravity.z ))
  });
  physicsGravityFolder.add(myObject.gravity,'z').onChange(value=>{
    //physicsWorld.gravity.z = myObject.gravity.z;
    physicsWorld.setGravity(new OIMO.common.Vec3( myObject.gravity.x, myObject.gravity.y, myObject.gravity.z ))
  });
  const physicsBoxFolder = physicsFolder.addFolder('Box')
  physicsBoxFolder.add(myObject,'addPhysicsBox')
  physicsBoxFolder.add(myObject,'removePhysicsBox')

  const physicsGroundFolder = physicsFolder.addFolder('Ground')
  physicsGroundFolder.add(myObject,'addPhysicsGround')
  physicsGroundFolder.add(myObject,'removePhysicsGround')
}

function setupHelpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
  controls = new OrbitControls( camera, renderer.domElement );
}

function setupScene(){

  setupHelpers();
  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  renderer.setAnimationLoop( animate );
  createGUI();
}

const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta()
  stats.update();
  
  updatePhysiscs(delta);
  //controls.update();
	renderer.render( scene, camera );
}

initPhysics()