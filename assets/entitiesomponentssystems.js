

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
//import { THREE } from "./triengine/ThreeAPI.js";
const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;

import ECS from "https://unpkg.com/ecs@0.20.0/ecs.js";

// generates a new entity component system
const world = ECS.createWorld()

// set up the player
const PLAYER = ECS.createEntity(world)
ECS.addComponentToEntity(world, PLAYER, 'position', { x: 15, y: 23 })
ECS.addComponentToEntity(world, PLAYER, 'moveable', { dx: 0, dy: 0 })

var Keyboard = {};

// update entity velocity based on key pressed
function keyboardControlSystem (world) {
  // called each game loop
  const onUpdate = function (dt) {
      // get all of the entities in the world that pass the filter
      for (const entity of ECS.getEntities(world, [ 'moveable' ])) {
        console.log("update...");
          // update the entity position according to what is pressed
          /*
          if (Keyboard.keyPressed('up'))
              entity.moveable.dy -= 1
          if (Keyboard.keyPressed('down'))
              entity.moveable.dy += 1
          if (Keyboard.keyPressed('left'))
              entity.moveable.dx -= 1
          if (Keyboard.keyPressed('right'))
              entity.moveable.dx += 1
          */
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


function rendererSystem (world) {

  const RENDERABLE_FILTER = [ 'renderable' ]

  // data structure to store all entities that were added or removed last frame
  const resultEntries = {
      count: 0,
      entries: new Array(100)
  }

  const onUpdate = function (dt) {

    // optional 3rd parameter, can be 'added' or 'removed'. provides the list of entities that were
    // added since the last ECS.cleanup(...) call
    //for (ECS.getEntities(world, RENDERABLE_FILTER, 'added', resultEntries)) {
      // resultEntries will now be filled in with a reference to all entries added last frame
    //}
    //for (ECS.getEntities(world, RENDERABLE_FILTER, 'removed', resultEntries)) {
      // resultEntries will now be filled in with a reference to all entries removed last frame
    //}

  }
  return { onUpdate }
}


ECS.addSystem(world, keyboardControlSystem)
ECS.addSystem(world, movementSystem)
//ECS.addSystem(world, rendererSystem)


let currentTime = performance.now()

function gameLoop () {
  const newTime = performance.now()
  const frameTime = newTime - currentTime  // in milliseconds, e.g. 16.64356
  currentTime = newTime

  // run onUpdate for all added systems
  ECS.update(world, frameTime)

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world)

  requestAnimationFrame(gameLoop)
}


// finally start the game loop
gameLoop()