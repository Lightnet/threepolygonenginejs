/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { THREE, OrbitControls, van  } from "./dps.js";

const ThreeSceneEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    //engine.val = new ThreeScene({canvas:renderEL,isPhysics:true});
    //console.log(engine.val);//
  }

  init();

  return div(
    renderEL
  )
};

export {
  ThreeSceneEL,
}