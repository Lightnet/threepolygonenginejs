//game worker for thread handle process events...

import { parentPort, workerData } from 'node:worker_threads';
import ECS, { 
  addComponentToEntity, 
  addSystem, 
  createEntity, 
  createWorld, 
  getEntities
} from 'ecs';
import RAPIER from '@dimforge/rapier3d-compat';


var id = workerData?.id || 0;

const world = createWorld()
var physicsWorld = null

const PLAYER = ECS.createEntity(world)
addComponentToEntity(world, PLAYER, 'position', { x: 15, y: 23 })
addComponentToEntity(world, PLAYER, 'moveable', { dx: 0, dy: 0 })

const movementSystem = function (world) {
  const onUpdate = function (dt) {
      for (const entity of getEntities(world, ['position', 'moveable'])) {
          entity.position.x += entity.moveable.dx
          entity.position.y += entity.moveable.dy
          console.log(entity.position)
      }
  }
  return { onUpdate }
}

addSystem(world, movementSystem);

const physicsSystem = function (world) {
  const onUpdate = function (dt) {
      for (const entity of getEntities(world, [
        //'position', 
        'rigidBody'
      ])) {
          //entity.position.x += entity.moveable.dx
          //entity.position.y += entity.moveable.dy
          //console.log(entity.position)
          //console.log(entity.rigidBody)
          let position = entity.rigidBody.translation();
          console.log(position);
      }
  }
  return { onUpdate }
}

addSystem(world, physicsSystem);


let currentTime = performance.now();

function gameLoop() {
  const newTime = performance.now()
  const frameTime = newTime - currentTime  // in milliseconds, e.g. 16.64356
  currentTime = newTime

  if(physicsWorld){
    // Step the simulation forward.  
    physicsWorld.step();
  }

  // run onUpdate for all added systems
  ECS.update(world, frameTime)

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world)

  //requestAnimationFrame(gameLoop)
}
async function run_simulation() {
  await RAPIER.init();
  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  physicsWorld = new RAPIER.World(gravity);

  const CUBE = ECS.createEntity(world);
  addComponentToEntity(world, PLAYER, 'position', { x: 15, y: 23, z:0 })

  // Create a dynamic rigid-body.
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 1.0, 0.0);
  let rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);

  // Create a cuboid collider attached to the dynamic rigidBody.
  let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  let collider = physicsWorld.createCollider(colliderDesc, rigidBody);
  addComponentToEntity(world, CUBE, 'rigidBody', rigidBody)





  let i = 0
  let timerId = setInterval(function() {
    console.log(id)
    gameLoop();
    i++;
    if (i >= 10) {
      console.log("CLEAR???")
  		clearInterval(timerId);
  	}
  }, 1000);

}

run_simulation();