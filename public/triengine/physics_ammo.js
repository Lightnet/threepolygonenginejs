/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import FrameWork_Physics from "./framework_physics.js";

class Physics_Ammo extends FrameWork_Physics{

  tmpTrans=null;

  constructor(args){
    super(args)
  }

  async init(){
    await this.setup();
    //console.log("init ammo")
  }

  async setup(){
    super.setup();
    //console.log("setup ammo")
    //const self = this;
    Ammo().then((lib)=>{
      //self.Ammo = lib;
      //console.log("lib: ", lib);
      this.build(lib);
    });
  }

  build(Ammo){
    let gravity = { x: 0.0, y: -9.81, z: 0.0 };
    //physics = new AMMO.World(gravity);
    //console.log(Ammo);
    var collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
    var dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration);
    var overlappingPairCache    = new Ammo.btDbvtBroadphase();
    var solver                  = new Ammo.btSequentialImpulseConstraintSolver();
    this.world           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    this.world.setGravity(new Ammo.btVector3(gravity.x, gravity.y, gravity.z));
    this.tmpTrans = new Ammo.btTransform();

    this.Ammo = Ammo;
  }

  updatePhysicsObjects(){

  }

  update(delta){
    super.update(delta);
    //console.log('update...');
    if(this.world){
      this.world.stepSimulation(delta,1);
      //this.updatePhysicsObjects()
    }
  }

  API(){
    //console.log("this.Ammo", this.Ammo);
    return this.Ammo;
  }

}

export default Physics_Ammo;