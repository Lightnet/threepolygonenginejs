/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import CorePhysics from "./corephysics.js";

class PhysicsAmmo extends CorePhysics{
  constructor(args){
    super(args);
    
  }
  async setup(){
    //required html script can't import from script
    let AMMO = await Ammo();
    //console.log(AMMO);
    this.Ammo = AMMO;
  }
}

export default PhysicsAmmo;