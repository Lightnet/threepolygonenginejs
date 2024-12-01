/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

//  TEST Force and impulse

// EXAMPLES
// https://rapier.rs/demos3d/index.html
// https://sbcode.net/threejs/physics-rapier-debugRenderer/

// https://sbcode.net/threejs/physics-rapier/

import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
//import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
//const {div, button} = van.tags;

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
const keyMap = {};
const stats = new Stats();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.set( -5, 10, -5 );
camera.position.set( 0, 10, 5);
const scene = new THREE.Scene();
var cube;
var physicsWorld;
var rigidBody;
var rapierDebugRenderer;

const bodies = [];

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

function setupLights(){
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
  if(physicsWorld){
    updateObjectPhysics()
    updateKey();
    physicsWorld.step();
    //update_rigid_body();
  }
  stats.update()
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
  console.log("INIT RAPIER...");
  // Use the RAPIER module here.
  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  physicsWorld = new RAPIER.World(gravity);

  // // Create the ground
  // let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
  // physicsWorld.createCollider(groundColliderDesc);

  // for cube
  // Create a dynamic rigid-body.
  // let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
  //   .setTranslation(0.0, 5.0, 0.0);
  // rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
  // // Create a cuboid collider attached to the dynamic rigidBody.
  // let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  // let collider = physicsWorld.createCollider(colliderDesc, rigidBody);

  //setup_triMesh();

  rapierDebugRenderer = new RapierDebugRenderer(scene, physicsWorld)

  setupScene();
}

function setup_triMesh(){
  // https://sbcode.net/threejs/physics-rapier/
  // TEST TRI MESH
  const trimeshBody = physicsWorld.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0))
  const vertices = new Float32Array(cube.geometry.attributes.position.array);
  let indices = new Uint32Array((cube.geometry.index).array)
  const trimeshShape = RAPIER.ColliderDesc.trimesh(vertices, indices);
  physicsWorld.createCollider(trimeshShape, trimeshBody);
  //console.log(RAPIER.ColliderDesc.trimesh);
}

function rigid_body_logs(){
  // Get and print the rigid-body's position.
  if(rigidBody){
    let position = rigidBody.translation();
    console.log("Rigid-body position: ", position.x, position.y);
  }
}

function updateObjectPhysics(){
  for(const op of bodies){
    if(op.mesh!=null && op.collider !=null){
      let position = op.collider.translation();
      let rotation = op.collider.rotation();
      op.mesh.position.copy(position);
      op.mesh.quaternion.copy(rotation);
    }
  }
}

