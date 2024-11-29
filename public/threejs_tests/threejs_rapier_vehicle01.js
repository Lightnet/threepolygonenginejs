/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://sbcode.net/threejs/physics-rapier-impulsejoint-motors/
// https://sbedit.net/d00b6d21064f1313f556563cd471ccdbf7d7578f#L265-L307
// https://sbcode.net/threejs/physics-rapier-impulsejoint-motors/
// 
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

class Box {
  dynamicBody=[]

  constructor(scene, world, position = [0,0,0]) {
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
    boxMesh.castShadow = true
    scene.add(boxMesh);

    const boxBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...position))

    const boxShape = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setRestitution(0.5).setMass(0.1)
    world.createCollider(boxShape, boxBody)

    this.dynamicBody = [boxMesh, boxBody];
  }

  update() {
    this.dynamicBody[0].position.copy(this.dynamicBody[1].translation())
    this.dynamicBody[0].quaternion.copy(this.dynamicBody[1].rotation())
  }

}
// https://sbcode.net/threejs/physics-rapier-impulsejoint-motors/
// collision groups
// floorShape = 0
// carShape = 1
// wheelShape = 2
// axelShape = 3

class Car {
  dynamicBodies = [];
  followTarget = new THREE.Object3D();
  lightLeftTarget = new THREE.Object3D();
  lightRightTarget = new THREE.Object3D();
  carBody=null; // RigidBody
  wheelBLMotor=null; // ImpulseJoint
  wheelBRMotor=null; // ImpulseJoint
  wheelFLAxel=null; // ImpulseJoint
  wheelFRAxel=null; // ImpulseJoint
  v = new THREE.Vector3()
  keyMap={}; //: { [key: string]: boolean }
  pivot=null; // : Object3D

  targetSteer=0;
  targetVelocity=0;

  constructor(keyMap= {}, pivot) {
    this.followTarget.position.set(0, 1, 0)
    this.lightLeftTarget.position.set(-0.35, 1, -10)
    this.lightRightTarget.position.set(0.35, 1, -10)
    this.keyMap = keyMap
    this.pivot = pivot
  }

