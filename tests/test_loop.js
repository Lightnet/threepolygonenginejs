// https://snyk.io/blog/node-js-multithreading-with-worker-threads/
// https://code.mu/en/javascript/book/prime/timers/timer-stopping/
import { parentPort, workerData } from 'node:worker_threads';

var id = "";
//console.log(workerData);
id = workerData.id || 0;
//parentPort.postMessage({data:"Test", type: "done"});

//function loopDelta(){}
let i = 0
let timerId = setInterval(function() {
  console.log(id)
  i++;
  if (i >= 10) {
    console.log("CLEAR???")
		clearInterval(timerId);
	}
}, 1000);