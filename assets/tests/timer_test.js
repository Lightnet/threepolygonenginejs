/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

//import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import { van } from "../triengine/dps.js";
const {button, canvas, input, label, div} = van.tags;

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

const TimerEL = () => {
  const renderEL = div({id:'ECS'});
  const mytimer = new Timer()

  mytimer.addEventListener("start", () => console.log("timer started!"))
  mytimer.addEventListener("stop", () => console.log("timer stopped!"))

  function timerStart(){
    mytimer.start();
  }

  function timerStop(){
    mytimer.stop();
  }

  function init(){
    van.add(renderEL,button({onclick:()=>timerStart()},'timer start'))
    van.add(renderEL,button({onclick:()=>timerStop()},'timer stop'))
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,TimerEL())



