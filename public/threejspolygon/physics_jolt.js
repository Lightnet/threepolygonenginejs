/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import CorePhysics from "./corephysics.js";

const JOLT_PATH = 'https://cdn.jsdelivr.net/npm/jolt-physics@0.29.0/dist/jolt-physics.wasm-compat.js';

class PhysicsJolt extends CorePhysics{
  Jolt=null;
  jolt=null;

  constructor(args){
    super(args);

  }

  async setup(){
    //required html script can't import from script
    const { default: initJolt } = await import( `${JOLT_PATH}` );
    //console.log(AMMO);
    this.Jolt = await initJolt();
    console.log(this.Jolt);
  }
}

export default PhysicsJolt;