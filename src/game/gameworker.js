//game worker for thread handle process events...

import { parentPort, workerData } from 'node:worker_threads';
import { TPGameEngine } from './gameengine.js';
import { GameNetwork } from './network.js';

const io =  GameNetwork.getIO();
console.log(io)


console.log(workerData);
var id = workerData?.id || 0;

async function run_simulation() {

  parentPort.on("message", msg => {
    console.log("worker message");
    console.log(msg);
  });

  const simple_game = new TPGameEngine({id:id});

  let i = 0
  let timerId = setInterval(function() {
    //console.log(id)
    //gameLoop();
    //simple_game.update();
    i++;
    if (i >= 1000000) {
      console.log("CLEAR!")
  		clearInterval(timerId);
  	}
  }, 1000);

}

run_simulation();