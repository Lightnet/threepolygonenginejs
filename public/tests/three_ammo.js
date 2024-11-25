/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Information:
    vanjs main client entry point
    Note working... odd way to load.
*/

// https://medium.com/@bluemagnificent/intro-to-javascript-3d-physics-using-ammo-js-and-three-js-dd48df81f591
// https://gist.github.com/BlueMagnificent/6ef76c65839a3d952228ba2f99d9b1e7
// https://github.com/mrdoob/three.js/blob/master/examples/physics_ammo_instancing.html

//import * as THREE from 'three';
//import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
//import * as Ammo from 'https://unpkg.com/three@0.157.0/examples/jsm/libs/ammo.wasm.js'; //nope can't load here.
//import 'https://unpkg.com/three@0.160.0/examples/jsm/libs/ammo.wasm.js';// does not work, load in browser
//console.log(Ammo);//check if loaded...

//import { AmmoPhysics } from 'https://unpkg.com/three@0.160.0/examples/jsm/physics/AmmoPhysics.js';
import {TriEngine} from '../triengine/triengine.js';

import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.2.min.js";

const {button, canvas, input, label, div} = van.tags;

let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4;

class ThreeAmmoTest extends TriEngine{

  rigidBodies = [];

  constructor(args){
    super(args);
    //this.clock = new THREE.Clock();
  }
  //setup from class extends
  async init(){
    super.init();
    await this.loadPhysicsWorld(); //physics 
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.setup();
  }

  async setup(){
    //this.physicsWorld = await AmmoPhysics();
    //console.log(this.physicsWorld);
    this.camera.position.set(0,0,50);
    this.createScene();
    
    this.stats = new Stats();
    console.log(this.stats);
    van.add(document.body,this.stats.dom);
    this.setupGUI();
  }

  createScene(){
    this.createLights();
    //this.createPhysicsGround();
    //this.createPhysicsBox();
    //this.physicsWorld.addScene( this.scene );
  }

  createLights(){
    const hemiLight = new THREE.HemisphereLight();
		this.scene.add( hemiLight );

		const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
		dirLight.position.set( 5, 5, 5 );
		dirLight.castShadow = true;
		//dirLight.shadow.camera.zoom = 2;
		this.scene.add( dirLight );
  }

  createMeshCube(args){
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
  
  createPhysicsGround(args){
    args = args || {};

    const width = args?.width || 10;
    const height = args?.height || 1;
    const depth = args?.depth || 10;

    let pos={
      x:0,
      y:0,
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
    // const floor = new THREE.Mesh(
    //   new THREE.BoxGeometry( width, height, depth ),
    //   //new THREE.ShadowMaterial( { color: 0x444444 } )
    //   new THREE.MeshBasicMaterial( { color: 0x00ffff } )
    // );
    let mesh = this.createMeshCube({width:width,height:height,depth:depth,color:color});
    //floor.position.y = - 2.5;
    mesh.receiveShadow = true;
    mesh.userData.physics = { mass: 0 };
    mesh.userData.objectType = 'ground';
    this.scene.add( mesh );


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );
    //shape

    let blockColShape = new Ammo.btBoxShape( new Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
    blockColShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    blockColShape.calculateLocalInertia( mass, localInertia );
    //info
    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, blockColShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );
    this.physicsWorld.addRigidBody( body);

    console.log(body);

    this.rigidBodies.push({
      mesh:mesh,
      rigid:body,
    })

  }

  removePhysicsGround(){
    for (const entity of this.rigidBodies){
      console.log(entity);

      if(entity.mesh.userData?.objectType=='ground'){
        this.scene.remove(entity.mesh);
        this.physicsWorld.removeRigidBody(entity.rigid);
        //break;
      }
    }
  }

  createPhysicsBox(args){
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
    mesh.userData.objectType = 'cube';
    this.scene.add( mesh );

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );
    //shape

    let blockColShape = new Ammo.btBoxShape( new Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
    blockColShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    blockColShape.calculateLocalInertia( mass, localInertia );
    //info
    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, blockColShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );
    this.physicsWorld.addRigidBody( body);

    this.rigidBodies.push({
      mesh:mesh,
      rigid:body,
    })
  }

