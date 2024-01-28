// for broswer and bun server test ...
// does not work for worker on import call for external site only local host

import {van, ECS} from './baseapi.js';

const {button, div} = van.tags;

const WorkerEL = () => {
  const engine = van.state(null);
  const renderEL = div({id:'threejs'});
  const pool = van.state(null);

  function start(){
    console.log("click...")
    if(pool.val == null){
      console.log("init...")
      try{
        pool.val = new Worker(new URL("./ecs_worker.js",import.meta.url), {
          type:"module",
          //name:"testECS"
        });
        console.log(pool.val)
        pool.val.onmessage = function(event) {
          //document.getElementById("result").innerHTML = event.data;
          console.log(event.data);
        };
      }
      catch(e){
        console.log(e);
      }
    }
  }

  function stop(){
    if(pool.val){
      pool.val.terminate();
      pool.val=undefined;
    }
  }

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    //engine.val = new CraftMobile({canvas:renderEL,isPhysics:true});
    //console.log(engine.val);//
    
    van.add(renderEL,button({onclick:()=>start()},'start'))
    van.add(renderEL,button({onclick:()=>stop()},'stop'))

    window.addEventListener('input', InputKeys);
    //console.log(document);

    window.addEventListener('keydown', pressDownKeyBoard)
    window.addEventListener('keyup', releaseUpKeyBoard)
  }

  function InputKeys(event){
    console.log(event)
    if(pool.val){
      pool.val.postMessage({type:"input",input:event.key})
    }
  }

  function pressDownKeyBoard(event){
    console.log(event)
    if(pool.val){
      pool.val.postMessage({type:"keydown",input:event.key})
    }
  }

  function releaseUpKeyBoard(event){
    //console.log(event.code)
    if(pool.val){
      pool.val.postMessage({type:"keyup",input:event.code})
    }
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,WorkerEL())

// https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker
function supportsWorkerType() {
  let supports = false;
  const tester = {
    get type() { supports = true; } // it's been called, it's supported
  };
  try {
    // We use "blob://" as url to avoid an useless network request.
    // This will either throw in Chrome
    // either fire an error event in Firefox
    // which is perfect since
    // we don't need the worker to actually start,
    // checking for the type of the script is done before trying to load it.
    const worker = new Worker('blob://', tester);
  } finally {
    return supports;
  }
}

//console.log( supportsWorkerType() );