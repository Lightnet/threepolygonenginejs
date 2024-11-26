/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import FrameWork_Physics from "./framework_physics.js";

const JOLT_PATH = 'https://cdn.jsdelivr.net/npm/jolt-physics@0.29.0/dist/jolt-physics.wasm-compat.js';

const wrapVec3 = (v) => new THREE.Vector3(v.GetX(), v.GetY(), v.GetZ());
const unwrapVec3 = (v) => new Jolt.Vec3(v.x, v.y, v.z);
const wrapRVec3 = wrapVec3;
const unwrapRVec3 = (v) => new Jolt.RVec3(v.x, v.y, v.z);
const wrapQuat = (q) => new THREE.Quaternion(q.GetX(), q.GetY(), q.GetZ(), q.GetW());
const unwrapQuat = (q) => new Jolt.Quat(q.x, q.y, q.z, q.w);

const LAYER_NON_MOVING = 0;
const LAYER_MOVING = 1;
const NUM_OBJECT_LAYERS = 2;

class Physics_Jolt extends FrameWork_Physics{
  gravity = { x: 0.0, y: -9.81, z: 0.0 };
  //isPhysics = false;
  world=null;
  rigidBodies = [];

  constructor(args){
    super(args)
  }

  // https://github.com/jrouwe/JoltPhysics.js/blob/main/Examples/js/example.js
  setupCollisionFiltering( settings ) {
    const Jolt = this.Jolt;

    // Layer that objects can be in, determines which other objects it can collide with
  	// Typically you at least want to have 1 layer for moving bodies and 1 layer for static bodies, but you can have more
  	// layers if you want. E.g. you could have a layer for high detail collision (which is not used by the physics simulation
  	// but only if you do collision testing).
  	let objectFilter = new Jolt.ObjectLayerPairFilterTable(NUM_OBJECT_LAYERS);
  	objectFilter.EnableCollision(LAYER_NON_MOVING, LAYER_MOVING);
  	objectFilter.EnableCollision(LAYER_MOVING, LAYER_MOVING);

  	// Each broadphase layer results in a separate bounding volume tree in the broad phase. You at least want to have
  	// a layer for non-moving and moving objects to avoid having to update a tree full of static objects every frame.
  	// You can have a 1-on-1 mapping between object layers and broadphase layers (like in this case) but if you have
  	// many object layers you'll be creating many broad phase trees, which is not efficient.
  	const BP_LAYER_NON_MOVING = new Jolt.BroadPhaseLayer(0);
  	const BP_LAYER_MOVING = new Jolt.BroadPhaseLayer(1);
  	const NUM_BROAD_PHASE_LAYERS = 2;
  	let bpInterface = new Jolt.BroadPhaseLayerInterfaceTable(NUM_OBJECT_LAYERS, NUM_BROAD_PHASE_LAYERS);
  	bpInterface.MapObjectToBroadPhaseLayer(LAYER_NON_MOVING, BP_LAYER_NON_MOVING);
  	bpInterface.MapObjectToBroadPhaseLayer(LAYER_MOVING, BP_LAYER_MOVING);

  	settings.mObjectLayerPairFilter = objectFilter;
  	settings.mBroadPhaseLayerInterface = bpInterface;
  	settings.mObjectVsBroadPhaseLayerFilter = new Jolt.ObjectVsBroadPhaseLayerFilterTable(settings.mBroadPhaseLayerInterface, NUM_BROAD_PHASE_LAYERS, settings.mObjectLayerPairFilter, NUM_OBJECT_LAYERS);

  }

  async init(){
    super.init();
    const { default: initJolt } = await import( `${JOLT_PATH}` );
    const Jolt = await initJolt();
    this.Jolt = Jolt;
    const wrapVec3 = (v) => new THREE.Vector3(v.GetX(), v.GetY(), v.GetZ());
    this.wrapVec3 = wrapVec3;
    const wrapQuat = (q) => new THREE.Quaternion(q.GetX(), q.GetY(), q.GetZ(), q.GetW());
    this.wrapQuat = wrapQuat;

    this.setup(Jolt)
  }

  async setup(Jolt){
    const settings = new Jolt.JoltSettings();
    this.setupCollisionFiltering(settings);
    this.world = new Jolt.JoltInterface( settings );// world physics
    
    Jolt.destroy( settings );
    this.physicsSystem = this.world.GetPhysicsSystem();
    this.bodyInterface = this.physicsSystem.GetBodyInterface();
  }

  update(delta){
    super.update(delta);
    let deltaTime = Math.min( delta, 1.0 / 30.0 );
    const numSteps = deltaTime > 1.0 / 55.0 ? 2 : 1;
    if(this.world){
      // Step the physics world
      this.world.Step( deltaTime, numSteps );
    }
  }

  API(){
    return this.Jolt;
  }
}

export default Physics_Jolt;

export{
  LAYER_NON_MOVING,
  LAYER_MOVING,
  NUM_OBJECT_LAYERS,
}