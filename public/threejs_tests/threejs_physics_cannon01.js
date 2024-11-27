/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
// import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
// import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
// import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
// import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

import {
  van,
  THREE,
  OrbitControls,
  Stats,
  GUI,
} from "/dps.js";
//import * as cannonEs from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm';

const {div,style} = van.tags;

let physicsWorld;
let bodies = [];

const stats = new Stats();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
//camera.position.set(0, 0, 5);
camera.position.set(0, 10, 10);
var gridHelper;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

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

    let mesh = createMeshCube({
      width:width,
      height:height,
      depth:depth,
      color:color,
    });
    mesh.userData.objectType='box';
    mesh.position.set(pos.x,pos.y,pos.z);
    scene.add(mesh);
    // Box
    const shape = new CANNON.Box(new CANNON.Vec3(width*0.5, height*0.5, depth*0.5))
    let body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(pos.x, pos.y, pos.z),
    })
    body.addShape(shape)
    body.angularVelocity.set(0, 10, 0)
    body.angularDamping = 0.5
    physicsWorld.addBody(body);

    bodies.push({
      mesh:mesh,
      rigid:body,
    })

  },
  removePhysicsBox(){
    console.log(physicsWorld)
    let removeBodies = [];
    for (const entity of bodies){
      console.log(entity);

      if(entity.mesh.userData?.objectType=='box'){
        scene.remove(entity.mesh);
        if(entity?.rigid){
          //console.log("this.physics.bodyInterface: ", this.physics.bodyInterface)
          physicsWorld.removeBody(entity.rigid);
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
  addPhysicsGround(args){
    args = args || {};
    const width = args?.width || 10;
    const height = args?.height || 2;
    const depth = args?.depth || 10;
    let color = args?.color || 0x00ffff;
    color = 'gray'

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

    let mesh = createMeshCube({
      width:width,
      height:height,
      depth:depth,
      color:color,
    });
    mesh.userData.objectType='ground';
    scene.add(mesh);


    console.log("add ground")
    const groundMaterial = new CANNON.Material('ground')
    //const groundShape = new CANNON.Plane()
    const groundShape = new CANNON.Box(new CANNON.Vec3(width*0.5, height*0.5, depth*0.5))
    const groundBody = new CANNON.Body({
      mass: 0,
      material: groundMaterial 
    });
    groundBody.addShape(groundShape);
    //groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); //plane rotate
    physicsWorld.addBody(groundBody);

    bodies.push({
      mesh:mesh,
      rigid:groundBody,
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
          physicsWorld.removeBody(entity.rigid);
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
}

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'test')
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
  
  const cubeFolder = gui.addFolder('Cube').show(false);
  cubeFolder.add(cube,'visible')
  cubeFolder.add(myObject,'isRotate')
  cubeFolder.add(myObject,'resetRotation')

  const physicsFolder = gui.addFolder('physics')
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

}

function setup_scene(){

  setup_Helpers()

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}

function animate() {

  if(myObject.isRotate){
    cube.rotation.x += 0.01;
	  cube.rotation.y += 0.01;
  }
	
  stats.update();
  controls.update();
  updatePhysics();
  
	renderer.render( scene, camera );
}

function updatePhysics(){
  // Step the physics world
  if(physicsWorld){
    physicsWorld.fixedStep();
  }

  for(const _entity of bodies){
    if((_entity?.mesh !=null)&&(_entity?.rigid !=null)){
      _entity.mesh.position.copy(_entity.rigid.position);
      _entity.mesh.quaternion.copy(_entity.rigid.quaternion);
    }
  }
}

function setupPhysics(){
  console.log(CANNON);
  physicsWorld = new CANNON.World()
  physicsWorld.gravity.set(0,-9.81,0);
  console.log(physicsWorld);

  setup_scene()
}
//console.log("CANNON: ",CANNON)

// setup_scene()
setupPhysics()