/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  no physics test.
*/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";

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
  // debugObject={
  //   createCube:'test'
  // };
  debugObject={};
  currentEntityId=0;
  controller_entities=null;

  constructor(args){
    super(args);
    //console.log(this.debugObject);
    this.debugObject.createCube='test';
  }

  async setup(){
    //need to load variable else there will be null var not set up yet.
    //await new Promise(resolve => setTimeout(resolve, 1000));
    super.setup();
    await new Promise(resolve => setTimeout(resolve, 1));//need to load var from this class.
    //console.log("example setup init ...");
    //this.ECS.addSystem(this.world, this.rotateSystem.bind(this));
    this.addSystem(this.rotateSystem.bind(this));
    //console.log(this.debugObject);
    this.createGUI();
  }

  setupECS(){
    super.setupECS();
    this.addSystem(this.rendererSystem.bind(this));// add and remove object3d from the scene
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

  createCubeTest(){
    //Assign Entity Component System
    const ECS = this.ECS;
    console.log(ECS);
    let mesh = this.createMeshCube();
    const CUBE = ECS.addEntity(this.world)
    ECS.addComponent(this.world, CUBE, 'mesh', mesh);
    ECS.addComponentToEntity(this.world, CUBE, 'renderable');
    ECS.addComponentToEntity(this.world, CUBE, 'cube');
    ECS.addComponent(this.world, CUBE, 'rotation', { x: 0, y: 0,z:0 });
  }

  debugLogs(){
    console.log(this.debugObject);
  }
  //=============================================
  // TEST MESH
  //=============================================
  createCubeChains(){
    const ECS = this.ECS;
    console.log("CREATE CUBE CHAINS");
    let mesh = this.createMeshCube();
    let _CUBE = this.createEntity();
    _CUBE.addComponent('mesh', mesh);
    _CUBE.addComponentToEntity('renderable');
    _CUBE.addComponentToEntity('cube');
    _CUBE.addComponent('rotation', { x: 0, y: 0,z:0 });
    _CUBE.cleanUp();
    _CUBE = null;
    //console.log("CUBE:", _CUBE);
  }

  createCube(){
    const ECS = this.ECS;
    console.log("CREATE CUBE");
    let mesh = this.createMeshCube();
    const CUBE = ECS.addEntity(this.world);
    ECS.addComponent(this.world, CUBE, 'mesh', mesh);
    ECS.addComponentToEntity(this.world, CUBE, 'renderable');
    ECS.addComponentToEntity(this.world, CUBE, 'cube');
    ECS.addComponent(this.world, CUBE, 'rotation', { x: 0, y: 0,z:0 });
  }

  removeCubes(){
    console.log("test remove")
    this.ECS.removeEntities(this.world, ['cube']);
  }

  checkPhysics(){
    console.log("physics: ", this.physics);
    console.log("physicsType: ", this.physicsType);
  }

  getEntitiesList(){
    // const world = this.world;
    // const ECS = this.ECS;
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
  //=============================================
  // TEST RIGID CUBE
  //=============================================
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
    const ECS = this.ECS;
    console.log("CREATE CUBE CHAINS");
    let mesh = this.createMeshCube({
      width:width,
      height:height,
      depth:depth,
    });
    let _CUBE = this.createEntity();
    _CUBE.addComponent('mesh', mesh);
    _CUBE.addComponentToEntity('renderable');

    //Ammojs Section
    // let transform = new this.physics.Ammo.btTransform();
    // transform.setIdentity();
    // transform.setOrigin( new this.physics.Ammo.btVector3( pos.x, pos.y, pos.z ) );
    // transform.setRotation( new this.physics.Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    // let motionState = new this.physics.Ammo.btDefaultMotionState( transform );
    // //shape

    // let blockColShape = new Ammo.btBoxShape( new this.physics.Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
    // blockColShape.setMargin( 0.05 );

    // let localInertia = new this.physics.Ammo.btVector3( 0, 0, 0 );
    // blockColShape.calculateLocalInertia( mass, localInertia );
    // //info
    // let rbInfo = new this.physics.Ammo.btRigidBodyConstructionInfo( mass, motionState, blockColShape, localInertia );
    // let body = new this.physics.Ammo.btRigidBody( rbInfo );
    // this.physics.world.addRigidBody( body);
    // //physicsWorld.addRigidBody( body, colGroupGreenBall, colGroupRedBall);
    let body = this.physics.createBoxShape({
      width:width,
      height:height,
      depth:depth,
      x:x,
      y:y,
      z:z,
    })


    _CUBE.addComponent('rigid', body);
    _CUBE.addComponentToEntity('rigidcube');

    //this.physics

    _CUBE.cleanUp();//clean up since temp build
    _CUBE = null;
    //console.log("CUBE:", _CUBE);
  }

  addPhysicsGround(){
    if(!this.ground){
      let pos = {x: 0, y: 0, z: 0};
      let quat = {x: 0, y: 0, z: 0, w: 1};
      let width = 10;
      let height = 1;
      let depth = 10;
      let mass = 0;

      console.log("test rigid cube")
      const ECS = this.ECS;
      console.log("CREATE CUBE CHAINS");
      let mesh = this.createMeshCube({
        width:width,
        height:height,
        depth:depth,
        color:'gray'
      });
      this.ground = mesh;
      let _CUBE = this.createEntity();
      _CUBE.addComponent('mesh', mesh);
      _CUBE.addComponentToEntity('renderable');

      _CUBE.addComponentToEntity('rigidground');

      //this.physics
      //Ammojs Section
      let transform = new this.physics.Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin( new this.physics.Ammo.btVector3( pos.x, pos.y, pos.z ) );
      transform.setRotation( new this.physics.Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
      let motionState = new this.physics.Ammo.btDefaultMotionState( transform );

      let colShape = new this.physics.Ammo.btBoxShape( new this.physics.Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
      colShape.setMargin( 0.05 );

      let localInertia = new this.physics.Ammo.btVector3( 0, 0, 0 );
      colShape.calculateLocalInertia( mass, localInertia );

      let rbInfo = new this.physics.Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
      let body = new this.physics.Ammo.btRigidBody( rbInfo );
      this.rigidGround = body

      console.log("GROUND BODY: ",body);
      this.physics.world.addRigidBody( body );
      _CUBE.addComponent('rigid', body);
      _CUBE.addComponentToEntity('rigidground');

      _CUBE.cleanUp();//clean up since temp build
      _CUBE = null;
    }

  }

  createGUI(){
    const gui = this.gui;
    gui.add(this,'debugLogs').name('Test Func Logs')
    gui.add(this,'checkPhysics').name('Check Physics')
    const debugFolder = gui.addFolder('Debug')

    const entityFolder = gui.addFolder('Entity')
    entityFolder.add(this,'createCubeChains').name('Create Box Entity Chains')
    entityFolder.add(this,'createCube').name('Add Entity Box')
    entityFolder.add(this,'removeCubes').name('Remove Entity Boxes')
    entityFolder.add(this,'getEntitiesList').name('Get entities Boxes')
    entityFolder.add(this,'currentEntityId').listen();
    entityFolder.add(this,'deleteSelectEntityId').name('Delete ID')
    this.entityFolder = entityFolder;
    //console.log(this.currentEntityId);

  }

  rotateSystem(world){
    const ECS = this.ECS;
    const onUpdate = function (dt) {
      for (const entity of ECS.getEntities(world, [ 'rotation','mesh'])) {
        //if(entity.isRotate){
          entity.rotation.x += 0.01;
          entity.rotation.y += 0.01;
          entity.mesh.rotation.x = entity.rotation.x % Math.PI;
          entity.mesh.rotation.y = entity.rotation.y % Math.PI;
          //console.log(entity.mesh.rotation.x);
        //}
      }
    }
    return {onUpdate}
  }
}

const threejsSample = new SampleCube({
  //isPhysics:false,
  //isPhysics:true,
  //physicsType:"none",
  //physicsType:"ammo",
});
//console.log(threejsSample);
van.add(document.body, threejsSample.domElement );