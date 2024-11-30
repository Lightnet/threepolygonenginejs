/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
/*
  Need work. 
  -Loading variable is null for some reason.(fixed)
  -need to load script here by inject load wait??

*/

import FrameWork_Physics from "./framework_physics.js";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

class Physics_Ammo extends FrameWork_Physics{

  tmpTrans=null;

  constructor(args){
    super(args)
  }

  async init(){
    //await this.setup();
    //console.log("init ammo")
    //const AmmoLib = await Ammo();
    await Ammo();
    //console.log("AmmoLib: ", AmmoLib);
    //console.log("Ammo: ", Ammo);

    //console.log("Ammo.ready 1", Ammo.ready);
    //const test = await Ammo.ready;
    //console.log("Ammo.ready test", test);
    this.Ammo = Ammo;
    this.setup();
  }

  async setup(){
    this.build()
  }

  build(){
    const Ammo = this.Ammo;
    this.gravity = { x: 0.0, y: -9.81, z: 0.0 };
    //let gravity = { x: 0.0, y: 0, z: 0.0 };
    //let gravity = { x: 0.0, y: -1, z: 0.0 };
    //physics = new AMMO.World(gravity);
    //console.log(Ammo);
    var collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
    var dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration);
    var overlappingPairCache    = new Ammo.btDbvtBroadphase();
    var solver                  = new Ammo.btSequentialImpulseConstraintSolver();
    this.world           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    this.world.setGravity(new Ammo.btVector3(this.gravity.x, this.gravity.y, this.gravity.z));
    //this.tmpTrans = new Ammo.btTransform();

    this.Ammo = Ammo;
  }

  updatePhysicsObjects(){

  }

  update(delta){
    super.update(delta);
    //console.log('delta: ', delta);
    if(this.world){
      //console.log(delta);
      this.world.stepSimulation(delta,10);
      //this.updatePhysicsObjects()
    }
  }

  API(){
    //console.log("this.Ammo", this.Ammo);
    return this.Ammo;
  }

}

export default Physics_Ammo;