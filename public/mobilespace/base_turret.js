/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { THREE } from "./dps.js";

class BaseTurret{
  gpoint = new THREE.Vector3();
  gpointRot = new THREE.Quaternion();;

  constructor(scene){
    this.group = new THREE.Group();
    scene.add(this.group);
    this.base = this.create_cube({width:0.5,height:0.5,depth:1,color:'blue'})
    this.group.add(this.base);
    
    this.group.position.set(0,0,5)

    this.axesHelper = new THREE.AxesHelper( 5 );
    this.base.add(this.axesHelper);

    this.point = this.create_cube({width:0.5,height:0.5,depth:0.5,color:'gray'})
    this.base.add(this.point);
    this.point.position.set(0,0,1)

    this.pointer = this.create_cube({width:0.6,height:0.6,depth:0.6,color:'red'})
    scene.add(this.pointer);
    //this.group.add(this.axesHelper);
  }

  update(){
    this.point.getWorldPosition(this.gpoint);
    this.point.getWorldQuaternion(this.gpointRot);
    //console.log("base position: ",this.gpoint);
    this.pointer.position.copy(this.gpoint)
    this.pointer.quaternion.copy(this.gpointRot)
  }

  create_cube(args){
    let color = args?.color || 0x00ffff;
    let x  = args?.x || 0;
    let y  = args?.x || 0;
    let z  = args?.x || 0;
  
    let width  = args?.width || 1;
    let height  = args?.height || 1;
    let depth  = args?.depth || 1;
    const geometry = new THREE.BoxGeometry( width, height, depth );
    //const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const material0 = new THREE.MeshLambertMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material0 );
    cube.position.set(x,y,z);
    //scene.add( cube );
    return cube;
  }

  setTargetVector3(target){
    //console.log("target pos: ",target)
    this.base.lookAt(target);
    this.update();
  }

}

export default BaseTurret;