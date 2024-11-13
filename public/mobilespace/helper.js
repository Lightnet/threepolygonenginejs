
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';

function create_cube(args){
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

export {
  create_cube
}