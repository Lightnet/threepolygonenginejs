/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  jolt physics test.
*/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';

import CorePolygon from "./corepolygon.js";
// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-33.php
function degrees_to_radians(degrees)
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi/180);
}

class SampleCube extends CorePolygon{
  debugObject={};
  currentEntityId=0;
  controller_entities=null;
  ground=null;
  rigidGround=null;
  groundPos={x:0,y:0,z:0};
  groundRot={x:0,y:0,z:0,w:1};

  constructor(args){
    super(args);
    //console.log(this.debugObject);
    this.debugObject.createCube='test';
  }

  async setup(){
    super.setup();
    await new Promise(resolve => setTimeout(resolve, 1));//need to load var from this class.
    this.createGUI();
  }

  setupECS(){
    super.setupECS();
    const ECS = this.ECS;
    
    this.addSystem(this.rendererSystem.bind(this));// add and remove object3d from the scene
    this.addSystem(this.physicsUpdateSystem.bind(this));
    this.addSystem(this.physicsSystemECS.bind(this));
  }

  debugLogs(){
    console.log(this.debugObject);
  }

  // https://github.com/mreinstein/ecs
  rendererSystem (world) {
    const RENDERABLE_FILTER = this.RENDERABLE_FILTER;
    const ECS = this.ECS;
    const scene = this.scene;

    const wrapVec3 = this.physics.wrapVec3;
    const wrapQuat = this.physics.wrapQuat;
    // data structure to store all entities that were added or removed last frame
    const result = {
      count: 0,
      entries: new Array(100)
    }
    const onUpdate = function (dt) {
      // optional 3rd parameter, can be 'added' or 'removed'. populates the list of entities that were
      // added since the last ECS.cleanup(...) call
      ECS.getEntities(world, RENDERABLE_FILTER, 'added', result);
      for (let i=0; i < result.count; i++){
        //console.log('added new entity:', result.entries[i])
        //console.log(result.entries[i])
        scene.add(result.entries[i].mesh);
      }

      ECS.getEntities(world, RENDERABLE_FILTER, 'removed', result);
      for (let i=0; i < result.count; i++){
        //console.log('removed entity:', result.entries[i])
        scene.remove(result.entries[i].mesh);
      }
    }

    return { onUpdate }
  }

  //===============================================
  // ECS PHYSICS UPDATE SYSTEM 
  //===============================================
  physicsUpdateSystem(world) {
    const ECS = this.ECS;

    const wrapVec3 = this.physics.wrapVec3;
    const wrapQuat = this.physics.wrapQuat;
    const onUpdate = function (dt) {
      for (const entity of ECS.getEntities(world, ['mesh', 'rigid'])) {
        //console.log(entity);
        if((entity?.mesh !=null)&&(entity?.rigid !=null)){
          
          //wrapVec3 helper
          //wrapQuat helper
          entity.mesh.position.copy(wrapVec3(entity.rigid.GetPosition()));
  	      entity.mesh.quaternion.copy(wrapQuat(entity.rigid.GetRotation()));

          //let pos = entity.rigid.GetPosition();
          //console.log("X: ",pos.GetX()," Y:",pos.GetY()," :", pos.GetZ())
          // entity.mesh.position.set(
          //   pos.GetX(),
          //   pos.GetY(),
          //   pos.GetZ()
          // );
          // let rot = entity.rigid.GetPosition();
          //entity.mesh.position.copy(entity.rigid.translation())
          //entity.mesh.quaternion.copy(entity.rigid.rotation())
        }
      }
    }
    return { onUpdate }
  }

