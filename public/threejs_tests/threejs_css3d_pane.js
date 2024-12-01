


import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';

const {div,style} = van.tags;

const myStyle = style(`
  /* Default wrapper view */
  .yourCustomContainer .tp-dfwv {
    min-width: 360px;
  }   
  `);
van.add(document.body,myStyle)

const PARAMS = {
  factor: 123,
  title: 'hello',
  color: '#ff0055',
  percentage: 50,
  theme: 'dark',
  size:8,
  text:'text',
};

const divPane = div({style:`position:fixed;top:0px;left:0px;`,class:'yourCustomContainer'})
van.add(document.body,divPane)
const pane0 = new Pane({
  title: 'Parameters',
  container:divPane,
  expanded: true,
});

pane0.addButton({
  title: 'test',
  //label: 'counter',   // optional
}).on('click', () => {
  console.log('test')
});



//CSS
const cssrenderer = new CSS3DRenderer();
cssrenderer.domElement.style.position = 'absolute';
cssrenderer.domElement.style.top = '0px';
cssrenderer.setSize( window.innerWidth, window.innerHeight );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
//camera.position.set( 500, 350, 750 );
camera.position.set( 0, 350, 750 );
camera.lookAt(0,0,0);

window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  //renderer.setSize( window.innerWidth, window.innerHeight );
  cssrenderer.setSize( window.innerWidth, window.innerHeight );
}

const cssobject = new CSS3DObject( divPane );
cssobject.position.set( 0, 0, 0 );
cssobject.rotation.y = 0;
scene.add(cssobject)

function createPane(){
  const pane = new Pane({
    title: 'Parameters',
    expanded: true,
  });

  const orbitControlsFolder = pane.addFolder({title: 'Orbit Controls',expanded: true,});
  orbitControlsFolder.addBinding(orbitControls, 'autoRotate');
  orbitControlsFolder.addBinding(orbitControls, 'autoRotateSpeed');
  orbitControlsFolder.addBinding(orbitControls, 'dampingFactor');
  orbitControlsFolder.addBinding(orbitControls, 'enableDamping');
  orbitControlsFolder.addBinding(orbitControls, 'enablePan');
  orbitControlsFolder.addBinding(orbitControls, 'enableRotate');
  orbitControlsFolder.addBinding(orbitControls, 'enableZoom');
  orbitControlsFolder.addBinding(orbitControls, 'panSpeed');
  orbitControlsFolder.addBinding(orbitControls, 'rotateSpeed');
  orbitControlsFolder.addBinding(orbitControls, 'screenSpacePanning');
  orbitControlsFolder.addBinding(orbitControls, 'zoomToCursor');
  orbitControlsFolder.addBinding(orbitControls, 'enabled');
  
  // pane.addBinding(PARAMS, 'factor');
  // pane.addBinding(PARAMS, 'title');
  // pane.addBinding(PARAMS, 'color');
  
  // // `min` and `max`: slider
  // pane.addBinding(
  //   PARAMS, 'percentage',
  //   {min: 0, max: 100, step: 10}
  // );
  
  // // `options`: list
  // pane.addBinding(
  //   PARAMS, 'theme',
  //   {options: {Dark: 'dark', Light: 'light'}}
  // );
  
  // const f = pane.addFolder({
  //   title: 'Title',
  //   expanded: true,
  // });
  
  // // f.addBinding(PARAMS, 'text');
  // f.addBinding(PARAMS, 'size');
  
  // const b = pane.addBinding(
  //   PARAMS, 'size',
  //   {min: 8, max: 100, step: 1}
  // );
  
  // b.on('change', function(ev) {
  //   console.log(`change: ${ev.value}`);
  // });
  
  // const pane2 = new Pane({
  //   title: 'Parameters2',
  //   expanded: true,
  // });
}
var orbitControls = new OrbitControls( camera, cssrenderer.domElement );

function animate() {

  cssrenderer.render( scene, camera );
  requestAnimationFrame( animate );
}

function setupScene(){
  
  van.add(document.body, cssrenderer.domElement);
  //this should be here else it not able to interact
  createPane();
  //loop render
  animate();
}

setupScene();