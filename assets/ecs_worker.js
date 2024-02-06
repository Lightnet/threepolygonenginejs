// this for worker sandbox
//console.log(Worker);
console.log("worker init...")
import { sayHello } from './test.js';
sayHello();
//import test from './test.js'; //works current host assets
//import ECS from "https://unpkg.com/ecs@0.20.0/ecs.js"; //does not work outside access sites
//import { ECS } from "./baseapi";
//import ECS from "ecs";
/*
// generates a new entity component system
const world = ECS.createWorld()

// set up the player
const PLAYER = ECS.createEntity(world)
ECS.addComponentToEntity(world, PLAYER, 'position', { x: 15, y: 23 })
ECS.addComponentToEntity(world, PLAYER, 'moveable', { dx: 0, dy: 0 })

// update entity velocity based on key pressed
function keyboardControlSystem (world) {
  // called each game loop
  const onUpdate = function (dt) {
      // get all of the entities in the world that pass the filter
      for (const entity of ECS.getEntities(world, [ 'moveable' ])) {
        console.log("update...");
          // update the entity position according to what is pressed
          
          if (Keyboard.keyPressed('up'))
              entity.moveable.dy -= 1
          if (Keyboard.keyPressed('down'))
              entity.moveable.dy += 1
          if (Keyboard.keyPressed('left'))
              entity.moveable.dx -= 1
          if (Keyboard.keyPressed('right'))
              entity.moveable.dx += 1
          
         //entity.moveable.dx = clamp(entity.moveable.dx, -10, 10)
         //entity.moveable.dy = clamp(entity.moveable.dy, -10, 10)
      }
  }

  return { onUpdate }
}

function movementSystem (world) {
  const onUpdate = function (dt) {
      for (const entity of ECS.getEntities(world, [ 'position', 'moveable' ])) {
          entity.position.x += entity.moveable.dx
          entity.position.y += entity.moveable.dy
      }
  }

  return { onUpdate }
}

ECS.addSystem(world, keyboardControlSystem)
ECS.addSystem(world, movementSystem)

let currentTime = performance.now()

function gameLoop() {
  const newTime = performance.now()
  const frameTime = newTime - currentTime  // in milliseconds, e.g. 16.64356
  currentTime = newTime

  // run onUpdate for all added systems
  ECS.update(world, frameTime)

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world)

  //requestAnimationFrame(gameLoop)
}
*/
var i = 0;
console.log("init...");

function timedCount() {
  i = i + 1;
  postMessage(i);
  //gameLoop();
  //setTimeout("timedCount()",500);
  setTimeout(timedCount,500);
}

timedCount();