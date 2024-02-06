//testing...

import { 
  THREE, 
  van,
  CSS3DRenderer,
  CSS3DObject,
  OrbitControls
} from "./triengine/dps.js";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const { 
  div 
} = van.tags;

function Element( id, x, y, z, ry ) {

  const div0 = document.createElement( 'div' );
  div0.style.width = '480px';
  div0.style.height = '360px';
  div0.style.backgroundColor = '#000';

  const iframe = document.createElement( 'iframe' );
  iframe.style.width = '480px';
  iframe.style.height = '360px';
  iframe.style.border = '0px';
  //iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
  //div0.appendChild( iframe );

  //const divEl = div({style:"width:480px;height:360px;backgroundColor:gray;"});
  //console.log(divEl)
  //div0.appendChild( divEl );

  const object = new CSS3DObject( div0 );
  object.position.set( x, y, z );
  object.rotation.y = ry;

  return object;
}

function init(){
  const cssrenderer = new CSS3DRenderer();
  cssrenderer.domElement.style.position = 'absolute';
  cssrenderer.domElement.style.top = '0px';
  cssrenderer.setSize( window.innerWidth, window.innerHeight );
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

  const geometry = new THREE.BoxGeometry( 100, 100, 100 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  const mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  const group = new THREE.Group();
  scene.add(group)
  //group.add( new Element( 'SJOz3qjfQXU', 0, 0, 240, 0 ) );
  //group.add( new Element( 'SJOz3qjfQXU', 0, 0, 0, 0 ) );
  //scene.add( new Element( 'SJOz3qjfQXU', 0, 0, 0, 0 ) );

  function clicktest(){
    console.log("click...")
  }

  const divEl = div({style:"width:480px;height:360px;",onclick:()=>clicktest()});
  divEl.style.backgroundColor='#000';
  //note if OrbitControls is use the over lay will not work
  //const test = div({style:"width:480px;height:360px;",onclick:()=>clicktest()});
  //test.style.backgroundColor='blue';
  //divEl.appendChild(test)
  console.log(divEl);
  const cssobject = new CSS3DObject( divEl );
  cssobject.position.set( 0, 0, 0 );
  cssobject.rotation.y = 0;
  scene.add(cssobject)

  //const controls = new TrackballControls( camera, renderer.domElement );
	//controls.rotateSpeed = 4;

  const controls = new OrbitControls(camera, renderer.domElement)
  //const csscontrols = new OrbitControls(camera, cssrenderer.domElement)
  
  van.add(document.body, renderer.domElement);
  van.add(document.body, cssrenderer.domElement);
  window.addEventListener( 'resize', onWindowResize );

  function animate() {
    //console.log('update...');
    renderer.render( scene, camera );
    cssrenderer.render( scene, camera );
    controls.update();
    //csscontrols.update();
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

