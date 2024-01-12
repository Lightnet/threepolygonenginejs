

import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import Observable from './Observable.js';

class PhysicsFrameWork{

  isPhysics = false;

  world=null;
  rigidBodies = [];
  rigidBody=null
  gravity = { x: 0.0, y: -9.81, z: 0.0 };

  event=null;

  constructor(args){
    this.event = new Observable();
    this.setup();
    return this;
  }

  async setup(){
    await RAPIER.init();
    // set up world
    this.world = new RAPIER.World(this.gravity);
    // fire event when ready to init other
    this.event.fireEvent("Ready");
  }

  update(delta){
    if (this.world == null){
      console.log('physics update null');
      return;
    }
    //console.log('physics update!');

    // Step the simulation forward.  
    this.world.step();
    this.updateBodies();
  }

  create_body_ground(){
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
    console.log(this.world)
    this.world.createCollider(groundColliderDesc);
  }

  create_body_cube(){
    //Ammojs Section
    // Create a dynamic rigid-body.
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
     .setTranslation(0.0, 20.0, 0.0);
    let rigidBody = this.world.createRigidBody(rigidBodyDesc);
    this.rigidBody = rigidBody;

    // Create a cuboid collider attached to the dynamic rigidBody.
    let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    let collider = this.world.createCollider(colliderDesc, rigidBody);

    console.log(rigidBody);

    //ball.userData.physicsBody = rigidBody;
    return rigidBody;
  }

  add_body_sync(_object){
    this.rigidBodies.push(_object);
  }

  updateBodies(){
    if(this.rigidBodies){
      for ( let i = 0; i < this.rigidBodies.length; i++ ) {
        let objThree = this.rigidBodies[ i ];
        let objPhysics = objThree.userData.physicsBody;
        if(objPhysics){
          let p = objPhysics.translation();
          objThree.position.set( p.x, p.y, p.z );
          let q = objPhysics.rotation();
          //console.log(r);
          objThree.quaternion.set( q.x, q.y, q.z, q.w );
        }
      }
    }
  }

}

export {
  PhysicsFrameWork
}