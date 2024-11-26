/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Information:
    vanjs main client entry point

    Testing three and jolt physics.
*/

// https://gist.github.com/BlueMagnificent/6ef76c65839a3d952228ba2f99d9b1e7
// https://rapier.rs/docs/user_guides/javascript/rigid_bodies/

import { 
  THREE, 
  van,
  GUI,
  Stats,
} from '/dps.js';
import {TriFrameWork} from '../triengine/tri_framework.js';

import { LAYER_MOVING } from '../triengine/framework_physics_jolt.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const {canvas, div} = van.tags;

class ThreejsJoltTest extends TriFrameWork{

  clock=null;
  rigidBodies = [];
  
  constructor(args){
    super(args);
    console.log("rapier test init...");
    this.clock = new THREE.Clock();
  }

  async setup(){
    super.setup()
    console.log("Setup Threejs Jolt...");
    //await sleep(1000);
    //await this.setup_physics();
    this.setupScene();
    //this.createPhysicsGround();
    //this.createPhysicsObject();
    //console.log("finish...")
    this.setupGUI();
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

  checkPhysics(){
    console.log("physics: ", this.physics)
  }

  setupGUI(){
    const gui = new GUI()
    this.gui = gui;
    gui.add(this, 'checkPhysics');
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

  //updatePhysics( deltaTime ){
    // if (this.physics == null){
    //   return;
    // }
    // Step the simulation forward.  
    //this.physics.step();

    // if(this.rigidBodies){
    //   for ( let i = 0; i < this.rigidBodies.length; i++ ) {
    //   }
    // }
  //}

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

  createPhysicsBox(args={}){
    //console.log(args);
    let width = args?.width || 2;
    let height = args?.height || 2;
    let depth = args?.depth || 2;

    let x = args?.x || 0;
    let y = args?.y || 0;
    let z = args?.z || 0;

    const mesh = this.createMeshCube({width:width,height:height,depth:height});//threejs mesh
    this.scene.add(mesh);

    const Jolt = this.physicsAPI();
    console.log("Jolt: ", Jolt);

    // Create a box
  	let material = new Jolt.PhysicsMaterial();
  	let size = new Jolt.Vec3(width/2, height/2, depth/2);
  	let box = new Jolt.BoxShapeSettings(size, 0.05, material); // 'material' is now owned by 'box'
  	Jolt.destroy(size);

    // Create a compound
  	let compound = new Jolt.StaticCompoundShapeSettings();
  	let boxPosition = new Jolt.Vec3(0, 0, 0);
  	compound.AddShape(boxPosition, Jolt.Quat.prototype.sIdentity(), box); // 'box' is now owned by 'compound'
  	Jolt.destroy(boxPosition);
  	let shapeResult = compound.Create();
  	let shape = shapeResult.Get();
  	shapeResult.Clear(); // We no longer need the shape result, it keeps a reference to 'shape' (which it will also release the next time you create another shape)
  	shape.AddRef(); // We want to own this shape so we can delete 'compound' which internally keeps a reference
  	Jolt.destroy(compound);

    // Create the body
  	let bodyPosition = new Jolt.RVec3(x, y, z);
  	let bodyRotation = new Jolt.Quat(0, 0, 0, 1);
  	let creationSettings = new Jolt.BodyCreationSettings(shape, bodyPosition, bodyRotation, Jolt.EMotionType_Dynamic, LAYER_MOVING); // 'creationSettings' now holds a reference to 'shape'
  	Jolt.destroy(bodyPosition);
  	Jolt.destroy(bodyRotation);
  	shape.Release(); // We no longer need our own reference to 'shape' because 'creationSettings' now has one
  	let body = this.physics.bodyInterface.CreateBody(creationSettings);
  	Jolt.destroy(creationSettings); // 'creationSettings' no longer needed, all settings and the shape reference went to 'body'

  	// Add the body
  	this.physics.bodyInterface.AddBody(body.GetID(), Jolt.EActivation_Activate);

    this.rigidBodies.push({
      mesh:mesh,
      rigid:body
    });

  }

  removePhysicsBox(){

  }

  createPhysicsGround(){
    let pos = {x: 0, y: -1, z: 0};
    let scale = {x: 10, y: 0.1, z: 10};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    // Create the ground
    let mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.scene.add(mesh);

    // Create the ground

  }

  removePhysicsGround(){

  }

  // SPHERE
  createPhysicsSphere(){
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
    //console.log(this.scene);
    this.scene.add(ball);

    //console.log(rigidBody);
    //ball.userData.physicsBody = rigidBody;
    this.rigidBodies.push(ball);
  }

  createPlayer(){

  }

  resetPlayer(){

  }

  removePlayer(){

  }

  updatePhysics(){

    const wrapVec3 = this.physics.wrapVec3;
    const wrapQuat = this.physics.wrapQuat;

    for (const entity of this.rigidBodies) {
      if((entity?.mesh !=null)&&(entity?.rigid !=null)){
        //wrapVec3 helper
        //wrapQuat helper
        entity.mesh.position.copy(wrapVec3(entity.rigid.GetPosition()));
	      entity.mesh.quaternion.copy(wrapQuat(entity.rigid.GetRotation()));
      }
    }
  }

  update(delta){
    super.update(delta);
    //console.log("update???");
    this.updatePhysics();
    //let deltaTime = this.clock.getDelta();
    //this.updatePhysics(deltaTime);
  }
}

const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'CanvasThreeJS'});

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new ThreejsJoltTest({
      canvas:renderEL,
      isPhysics:true,
      physicsType:'jolt',
    });
    //console.log(engine.val);//
  }

  init();

  return renderEL;
};

van.add(document.body,ThreeEL())