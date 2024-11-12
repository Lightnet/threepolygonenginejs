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
//import { SimplexNoise } from 'https://unpkg.com/three@0.170.0/examples/jsm/math/SimplexNoise.js';
//import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';
//console.log(TWEEN);

const stats = new Stats();
van.add(document.body, stats.dom);

const groupTween = new TWEEN.Group();
//console.log(groupTween);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0,5,5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

function setup_GridHelper(){
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

// https://github.com/tweenjs/tween.js/blob/main/examples/11_stop_all_chained_tweens.html
var myTween;
// OBJ FUNC
const myObject ={
  timeMove:3000,
  pos:{x:0,y:2,z:0},
  test_move:function (){
    console.log('test');
    //const coords = {x: 0, y: 0} // Start at (0, 0)
    myTween = new TWEEN.Tween(cube.position)
    //const myTween = new TWEEN.Tween(cube.position)
      .to(this.pos,this.timeMove)
      //.delay(Math.random() * 1000)
      //.easing(TWEEN.Easing.Elastic.InOut)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate((object)=>{
        console.log('update...');
        //console.log('object: ', object);
        //console.log('pos: ', coords);
      }).onStop((object)=>{
        console.log('STOP?', object);
        //groupTween.removeAll();
        groupTween.remove(myTween);
        // if(object){
        //   cube.position.copy(object)
        // }
      })
      .onComplete(()=>{
        console.log('DONE');
      });
    myTween.start();
    //console.log(myTween);
    
    groupTween.add(myTween);
    console.log(groupTween);

  },
  remove_tween:function(){
    console.log(groupTween);
    groupTween.remove(myTween);
  },
  reset_obj:function (){
    console.log('reset');
    const resetTween = new TWEEN.Tween(cube.position)
      .to({x:0,y:0,z:0},1000)
      //.delay(Math.random() * 1000)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate((object)=>{
        //console.log('update...');
        //console.log('object: ', object);
        //console.log('pos: ', coords);
      }).onComplete(()=>{
        console.log('DONE');
      });
    resetTween.start();
    groupTween.add(resetTween);
    //console.log(resetTween);
  },
  stop_obj:function (){
    if(myTween){
      console.log(myTween);
      myTween.stop();
    }
  },
  stopchain_obj:function (){
    if(myTween){
      console.log(myTween);
      myTween.stopChainedTweens();
    }
  },
  end_obj:function (){
    if(myTween){
      console.log(myTween);
      myTween.end();
      groupTween.remove(myTween);
    }
  },
  remove_all_tween:function (){
    groupTween.removeAll();
  }
}

// https://lil-gui.georgealways.com/
function createUI(){
  const gui = new GUI();
  gui.add(myObject, 'timeMove', 0 ,10000, 1).name('Move Time');
  //gui.add(myObject, 'remove_all_tween').name('Remove All Tweens');
  //gui.add(myObject, 'remove_tween').name('Remove Tween');
  gui.add(myObject.pos, 'x').name('X: ');
  gui.add(myObject.pos, 'y').name('Y: ');
  gui.add(myObject.pos, 'z').name('Z: ');
  gui.add(myObject, 'test_move').name('Move');
  gui.add(myObject, 'stop_obj').name('Stop');
  //gui.add(myObject, 'stopchain_obj').name('Stop Chain');
  gui.add(myObject, 'end_obj').name('End (finish it)');
  gui.add(myObject, 'reset_obj').name('Reset');
}

// LOOP UPDATE
var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );
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
  controls.update();

	renderer.render( scene, camera );
}
//Init loop
renderer.setAnimationLoop( animate );
createUI();
setup_GridHelper();
// ADD RENDER to Body doc.
van.add(document.body, renderer.domElement);
