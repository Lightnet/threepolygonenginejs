/*
  Information:
    vanjs main client entry point
*/
//import * as THREE from 'three';
//import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import TriEngine from "./triengine/triengine";
//import {ThreeEL} from './triengine/triengine.js';
const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;

class SpaceMobile extends TriEngine{

  constructor(args){
    super(args);
  }
  
}

const ThreeEL = () => {

  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new SpaceMobile({canvas:renderEL});
    console.log(engine.val);//
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,ThreeEL())