/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  rapier physics test.
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
    //physics error need order build setup
    this.addSystem(this.rendererSystem.bind(this));// add and remove object3d from the scene

    this.addSystem(this.physicsSystem.bind(this));//handle remove phyisics
    this.addSystem(this.physicsUpdateSystem.bind(this));
  }

  createMeshCube(args){
    args = args || {};
    const width = args?.width || 1;
    const height = args?.height || 1;
    const depth = args?.depth || 1;
    const color = args?.color || 0x00ff00;
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const material = new THREE.MeshBasicMaterial( { color: color } );
    let cube = new THREE.Mesh( geometry, material );
    return cube;
  }

  // https://github.com/mreinstein/ecs
  rendererSystem (world) {
    const RENDERABLE_FILTER = this.RENDERABLE_FILTER;
    const ECS = this.ECS;
    const scene = this.scene;
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

  physicsSystem (world) {
    // data structure to store all entities that were added or removed last frame
    const ECS = this.ECS;
    const scene = this.scene;
    const physics = this.physics.world;
    const PHYSICSABLE_FILTER = this.PHYSICSABLE_FILTER;
    const result = {
      count: 0,
      entries: new Array(100)
    }
  
    const onUpdate = function (dt) {
  
      ECS.getEntities(world, PHYSICSABLE_FILTER, 'added', result);
      for (let i=0; i < result.count; i++){
        console.log("physicsSystem add")
        console.log('[physicsSystem] added new entity:', result.entries[i])
        // if((result.entries[i]?.mesh !=null)&&(result.entries[i]?.rigid !=null)){
        //   result.entries[i].mesh.position.copy(result.entries[i].rigid.translation())
        //   result.entries[i].mesh.quaternion.copy(result.entries[i].rigid.rotation())
        // }
        //console.log(result.entries[i])
        //scene.add(result.entries[i].mesh);
      }
  
      ECS.getEntities(world, PHYSICSABLE_FILTER, 'removed', result);
      for (let i=0; i < result.count; i++){
        //console.log('removed entity:', result.entries[i])
        //scene.remove(result.entries[i].mesh);
        
        if(result.entries[i]?.rigid){
          physics.removeRigidBody(result.entries[i].rigid);
        }
        if(result.entries[i]?.collider){
          physics.removeCollider(result.entries[i].collider);
        }
        if(result.entries[i]?.mesh){
          scene.remove(result.entries[i].mesh);
        }
      }
    }
    return { onUpdate }
  }

  //physics update mesh with position and rotation
  physicsUpdateSystem(world) {
    const ECS = this.ECS;
    const onUpdate = function (dt) {
      //console.log('physicsUpdateSystem test');
      for (const entity of ECS.getEntities(world, ['mesh', 'rigid'])) {
        if((entity?.mesh !=null)&&(entity?.rigid !=null)){
          entity.mesh.position.copy(entity.rigid.translation())
          entity.mesh.quaternion.copy(entity.rigid.rotation())
        }
      }
    }
    return { onUpdate }
  }

  debugLogs(){
    console.log(this.debugObject);
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
    const world = this.world;
    const ECS = this.ECS;
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
    const RAPIER = this.physicsAPI;
    const world = this.physics.world;
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(x, y, x);
    let rigidBody = world.createRigidBody(rigidBodyDesc);

    //let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    let colliderDesc = RAPIER.ColliderDesc.cuboid(width/2, height/2, depth/2);
    let collider = world.createCollider(colliderDesc, rigidBody);

    let _CUBE = this.createEntity();
    _CUBE.addComponent('mesh', mesh);
    _CUBE.addComponentToEntity('renderable');

    _CUBE.addComponent('rigid', rigidBody);
    _CUBE.addComponent('colliderDesc', colliderDesc);
    _CUBE.addComponent('collider', collider);
    _CUBE.addComponentToEntity('rigidcube');

    _CUBE.cleanUp();//clean up since temp build
    _CUBE = null;
    //console.log("CUBE:", _CUBE);
  }

  removePhysicsGround(){
    this.removeEntities(['rigidground']);
    this.ground = null;
  }
  removePhysicsCubes(){
    this.removeEntities(['rigidcube']);
  }

  addPhysicsGround(){
    console.log("addPhysicsGround");

    let groundColliderDesc = this.physicsAPI.ColliderDesc
      .cuboid(10.0, 0.1, 10.0)
      .setTranslation(0.0, -1.0, 0.0);
    let body = this.physics.world.createCollider(groundColliderDesc);
    //let mesh = createCube({width:20,height:0.2,depth:20,color:0x00fff0});
    let mesh = this.createMeshCube({width:20,height:0.2,depth:20,color:'gray'});
    console.log(mesh);
    //mesh.position.set(0,-1,0);
    //scene.add(mesh);
    this.ground = mesh;
    this.rigidGround = body;
    console.log(body);


    console.log("CREATE CUBE");
    let CUBE = this.createEntity();
    CUBE.addComponent('mesh', mesh);
    CUBE.addComponentToEntity('renderable');
    CUBE.addComponentToEntity(CUBE, 'cube');
    //CUBE.addComponent('rotation', { x: 0, y: 0,z:0 });
    CUBE.addComponent('rigid', body);
    CUBE.addComponentToEntity('rigidground');
    CUBE.cleanUp();
    CUBE = null;

  }

  removePhysicsGround(){
    this.removeEntities(['rigidground']);
    this.ground = null;
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
  physicsType:"rapier",
});
//console.log(threejsSample);
van.add(document.body, threejsSample.domElement );