  //async init(scene, world, position= [0, 0, 0]) {
  async init(scene, world, position) {

    const carMesh =  new THREE.Mesh(new THREE.BoxGeometry(0.8,0.5,1.5), new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe:true
    }));
    //carMesh.position.set(0,1,0)
    carMesh.add(this.followTarget)

    const wheelBLMesh0 = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 0.3, 0.3, 6 ), new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      //color: 'red',
      wireframe:true
    })); 
    const wheelBRMesh0 = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 0.3, 0.3, 6 ), new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe:true
    })); 
    const wheelFLMesh0 = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 0.3, 0.3, 6 ), new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe:true
    })); 
    const wheelFRMesh0 = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 0.3, 0.3, 6 ), new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe:true
    }));

    //rotate mesh to match wheel rotate spin
    const wheelBLMesh = new THREE.Object3D();
    wheelBLMesh0.rotation.z = Math.PI / 180 * 90;
    wheelBLMesh0.position.set(-0.2,0,0)
    wheelBLMesh.add(wheelBLMesh0);
    //rotate mesh to match wheel rotate spin
    const wheelBRMesh = new THREE.Object3D();
    wheelBRMesh0.rotation.z = Math.PI / 180 * 90;
    wheelBRMesh0.position.set(0.2,0,0)
    wheelBRMesh.add(wheelBRMesh0);
    //rotate mesh to match wheel rotate spin
    const wheelFLMesh = new THREE.Object3D();
    wheelFLMesh0.rotation.z = Math.PI / 180 * 90;
    wheelFLMesh0.position.set(-0.2,0,0)
    wheelFLMesh.add(wheelFLMesh0);
    //rotate mesh to match wheel rotate spin
    const wheelFRMesh = new THREE.Object3D();
    wheelFRMesh0.rotation.z = Math.PI / 180 * 90;
    wheelFRMesh0.position.set(0.2,0,0)
    wheelFRMesh.add(wheelFRMesh0);

    scene.add(carMesh, wheelBLMesh, wheelBRMesh, wheelFLMesh, wheelFRMesh)

    // create bodies for car, wheels and axels
    this.carBody = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(...position)
        .setCanSleep(false)
    )

    const wheelBLBody = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position[0] - 0.55, position[1], position[2] + 0.63)
        .setCanSleep(false)
    )
    const wheelBRBody = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position[0] + 0.55, position[1], position[2] + 0.63)
        .setCanSleep(false)
    )

    const wheelFLBody = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position[0] - 0.55, position[1], position[2] - 0.63)
        .setCanSleep(false)
    )
    const wheelFRBody = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position[0] + 0.55, position[1], position[2] - 0.63)
        .setCanSleep(false)
    )

    const axelFLBody = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position[0] - 0.55, position[1], position[2] - 0.63)
        .setCanSleep(false)
    )
    const axelFRBody = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position[0] + 0.55, position[1], position[2] - 0.63)
        .setCanSleep(false)
    )

    const v = new THREE.Vector3()
    let positions = []
    carMesh.updateMatrixWorld(true) // ensure world matrix is up to date
    carMesh.traverse((o) => {
      if (o.type === 'Mesh') {
        const positionAttribute = (o).geometry.getAttribute('position')
        for (let i = 0, l = positionAttribute.count; i < l; i++) {
          v.fromBufferAttribute(positionAttribute, i)
          v.applyMatrix4((o.parent).matrixWorld)
          positions.push(...v)
        }
      }
    })

    // create shapes for carBody, wheelBodies and axelBodies
    const carShape = (RAPIER.ColliderDesc.convexMesh(new Float32Array(positions)) )
      .setMass(1)
      .setRestitution(0.5)
      .setFriction(3)
      .setCollisionGroups(131073)
    const wheelBLShape = RAPIER.ColliderDesc.cylinder(0.1, 0.3)
      .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2))
      .setTranslation(-0.2, 0, 0)
      .setRestitution(0.5)
      .setFriction(2)
      .setCollisionGroups(262145)
    const wheelBRShape = RAPIER.ColliderDesc.cylinder(0.1, 0.3)
      .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
      .setTranslation(0.2, 0, 0)
      .setRestitution(0.5)
      .setFriction(2)
      .setCollisionGroups(262145)
    const wheelFLShape = RAPIER.ColliderDesc.cylinder(0.1, 0.3)
      .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
      .setTranslation(-0.2, 0, 0)
      .setRestitution(0.5)
      .setFriction(2.5)
      .setCollisionGroups(262145)
    const wheelFRShape = RAPIER.ColliderDesc.cylinder(0.1, 0.3)
      .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
      .setTranslation(0.2, 0, 0)
      .setRestitution(0.5)
      .setFriction(2.5)
      .setCollisionGroups(262145)

    // attach back wheel to cars. These will be configurable motors.
    const axelFLShape = RAPIER.ColliderDesc.cuboid(0.1, 0.1, 0.1)
      .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
      .setMass(0.1)
      .setCollisionGroups(589823) //d
    //.setCollisionGroups(524288)
    const axelFRShape = RAPIER.ColliderDesc.cuboid(0.1, 0.1, 0.1)
      .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
      .setMass(0.1)
      .setCollisionGroups(589823)// d
    //.setCollisionGroups(524288)//

    // attach back wheel to cars. These will be configurable motors.
    this.wheelBLMotor = world.createImpulseJoint(
      RAPIER.JointData.revolute(new RAPIER.Vector3(-0.55, 0, 0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(-1, 0, 0)),
      this.carBody,
      wheelBLBody,
      true
    )
    this.wheelBRMotor = world.createImpulseJoint(
        RAPIER.JointData.revolute(new RAPIER.Vector3(0.55, 0, 0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(-1, 0, 0)),
        this.carBody,
        wheelBRBody,
        true
    )

    // attach steering axels to car. These will be configurable motors.
    this.wheelFLAxel = world.createImpulseJoint(
        RAPIER.JointData.revolute(new RAPIER.Vector3(-0.55, 0, -0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(0, 1, 0)),
        this.carBody,
        axelFLBody,
        true
    )
    this.wheelFLAxel.configureMotorModel(RAPIER.MotorModel.ForceBased)
    this.wheelFRAxel = world.createImpulseJoint(
        RAPIER.JointData.revolute(new RAPIER.Vector3(0.55, 0, -0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(0, 1, 0)),
        this.carBody,
        axelFRBody,
        true
    )
    this.wheelFRAxel.configureMotorModel(RAPIER.MotorModel.ForceBased)

    // // attach front wheel to steering axels
    world.createImpulseJoint(
        RAPIER.JointData.revolute(new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(1, 0, 0)),
        axelFLBody,
        wheelFLBody,
        true
    )
    world.createImpulseJoint(
        RAPIER.JointData.revolute(new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(1, 0, 0)),
        axelFRBody,
        wheelFRBody,
        true
    )

    // create world collider
    world.createCollider(carShape, this.carBody)
    world.createCollider(wheelBLShape, wheelBLBody)
    world.createCollider(wheelBRShape, wheelBRBody)
    world.createCollider(wheelFLShape, wheelFLBody)
    world.createCollider(wheelFRShape, wheelFRBody)
    world.createCollider(axelFLShape, axelFLBody)
    world.createCollider(axelFRShape, axelFRBody)

    // update local dynamicBodies so mesh positions and quaternions are updated with the physics world info
    this.dynamicBodies.push([carMesh, this.carBody])
    this.dynamicBodies.push([wheelBLMesh, wheelBLBody])
    this.dynamicBodies.push([wheelBRMesh, wheelBRBody])
    this.dynamicBodies.push([wheelFLMesh, wheelFLBody])
    this.dynamicBodies.push([wheelFRMesh, wheelFRBody])
    this.dynamicBodies.push([new THREE.Object3D(), axelFRBody])
    this.dynamicBodies.push([new THREE.Object3D(), axelFLBody])

  }

  update(delta) {
    //console.log("update car???")
    for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
      this.dynamicBodies[i][0].position.copy(this.dynamicBodies[i][1].translation())
      this.dynamicBodies[i][0].quaternion.copy(this.dynamicBodies[i][1].rotation())
    }

    this.followTarget.getWorldPosition(this.v)
    this.pivot.position.lerp(this.v, delta * 5) // frame rate independent

    let targetVelocity = 0
    if (this.keyMap['KeyW']) {
      targetVelocity = 200
    }
    if (this.keyMap['KeyS']) {
      targetVelocity = -200
    }
    // if (this.keyMap['Space']) {
    //   targetVelocity = 0
    // }
    this.targetVelocity = targetVelocity;
    ;(this.wheelBLMotor).configureMotorVelocity(targetVelocity, 2.0)
    ;(this.wheelBRMotor).configureMotorVelocity(targetVelocity, 2.0)

    let targetSteer = 0
    if (this.keyMap['KeyA']) {
      targetSteer += 0.6
    }
    if (this.keyMap['KeyD']) {
      targetSteer -= 0.6
    }
    this.targetSteer = targetSteer;
    
    ;(this.wheelFLAxel).configureMotorPosition(targetSteer, 100, 10)
    ;(this.wheelFRAxel).configureMotorPosition(targetSteer, 100, 10)
  }
}

const keyMap = {}
const onDocumentKey = (e) => {
  keyMap[e.code] = e.type === 'keydown'
}

var bodies = [];
var physicsWorld;
var gridHelper;
var rapierDebugRenderer;

var clock = new THREE.Clock();
const stats = new Stats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer();
//const controls = new OrbitControls( camera, renderer.domElement );

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
  const mesh = new THREE.Mesh( geometry, material );
  return mesh;
}

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

