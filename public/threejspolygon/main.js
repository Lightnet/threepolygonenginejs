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
  constructor(args){
    super(args);
  }

  setup(){

    //this.createCubeTest();

    this.ECS.addSystem(this.world, this.rotateSystem.bind(this));

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

  createEntity(){
    this.ECS.addEntity(this.world);
  }

  createCube(){
    const ECS = this.ECS;
    console.log("test add");
    let mesh = this.createMeshCube();
    const CUBE = ECS.addEntity(this.world)
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
    gui.add(this,'createCube')
    gui.add(this,'removeCube')
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
console.log(threejsSample);
van.add(document.body, threejsSample.domElement );

