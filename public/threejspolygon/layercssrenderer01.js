/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://discourse.threejs.org/t/css3drednerer-object/36464/7
// https://stackoverflow.com/questions/41279071/how-to-use-three-css3drenderer-in-angular2
// https://jsfiddle.net/x1Lw3b5m/
// https://sbcode.net/threejs/trackball-controls/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
//import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
// https://stackoverflow.com/questions/18813481/three-js-mousedown-not-working-when-trackball-controls-enabled
import {TrackballControls} from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'https://unpkg.com/three@0.170.0/examples/jsm/renderers/CSS3DRenderer.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

const {div,button} = van.tags;

const stats = new Stats();

class CSSRenderer {

  constructor(args){
    this.setup()
  }

  setup(){

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(200, 200, 200);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //document.body.appendChild(this.renderer.domElement);
    //console.log(this.cssRenderer);
    this.setupCSS()
  }

  setupCSS(){
    this.cssScene = new THREE.Scene();

    // this.cssCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    // this.cssCamera.position.set(200, 0, 200);
    // this.cssCamera.lookAt(new THREE.Vector3(0, 0, 0));

    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    this.cssRenderer.domElement.style.position = 'absolute';
    this.cssRenderer.domElement.style.top = '0px';
    this.cssRenderer.domElement.style.left = '0px';

    window.addEventListener('resize',this.onResize.bind(this));

    this.setupScene();
  }

  c_hello(){
    console.log('Hello');
  }

  onResize(event){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    // this.cssCamera.aspect = window.innerWidth / window.innerHeight;
    // this.cssCamera.updateProjectionMatrix();
    this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
  }

  setupScene(){

    const geometry = new THREE.BoxGeometry( 50, 50, 50 ); 
    const material = new THREE.MeshBasicMaterial( {
      color: 0x00ff00,
      wireframe: true,
    } ); 
    const cube = new THREE.Mesh( geometry, material ); 
    this.scene.add( cube );
    this.cube = cube;

    //const element = document.createElement('div');
    const element = div({},button({onclick:this.c_hello.bind(this)},'CLick Me'));
    element.style.width = '100px';
    element.style.height = '100px';
    //element.style.opacity =  1;
    element.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
    const cssObject = new CSS3DObject(element);
    this.cssScene.add(cssObject);

    van.add(document.body, this.renderer.domElement);
    van.add(document.body, this.cssRenderer.domElement);
    van.add(document.body, stats.dom);

    //need to append render before this else not working
    //this.trackBallControls = new TrackballControls(this.cssCamera, this.cssRenderer.domElement);
    this.trackBallControls = new TrackballControls(this.camera, this.cssRenderer.domElement);
    this.trackBallControls.rotateSpeed = 10.0
    //this.trackBallControls = new TrackballControls(this.camera, this.renderer.domElement);
    console.log(this.trackBallControls);

    //console.log(this.camera.position)
    //set up frame render loop
    this.renderer.setAnimationLoop( this.update.bind(this));
    this.createGUI();
  }

  createGUI(){
    const gui = new GUI();
    this.gui = gui;
    console.log(this.trackBallControls);
    //reason is default prevent call function to disable html button
    gui.add(this.trackBallControls,'enabled').name('enabled(uncheck to click button)')
    gui.add(this.trackBallControls,'noPan')
    gui.add(this.trackBallControls,'noRotate')
    gui.add(this.trackBallControls,'minZoom')
    gui.add(this.trackBallControls,'panSpeed')
    gui.add(this.trackBallControls,'rotateSpeed')
    gui.add(this.trackBallControls,'zoomSpeed')
  }

  update(){
    if(this.cube){
      this.cube.rotation.x += 0.01;
    }
    stats.update();

    this.trackBallControls.update();
    this.renderer.render(this.scene, this.camera);
    this.cssRenderer.render(this.cssScene, this.camera);
    //console.log(this.trackBallControls);
    //console.log("Hello")
  }

  // get domElement(){
  //   return this.cssRenderer.domElement;
  // }

}

const cssRenderer = new CSSRenderer();

//van.add(document.body, cssRenderer.renderer.domElement);
//van.add(document.body, cssRenderer.cssRenderer.domElement);
console.log("init css3d")