

//import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import { van } from "./triengine/dps.js";
const {button, input, label, div} = van.tags;

const WorkerEL = () => {
  const engine = van.state(null);
  const renderEL = div({id:'threejs'});
  const pool = van.state(null);


  function start(){
    console.log("click...")
    if(pool.val == null){
      pool.val = new Worker("./worker_pool.js");
      pool.val.onmessage = function(event) {
        //document.getElementById("result").innerHTML = event.data;
        console.log(event.data);
      };
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
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,WorkerEL())