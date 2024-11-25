/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

//prototype

// https://rapier.rs/docs/user_guides/javascript/colliders#collision-groups-and-solver-groups
// https://rapier.rs/docs/user_guides/javascript/colliders#active-events
// https://rapier.rs/docs/user_guides/javascript/advanced_collision_detection_js
// https://rapier.rs/docs/user_guides/javascript/advanced_collision_detection/#contact-and-intersection-filtering
// 
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import { RAPIER } from '/dps.js';
import Observable from './Observable.js';
import FrameWork_Physics from './framework_physics.js';

class Physics_Rapier extends FrameWork_Physics{

  isPhysics = false;
  world=null;
  rigidBodies = [];
  rigidBody=null
  gravity = { x: 0.0, y: -9.81, z: 0.0 };

  event=null;
  eventQueue=null;

  constructor(args){
    super(args);

    this.event = new Observable();
    if(args){
      if(typeof args?.x == 'number'){
        this.gravity.x = args.x;
      }
      if(typeof args?.y == 'number'){
        this.gravity.y = args.y;
      }
      if(typeof args?.z == 'number'){
        this.gravity.z = args.z;
      }
    }


    this.setup();
    return this;
  }

  async setup(){
    await RAPIER.init();
    // set up world
    this.world = new RAPIER.World(this.gravity);
    //this.eventQueue = new RAPIER.EventQueue(true);
    //this.setupEventQueue();
    //does not work need to be in loop update
    //this.eventQueue.drainCollisionEvents();
    // fire event when ready to init other
    this.event.fireEvent("Ready");
  }
  
  create_body_ground(){
    let rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
      .setTranslation(0.0,-2.0,0.0);
    let rigidBody = this.world.createRigidBody(rigidBodyDesc);
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    let collider = this.world.createCollider(groundColliderDesc, rigidBody);
    console.log(collider);
    return rigidBody;
  }

  create_body_sensor(){
    let rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
      .setTranslation(0,0,0);
    let rigidBody = this.world.createRigidBody(rigidBodyDesc);
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    let collider = this.world.createCollider(groundColliderDesc, rigidBody);
    console.log(collider);
    //collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT);
    //collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    //collider.setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS);
    //collider.setActiveHooks(RAPIER.ActiveHooks.FILTER_CONTACT_PAIRS);
    collider.setActiveHooks(RAPIER.ActiveHooks.FILTER_INTERSECTION_PAIR);
    collider.setSensor(true);
    return rigidBody;
  }

  create_body_cube(args){
    let position = {x:0,y:0.0,z:0};
    let size = {x:0.5,y:0.5,z:0.5};
    if(args){
      if(args?.pos){
        if(args.pos?.x){
          position.x = args.pos.x;
        }
        if(args.pos?.y){
          position.y = args.pos.y;
        }
        if(args.pos?.z){
          position.z = args.pos.z;
        }
      }
      if(args?.size){
        if(args.size?.x){
          size.x = args.size.x;
        }
        if(args.size?.y){
          size.y = args.size.y;
        }
        if(args.size?.z){
          size.z = args.size.z;
        }
      }
    }

    // Create a dynamic rigid-body.
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(position.x, position.y, position.z);
     //.setTranslation(0.0, 20.0, 0.0);
     //rigidBodyDesc.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT)
     //console.log(rigidBodyDesc);
     
    let rigidBody = this.world.createRigidBody(rigidBodyDesc);
    this.rigidBody = rigidBody;

    // Create a cuboid collider attached to the dynamic rigidBody.
    //let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x, size.y, size.z);
    let collider = this.world.createCollider(colliderDesc, rigidBody);
    collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT);
    collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    //https://rapier.rs/docs/user_guides/javascript/advanced_collision_detection/#contact-and-intersection-filtering
    //collider.setActiveHooks(RAPIER.ActiveHooks.FILTER_CONTACT_PAIRS);
    collider.setActiveHooks(RAPIER.ActiveHooks.FILTER_INTERSECTION_PAIR);//works,
    console.log(collider)

    //console.log(rigidBody);

    //ball.userData.physicsBody = rigidBody;
    return rigidBody;
  }

  add_body_sync(_object){
    this.rigidBodies.push(_object);
  }

  //update body from scene object > userData
  //updateBodies(){
    //if(this.rigidBodies){
      //for ( let i = 0; i < this.rigidBodies.length; i++ ) {
        //let objThree = this.rigidBodies[ i ];
        //let objPhysics = objThree.userData.physicsBody;
        //if(objPhysics){
          //let p = objPhysics.translation();
          //objThree.position.set( p.x, p.y, p.z );
          //let q = objPhysics.rotation();
          //console.log(r);
          //objThree.quaternion.set( q.x, q.y, q.z, q.w );
        //}
      //}
    //}
  //}

  update(delta){
    //console.log('physics update!');
    if (this.world == null){
      console.log('physics update null');
      return;
    }
    
    let eventQueue = new RAPIER.EventQueue(true);
    //console.log(eventQueue);
    // Step the simulation forward.
    this.world.step(eventQueue);
    //this.updateBodies();

    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      /* Handle the collision event. */
      
      //console.log("drainCollisionEvents...");
      //console.log(handle1)
      //console.log(handle2)
      //console.log(started)
      this.event.fireEvent("drainCollisionEvents",{
        handle1,
        handle2,
        started
      });
    });

    eventQueue.drainContactForceEvents(event => {
      let handle1 = event.collider1(); // Handle of the first collider involved in the event.
      let handle2 = event.collider2(); // Handle of the second collider involved in the event.
      /* Handle the contact force event. */
      console.log("drainContactForceEvents...");
    });
  }

}

export {
  Physics_Rapier
}