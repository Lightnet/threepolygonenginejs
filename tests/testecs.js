// https://github.com/nodejs/help/issues/2483
// 

import ECS, { 
  addComponentToEntity, 
  addSystem, 
  createEntity, 
  createWorld, 
  getEntities
} from 'ecs';
//import clamp    from 'clamp';


const world = createWorld()

const PLAYER = createEntity(world);
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

let currentTime = performance.now();

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


// finally start the game loop
//gameLoop();
//gameLoop();
//gameLoop();