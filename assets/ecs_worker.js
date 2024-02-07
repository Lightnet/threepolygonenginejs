// this for worker sandbox
//console.log(Worker);
console.log("worker init...")
//import { sayHello } from './test.js';
//sayHello();
//import test from './test.js'; //works current host assets
//does not work outside access sites or other package needed to loaded.
//import ECS from "https://cdn.skypack.dev/ecs";
//import { ECS } from "./baseapi";//does not work missing packages???
//import ECS from "ecs";

import ECS from "https://cdn.skypack.dev/ecs";// pass
//console.log(ECS)

// generates a new entity component system
const world = ECS.createWorld()

var KeyPad = {
  LEFT:false,
  RIGHT:false,
  UP:false,
  DOWN:false,
}

const EGamePad = ECS.createEntity(world)
ECS.addComponentToEntity(world, EGamePad, 'KEY', { KeyPad })

onmessage = (e)=>{
  //console.log(e.data);
  if(e.data?.type){
    //console.log("Hello?")
    if(e.data.type == "keydown"){
      if(e.data.input == "a"){
        EGamePad.KEY.LEFT = true;
      }
      if(e.data.input == "d"){
        EGamePad.KEY.RIGHT = true;
      }
      if(e.data.input == "w"){
        EGamePad.KEY.UP = true;
      }
      if(e.data.input == "s"){
        EGamePad.KEY.DOWN = true;
      }
    }
    if(e.data.type == "keyup"){
      if(e.data.input == "a"){
        EGamePad.KEY.LEFT = false;
      }
      if(e.data.input == "d"){
        EGamePad.KEY.RIGHT = false;
      }
      if(e.data.input == "w"){
        EGamePad.KEY.UP = false;
      }
      if(e.data.input == "s"){
        EGamePad.KEY.DOWN = false;
      }
    }
  }
};

// set up the player
const PLAYER = ECS.createEntity(world)
ECS.addComponentToEntity(world, PLAYER, 'position', { x: 15, y: 23 })
ECS.addComponentToEntity(world, PLAYER, 'moveable', { dx: 0, dy: 0 })

// update entity velocity based on key pressed
function keyboardControlSystem (world) {
  // called each game loop
  const onUpdate = function (dt) {
    const GamePad = ECS.getEntity(world, [ 'KEY' ]);
    // get all of the entities in the world that pass the filter
    for (const entity of ECS.getEntities(world, [ 'moveable' ])) {
      //console.log("update...");
        // update the entity position according to what is pressed
        
      if (GamePad.KEY.UP==true)
          entity.moveable.dy -= 1
      else if (GamePad.KEY.DOWN==true)
          entity.moveable.dy += 1
      else
        entity.moveable.dy = 0

      if (GamePad.KEY.LEFT == true)
          entity.moveable.dx -= 1
      else if (GamePad.KEY.RIGHT==true)
          entity.moveable.dx += 1
      else
        entity.moveable.dx = 0
        
       //entity.moveable.dx = clamp(entity.moveable.dx, -10, 10)
       //entity.moveable.dy = clamp(entity.moveable.dy, -10, 10)
    }
  }

  return { onUpdate }
}

function movementSystem (world) {
  const onUpdate = function (dt) {
    for (const entity of ECS.getEntities(world, [ 'position', 'moveable' ])) {
      //console.log(entity.moveable);
      entity.position.x += entity.moveable.dx
      entity.position.y += entity.moveable.dy
      postMessage({
        pos:entity.position
      })

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

var i = 0;

function timedCount() {
  i = i + 1;
  postMessage(i);
  gameLoop();
  //setTimeout("timedCount()",500);
  setTimeout(timedCount,500);
}

timedCount();