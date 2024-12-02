/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// vehicle class without class from cannon to test.
// wheel rotate not fixed

// https://github.com/pmndrs/cannon-es/blob/master/examples/constraints.html
// https://github.com/pmndrs/cannon-es/blob/master/examples/fixed_rotation.html
// https://github.com/pmndrs/cannon-es/blob/master/examples/hinge.html

// https://github.com/pmndrs/cannon-es/blob/master/getting-started.md
// https://pmndrs.github.io/cannon-es/examples/rigid_vehicle
// https://github.com/pmndrs/cannon-es/blob/master/examples/rigid_vehicle.html

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
//import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm';
import CannonDebugRenderer from './cannondebugrenderer.js';
import RigidVehicle from "./rigidvehicle.js";
const {div,style} = van.tags;

const keyMap = {}
const onDocumentKey = (e) => {
  keyMap[e.code] = e.type === 'keydown'
}

var physicsWorld;
const bodies = [];

//let cube;
var gridHelper;
var cannonDebugRenderer;

const stats = new Stats();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x80a0e0);
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

document.addEventListener('click', () => {
  renderer.domElement.requestPointerLock()
})

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === renderer.domElement) {
    document.addEventListener('keydown', onDocumentKey)
    document.addEventListener('keyup', onDocumentKey)

    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove)
    renderer.domElement.addEventListener('wheel', onDocumentMouseWheel)
  } else {
    document.removeEventListener('keydown', onDocumentKey)
    document.removeEventListener('keyup', onDocumentKey)

    renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove)
    renderer.domElement.removeEventListener('wheel', onDocumentMouseWheel)
  }
})

function onDocumentMouseMove(e) {
  // yaw.rotation.y -= e.movementX * 0.002
  // const v = pitch.rotation.x - e.movementY * 0.002

  // // limit range
  // if (v > -1 && v < 0.1) {
  //   pitch.rotation.x = v
  // }
}

function onDocumentMouseWheel(e) {
  e.preventDefault()
  const v = camera.position.z + e.deltaY * 0.005

  // limit range
  if (v >= 1 && v <= 10) {
    camera.position.z = v
  }
}

