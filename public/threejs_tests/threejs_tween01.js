/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// https://jsfiddle.net/26tgaufc/13/
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import TWEEN from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/tween.module.js'; //odd url error?

console.log(TWEEN);

import { SimplexNoise } from 'https://unpkg.com/three@0.170.0/examples/jsm/math/SimplexNoise.js';
import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';

const stats = new Stats();
van.add(document.body, stats.dom);


const groupTween = new TWEEN.Group();

console.log(groupTween);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
//var myTween;
// GUI FUNC
const myObject ={
  test_move:function (){
    console.log('test');

    const coords = {x: 0, y: 0} // Start at (0, 0)

    //myTween = new TWEEN.Tween(coords)
    const myTween = new TWEEN.Tween(cube.position)
      .to({y:2},2000)
      //.delay(Math.random() * 1000)
      //.easing(TWEEN.Easing.Elastic.InOut)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate((object)=>{
        //console.log('update...');
        console.log('object: ', object);
        //console.log('pos: ', coords);
      }).onComplete(()=>{
        console.log('DONE');
      });
    myTween.start();
    //console.log(myTween);
    groupTween.add(myTween);

  },
  reset_obj:function (){
    console.log('reset');
    const resetTween = new TWEEN.Tween(cube.position)
      .to({y:0},1000)
      //.delay(Math.random() * 1000)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate((object)=>{
        console.log('update...');
        //console.log('object: ', object);
        //console.log('pos: ', coords);
      }).onComplete(()=>{
        console.log('DONE');
      });
    resetTween.start();
    groupTween.add(resetTween);
    //console.log(resetTween);
  }
}

// https://lil-gui.georgealways.com/

function createUI(){
  const gui = new GUI();
  gui.add(myObject, 'test_move').name('Test Move');
  gui.add(myObject, 'reset_obj').name('Reset');
}

createUI();

// LOOP UPDATE
var clock = new THREE.Clock();
function animate() {
  const deltaTime = clock.getDelta();
  if(stats){
    stats.update();
  }
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
  // if(myTween){//works
  //   myTween.update();
  // }
  groupTween.update();

	renderer.render( scene, camera );
}
//Init loop
renderer.setAnimationLoop( animate );