  physicsSystemECS(world) {
    const ECS = this.ECS;
    const scene = this.scene;
    const PHYSICSABLE_FILTER = this.PHYSICSABLE_FILTER;
    const bodyInterface = this.physics.bodyInterface;
    // data structure to store all entities that were added or removed last frame
    const result = {
      count: 0,
      entries: new Array(100)
    }
  
    const onUpdate = function (dt) {
  
      ECS.getEntities(world, PHYSICSABLE_FILTER, 'added', result);
      for (let i=0; i < result.count; i++){
        //console.log("physicsSystem add");
        //console.log('[physicsSystem] added new entity:', result.entries[i]);
      }
  
      ECS.getEntities(world, PHYSICSABLE_FILTER, 'removed', result);
      for (let i=0; i < result.count; i++){
        //console.log('removed entity:', result.entries[i])
        //scene.remove(result.entries[i].mesh);
        console.log("Physics remove???");
        
        if(result.entries[i]?.rigid){
          let body = result.entries[i].rigid;
          bodyInterface.RemoveBody(body.GetID())
          bodyInterface.DestroyBody(body.GetID())
        }
        if(result.entries[i]?.mesh){
          scene.remove(result.entries[i].mesh);
        }
      }
    }
    return { onUpdate }
  }

  createPhysicsCube(args={}){

    const width = args?.width || 2;
    const height = args?.height || 2;
    const depth = args?.depth || 2;
    const color = args?.color || 0x00ffff;
    let mass = 1;

    const x = args?.x || 0;
    const y = args?.y || 5;
    const z = args?.z || 0;

    let quat = {x: 0, y: 0, z: 0, w: 1};

    console.log("test rigid cube")
    //const ECS = this.ECS;
    console.log("CREATE CUBE CHAINS");
    //mesh cube
    let mesh = this.createMeshCube({
      width:width,
      height:height,
      depth:depth,
    });
    //physics cube
    const Jolt = this.physics.Jolt;
    const bodyInterface = this.physics.bodyInterface;
    const LAYER_MOVING = this.physics.LAYER_MOVING;
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
  	let body = bodyInterface.CreateBody(creationSettings);
  	Jolt.destroy(creationSettings); // 'creationSettings' no longer needed, all settings and the shape reference went to 'body'

  	// Add the body
  	bodyInterface.AddBody(body.GetID(), Jolt.EActivation_Activate);
    

    let _CUBE = this.createEntity();
    _CUBE.addComponent('mesh', mesh);
    _CUBE.addComponentToEntity('renderable');

    _CUBE.addComponent('rigid', body);
    _CUBE.addComponentToEntity('rigid');
    _CUBE.addComponentToEntity('rigidcube');

    _CUBE.cleanUp();//clean up since temp build
    _CUBE = null;
    //console.log("CUBE:", _CUBE);
  }

  removeCubes(){
    console.log("test remove")
    this.removeEntities(['cube']);
  }

  checkPhysics(){
    console.log("physics: ", this.physics);
    console.log("physicsType: ", this.physicsType);
  }

  getEntitiesList(){
    //const world = this.world;
    //const ECS = this.ECS;
    let entityIds = [];
    for (const entity of this.getEntities([ 'renderable' ])){
      const entity_id = this.getEntityId( entity)
      console.log("entity_id: ",entity_id);
      entityIds.push(entity_id); 
    }
    let controller_entities = this.controller_entities;
    const entityFolder = this.entityFolder;

    if(controller_entities){// if exist delete gui since they need to update html docs list
      controller_entities.destroy()//delete ui
      controller_entities = entityFolder.add(this, 'currentEntityId', entityIds);
    }else{
      //create ui
      controller_entities = entityFolder.add(this, 'currentEntityId', entityIds);
    }
    this.controller_entities = controller_entities
  }

  deleteSelectEntityId(){
    const world = this.world;
    const ECS = this.ECS;
    console.log("this.entity_id: ", this.currentEntityId)
    const entity = this.getEntityById(this.currentEntityId);
    const deferredRemoval = false  // by default this is true. setting it to false immediately removes the component
    ECS.removeEntity(world, entity, deferredRemoval)
  }

  removePhysicsGround(){
    this.removeEntities(['rigidground']);
    this.ground = null;
  }

  removePhysicsCubes(){
    this.removeEntities(['rigidcube']);
  }