const pivot = new THREE.Object3D()
const yaw = new THREE.Object3D()
const pitch = new THREE.Object3D()

scene.add(pivot)
pivot.add(yaw)
yaw.add(pitch)
pitch.add(camera) // adding the perspective camera to the hierarchy

const myObject ={
  isRotate:true,
  gravity:{x:0,y:-9.81,z:0},
  test:()=>{
    console.log('test');
  },
  resetRotation(){
    //cube.rotation.set(0,0,0)
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
  addPhysicsVehicle(){

  }
}

function createGUI(){
  const gui = new GUI();
  //gui.add(myObject,'test')
  const debugFolder = gui.addFolder('Debug')
  debugFolder.add(gridHelper,'visible').name('is Grid')
  debugFolder.add(rapierDebugRenderer,'enabled').name('Rapier Debug Renderer')

  // const orbitControlsFolder = gui.addFolder('Orbit Controls').show(false)
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
  
  // const cubeFolder = gui.addFolder('Cube').show(false)
  // cubeFolder.add(cube,'visible')
  // cubeFolder.add(myObject,'isRotate')
  // cubeFolder.add(myObject,'resetRotation')

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

  const physicsCarFolder = physicsFolder.addFolder('Car')
  physicsCarFolder.add(car, 'targetSteer').listen().disable();
  physicsCarFolder.add(car, 'targetVelocity').listen().disable();
  //targetSteer
  //const physicsPlayerFolder = physicsFolder.addFolder('Player')
  //physicsPlayerFolder.add(myObject,'addPhysicsPlayer')
  //physicsPlayerFolder.add(myObject,'removePhysicsPlayer')
  //physicsPlayerFolder.add(myObject,'resetPhysicsPlayer')

}

function onDocumentMouseMove(e) {
  yaw.rotation.y -= e.movementX * 0.002
  const v = pitch.rotation.x - e.movementY * 0.002

  // limit range
  if (v > -1 && v < 0.1) {
    pitch.rotation.x = v
  }
}

function onDocumentMouseWheel(e) {
  e.preventDefault()
  const v = camera.position.z + e.deltaY * 0.005

  // limit range
  if (v >= 1 && v <= 10) {
    camera.position.z = v
  }
}

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
var car;
var boxes;
// SET UP SCENE
async function setupScene(){
  // cube = createMeshCube();
  // scene.add(cube)
  setup_Helpers();

  myObject.addPhysicsGround();

  car = new Car(keyMap, pivot);
  await car.init(scene, physicsWorld, [0, 1, 0]);

  boxes = []
  for (let x = 0; x < 8; x += 1) {
    for (let y = 0; y < 8; y += 1) {
      boxes.push(new Box(scene, physicsWorld, [(x - 4) * 1.2, y + 1, -20]))
    }
  }

  document.addEventListener('keydown', onDocumentKey);
  document.addEventListener('keyup', onDocumentKey);

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}
// LOOP RENDERER AND UPDATE
function animate() {
  let deltaTime = clock.getDelta();
  // if(myObject.isRotate){
  //   cube.rotation.x += 0.01;
	//   cube.rotation.y += 0.01;
  // }
  //console.log(car);
  if(car){
    //console.log('UPDATE???')
    car.update(deltaTime);
  }

  updatePhysics(deltaTime);
	if(rapierDebugRenderer){
    rapierDebugRenderer.update()
  }
  stats.update();
  //controls.update();
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
  boxes.forEach((b) => b.update())
  
  for(const _entity of bodies){
    if((_entity?.mesh !=null)&&(_entity?.rigid !=null)){
      _entity.mesh.position.copy(_entity.rigid.translation())
      _entity.mesh.quaternion.copy(_entity.rigid.rotation())
    }
  }
}

initPhysics()