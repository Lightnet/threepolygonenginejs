// for dealing with 
// https://nodejs.org/api/events.html#class-eventemitter
// https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter
import path,{ dirname } from 'path';
import { fileURLToPath } from 'url';
import {Worker, isMainThread, parentPort } from 'node:worker_threads';
import { TPGameEngine } from './gameengine.js';
import EventEmitter from 'node:events';
//EventEmitter = require('node:events');
//const dir = import.meta.dir;
//console.log(dir)
//console.log(import.meta)
//console.log(process.cwd())

const __dirname_ = dirname(fileURLToPath(import.meta.url));
console.log(__dirname_)
class Emitter extends EventEmitter {};

class GameManagement{
  io=null;
  gameInstances=new Set();
  EventE = new Emitter();
  threads = new Set();

  constructor(args){

    this.io = args.io;//socket.io

  }

  createGameInstance(args){
    const workerFile = path.join(__dirname_ ,"./gameworker.js");
    //console.log(this.io);
    // Create the worker.
    const worker = new Worker(workerFile,{workerData:{id:'1'}});
    
    worker.on('message', (msg) => { 
      console.log(msg); 
    });
  
    worker.on("error", err => console.error(err));
    worker.on("exit", code =>{ 
      console.log(`Worker exited with code ${code}.`)
      this.threads.delete(worker);
    });
    
    this.threads.add(worker);
  }

  destroyGameInstance(){
    //gameInstance.postMessage({api:'SHUTDOWN'});
  }
  // https://www.geeksforgeeks.org/how-to-iterate-over-set-elements-in-javascript/
  // https://nodejs.org/api/worker_threads.html#workerpostmessagevalue-transferlist
  // https://blog.logrocket.com/multithreading-node-js-worker-threads/
  gameReset(){
    for(const gameInstance of this.threads){
      //gameInstance.postMessage({api:'RESET'});
    }
  }

  echo(){
    for(const gameInstance of this.threads){
      gameInstance.postMessage({api:'echo'});
    }
  }

  socketGameSetup(socket){
    socket.on('api', (data) => {
      console.log(data)
      if(data){
        if(data.action == "creategame"){
          this.createGameInstance();
        }
        if(data.action == "reset"){
          this.gameReset();
        }
        if(data.action == "close"){
          this.gameReset();
        }
        if(data.action == "echo"){
          this.echo();
        }
      } 
    });
  }
}

function socketGameSetup(gameManagement,socket){
  socket.on('api', (data) => {
    console.log(data)
    if(data){
      if(data.action == "creategame"){
        gameManagement.createGameInstance();
      }
      if(data.action == "reset"){
        gameManagement.gameReset();
      }
      if(data.action == "close"){
        gameManagement.gameReset();
      }
      if(data.action == "echo"){
        gameManagement.echo();
      }
    } 
  });
}
//EXPORT FUNS,CLASS
export{
  GameManagement,
  socketGameSetup
}