function removePhysicsTag(_name){
  let removeBodies = [];
  for(const _entity of bodies) {
    console.log("entity ", _entity)
    if(_entity.mesh.userData?.objectType==_name){
      console.log("found: ", _entity.mesh)
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
}
var colliderFolder;
var colliderFolders;
var controllerColliderid;
const myObject={
  pos:{x:0,y:5,z:0},
  quat:{x:0,y:0,z:0,w:1},
  force:{x:0,y:9,z:0},
  torque:{x:0,y:9,z:0},
  forceAtPoint1:{x:0,y:10,z:0},
  forceAtPoint2:{x:1,y:2,z:3},

  gravity:{x:0,y:-9.81,z:0},
  linearVelocity:{x:0,y:10,z:0},
  angularVelocity:{x:0,y:0,z:0},//radian
  gravityScale:1,
  colliderId:0,
  collider:null,
  test(){
    console.log('test');
  },
  c_reset(){
    rigidBody.setTranslation({ x: 0.0, y: 2.0, z: 0.0 }, true);
  },
  addPhysicsBox(args={}){
    let width = args?.width || 1;
    let height = args?.height || 1;
    let depth = args?.depth || 1;
    let color = args?.color || 0x00ffff;
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

    // THREEJS
    let mesh = createMeshCube({
      width,
      height,
      depth,
      color,
    })
    mesh.userData.objectType='box'
    scene.add(mesh);

    //PHYSICS
    // Create a dynamic rigid-body.
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(pos.x, pos.y, pos.z);
    let rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
    // Create a cuboid collider attached to the dynamic rigidBody.
    let colliderDesc = RAPIER.ColliderDesc.cuboid(width*0.5, height*0.5, depth*0.5);
    let collider = physicsWorld.createCollider(colliderDesc, rigidBody);
    console.log(collider);

    bodies.push({
      rigid:rigidBody,
      collider:collider,
      mesh:mesh,
    });
    this.getColliderIds();
  },
  removePhysicsBox(){
    removePhysicsTag('box');
  },
  addPhysicsGround(args={}){
    let width = args?.width || 20;
    let height = args?.height || 1;
    let depth = args?.depth || 20;
    let color = args?.color || 0x00ff00;
    color = 'gray';

    // THREEJS
    let mesh = createMeshCube({
      width,
      height,
      depth,
      color,
    })
    mesh.userData.objectType='ground'
    scene.add( mesh );
    // PHYSICS
    // Create the ground
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(width*0.5,height*0.5, depth*0.5);
    let collider = physicsWorld.createCollider(groundColliderDesc);

    bodies.push({
      rigid:null,
      collider:collider,
      mesh:mesh,
    });
    this.getColliderIds();
  },
  removePhysicsGround(args={}){
    removePhysicsTag('ground');
  },
  getColliderId(){
    let opTmp = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        //console.log(op.collider)
        opTmp = op.collider;
      }
    }
    console.log(opTmp);
  },
  getColliderIds(){
    if(!colliderFolder)return;
    console.log('get ids')
    let opIds = [];
    for(const op of bodies){
      if(op?.collider){
        console.log(op.collider)
        opIds.push(op.collider.handle)
      }
    }
    if(controllerColliderid){
      controllerColliderid.destroy()
      controllerColliderid = colliderFolders.add(this,'colliderId',opIds)
    }else{
      controllerColliderid = colliderFolders.add(this,'colliderId',opIds)
    }
  },
  setVeolcity(){
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      opRigid.setLinvel({ x: this.linearVelocity.x, y: this.linearVelocity.y, z: this.linearVelocity.z }, true); 
    }
  },
  setRotation(){
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      opRigid.setAngvel({ x: this.angularVelocity.x, y: this.angularVelocity.y, z: this.angularVelocity.z }, true); 
    }
  },
  resetRigid(){
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      opRigid.setTranslation({ x: 0, y: 5, z: 0 }, true);
      opRigid.setLinvel({ x: 0, y: 0, z: 0}, true); 
      opRigid.setAngvel({ x: 0, y:0, z: 0 }, true);
      opRigid.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 }); 
      opRigid.resetForces(true);
      opRigid.resetTorques(true);
    }
  },
  resetForceRigid(){
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      opRigid.setAngvel({ x: 0, y:0, z: 0 }, true);
      opRigid.resetForces(true);
    }
  },
  resetTorquesRigid(){
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      opRigid.resetTorques(true);
    }
  },
  addForceRigid(){//no way to stop when set
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      console.log(this.force);
      opRigid.addForce({ x: this.force.x, y: this.force.y, z: this.force.z }, true);
    }
  },
  addImpulseRigid(){//no way to stop when set
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      console.log(this.force);
      opRigid.applyImpulse({ x: this.force.x, y: this.force.y, z: this.force.z }, true);
    }
  },
  addTorqueRigid(){
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      console.log(this.torque);
      opRigid.addTorque({ x: this.torque.x, y: this.torque.y, z: this.torque.z }, true);
    }
  },
  addImpulseTorqueRigid(){//one time
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      console.log(this.torque);
      opRigid.applyTorqueImpulse({ x: this.torque.x, y: this.torque.y, z: this.torque.z }, true);
    }
  },
  addForceAtPoint(){
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      opRigid.addForceAtPoint(
        { x: this.forceAtPoint1.x, y: this.forceAtPoint1.y, z: this.forceAtPoint1.z },
        { x: this.forceAtPoint2.x, y: this.forceAtPoint2.y, z: this.forceAtPoint2.z }, 
        true);
    }
  },
  applyImpulseAtPoint(){
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == this.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      opRigid.applyImpulseAtPoint(
        { x: this.forceAtPoint1.x, y: this.forceAtPoint1.y, z: this.forceAtPoint1.z },
        { x: this.forceAtPoint2.x, y: this.forceAtPoint2.y, z: this.forceAtPoint2.z }, 
        true);
    }
  }
}

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'test')
  const physicsFolder = gui.addFolder('Physics');
  const physicsGravityFolder = physicsFolder.addFolder('Gravity').show(false);
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
  physicsFolder.add(myObject,'addPhysicsBox')
  physicsFolder.add(myObject,'removePhysicsBox')
  physicsFolder.add(myObject,'addPhysicsGround')
  physicsFolder.add(myObject,'removePhysicsGround')
  colliderFolder = physicsFolder.addFolder('Collider')
  colliderFolders = colliderFolder.addFolder('Colliders')
  colliderFolders.add(myObject,'resetRigid');
  controllerColliderid = colliderFolders.add(myObject,'colliderIds',[])

  const colliderGravityScaleFolder = colliderFolder.addFolder('Gravity Scale').show(false)
  colliderGravityScaleFolder.add(myObject,'gravityScale').onChange((value)=>{
    let opCollider = null;
    let opRigid = null;
    for(const op of bodies){
      if(op?.collider.handle == myObject.colliderId){
        console.log(op)
        opCollider = op.collider;
        opRigid = op.rigid;
      }
    }
    console.log(opRigid);
    if(opRigid){
      opRigid.setGravityScale(value, true); 
    }
  })
  const colliderPositionFolder = colliderFolder.addFolder('Position').show(false)
  colliderPositionFolder.add(myObject.pos,'x')
  colliderPositionFolder.add(myObject.pos,'y')
  colliderPositionFolder.add(myObject.pos,'z')

  const colliderRotationFolder = colliderFolder.addFolder('Rotation').show(false)
  colliderRotationFolder.add(myObject.quat,'x')
  colliderRotationFolder.add(myObject.quat,'y')
  colliderRotationFolder.add(myObject.quat,'z')
  colliderRotationFolder.add(myObject.quat,'w')

  

  const colliderLinearVelocityFolder = colliderFolder.addFolder('Linear Velocity').show(false)
  colliderLinearVelocityFolder.add(myObject.linearVelocity,'x')
  colliderLinearVelocityFolder.add(myObject.linearVelocity,'y')
  colliderLinearVelocityFolder.add(myObject.linearVelocity,'z')
  colliderLinearVelocityFolder.add(myObject,'setVeolcity')

  const colliderAngularVelocityFolder = colliderFolder.addFolder('Angular Velocity').show(false)
  colliderAngularVelocityFolder.add(myObject.angularVelocity,'x')
  colliderAngularVelocityFolder.add(myObject.angularVelocity,'y')
  colliderAngularVelocityFolder.add(myObject.angularVelocity,'z')
  colliderAngularVelocityFolder.add(myObject,'setRotation')

  const colliderTorquesFolder = colliderFolder.addFolder('Torques( Rotate )')
  colliderTorquesFolder.add(myObject.torque,'x')
  colliderTorquesFolder.add(myObject.torque,'y')
  colliderTorquesFolder.add(myObject.torque,'z')
  colliderTorquesFolder.add(myObject,'resetTorquesRigid').name('RESET');
  colliderTorquesFolder.add(myObject,'addTorqueRigid').name('Add Torque');
  colliderTorquesFolder.add(myObject,'addImpulseTorqueRigid').name('Apply Impulse Torque');;

  const colliderForceFolder = colliderFolder.addFolder('Force( Velocity )')
  colliderForceFolder.add(myObject.force,'x')
  colliderForceFolder.add(myObject.force,'y')
  colliderForceFolder.add(myObject.force,'z')
  colliderForceFolder.add(myObject,'resetForceRigid').name('RESET');
  colliderForceFolder.add(myObject,'addForceRigid').name('Add Force');
  colliderForceFolder.add(myObject,'addImpulseRigid').name('Add Impulse');

  const colliderForceAtPointFolder = colliderFolder.addFolder('ForceAt')
  const colliderForceAtPoint1Folder = colliderForceAtPointFolder.addFolder('Point1')
  colliderForceAtPoint1Folder.add(myObject.forceAtPoint1,'x')
  colliderForceAtPoint1Folder.add(myObject.forceAtPoint1,'y')
  colliderForceAtPoint1Folder.add(myObject.forceAtPoint1,'z')

  const colliderForceAtPoint2Folder = colliderForceAtPointFolder.addFolder('Point2')
  colliderForceAtPoint2Folder.add(myObject.forceAtPoint2,'x')
  colliderForceAtPoint2Folder.add(myObject.forceAtPoint2,'y')
  colliderForceAtPoint2Folder.add(myObject.forceAtPoint2,'z')
  colliderForceAtPointFolder.add(myObject,'addForceAtPoint').name('Add Force Point')
  colliderForceAtPointFolder.add(myObject,'applyImpulseAtPoint').name('Apply Impulse At Point')

  //colliderFolder.add(myObject,'getColliderId')
  //colliderFolder.add(myObject,'getColliderIds')
  
}
var wheelFLAxel;

