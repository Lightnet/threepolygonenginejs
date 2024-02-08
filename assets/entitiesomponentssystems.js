//testing ECS only
// https://github.com/mreinstein/ecs

//import ECS from 'https://cdn.skypack.dev/ecs';
//import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import { ECS, van } from "./triengine/dps";
const {button, label, br, div} = van.tags;

// generates a new entity component system
const world = ECS.createWorld()

// set up the player
const PLAYER = ECS.createEntity(world)
ECS.addComponentToEntity(world, PLAYER, 'position', { x: 15, y: 23 })
ECS.addComponentToEntity(world, PLAYER, 'moveable', { dx: 0, dy: 0 })

//create input in the system
function keyboardInputUpdateSystem(world){
  var GamePad = {
    LEFT:false,
    RIGHT:false,
    UP:false,
    DOWN:false,
  }

  const ECSGamePad = ECS.createEntity(world)
  ECS.addComponentToEntity(world, ECSGamePad, 'GamePad', GamePad);

  window.addEventListener('keydown', pressDownKeyBoard)
  window.addEventListener('keyup', releaseUpKeyBoard)

  function pressDownKeyBoard(event){
    //console.log(event.key);
    if(event.key == "a"){
      ECSGamePad.GamePad.LEFT = true;
    }
    if(event.key == "d"){
      ECSGamePad.GamePad.RIGHT = true;
    }
    if(event.key == "w"){
      ECSGamePad.GamePad.UP = true;
    }
    if(event.key == "s"){
      ECSGamePad.GamePad.DOWN = true;
    }
  }

  function releaseUpKeyBoard(event){
    if(event.key == "a"){
      ECSGamePad.GamePad.LEFT = false;
    }
    if(event.key == "d"){
      ECSGamePad.GamePad.RIGHT = false;
    }
    if(event.key == "w"){
      ECSGamePad.GamePad.UP = false;
    }
    if(event.key == "s"){
      ECSGamePad.GamePad.DOWN = false;
    }
  }

  const onUpdate = function (dt) {

  }

  return { 
    //onUpdate
  }
}

ECS.addSystem(world, keyboardInputUpdateSystem)

// update entity velocity based on key pressed
function keyboardControlSystem (world) {
  // called each game loop
  const onUpdate = function (dt) {
      const EInput = ECS.getEntity(world, [ 'GamePad' ])
      //console.log(EInput);
      //console.log(EInput.GamePad);

      // get all of the entities in the world that pass the filter
      for (const entity of ECS.getEntities(world, [ 'moveable' ])) {
        //console.log("update...");
          // update the entity position according to what is pressed
          if (EInput.GamePad.UP == true){
            entity.moveable.dy -= 1
          }else if (EInput.GamePad.DOWN == true){
            entity.moveable.dy += 1
          }else{
            entity.moveable.dy = 0
          }
          
          if (EInput.GamePad.LEFT == true){
            entity.moveable.dx -= 1
          }else if (EInput.GamePad.RIGHT == true){
            entity.moveable.dx += 1
          }else{
            entity.moveable.dx = 0
          }

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
      //check pos
      //console.log(entity.position);
    }
  }

  return { onUpdate }
}

function rendererSystem (world) {
  console.log("render init??")
  const RENDERABLE_FILTER = [ 'renderable' ]

  // data structure to store all entities that were added or removed last frame
  const resultEntries = {
    count: 0,
    entries: new Array(100)
  }
  
  const onUpdate = function (dt) {
    //console.log("update...");

    console.log(ECS.getEntities(world, RENDERABLE_FILTER, 'added', resultEntries));

    // optional 3rd parameter, can be 'added' or 'removed'. provides the list of entities that were
    // added since the last ECS.cleanup(...) call
    let results = ECS.getEntities(world, RENDERABLE_FILTER, 'added', resultEntries);
    if(results){
      if(results.count > 0){
        console.log("added...")
        console.log(results.entries);
      }
    }
    // resultEntries will now be filled in with a reference to all entries removed last frame
    results = ECS.getEntities(world, RENDERABLE_FILTER, 'removed', resultEntries);
      
    if(results){
      if(results.count > 0){
        console.log("remove...")
        console.log(results.entries);
      }
    }

  }
  return { onUpdate }
}

ECS.addSystem(world, keyboardControlSystem)
ECS.addSystem(world, movementSystem)
ECS.addSystem(world, rendererSystem)

function variablesSystem(world) {
  //console.log("variables init??")
  const onUpdate = function (dt) {
    //console.log("variables")
  }
  return { onUpdate }
}
//ECS.addSystem(world, variablesSystem)

var currentTime = performance.now()
function gameLoop () {
  const newTime = performance.now()
  const frameTime = newTime - currentTime  // in milliseconds, e.g. 16.64356
  currentTime = newTime
  // run onUpdate for all added systems
  ECS.update(world, frameTime)
  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world)
  //requestAnimationFrame(gameLoop)
}

// finally start the game loop
//gameLoop()
var isLoop = true;
var i=0;
function timedCount() {
  i = i + 1;
  //postMessage(i);
  gameLoop();
  //setTimeout("timedCount()",500);
  if(isLoop){
    setTimeout(timedCount,500);
  }
}

const ECS_LOOP_EL = () => {
  const renderEL = div({id:'ECS'});

  function start(){
    console.log("loop...")
    currentTime = performance.now()
    timedCount();
  }

  function stop(){
    isLoop=false;
  }

  function addEntity(){
    const PH_Entity = ECS.createEntity(world)
    ECS.addComponentToEntity(world, PH_Entity, 'pos', { x: 15, y: 23 })
    ECS.addComponentToEntity(world, PH_Entity, 'renderable')
  }

  function removeEntity(){
    const deferredRemoval = false  // by default this is true. setting it to false immediately removes the component

    const PH_Entity = ECS.getEntity(world,['pos']);
    console.log(PH_Entity);
    ECS.removeEntity(world, PH_Entity, deferredRemoval);
  }

  function checkEntity(){
    console.log(world);
    console.log(ECS.getEntities(world, [ 'pos' ]).length)
  }

  function init(){
    van.add(renderEL,label('Run Loop >>:'))
    van.add(renderEL,button({onclick:()=>start()},'start'))
    van.add(renderEL,button({onclick:()=>stop()},'stop'))
    van.add(renderEL,br())
    van.add(renderEL,label('WASD = movement, check console.log'))

    van.add(renderEL,button({onclick:()=>addEntity()},'add'))
    van.add(renderEL,button({onclick:()=>removeEntity()},'remove'))
    van.add(renderEL,button({onclick:()=>checkEntity()},'check'))
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,ECS_LOOP_EL());