

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
//import { THREE } from "./triengine/ThreeAPI.js";
const {button, canvas, input, label, div} = van.tags;

import ECS from "https://unpkg.com/ecs@0.20.0/ecs.js";

// generates a new entity component system
const world = ECS.createWorld()

// set up the player
const PLAYER = ECS.createEntity(world)
ECS.addComponentToEntity(world, PLAYER, 'position', { x: 15, y: 23 })
ECS.addComponentToEntity(world, PLAYER, 'moveable', { dx: 0, dy: 0 })

var Keyboard = {};

var GameKeyBoard = {
  "q":false,
  "w":false,
  "e":false,
  "r":false,
  "t":false,
  "y":false,
  "u":false,
  "i":false,
  "o":false,
  "p":false,
  "a":false,
  "s":false,
  "d":false,
  "f":false,
  "g":false,
  "h":false,
  "j":false,
  "k":false,
  "l":false,
  "z":false,
  "x":false,
  "c":false,
  "v":false,
  "b":false,
  "n":false,
  "m":false,
};

const EINPUT = ECS.createEntity(world)
ECS.addComponentToEntity(world, EINPUT, 'INPUT', GameKeyBoard);
console.log(EINPUT);

// update entity velocity based on key pressed
function keyboardControlSystem (world) {
  // called each game loop
  const onUpdate = function (dt) {
      const EInput = ECS.getEntity(world, [ 'INPUT' ])
      //console.log(EInput);
      console.log(EInput.INPUT);

      // get all of the entities in the world that pass the filter
      for (const entity of ECS.getEntities(world, [ 'moveable' ])) {
        //console.log("update...");
          // update the entity position according to what is pressed
          if (EInput.INPUT.w == true){
            entity.moveable.dy -= 1
          }else if (EInput.INPUT.s == true){
            entity.moveable.dy += 1
          }else{
            entity.moveable.dy = 0
          }
          
          if (EInput.INPUT.a == true){
            entity.moveable.dx -= 1
          }else if (EInput.INPUT.d == true){
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
          console.log(entity.position);
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
  console.log("render init??")

  const onUpdate = function (dt) {
    //console.log("update...");

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
ECS.addSystem(world, rendererSystem)


function variablesSystem(world) {

  console.log("variables init??")

  const onUpdate = function (dt) {
    console.log("variables")
  }
  return { onUpdate }
}

ECS.addSystem(world, variablesSystem)

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

//timedCount();
class Timer extends EventTarget {
  start() {
    this.dispatchEvent(new Event("start"))
  }

  pause() {
    this.dispatchEvent(new Event("paused"))
  }

  unpause() {
    this.dispatchEvent(new Event("unpaused"))
  }

  stop() {
    this.dispatchEvent(new Event("stop"))
  }
}

const WorkerEL = () => {
  const renderEL = div({id:'ECS'});
  const mytimer = new Timer()

  mytimer.addEventListener("start", () => console.log("timer started!"))
  mytimer.addEventListener("stop", () => console.log("timer stopped!"))

  function start(){
    console.log("click...")
    //if(gloop.val == null){
      currentTime = performance.now()
      timedCount();
    //}
  }

  function stop(){
    //if(pool.val){
      isLoop=false;
      //gloop.val.terminate();
      //gloop.val=undefined;
    //}
  }

  function timerStart(){
    mytimer.start();
  }

  function timerStop(){
    mytimer.stop();
  }

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    //engine.val = new CraftMobile({canvas:renderEL,isPhysics:true});
    //console.log(engine.val);//
    
    van.add(renderEL,button({onclick:()=>start()},'start'))
    van.add(renderEL,button({onclick:()=>stop()},'stop'))

    van.add(renderEL,button({onclick:()=>timerStart()},'timer start'))
    van.add(renderEL,button({onclick:()=>timerStop()},'timer stop'))

    window.addEventListener('keydown', pressDownKeyBoard)
    window.addEventListener('keyup', releaseUpKeyBoard)
  }

  function InputKeys(event){
    //console.log(event)
    if(pool.val){
      pool.val.postMessage({type:"input",input:event.key})
    }
  }

  function pressDownKeyBoard(event){
    //console.log(event)
    EINPUT.INPUT[event.key]=true;
    //GameKeyBoard[event.key]=true;
  }

  function releaseUpKeyBoard(event){
    EINPUT.INPUT[event.key]=false;
    //GameKeyBoard[event.key]=false;
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,WorkerEL())