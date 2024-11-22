/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import CorePhysics from "./corephysics.js";

class PhysicsAmmo extends CorePhysics{
  tmpTrans=null;

  constructor(args){
    super(args);
    
  }
  async setup(){
    //required html script can't import from script
    let AMMO = await Ammo();
    //console.log(AMMO);
    this.Ammo = AMMO;
    this.tmpTrans = new this.Ammo.btTransform();
    await this.build();
  }

  async build(){
    //this.gravity
    var collisionConfiguration  = new this.Ammo.btDefaultCollisionConfiguration();
    var dispatcher              = new this.Ammo.btCollisionDispatcher(collisionConfiguration);
    var overlappingPairCache    = new this.Ammo.btDbvtBroadphase();
    var solver                  = new this.Ammo.btSequentialImpulseConstraintSolver();
    this.world                = new this.Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    this.world.setGravity(new this.Ammo.btVector3(this.gravity.x, this.gravity.y, this.gravity.z));
    this.tmpTrans = new this.Ammo.btTransform();
    console.log("this.tmpTrans: ", this.tmpTrans);
    console.log("Ammo finish setup...")
    await new Promise(resolve => setTimeout(resolve, 1));
  }

  update(delta){
    super.update(delta);
    this.world.stepSimulation(delta,1);
    //console.log(delta);
  }

  detectCollision(){
    let dispatcher = this.world.getDispatcher();
  	let numManifolds = dispatcher.getNumManifolds();
    //console.log("numManifolds: ", numManifolds);
  	for ( let i = 0; i < numManifolds; i ++ ) {

  		let contactManifold = dispatcher.getManifoldByIndexInternal( i );
  		let numContacts = contactManifold.getNumContacts();
      //console.log("contactManifold...",contactManifold);
      let body0 = contactManifold.getBody0();
      let body1 = contactManifold.getBody1();
      //console.log("body0: ", body0, " body1:", body1);
      //console.log("body0: ", body0);//body.hy ID
      //console.log("body1: ", body1);//body.hy ID

  		for ( let j = 0; j < numContacts; j++ ) {
  			//let contactPoint = contactManifold.getContactPoint( j );
  			//let distance = contactPoint.getDistance();
        //console.log("collision detected...",contactPoint)
  			//console.log({manifoldIndex: i, contactIndex: j, distance: distance});
  		}
  	}
  }

}

export default PhysicsAmmo;