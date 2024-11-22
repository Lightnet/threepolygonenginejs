/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";

import CorePolygon from "./corepolygon.js";

class SampleCube extends CorePolygon{
  // debugObject={
  //   createCube:'test'
  // };
  debugObject={};
  currentEntityId=0;
  controller_entities=null;
  ground=null;

  constructor(args){
    super(args);
    //console.log(this.debugObject);
    this.debugObject.createCube='test';
  }

  async setup(){
    //need to load variable else there will be null var not set up yet.
    //await new Promise(resolve => setTimeout(resolve, 1000));
    //super();
    super.setup();
    await new Promise(resolve => setTimeout(resolve, 1));//need to load var from this class.
    console.log("example setup init ...");
    this.ECS.addSystem(this.world, this.rotateSystem.bind(this));
    console.log(this.debugObject);
    this.createGUI();
    const ECS = this.ECS;
    ECS.addSystem(this.world, this.physicsSystem.bind(this));
    ECS.addSystem(this.world, this.physicsCubeSystem.bind(this));
    ECS.addSystem(this.world, this.physicsUpdateSystem.bind(this))// update position and rotation
  }

  setupECS(){
    super.setupECS();
    const ECS = this.ECS;
    //physics error need order build setup
  }

  //physics update mesh with position and rotation
  physicsUpdateSystem(world) {
    //const scene = this.scene;
    //const physics = this.physics.world;
    const ECS = this.ECS;
    const tmpTrans = this.physics.tmpTrans;
    console.log("this.physics.tmpTrans: ", tmpTrans);

    const onUpdate = function (dt) {
      for (const entity of ECS.getEntities(world, ['mesh', 'rigid'])) {
        if((entity?.mesh !=null)&&(entity?.rigid !=null)){
          let objThree = entity.mesh;
          let objAmmo = entity.rigid;
          let ms = objAmmo.getMotionState();
          if ( ms ) {
            ms.getWorldTransform( tmpTrans );
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            objThree.position.set( p.x(), p.y(), p.z() );
            objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
          }
          //entity.mesh.position.copy(entity.rigid.translation())
          //entity.mesh.quaternion.copy(entity.rigid.rotation())
        }
      }
    }
    return { onUpdate }
  }

  physicsSystem(world) {
    const scene = this.scene;
    const physics = this.physics.world;
    const ECS = this.ECS;
    // data structure to store all entities that were added or removed last frame
    const result = {
      count: 0,
      entries: new Array(100)
    }
    const PHYSICSABLE_FILTER = this.PHYSICSABLE_FILTER;
    console.log("PHYSICSABLE_FILTER: ",PHYSICSABLE_FILTER)
  
    const onUpdate = function (dt) {
  
      ECS.getEntities(world, PHYSICSABLE_FILTER, 'added', result);
      for (let i=0; i < result.count; i++){
        console.log("physicsSystem add")
        console.log('[physicsSystem] added new entity:', result.entries[i])
        for (let i=0; i < result.count; i++){
          console.log('added new entity:', result.entries[i])
          //console.log(result.entries[i])
          scene.add(result.entries[i].mesh);
        }
      }
  
      ECS.getEntities(world, PHYSICSABLE_FILTER, 'removed', result);
      for (let i=0; i < result.count; i++){
        console.log('removed entity:', result.entries[i])
        //scene.remove(result.entries[i].mesh);
        
        if(result.entries[i]?.rigid){
          physics.removeRigidBody(result.entries[i].rigid);
        }
        if(result.entries[i]?.mesh){
          scene.remove(result.entries[i].mesh);
        }
      }
    }
    return { onUpdate }
  }

