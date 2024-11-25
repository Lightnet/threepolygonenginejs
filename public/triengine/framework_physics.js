/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/


import { RAPIER } from '/dps.js';
import Observable from './Observable.js';

class FrameWork_Physics{

  isPhysics = false;
  world=null;
  rigidBodies = [];
  gravity = { x: 0.0, y: -9.81, z: 0.0 };

  constructor(args){
    

  }

  async setup(){

  }

  update(delta){

  }

}

export default FrameWork_Physics;