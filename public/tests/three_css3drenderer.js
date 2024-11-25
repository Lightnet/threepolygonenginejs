/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

//testing...

import { 
  THREE, 
  van,
  CSS3DRenderer,
  CSS3DObject,
  OrbitControls
} from "/dps.js";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const { 
  div 
} = van.tags;

function init(){
  //CSS
  const cssrenderer = new CSS3DRenderer();
  cssrenderer.domElement.style.position = 'absolute';
  cssrenderer.domElement.style.top = '0px';
  cssrenderer.setSize( window.innerWidth, window.innerHeight );
  //WEBGL
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xffffff, 0);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0px';
  renderer.setSize( window.innerWidth, window.innerHeight );
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.set( 500, 350, 750 );
  //camera.position.set( 100, 100, 100 );
  camera.lookAt(0,0,0);
  //CREATE GEO
  const geometry = new THREE.BoxGeometry( 100, 100, 100 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  const mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  const group = new THREE.Group();
  scene.add(group)

  function clicktest(){
    console.log("click...")
  }

  const divEl = div({style:"width:480px;height:360px;",onclick:()=>clicktest()});
  divEl.style.backgroundColor='#000';
  //note if OrbitControls is use the over lay will not work
  console.log(divEl);
  const cssobject = new CSS3DObject( divEl );
  cssobject.position.set( 0, 0, 0 );
  cssobject.rotation.y = 0;
  scene.add(cssobject)

  //const controls = new TrackballControls( camera, renderer.domElement );
	//controls.rotateSpeed = 4;

  //const controls = new OrbitControls(camera, renderer.domElement)
  //const csscontrols = new OrbitControls(camera, cssrenderer.domElement)
  
  van.add(document.body, renderer.domElement);
  van.add(document.body, cssrenderer.domElement);
  window.addEventListener( 'resize', onWindowResize );

  function animate() {
    //console.log('update...');
    renderer.render( scene, camera );
    cssrenderer.render( scene, camera );
    //controls.update();
    //csscontrols.update();
    cssobject.rotation.y += 0.01;
    requestAnimationFrame( animate );
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    cssrenderer.setSize( window.innerWidth, window.innerHeight );
  }

  animate();
}

init();

