/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import CorePhysics from "./corephysics.js";
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

//DRAW PHYSICS VERTICES
class RapierDebugRenderer {
  mesh
  world
  enabled = true
  //threejs, physics
  constructor(scene, world) {
    this.world = world
    this.mesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true }))
    this.mesh.frustumCulled = false
    scene.add(this.mesh)
  }

  update() {
    if (this.enabled) {
      const { vertices, colors } = this.world.debugRender()
      this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
      this.mesh.visible = true
    } else {
      this.mesh.visible = false
    }
  }
}

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
    await this.build();
  }

  async build(){
    this.world = new this.RAPIER.World(this.gravity);
    //rapierDebugRenderer = new RapierDebugRenderer(scene, physics);
    
    await new Promise(resolve => setTimeout(resolve, 1));
  }

  update(delta){
    super.update(delta);
    this.world.step();
    //console.log(delta);
  }

  get API(){
    return this.RAPIER;
  }

}

export default PhysicsRapier;

export {
  RapierDebugRenderer
}