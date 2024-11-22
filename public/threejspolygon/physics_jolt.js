/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import CorePhysics from "./corephysics.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
const JOLT_PATH = 'https://cdn.jsdelivr.net/npm/jolt-physics@0.29.0/dist/jolt-physics.wasm-compat.js';

class PhysicsJolt extends CorePhysics{
  // Object layers
  LAYER_NON_MOVING = 0;
  LAYER_MOVING = 1;
  NUM_OBJECT_LAYERS = 2;
  Jolt=null;
  jolt=null;
  physicsSystem=null;
  bodyInterface=null;

  DegreesToRadians=null;
  wrapVec3=null;
  unwrapVec3=null;
  wrapRVec3=null;
  unwrapRVec3=null;
  wrapQuat=null;
  unwrapQuat=null;


  constructor(args){
    super(args);

  }
  // https://github.com/jrouwe/JoltPhysics.js/blob/main/Examples/js/example.js
  // default
  setupCollisionFiltering( settings ) {
    // Layer that objects can be in, determines which other objects it can collide with
  	// Typically you at least want to have 1 layer for moving bodies and 1 layer for static bodies, but you can have more
  	// layers if you want. E.g. you could have a layer for high detail collision (which is not used by the physics simulation
  	// but only if you do collision testing).
  	let objectFilter = new this.Jolt.ObjectLayerPairFilterTable(this.NUM_OBJECT_LAYERS);
  	objectFilter.EnableCollision(this.LAYER_NON_MOVING, this.LAYER_MOVING);
  	objectFilter.EnableCollision(this.LAYER_MOVING, this.LAYER_MOVING);

  	// Each broadphase layer results in a separate bounding volume tree in the broad phase. You at least want to have
  	// a layer for non-moving and moving objects to avoid having to update a tree full of static objects every frame.
  	// You can have a 1-on-1 mapping between object layers and broadphase layers (like in this case) but if you have
  	// many object layers you'll be creating many broad phase trees, which is not efficient.
  	const BP_LAYER_NON_MOVING = new this.Jolt.BroadPhaseLayer(0);
  	const BP_LAYER_MOVING = new this.Jolt.BroadPhaseLayer(1);
  	const NUM_BROAD_PHASE_LAYERS = 2;
  	let bpInterface = new this.Jolt.BroadPhaseLayerInterfaceTable(this.NUM_OBJECT_LAYERS, NUM_BROAD_PHASE_LAYERS);
  	bpInterface.MapObjectToBroadPhaseLayer(this.LAYER_NON_MOVING, BP_LAYER_NON_MOVING);
  	bpInterface.MapObjectToBroadPhaseLayer(this.LAYER_MOVING, BP_LAYER_MOVING);

  	settings.mObjectLayerPairFilter = objectFilter;
  	settings.mBroadPhaseLayerInterface = bpInterface;
  	settings.mObjectVsBroadPhaseLayerFilter = new this.Jolt.ObjectVsBroadPhaseLayerFilterTable(settings.mBroadPhaseLayerInterface, NUM_BROAD_PHASE_LAYERS, settings.mObjectLayerPairFilter, this.NUM_OBJECT_LAYERS);

  }

  async setup(){
    //required html script can't import from script
    const { default: initJolt } = await import( `${JOLT_PATH}` );
    //console.log(AMMO);
    this.Jolt = await initJolt();
    console.log(this.Jolt);
    await this.build();
  }

  async build(){
    const settings = new this.Jolt.JoltSettings();
    this.setupCollisionFiltering(settings);
    this.jolt = new this.Jolt.JoltInterface( settings );// world physics
    this.Jolt.destroy( settings );
    this.physicsSystem = this.jolt.GetPhysicsSystem();
    this.bodyInterface = this.physicsSystem.GetBodyInterface();

    this.DegreesToRadians = (deg) => deg * (Math.PI / 180.0);

    this.wrapVec3 = (v) => new THREE.Vector3(v.GetX(), v.GetY(), v.GetZ());
    this.unwrapVec3 = (v) => new this.Jolt.Vec3(v.x, v.y, v.z);
    this.wrapRVec3 = this.wrapVec3;
    this.unwrapRVec3 = (v) => new this.Jolt.RVec3(v.x, v.y, v.z);
    this.wrapQuat = (q) => new THREE.Quaternion(q.GetX(), q.GetY(), q.GetZ(), q.GetW());
    this.unwrapQuat = (q) => new this.Jolt.Quat(q.x, q.y, q.z, q.w);
  }

  update(delta){
    super.update(delta);
    let deltaTime = delta;
    // Don't go below 30 Hz to prevent spiral of death
    deltaTime = Math.min( deltaTime, 1.0 / 30.0 );
    // When running below 55 Hz, do 2 steps instead of 1
    const numSteps = deltaTime > 1.0 / 55.0 ? 2 : 1;

    // Step the physics world
    //console.log(this.jolt)
    this.jolt.Step( deltaTime, numSteps );

    //console.log("update...", deltaTime);
  }

  get API(){
    return this.Jolt;
  }
}

export default PhysicsJolt;