  removePhysicsBox(){
    for (const entity of this.rigidBodies){
      console.log(entity.userData);

      if(entity.mesh.userData?.objectType=='cube'){
        this.scene.remove(entity.mesh);
        this.physicsWorld.removeRigidBody(entity.rigid);
        //break;
      }
    }
  }

  updatePhysicsObjects(){
    const tmpTrans = this.tmpTrans;
    for(const _entity of this.rigidBodies){
      if((_entity?.mesh !=null)&&(_entity?.rigid !=null)){
        let ms = _entity.rigid.getMotionState();
        ms.getWorldTransform( tmpTrans );
        let p = tmpTrans.getOrigin();
        let q = tmpTrans.getRotation();
        //console.log(p);
        //console.log("x: ",p.x()," y: ", p.y(), " z:", p.z());
        //console.log("x: ",q.x()," y: ", q.y(), " z:", q.z(), " w: ", q.w());
        if ( ms ) {
          _entity.mesh.position.set( p.x(), p.y(), p.z() );
          _entity.mesh.quaternion.set( q.x(), q.y(), q.z(),q.w() );
        }
      }
    }
  }

  update(){
    super.update()
    let deltaTime = this.clock.getDelta();
    if(this.stats){
      this.stats.update();
    }
    if(this.physicsWorld){
      //console.log(this.physicsWorld);
      //this.physicsWorld.stepSimulation(frameTime,10);
      this.physicsWorld.stepSimulation(deltaTime,1);
      this.updatePhysicsObjects()
      //detectCollision();
    }
  }

  createPlayer(args){
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

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );
    //shape

    let blockColShape = new Ammo.btBoxShape( new Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
    blockColShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    blockColShape.calculateLocalInertia( mass, localInertia );
    //info
    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, blockColShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );
    this.physicsWorld.addRigidBody( body);

    this.rigidBodies.push({
      mesh:mesh,
      rigid:body,
    })
  }

  resetPlayer(){

  }

  removePlayer(){
    for (const entity of this.rigidBodies){
      console.log(entity.userData);

      if(entity.mesh.userData?.objectType=='player'){
        this.scene.remove(entity.mesh);
        this.physicsWorld.removeRigidBody(entity.rigid);
        //break;
      }
    }
  }

  setupGUI(){
    const gui = new GUI()
    this.gui = gui;
    const physicsFolder = gui.addFolder('Physics')
    const physicsBoxFolder = physicsFolder.addFolder('Box')
    physicsBoxFolder.add(this, 'createPhysicsBox').name('Created');
    physicsBoxFolder.add(this, 'removePhysicsBox').name('Remove');
    const physicsGroundFolder = physicsFolder.addFolder('Ground')
    physicsGroundFolder.add(this, 'createPhysicsGround').name('Created');
    physicsGroundFolder.add(this, 'removePhysicsGround').name('Remove');

    const physicsPlayerFolder = physicsFolder.addFolder('Player')
    physicsPlayerFolder.add(this, 'createPlayer').name('Created')
    physicsPlayerFolder.add(this, 'resetPlayer')
    physicsPlayerFolder.add(this, 'removePlayer').name('Remove')

  }

  async loadPhysicsWorld(){
    //let AMMO = await Ammo();
    await Ammo();
    await this.setupPhysicsWorld();
  }

  async setupPhysicsWorld(){
    let gravity = { x: 0.0, y: -9.81, z: 0.0 };
    //physics = new AMMO.World(gravity);
    console.log(Ammo);
    var collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
    var dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration);
    var overlappingPairCache    = new Ammo.btDbvtBroadphase();
    var solver                  = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    this.physicsWorld.setGravity(new Ammo.btVector3(gravity.x, gravity.y, gravity.z));
    this.tmpTrans = new Ammo.btTransform();
  }
  
}

const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});

  function init(){
    engine.val = new ThreeAmmoTest({
      canvas:renderEL,
      resize:'window',
      isPhysics:false,
    });
    console.log(engine.val);//
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,ThreeEL())