function setupJointTest(){

  let position = [0, 1, 0];

  // create bodies for car, wheels and axels
  const carBody = physicsWorld.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(...position)
      .setCanSleep(false)
  )

  const axelFLBody = physicsWorld.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(position[0] - 0.55, position[1], position[2] - 0.63)
      .setCanSleep(false)
  )

  const wheelFLBody = physicsWorld.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(position[0] - 0.55, position[1], position[2] - 0.63)
      .setCanSleep(false)
  )

  const wheelFLShape = RAPIER.ColliderDesc.cylinder(0.1, 0.3)
      .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
      .setTranslation(-0.2, 0, 0)
      .setRestitution(0.5)
      .setFriction(2.5)
      .setCollisionGroups(262145)

  // attach steering axels to car. These will be configurable motors.
  wheelFLAxel = physicsWorld.createImpulseJoint(
    RAPIER.JointData.revolute(new RAPIER.Vector3(-0.55, 0, -0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(0, 1, 0)),
    carBody,
    axelFLBody,
    true
  )
  wheelFLAxel.configureMotorModel(RAPIER.MotorModel.ForceBased)

  // // attach front wheel to steering axels
  physicsWorld.createImpulseJoint(
    RAPIER.JointData.revolute(new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(1, 0, 0)),
    axelFLBody,
    wheelFLBody,
    true
  )

  // attach back wheel to cars. These will be configurable motors.
  const axelFLShape = RAPIER.ColliderDesc.cuboid(0.1, 0.1, 0.1)
  .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
  .setMass(0.1)
  .setCollisionGroups(589823) //d

  physicsWorld.createCollider(axelFLShape, axelFLBody)
  physicsWorld.createCollider(wheelFLShape, wheelFLBody)
}

function updateKey(){
  let targetSteer = 0
    if (keyMap['KeyA']) {
      targetSteer += 0.6
    }
    if (keyMap['KeyD']) {
      targetSteer -= 0.6
    }
    //targetSteer = targetSteer;
  //console.log(targetSteer);
  
  ;(wheelFLAxel).configureMotorPosition(targetSteer, 100, 10)
}


const onDocumentKey = (e) => {
  keyMap[e.code] = e.type === 'keydown'
}

function setupScene(){

  setupLights();

  myObject.addPhysicsGround()

  setupJointTest();
  
  createGUI();

  document.addEventListener('keydown', onDocumentKey)
  document.addEventListener('keyup', onDocumentKey)


  document.body.appendChild( stats.dom );
  document.body.appendChild( renderer.domElement );
  renderer.setAnimationLoop( animate );
}
console.log("three rapier test");


run_simulation();