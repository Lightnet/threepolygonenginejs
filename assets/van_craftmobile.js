/*
  Information:
    vanjs main client entry point
*/
// https://medium.com/@bluemagnificent/intro-to-javascript-3d-physics-using-ammo-js-and-three-js-dd48df81f591
// https://gist.github.com/BlueMagnificent/6ef76c65839a3d952228ba2f99d9b1e7


//import * as THREE from 'three';
//import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
//import * as Ammo from 'https://unpkg.com/three@0.157.0/examples/jsm/libs/ammo.wasm.js';
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import {TriEngine} from './triengine/triengine.js';
//import cannonEs from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm';
//import ammoNode from 'https://cdn.jsdelivr.net/npm/ammo-node@1.0.0/+esm';
//import 'https://raw.githubusercontent.com/kripken/ammo.js/main/builds/ammo.js';

//console.log(Ammo );
//console.log(AmmoPhysics);
//var AmmoPhysics = null;

const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;

let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4

class CraftMobile extends TriEngine{

  mesh = null;
  isPhysics = false;
  rigidBodies = []; 
  tmpTrans;
  physicsWorld=null;
  clock=null;

  constructor(args){
    
    super(args);
    //this.mesh = null;
    this.clock = new THREE.Clock();
    
    const setup = this.setup.bind(this);
    Ammo().then( function ( AmmoLib ) {
      console.log(AmmoLib);
      //AmmoPhysics=AmmoLib;
      Ammo = AmmoLib;
      setup();
    })
  }

  setup(){
    this.tmpTrans = new Ammo.btTransform();
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    this.mesh = cube;
    //this.scene.add( cube );
    console.log(this.mesh);

    this.camera.position.set(0,0,50);
    //this.camera.position.z



    this.createLight();
    this.setup_physics();

    this.createBlock();

    this.setup_physics_objs();
  }

  setup_physics(){
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache    = new Ammo.btDbvtBroadphase(),
        solver                  = new Ammo.btSequentialImpulseConstraintSolver();

    this.physicsWorld           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    this.physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

  }

  updatePhysics( deltaTime ){
    if (this.physicsWorld == null){
      return;
    }
    // Step world
    this.physicsWorld.stepSimulation( deltaTime, 10 );

    // Update rigid bodies
    for ( let i = 0; i < this.rigidBodies.length; i++ ) {
        let objThree = this.rigidBodies[ i ];
        let objAmmo = objThree.userData.physicsBody;
        let ms = objAmmo.getMotionState();
        if ( ms ) {
            ms.getWorldTransform( this.tmpTrans );
            let p = this.tmpTrans.getOrigin();
            let q = this.tmpTrans.getRotation();
            objThree.position.set( p.x(), p.y(), p.z() );
            objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
        }
    }
  }

  createLight(){
    //Add hemisphere light
    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
    hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
    hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
    hemiLight.position.set( 0, 50, 0 );
    this.scene.add( hemiLight );

    //Add directional light
    let dirLight = new THREE.DirectionalLight( 0xffffff , 1);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.multiplyScalar( 100 );
    this.scene.add( dirLight );
  }

  createBlock(){
    let pos = {x: 0, y: 0, z: 0};
    let scale = {x: 50, y: 2, z: 50};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));

    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    this.scene.add(blockPlane);

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    this.physicsWorld.addRigidBody( body, colGroupPlane, colGroupRedBall );
  }

  setup_physics_objs(){
    let pos = {x: 0, y: 20, z: 0};
    //let pos = {x: 0, y: 0, z: 0};
    let radius = 1;
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;

    //threeJS Section
    let ball = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));

    ball.position.set(pos.x, pos.y, pos.z);
    
    ball.castShadow = true;
    ball.receiveShadow = true;
    console.log(this.scene);

    this.scene.add(ball);

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btSphereShape( radius );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    this.physicsWorld.addRigidBody( body, colGroupRedBall, colGroupPlane | colGroupGreenBall );
    //this.physicsWorld.addRigidBody( body );
    ball.userData.physicsBody = body;
    this.rigidBodies.push(ball);






  }

  setup_physics_floor(){

  }

  update(){
    let deltaTime = this.clock.getDelta();
    //super();
    //console.log("update?")
    //console.log(this.mesh)
    //if(this.mesh){
      //this.mesh.rotation.x += 0.01;
      //this.mesh.rotation.y += 0.01;
    //}

    this.updatePhysics(deltaTime);
    
  }
  
}

const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new CraftMobile({canvas:renderEL});
    console.log(engine.val);//
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,ThreeEL())