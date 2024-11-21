/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import CorePhysics from "./corephysics.js";
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

class PhysicsRapier extends CorePhysics{
  RAPIER=null;
  constructor(args){
    super(args);

  }

  async setup(){
    //required html script can't import from script
    await RAPIER.init();
    //console.log(AMMO);
    this.RAPIER = RAPIER;
  }

}

export default PhysicsRapier;