import {Worker, isMainThread, parentPort } from 'node:worker_threads';

console.log('init')

var testfile = "./tests/test_loop.js";

if (isMainThread) {
  const threads = new Set();;
  console.log("main")
  // Create the worker.
  const worker = new Worker(testfile,{workerData:{id:'1'}});
  // Listen for messages from the worker and print them.
  worker.on('message', (msg) => { console.log(msg); });
  
  worker.on("error", err => console.error(err));
  worker.on("exit", code =>{ 
    console.log(`Worker exited with code ${code}.`)
    threads.delete(worker);
  });
  threads.add(worker)

  const worker2 = new Worker(testfile,{workerData:{id:'2'}});
  // Listen for messages from the worker and print them.
  worker2.on('message', (msg) => { console.log(msg); });
  
  worker2.on("error", err => console.error(err));
  worker2.on("exit", code =>{ 
    console.log(`Worker exited with code ${code}.`)
    threads.delete(worker2);
  });
  threads.add(worker2)



}else{
  console.log("worker")
}


console.log('finish')