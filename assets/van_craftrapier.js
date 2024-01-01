/*
  Information:
    vanjs main client entry point
*/

// https://gist.github.com/BlueMagnificent/6ef76c65839a3d952228ba2f99d9b1e7
// https://rapier.rs/docs/user_guides/javascript/rigid_bodies/

//import * as THREE from 'three';
//import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
//import * as Ammo from 'https://unpkg.com/three@0.157.0/examples/jsm/libs/ammo.wasm.js';
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import {TriEngine} from './triengine/triengine.js';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

//console.log(Ammo );
//console.log(AmmoPhysics);
//var AmmoPhysics = null;

const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;

let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4

class CraftMobile extends TriEngine{

  clock=null;
  mesh = null;
  isPhysics = false;

  //tmpTrans;
  physicsWorld=null;
  rigidBodies = []; 
  //world=null;
  rigidBody=null
  
  constructor(args){
    
    super(args);
    console.log("init....")
    //this.mesh = null;
    this.clock = new THREE.Clock();
    
    const setup = this.setup.bind(this);
    setup();

  }

  async setup(){
    
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    this.mesh = cube;
    //this.scene.add( cube );
    console.log(this.mesh);

    this.camera.position.set(0,0,50);
    //this.camera.position.z


    console.log("setup")
    this.createLight();
    await this.setup_physics();

    this.createGroundBlock();

    this.setup_physics_objs();
    console.log("finish...")
  }
  // https://rapier.rs/docs/user_guides/javascript/getting_started_js
  async setup_physics(){
    console.log("physics")
    await RAPIER.init();
    console.log(RAPIER);
    // Use the RAPIER module here.
    let gravity = { x: 0.0, y: -9.81, z: 0.0 };
    let world = new RAPIER.World(gravity);
    console.log(this.world)
    this.physicsWorld = world;
    console.log(this.world)
  }

  updatePhysics( deltaTime ){
    if (this.physicsWorld == null){
      return;
    }
    // Step the simulation forward.  
    this.physicsWorld.step();
    // Get and print the rigid-body's position.
    let position = this.rigidBody.translation();
    if(position){
      //console.log("Rigid-body position: ", position.x, position.y, position.z);
    }
    if(this.rigidBodies){
      for ( let i = 0; i < this.rigidBodies.length; i++ ) {
        let objThree = this.rigidBodies[ i ];
        let objPhysics = objThree.userData.physicsBody;
        if(objPhysics){
          let p = objPhysics.translation();
          objThree.position.set( p.x, p.y, p.z );
          let q = objPhysics.rotation();
          //console.log(r);
          objThree.quaternion.set( q.x, q.y, q.z, q.w );
        }
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

  createGroundBlock(){
    let pos = {x: 0, y: -1, z: 0};
    let scale = {x: 10, y: 0.1, z: 10};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));

    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    this.scene.add(blockPlane);

    // Create the ground
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
    console.log(this.physicsWorld)
    this.physicsWorld.createCollider(groundColliderDesc);

    //Ammojs Section
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
     // Create a dynamic rigid-body.
     let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
     .setTranslation(0.0, 20.0, 0.0);
    let rigidBody = this.physicsWorld.createRigidBody(rigidBodyDesc);
    this.rigidBody = rigidBody;

    // Create a cuboid collider attached to the dynamic rigidBody.
    let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    let collider = this.physicsWorld.createCollider(colliderDesc, rigidBody);

    console.log(rigidBody);

    ball.userData.physicsBody = rigidBody;
    this.rigidBodies.push(ball);

  }

  setup_physics_floor(){

  }

  update(){
    let deltaTime = this.clock.getDelta();
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