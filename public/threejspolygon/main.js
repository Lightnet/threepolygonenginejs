/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";

import CorePolygon from "./corepolygon.js";
console.log("init core...");
// const corePolygon = new CorePolygon();
// console.log(corePolygon);
// van.add(document.body, corePolygon.domElement );
class SampleCube extends CorePolygon{
  // debugObject={
  //   createCube:'test'
  // };
  debugObject={};

  constructor(args){
    super(args);
    //console.log(this.debugObject);
    this.debugObject.createCube='test';
  }

  setupInit(){
    console.log("init ...");
    //this.createCubeTest();
    this.ECS.addSystem(this.world, this.rotateSystem.bind(this));
    //this.debugObject.createCube = this.createCube;
    
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

  removeCube(){
    console.log("test remove")
    this.ECS.removeEntities(this.world, ['cube']);
  }

  createGUI(){
    const gui = this.gui;
    const debugObject = this.debugObject;
    console.log(debugObject)
    gui.add(this,'debugLogs').name('Test Func Logs')
    gui.add(this,'createTestChains').name('create entity chains')
    gui.add(this,'createCube').name('add entity cube')
    gui.add(this,'removeCube').name('remove entity cube')
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

