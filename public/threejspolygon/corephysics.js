/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

class CorePhysics{

  isPhysics=false;
  isPause=false;
  world=null;
  gravity = { x: 0.0, y: -9.81, z: 0.0 };

  constructor(args){
    //this.setup();
  }

  async setup(){}

  async build(){}

  update(delta){}

  get API(){
    return this.Ammo;
  }

}

export default CorePhysics;