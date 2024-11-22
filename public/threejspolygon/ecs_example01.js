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

  constructor(args){
    super(args);
    //console.log(this.debugObject);
    this.debugObject.createCube='test';
  }

  setupInit(){
    console.log("init ...");
    this.ECS.addSystem(this.world, this.rotateSystem.bind(this));
    console.log(this.debugObject);
    this.createGUI();
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

  createTestChains(){
    const ECS = this.ECS;
    console.log("CREATE CUBE CHAINS");
    let mesh = this.createMeshCube();
    let _CUBE = this.createEntity();
    _CUBE.addComponent('mesh', mesh);
    _CUBE.addComponentToEntity('renderable');
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
    const controller_entities = this.controller_entities;
    const entityFolder = this.entityFolder;

    if(controller_entities){// if exist delete gui since they need to update html docs list
      controller_entities.destroy()//delete ui
      this.controller_entities = entityFolder.add(this, 'currentEntityId', entityIds);
    }else{
      //create ui
      this.controller_entities = entityFolder.add(this, 'currentEntityId', entityIds);
    }
  }

  deleteSelectEntityId(){
    const world = this.world;
    const ECS = this.ECS;
    console.log("this.entity_id: ", this.currentEntityId)
    const entity = ECS.getEntityById(world, this.currentEntityId);
    const deferredRemoval = false  // by default this is true. setting it to false immediately removes the component
    ECS.removeEntity(world, entity, deferredRemoval)

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

const threejsSample = new SampleCube();
//console.log(threejsSample);
van.add(document.body, threejsSample.domElement );

