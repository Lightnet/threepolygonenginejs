/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

//testing
// TrackballControls block click event UI since preventdefault mouse handle.

// https://threejs.org/examples/#css2d_label
// https://github.com/mrdoob/three.js/blob/master/examples/css2d_label.html
import { 
  THREE, 
  van,
  //CSS3DRenderer,
  //CSS3DObject 
} from "/dps.js";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

function init(){
  const gui = new GUI();
  const renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0xffffff, 0);
	
  const cssRenderer = new CSS2DRenderer();
  cssRenderer.setSize( window.innerWidth, window.innerHeight );
  cssRenderer.domElement.style.position = 'absolute';
  cssRenderer.domElement.style.top = '0px';
  //cssRenderer.setClearColor( 0xffffff, 0);//it not webgl
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
  //camera.position.set( 500, 350, 750 );
  camera.position.set( 20, 15, 30 );
  camera.lookAt(0,0,0)
  camera.layers.enableAll();

  const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
	dirLight.position.set( 0, 0, 1 );
	dirLight.layers.enableAll();
	scene.add( dirLight );

	const axesHelper = new THREE.AxesHelper( 5 );
	axesHelper.layers.enableAll();
	scene.add( axesHelper );

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  const mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  //=============================================
  // 2D ELEMENT
  //=============================================

  const earthDiv = document.createElement( 'div' );
	//earthDiv.className = 'label';
	earthDiv.textContent = 'Earth';
	//earthDiv.style.backgroundColor = 'transparent';
	earthDiv.style.backgroundColor = 'gray';
  //earthDiv.style.display = 'block';
  earthDiv.style.width = '200px;'
  earthDiv.style.height = '200px;'
  console.log(earthDiv)
  earthDiv.addEventListener("click",function(){
    console.log("test click");
  });
  //van.add(document.body, earthDiv);

  const earthLabel = new CSS2DObject( earthDiv );
  earthLabel.position.set( 0, 0, 0 );
	earthLabel.center.set( 0, 1 );
	//earth.add( earthLabel );
	earthLabel.layers.set( 0 );
  scene.add(earthLabel)
  //=============================================
  // 2D ELEMENT END
  //=============================================

  //document.body.appendChild( renderer.domElement );
  van.add(document.body,  renderer.domElement); //render append to body
  van.add(document.body, cssRenderer.domElement); //render append to body
  
  //const controls = new TrackballControls( camera, renderer.domElement );
  const controls = new TrackballControls( camera, cssRenderer.domElement );
	//controls.rotateSpeed = 4;
  gui.add(controls,'enabled').name('TrackballControls uncheck for click ')
  
  window.addEventListener( 'resize', onWindowResize );

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cssRenderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    //console.log('update...');
    cssRenderer.render( scene, camera );
    renderer.render( scene, camera );
    controls.update();
    //requestAnimationFrame( animate );
  }

  //animate();
  renderer.setAnimationLoop( animate );
}

init();

