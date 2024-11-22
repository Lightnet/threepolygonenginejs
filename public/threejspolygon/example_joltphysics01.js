/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  ammo physics test.
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
    //physics error need order build setup
  }

  debugLogs(){
    console.log(this.debugObject);
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

  removePhysicsGround(){
    this.removeEntities(['rigidground']);
    this.ground = null;
  }
  removePhysicsCubes(){
    this.removeEntities(['rigidcube']);
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
    // physicsFolder.add(this,'createPhysicsCube').name('Create Cube')
    // physicsFolder.add(this,'removePhysicsCubes').name('Remove Cube')

    const groundFolder = gui.addFolder('Ground');
    // groundFolder.add(this,'addPhysicsGround').name('Add')
    // groundFolder.add(this,'removePhysicsGround').name('Remove')
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