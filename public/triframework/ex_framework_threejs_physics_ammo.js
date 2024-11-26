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

//import * as Ammo from 'https://unpkg.com/three@0.157.0/examples/jsm/libs/ammo.wasm.js'; // nope can't load here.
//import 'https://unpkg.com/three@0.160.0/examples/jsm/libs/ammo.wasm.js'; //  nope can't load here.
//console.log(Ammo);//check if loaded...

//import { AmmoPhysics } from 'https://unpkg.com/three@0.160.0/examples/jsm/physics/AmmoPhysics.js';
import {TriFrameWork} from './tri_framework.js';
import { 
  THREE,
  Stats,
  GUI,
  van
} from '/dps.js';

const {button, canvas, input, label, div} = van.tags;

let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4;

class ThreeAmmoTest extends TriFrameWork{

  rigidBodies = [];

  constructor(args){
    super(args);
    //this.clock = new THREE.Clock();
  }

  async setup(){
    super.setup();
    //this.physicsWorld = await AmmoPhysics();
    //console.log(this.physicsWorld);
    this.camera.position.set(0,0,50);
    this.createScene();
    
    this.stats = new Stats();
    //console.log(this.stats);
    van.add(document.body,this.stats.dom);

    //console.log("this.physicsAPI: ", this.physicsAPI());
    const Ammo = this.physicsAPI();
    //console.log("Ammo: ", Ammo);
    //this.tmpTrans = new this.physicsAPI().btTransform();
    this.tmpTrans = new Ammo.btTransform();
    //console.log("this.tmpTrans: ", this.tmpTrans);
    this.setupGUI();
  }

  createScene(){
    this.createLights();
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

    //const Ammo = this.physics.API;
    const Ammo = this.physicsAPI();
    console.log("Ammo", Ammo)

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
    this.physics.world.addRigidBody( body);

    console.log(body);

    this.rigidBodies.push({
      mesh:mesh,
      rigid:body,
    })

  }

  removePhysicsGround(){
    let removeBodies = [];
    for (const entity of this.rigidBodies){
      console.log(entity);

      if(entity.mesh.userData?.objectType=='ground'){
        this.scene.remove(entity.mesh);
        this.physics.world.removeRigidBody(entity.rigid);
        removeBodies.push(entity);
        //break;
      }
    }

    for(let i = 0; i < removeBodies.length;i++){
      let index = this.rigidBodies.indexOf(removeBodies[i]);
      if(index > -1){
        this.rigidBodies.splice(index, 1);
      }
    }
  }

  createPhysicsBox(args){

    if(this.physicsWorld()==null){
      console.log("not loaded?")
      return;
    }
    args = args || {};
    const width = args?.width || 2;
    const height = args?.height || 2;
    const depth = args?.depth || 2;
    let mass = args?.mass || 1;

    let pos={
      x:args?.x || 0,
      y:args?.y || 5,
      z:args?.z || 0,
    }
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let color = 'green';

    let mesh = this.createMeshCube({width:width,height:height,depth:depth,color:color});
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData.physics = { mass: 1 };
    mesh.userData.objectType = 'cube';
    this.scene.add( mesh );

    //const Ammo = this.physics.API;
    const Ammo = this.physicsAPI();
    //console.log("Ammo", Ammo)
    //console.log("mass", mass)

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

    //console.log(this.physics.world);
    this.physicsWorld().addRigidBody( body);

    //console.log(body);

    this.rigidBodies.push({
      mesh:mesh,
      rigid:body,
    })

  }

  removePhysicsBox(){
    let removeBodies = [];
    for (const entity of this.rigidBodies){
      console.log(entity);

      if(entity.mesh.userData?.objectType=='cube'){
        this.scene.remove(entity.mesh);
        this.physics.world.removeRigidBody(entity.rigid);
        removeBodies.push(entity);
        //break;
      }
    }

    for(let i = 0; i < removeBodies.length;i++){
      let index = this.rigidBodies.indexOf(removeBodies[i]);
      if(index > -1){
        this.rigidBodies.splice(index, 1);
      }
    }
  }

  updatePhysicsObjects(){
    const tmpTrans = this.tmpTrans;
    //console.log(tmpTrans);
    for(const _entity of this.rigidBodies){
      if((_entity?.mesh !=null)&&(_entity?.rigid !=null)){
        //console.log(_entity.rigid)
        let ms = _entity.rigid.getMotionState();
        //console.log(ms);
        ms.getWorldTransform( tmpTrans );
        //console.log(p);
        if ( ms ) {
          let p = tmpTrans.getOrigin();
          let q = tmpTrans.getRotation();
          //console.log("x: ",p.x()," y: ", p.y(), " z:", p.z());
          //console.log("x: ",q.x()," y: ", q.y(), " z:", q.z(), " w: ", q.w());
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
    if(this.physics){
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
        this.physics.world.removeRigidBody(entity.rigid);
        //break;
      }
    }
  }

  debugInfo(){
    console.log("Physics: ", this.physicsAPI())
  }

  setupGUI(){
    const gui = new GUI()
    this.gui = gui;
    const self = this;
    gui.add(this, 'debugInfo');
    const physicsFolder = gui.addFolder('Physics')
    const physicsGravityFolder = physicsFolder.addFolder('Gravity')
    physicsGravityFolder.add(this.physics.gravity,'x').onChange( value => {
      let gravity = self.physics.gravity;
      gravity.x = value;
      let bgravity = new self.physics.Ammo.btVector3(gravity.x, gravity.y, gravity.z);
      self.physics.world.setGravity(bgravity)
    })
    physicsGravityFolder.add(this.physics.gravity,'y').onChange( value => {
      let gravity = self.physics.gravity;
      gravity.y = value;
      let bgravity = new self.physics.Ammo.btVector3(gravity.x, gravity.y, gravity.z);
      self.physics.world.setGravity(bgravity)
    })
    physicsGravityFolder.add(this.physics.gravity,'z').onChange( value => {
      let gravity = self.physics.gravity;
      gravity.z = value;
      let bgravity = new self.physics.Ammo.btVector3(gravity.x, gravity.y, gravity.z);
      self.physics.world.setGravity(bgravity)
    })

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
  
}

const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});

  function init(){
    engine.val = new ThreeAmmoTest({
      canvas:renderEL,
      resize:'window',
      isPhysics:true,
      physicsType:'ammo',
    });
    //console.log(engine.val);//
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,ThreeEL())