  physicsCubeSystem(world) {
    const scene = this.scene;
    const physics = this.physics.world;
    const ECS = this.ECS;
    // data structure to store all entities that were added or removed last frame
    const result = {
      count: 0,
      entries: new Array(100)
    }
    // const PHYSICSABLE_FILTER = this.PHYSICSABLE_FILTER;
    // console.log("PHYSICSABLE_FILTER: ",PHYSICSABLE_FILTER)
  
    const onUpdate = function (dt) {
  
      // ECS.getEntities(world, PHYSICSABLE_FILTER, 'added', result);
      // for (let i=0; i < result.count; i++){
      //   console.log("physicsSystem add")
      //   console.log('[physicsSystem] added new entity:', result.entries[i])
      //   for (let i=0; i < result.count; i++){
      //     console.log('added new entity:', result.entries[i])
      //     //console.log(result.entries[i])
      //     scene.add(result.entries[i].mesh);
      //   }
      // }
  
      ECS.getEntities(world, ['rigidcube'], 'removed', result);
      for (let i=0; i < result.count; i++){
        console.log('removed entity:', result.entries[i])
        //scene.remove(result.entries[i].mesh);
        
        if(result.entries[i]?.rigid){
          physics.removeRigidBody(result.entries[i].rigid);
        }
        if(result.entries[i]?.mesh){
          scene.remove(result.entries[i].mesh);
        }
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
    ECS.addComponent(this.world, CUBE, 'rotation', { x: 0, y: 0,z:0 });
  }

  debugLogs(){
    console.log(this.debugObject);
  }
  //=============================================
  // TEST MESH
  //=============================================
  createTestChains(){
    const ECS = this.ECS;
    console.log("CREATE CUBE CHAINS");
    let mesh = this.createMeshCube();
    let _CUBE = this.createEntity();
    _CUBE.addComponent('mesh', mesh);
    _CUBE.addComponentToEntity('renderable');
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
    const world = this.world;
    const ECS = this.ECS;
    let entityIds = [];
    for (const entity of ECS.getEntities(world, [ 'renderable' ])){
      const entity_id = ECS.getEntityId(world, entity)
      console.log(entity_id);
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
    const entity = ECS.getEntityById(world, this.currentEntityId);
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

    let pos = {x: x, y: y, z: z};
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
    let transform = new this.physics.Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new this.physics.Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new this.physics.Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new this.physics.Ammo.btDefaultMotionState( transform );
    //shape

    let blockColShape = new Ammo.btBoxShape( new this.physics.Ammo.btVector3( width * 0.5, height * 0.5, depth * 0.5 ) );
    blockColShape.setMargin( 0.05 );

    let localInertia = new this.physics.Ammo.btVector3( 0, 0, 0 );
    blockColShape.calculateLocalInertia( mass, localInertia );
    //info
    let rbInfo = new this.physics.Ammo.btRigidBodyConstructionInfo( mass, motionState, blockColShape, localInertia );
    let body = new this.physics.Ammo.btRigidBody( rbInfo );
    this.physics.world.addRigidBody( body);
    //physicsWorld.addRigidBody( body, colGroupGreenBall, colGroupRedBall);
    //console.log(physicsWorld);

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

      console.log("GROUND BODY: ",body);
      this.physics.world.addRigidBody( body );
      _CUBE.addComponent('rigid', body);
      _CUBE.addComponentToEntity('rigidground');

      _CUBE.cleanUp();//clean up since temp build
      _CUBE = null;
    }

  }

  removePhysicsGround(){
    this.ECS.removeEntities(this.world, ['rigidground']);
    this.ground = null;
  }
  removePhysicsCubes(){
    this.ECS.removeEntities(this.world, ['rigidcube']);
  }

  createGUI(){
    const gui = this.gui;
    const debugObject = this.debugObject;
    console.log(debugObject)
    gui.add(this,'debugLogs').name('Test Func Logs')
    gui.add(this,'checkPhysics').name('Check Physics')
    const debugFolder = gui.addFolder('Debug')

    const entityFolder = gui.addFolder('Entity')
    entityFolder.add(this,'createTestChains').name('Create Box Entity Chains')
    entityFolder.add(this,'createCube').name('Add Entity Box')
    entityFolder.add(this,'removeCubes').name('Remove Entity Boxes')
    entityFolder.add(this,'getEntitiesList').name('Get entities Boxes')
    entityFolder.add(this,'currentEntityId').listen();
    entityFolder.add(this,'deleteSelectEntityId').name('Delete ID')
    this.entityFolder = entityFolder;
    //console.log(this.currentEntityId);
    const physicsFolder = gui.addFolder('Physics');
    physicsFolder.add(this,'createPhysicsCube').name('Create Cube')
    physicsFolder.add(this,'removePhysicsCubes').name('Remove Cube')

    const groundFolder = gui.addFolder('Ground');
    groundFolder.add(this,'addPhysicsGround').name('Add')
    groundFolder.add(this,'removePhysicsGround').name('Remove')
    const groundPosFolder = groundFolder.addFolder('Position')
    const groundRotFolder = groundFolder.addFolder('Rotation')

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
  isPhysics:true,
  //physicsType:"none",
  physicsType:"ammo",
});
//console.log(threejsSample);
van.add(document.body, threejsSample.domElement );