  addPhysicsGround(args={}){
    console.log("ground...")
    const width = args?.width || 20;
    const height = args?.height || 1;
    const depth = args?.depth || 20;
    const color = args?.color || 0x00ffff;
    let mass = 1;

    const x = args?.x || 0;
    const y = args?.y || 0;
    const z = args?.z || 0;
    let quat = {x: 0, y: 0, z: 0, w: 1};
    // CREATE MESH
    let mesh = this.createMeshCube({
      width:width,
      height:height,
      depth:depth,
      color:'gray'
    });
    const Jolt = this.physics.Jolt;
    const LAYER_NON_MOVING = this.physics.LAYER_NON_MOVING;
    const bodyInterface = this.physics.bodyInterface;
    // CREATE RIGID BODY
    var shape = new Jolt.BoxShape(new Jolt.Vec3(width*0.5, height*0.5, depth*0.5), 0.05, null);
	  var creationSettings = new Jolt.BodyCreationSettings(shape, new Jolt.RVec3(0, 0, 0), new Jolt.Quat(0, 0, 0, 1), Jolt.EMotionType_Static, LAYER_NON_MOVING);
	  let body = bodyInterface.CreateBody(creationSettings);
    console.log(body);
	  Jolt.destroy(creationSettings);

    bodyInterface.AddBody(body.GetID(), Jolt.EActivation_Activate);


    // ECS
    let _CUBE = this.createEntity();
    _CUBE.addComponent('mesh', mesh);
    _CUBE.addComponentToEntity('renderable');

    _CUBE.addComponent('rigid', body);
    _CUBE.addComponentToEntity('rigid');
    _CUBE.addComponentToEntity('rigidground');

    _CUBE.cleanUp();//clean up since temp build
    _CUBE = null;
  }

  removePhysicsGround(){
    this.removeEntities(['rigidground']);
  }

  createGUI(){
    const gui = this.gui;
    const debugObject = this.debugObject;
    console.log(debugObject)
    gui.add(this,'debugLogs').name('Test Func Logs')
    gui.add(this,'checkPhysics').name('Check Physics')
    const debugFolder = gui.addFolder('Debug')

    const entityFolder = gui.addFolder('Entity')
    // entityFolder.add(this,'createTestChains').name('Create Box Entity Chains')
    // entityFolder.add(this,'createCube').name('Add Entity Box')
    // entityFolder.add(this,'removeCubes').name('Remove Entity Boxes')
    // entityFolder.add(this,'getEntitiesList').name('Get entities Boxes')
    // entityFolder.add(this,'currentEntityId').listen();
    // entityFolder.add(this,'deleteSelectEntityId').name('Delete ID')
    // this.entityFolder = entityFolder;
    // //console.log(this.currentEntityId);
    const physicsFolder = gui.addFolder('Physics');
    physicsFolder.add(this,'createPhysicsCube').name('Create Cube')
    physicsFolder.add(this,'removePhysicsCubes').name('Remove Cube')

    const groundFolder = gui.addFolder('Ground');
    groundFolder.add(this,'addPhysicsGround').name('Add')
    groundFolder.add(this,'removePhysicsGround').name('Remove')
    // const groundPosFolder = groundFolder.addFolder('Position')
    // groundPosFolder.add(this.groundPos, 'x')
    // groundPosFolder.add(this.groundPos, 'y')
    // groundPosFolder.add(this.groundPos, 'z')
    // const groundRotFolder = groundFolder.addFolder('Rotation')
    // var self = this;
    // var transformAux1 =  new this.physics.API.btTransform();

    // groundRotFolder.add(this.groundRot, 'x',-180,180).onChange( value => {
    // })
    // groundRotFolder.add(this.groundRot, 'y',-180,180).onChange( value => {
    // })
    // groundRotFolder.add(this.groundRot, 'z',-180,180).onChange( value => {
    // })
  }

}

const threejsSample = new SampleCube({
  //isPhysics:false,
  isPhysics:true,
  //physicsType:"none",
  physicsType:"jolt",
});
//console.log(threejsSample);
van.add(document.body, threejsSample.domElement );