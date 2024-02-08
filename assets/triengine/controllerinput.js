//testing...
import { ECS } from "./dps";

//create input in the system
//simple set up
function GamePadSystem(world){
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

  //const onUpdate = function (dt) { }

  return { 
    //onUpdate
  }
}

export{
  GamePadSystem
}
//ECS.addSystem(world, GamePadSystem)