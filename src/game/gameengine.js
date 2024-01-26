//game? 

import { parentPort, workerData } from 'node:worker_threads';
import ECS, { 
  addComponentToEntity, 
  addSystem, 
  createEntity, 
  createWorld, 
  getEntities
} from 'ecs';
import RAPIER from '@dimforge/rapier3d-compat';

class TPGameEngine{

  id = "0000";
  world = createWorld();

  PHYSICSWORLD=null;//ECS
  physicsWorld = null;//physics
  currentTime = performance.now();
  gravity = { x: 0.0, y: -9.81, z: 0.0 };

  constructor(args){
    this.id = args?.id | "0";
    console.log(this.id);

    this.currentTime = performance.now();
    this.init();
  }

  async init(){
    await this.setup_physics();
    this.setup_base_system();
    this.setup_test();
  }

  setup_base_system(){
    //addSystem(this.world, this.movementSystem);
  }
  // RAPIER 
  async setup_physics(){
    await RAPIER.init();
    //this.physicsWorld = new RAPIER.World(this.gravity);

    this.physicsWorld = new RAPIER.World(this.gravity); // RAPIER world
    this.PHYSICSWORLD = ECS.createEntity(this.world);// ECS
    ECS.addComponentToEntity(this.world, this.PHYSICSWORLD, 'physics', this.physicsWorld);

    ECS.addSystem(this.world, this.physicsSystem);
    ECS.addSystem(this.world, this.rigidBodySystem);
  }
  // RAPIER
  physicsSystem(world){
    const onUpdate = function (dt) {
      for (const entity of getEntities(world, ['physics'])) {
        //update physics objects
        entity.physics.step();
      }
    }
    return { onUpdate }
  }

  createCube(){

    const CUBE = ECS.createEntity(this.world);
    ECS.addComponentToEntity(this.world, CUBE, 'position', { x: 15, y: 23, z:0 })

    // Create a dynamic rigid-body.
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(0.0, 1.0, 0.0);
    let rigidBody = this.physicsWorld.createRigidBody(rigidBodyDesc);

    // Create a cuboid collider attached to the dynamic rigidBody.
    let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    let collider = this.physicsWorld.createCollider(colliderDesc, rigidBody);
    ECS.addComponentToEntity(this.world, CUBE, 'rigidBody', rigidBody)

  }

  setup_test(){
    this.createCube();
  }

  movementSystem(world){

  }

  rigidBodySystem(world) {
    const onUpdate = function (dt) {
      for (const entity of getEntities(world, [
        'rigidBody'
      ])) {
        let position = entity.rigidBody.translation();
        console.log(position);
      }
    }
    return { onUpdate }
  }

  update(){
    const newTime = performance.now()
    const frameTime = newTime - this.currentTime  // in milliseconds, e.g. 16.64356
    this.currentTime = newTime

    //if(this.physicsWorld){
      // Step the simulation forward.  
      //this.physicsWorld.step();
    //}

    // run onUpdate for all added systems
    ECS.update(this.world, frameTime)
    // necessary cleanup step at the end of each frame loop
    ECS.cleanup(this.world)
  }
}

export {
  TPGameEngine
}