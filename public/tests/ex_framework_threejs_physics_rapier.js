/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Information:
    testing rapier physics sample cube and ground

    Testing three and rapier stand alone.
*/

// https://gist.github.com/BlueMagnificent/6ef76c65839a3d952228ba2f99d9b1e7
// https://rapier.rs/docs/user_guides/javascript/rigid_bodies/

//import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
//import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import { 
  THREE, 
  van, 
  RAPIER,
  GUI,
} from '/dps.js';
import {TriFrameWork} from '../triengine/tri_framework.js';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const {canvas, div} = van.tags;

class ThreeRapierTest extends TriFrameWork{

  clock=null;
  mesh = null;
  rigidBodies = [];
  
  constructor(args){
    super(args);
    //console.log("rapier test init...");
    this.clock = new THREE.Clock();
  }

  async setup(){
    super.setup()
    console.log("setup three rapier...");
    //await sleep(1000);
    //await this.setup_physics();
    console.log("this.physics: ",this.physics);
    this.setupScene();
    //this.createPhysicsGround();
    //this.createPhysicsObject();
    this.setupGUI();
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

  setupScene(){
    this.createLight();

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    this.mesh = cube;
    //this.scene.add( cube );
    //console.log(this.mesh);

    this.camera.position.set(0,0,50);
    //this.camera.position.z
  }

  // https://rapier.rs/docs/user_guides/javascript/getting_started_js
  async setup_physics(){
    //console.log("physics")
    await RAPIER.init();
    //console.log(RAPIER);
    // Use the RAPIER module here.
    let gravity = { x: 0.0, y: -9.81, z: 0.0 };
    let world = new RAPIER.World(gravity);
    //console.log(this.world)
    this.physicsWorld = world;
    //console.log(this.world)
  }

  updatePhysics( deltaTime ){
    if (this.physicsWorld == null){
      return;
    }
    // Step the simulation forward.  
    this.physicsWorld.step();
    
    if(this.rigidBodies){
      for(const _entity of this.rigidBodies){
        let objThree = _entity.mesh;
        let objPhysics = _entity.rigid;
        if(objPhysics){
          let p = objPhysics.translation();
          //console.log(p);
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

  createPhysicsGround(){
    let width = 10;
    let height = 1;
    let depth = 10;
    let pos = {x: 0, y: -1, z: 0};
    let scale = {x: 10, y: 0.1, z: 10};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;
    let color = 'gray';

    //threeJS Section
    let mesh = this.createMeshCube({width:width,height:height,depth:depth,color:color});

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.objectType = 'ground';

    this.scene.add(mesh);
    console.log("this.physics.RAPIER")
    console.log(this.physics.RAPIER)
    //const RAPIER = this.physics.API;
    //console.log(RAPIER);

    // Create the ground
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(width*0.5, height*0.5, depth*0.5);
    //console.log(this.physicsWorld)
    let collider = this.physics.world.createCollider(groundColliderDesc);

    this.rigidBodies.push({
      mesh:mesh,
      //rigid:rigidBody,
      collider:collider,
      //colliderDesc:colliderDesc,
    });
  }

  removePhysicsGround(){
    let removeBodies = [];
    for (const entity of this.rigidBodies){
      console.log(entity);

      if(entity.mesh.userData?.objectType=='ground'){
        this.scene.remove(entity.mesh);
        if(entity?.rigid){
          this.physics.world.removeRigidBody(entity.rigid);
        }
        if(entity?.collider){
          this.physics.world.removeCollider(entity.collider);
        }
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

  createPhysicsBox(){
    console.log("rigid box")
    let width = 2;
    let height = 2;
    let depth = 2;
    let pos = {x: 0, y: 20, z: 0};
    //let pos = {x: 0, y: 0, z: 0};
    let radius = 1;
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;

    let color= 0x00ffff;
    //color=0x444444;

    let mesh = this.createMeshCube({width:width,height:height,depth:depth,color:color});
    mesh.userData.objectType = 'box';
    mesh.position.set(pos.x,pos.y,pos.z);
    this.scene.add(mesh);
    //threeJS Section
    // let ball = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));
    // ball.position.set(pos.x, pos.y, pos.z);
    //ball.castShadow = true;
    //ball.receiveShadow = true;
    //console.log(this.scene);
    //this.scene.add(ball);

    // Create a dynamic rigid-body.
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
     .setTranslation(pos.x, pos.y, pos.z);
    let rigidBody = this.physicsWorld.createRigidBody(rigidBodyDesc);

    // Create a cuboid collider attached to the dynamic rigidBody.
    let colliderDesc = RAPIER.ColliderDesc.cuboid(width * 0.5,height * 0.5,depth * 0.5);
    let collider = this.physicsWorld.createCollider(colliderDesc, rigidBody);
    //console.log(rigidBody);
    //ball.userData.physicsBody = rigidBody;
    //this.rigidBodies.push(ball);
    this.rigidBodies.push({
      mesh:mesh,
      rigid:rigidBody,
      collider:collider,
      colliderDesc:colliderDesc,
    });
  }

  removePhysicsBox(){
    let removeBodies = [];
    for (const entity of this.rigidBodies){
      console.log(entity);

      if(entity.mesh.userData?.objectType=='box'){
        this.scene.remove(entity.mesh);
        if(entity?.rigid){
          this.physics.world.removeRigidBody(entity.rigid);
        }
        if(entity?.collider){
          this.physics.world.removeCollider(entity.collider);
        }
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

  createPlayer(){

  }

  resetPlayer(){

  }

  removePlayer(){

  }

  //=============================================
  //
  //=============================================
  update(){
    super.update();
    //console.log("update???");
    let deltaTime = this.clock.getDelta();
    this.updatePhysics(deltaTime);
  }
}

const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'CanvasThreeJS'});

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new ThreeRapierTest({
      canvas:renderEL,
      isPhysics:true,
      physicsType:'rapier',
    });
    //console.log(engine.val);//
  }

  init();

  return renderEL;
};

van.add(document.body,ThreeEL())