/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { 
  THREE,
  //ECS,
  //van
} from "/dps.js";

//https://discourse.threejs.org/t/convert-screen-2d-to-world-3d-coordiate-system-without-using-raycaster/13739/6
function screenToWorld({ x, y, canvasWidth, canvasHeight, camera }) {
  const coords = new THREE.Vector3(
      (x / canvasWidth) * 2 - 1,
      -(y / canvasHeight) * 2 + 1,
      0.5
  )
  const worldPosition = new THREE.Vector3()
  const plane = new THREE.Plane(new THREE.Vector3(0.0, 0.0, 1.0))//face camera?
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(coords, camera)
  return raycaster.ray.intersectPlane(plane, worldPosition)
}

export {
  screenToWorld
}