function createMeshBox(args){
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

function setupBox(){
  cube = createMeshBox();
  scene.add( cube );
}

var controls = new OrbitControls( camera, renderer.domElement );

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

    let mesh = createMeshBox({
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
    const width = args?.width || 50;
    const height = args?.height || 1;
    const depth = args?.depth || 50;
    let color = args?.color || 0x00ffff;
    color = 'gray'

    let pos={
      x:args?.x || 0,
      y:args?.y || -5,
      z:args?.z || 0,
    }
    let quat={
      x:0,
      y:0,
      z:0,
      w:1
    }

    let mesh = createMeshBox({
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
    groundBody.position.set(pos.x, pos.y, pos.z)
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
// https://github.com/cocopon/tweakpane/issues/46
function createPanel(){
  const myStyle = style(`
/* Default wrapper view */
.yourCustomContainer .tp-dfwv {
  min-width: 360px;
}   
`);
  van.add(document.body,myStyle)
const divPane = div({style:`position:fixed;top:0px;right:0px;`,class:'yourCustomContainer'})
  van.add(document.body,divPane)
  const pane = new Pane({
    title: 'Parameters',
    container:divPane,
    expanded: true,
  });
  console.log("pane: ", pane);

  const debugFolder = pane.addFolder({title: 'Debug',expanded: true,});

  debugFolder.addBinding(gridHelper, 'visible',{
    label:'Grid Helper'
    // options:{//list
    //   label:'test'
    // }
  })

  const orbitControlsFolder = pane.addFolder({title: 'Orbit Controls',expanded: false,});
  orbitControlsFolder.addBinding(controls, 'autoRotate');
  orbitControlsFolder.addBinding(controls, 'autoRotateSpeed');
  orbitControlsFolder.addBinding(controls, 'dampingFactor');
  orbitControlsFolder.addBinding(controls, 'enableDamping');
  orbitControlsFolder.addBinding(controls, 'enablePan');
  orbitControlsFolder.addBinding(controls, 'enableRotate');
  orbitControlsFolder.addBinding(controls, 'enableZoom');
  orbitControlsFolder.addBinding(controls, 'panSpeed');
  orbitControlsFolder.addBinding(controls, 'rotateSpeed');
  orbitControlsFolder.addBinding(controls, 'screenSpacePanning');
  orbitControlsFolder.addBinding(controls, 'zoomToCursor');
  orbitControlsFolder.addBinding(controls, 'enabled');

  const physicsFolder = pane.addFolder({title: 'physics',expanded: true,});
  const physicsGravityFolder = physicsFolder.addFolder({title: 'Gravity',expanded: true,});
  physicsGravityFolder.addBinding(myObject.gravity,'x').on('change',ev=>{
    //console.log(ev.value);
    physicsWorld.gravity.x = myObject.gravity.x;
  });
  physicsGravityFolder.addBinding(myObject.gravity,'y').on('change',ev=>{
    //console.log(ev.value);
    physicsWorld.gravity.y = myObject.gravity.y;
  });
  physicsGravityFolder.addBinding(myObject.gravity,'z').on('change',ev=>{
    //console.log(ev.value);
    physicsWorld.gravity.z = myObject.gravity.z;
  });

  const physicsBoxFolder = physicsFolder.addFolder({title: 'Box',expanded: true,});

  physicsBoxFolder.addButton({
    title: 'Add',
    //label: 'counter',   // optional
  }).on('click', () => {
    myObject.addPhysicsBox();
  });

  physicsBoxFolder.addButton({
    title: 'Remove',
    //label: 'counter',   // optional
  }).on('click', () => {
    myObject.removePhysicsBox();
  });

}

function createGUI(){
  // const gui = new GUI();
  // gui.add(myObject,'test')
  // const debugFolder = gui.addFolder('Debug')
  // debugFolder.add(gridHelper,'visible').name('is Grid')
  // const orbitControlsFolder = gui.addFolder('Orbit Controls')
  // orbitControlsFolder.add(controls, 'autoRotate')
  // orbitControlsFolder.add(controls, 'autoRotateSpeed')
  // orbitControlsFolder.add(controls, 'dampingFactor')
  // orbitControlsFolder.add(controls, 'enableDamping')
  // orbitControlsFolder.add(controls, 'enablePan')
  // orbitControlsFolder.add(controls, 'enableRotate')
  // orbitControlsFolder.add(controls, 'enableZoom')
  // orbitControlsFolder.add(controls, 'panSpeed')
  // orbitControlsFolder.add(controls, 'rotateSpeed')
  // orbitControlsFolder.add(controls, 'screenSpacePanning')
  // orbitControlsFolder.add(controls, 'zoomToCursor')
  // orbitControlsFolder.add(controls, 'enabled')

  // const physicsFolder = gui.addFolder('Physics')
  // physicsFolder.add(myObject,'addPhysicsGround');



  
  // const cubeFolder = gui.addFolder('Cube')
  // cubeFolder.add(cube,'visible')
  // cubeFolder.add(myObject,'isRotate')
  // cubeFolder.add(myObject,'resetRotation')
}
var vehicle;
function UpdateVehicle(){
  const maxSteerVal = Math.PI / 8
  const maxSpeed = 10
  const maxForce = 100
  if (keyMap['KeyW']) {
    vehicle.setWheelForce(maxForce, 2)
    vehicle.setWheelForce(-maxForce, 3)
  }else if (keyMap['KeyS']) {
    vehicle.setWheelForce(-maxForce / 2, 2)
    vehicle.setWheelForce(maxForce / 2, 3)
  }else{
    vehicle.setWheelForce(0, 2)
    vehicle.setWheelForce(0, 3)
    // vehicle.setSteeringValue(0, 2)
    // vehicle.setSteeringValue(0, 3)
  }

  if (keyMap['KeyA']) {
    vehicle.setSteeringValue(maxSteerVal, 0)
    vehicle.setSteeringValue(maxSteerVal, 1)
  }else if (keyMap['KeyD']) {
    vehicle.setSteeringValue(-maxSteerVal, 0)
    vehicle.setSteeringValue(-maxSteerVal, 1)
  }else{
    vehicle.setSteeringValue(0, 0)
    vehicle.setSteeringValue(0, 1)
  }
}

function setupVehicle(){
  const zero = new CANNON.Vec3()
  const mass = 1
  const wheelMaterial = new CANNON.Material('wheel')
  // Build the car chassis
  const chassisShape = new CANNON.Box(new CANNON.Vec3(5, 0.5, 2))
  const chassisBody = new CANNON.Body({ mass: 1 })
  const centerOfMassAdjust = new CANNON.Vec3(0, -1, 0)
  chassisBody.addShape(chassisShape, centerOfMassAdjust)


  const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial })
  const wheelShape = new CANNON.Cylinder(1.5, 1.5, 1, 10)
  wheelBody1.addShape(wheelShape)
  wheelBody1.quaternion.setFromEuler(Math.PI / 2, 0, 0)
  console.log(wheelShape);
  wheelBody1.position.set(-5, 0, 3)

  const leftfrontc = new CANNON.HingeConstraint(chassisBody, wheelBody1, {
    pivotA: new CANNON.Vec3(-5, -1, 3),
    axisA: new CANNON.Vec3(0, 0, 0),
    pivotB: new CANNON.Vec3(0, 0, 0),
    axisB: new CANNON.Vec3(0, 1, 0),
    collideConnected: false,
  })
  console.log("leftfrontc: ",leftfrontc)

  const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial })
  const wheelShape2 = new CANNON.Cylinder(1.5, 1.5, 1, 10)
  wheelBody2.addShape(wheelShape2)
  wheelBody2.quaternion.setFromEuler(Math.PI / 2, 0, 0)
  wheelBody2.position.set(-5, 0, -3)

  const rightfrontc = new CANNON.HingeConstraint(chassisBody, wheelBody2, {
    pivotA: new CANNON.Vec3(-5, -1, -3),
    axisA: new CANNON.Vec3(0, 0, 0),
    pivotB: new CANNON.Vec3(0, 0, 0),
    axisB: new CANNON.Vec3(0, 1, 0),
    collideConnected: false,
  })

  const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial })
  const wheelShape3 = new CANNON.Cylinder(1.5, 1.5, 1, 10)
  wheelBody3.addShape(wheelShape3)
  wheelBody3.quaternion.setFromEuler(Math.PI / 2, 0, 0)
  wheelBody3.position.set(5, 0, 3)

  const leftrearc = new CANNON.HingeConstraint(chassisBody, wheelBody3, {
    pivotA: new CANNON.Vec3(5, -1, 3),
    axisA: new CANNON.Vec3(0, 0, 0),
    pivotB: new CANNON.Vec3(0, 0, 0),
    axisB: new CANNON.Vec3(0, 1, 0),
    collideConnected: false,
  })

  const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial })
  const wheelShape4 = new CANNON.Cylinder(1.5, 1.5, 1, 10)
  wheelBody4.addShape(wheelShape4)
  wheelBody4.quaternion.setFromEuler(Math.PI / 2, 0, 0)
  wheelBody4.position.set(5, 0, -3)

  const rightrearc = new CANNON.HingeConstraint(chassisBody, wheelBody4, {
    pivotA: new CANNON.Vec3(5, -1, -3),
    axisA: new CANNON.Vec3(0, 0, 0),
    pivotB: new CANNON.Vec3(0, 0, 0),
    axisB: new CANNON.Vec3(0, 1, 0),
    collideConnected: false,
  })
  
  //body to world
  physicsWorld.addBody(chassisBody)
  physicsWorld.addBody(wheelBody1)
  physicsWorld.addBody(wheelBody2)
  physicsWorld.addBody(wheelBody3)
  physicsWorld.addBody(wheelBody4)
  //Constraint to world
  physicsWorld.addConstraint(leftfrontc)
  physicsWorld.addConstraint(rightfrontc)
  physicsWorld.addConstraint(leftrearc)
  physicsWorld.addConstraint(rightrearc)

  const velocity = -1
  // leftfrontc.enableMotor()
  // rightfrontc.enableMotor()
  // leftfrontc.setMotorSpeed(velocity)
  // rightfrontc.setMotorSpeed(velocity)

  leftrearc.enableMotor()
  rightrearc.enableMotor()
  leftrearc.setMotorSpeed(velocity)
  rightrearc.setMotorSpeed(velocity)

}

function setupScene(){
  //setupBox();
  setup_Helpers()

  myObject.addPhysicsGround();

  setupVehicle();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  cannonDebugRenderer = new CannonDebugRenderer(scene, physicsWorld)
  
  renderer.setAnimationLoop( animate );
  //createGUI();
  createPanel();
}

function animate() {

  // if(myObject.isRotate){
  //   cube.rotation.x += 0.01;
	//   cube.rotation.y += 0.01;
  // }

  updatePhysics();
  //UpdateVehicle();
  cannonDebugRenderer.update();
	
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}

function setupPhysics(){
  console.log(CANNON);
  physicsWorld = new CANNON.World()
  physicsWorld.gravity.set(0,-9.81,0);
  console.log(physicsWorld);

  setupScene()
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
//setupScene()
setupPhysics()