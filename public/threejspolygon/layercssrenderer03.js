/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// notes:
// testing div gui style
//

// https://discourse.threejs.org/t/css3drednerer-object/36464/7
// https://stackoverflow.com/questions/41279071/how-to-use-three-css3drenderer-in-angular2
// https://jsfiddle.net/x1Lw3b5m/
// https://sbcode.net/threejs/trackball-controls/
// https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
// https://discourse.threejs.org/t/get-mouse-x-y-z-coordinates-in-scene-with-no-children/10231
// https://stackoverflow.com/questions/11534000/three-js-converting-3d-position-to-2d-screen-position
// 

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
  trackBallControls=null;
  pointer = new THREE.Vector2();
  //raycaster = new THREE.Raycaster();
  isResize = true;

  constructor(args){
    this.setup()
  }

  screenToWorld({ x, y, canvasWidth, canvasHeight, camera }) {
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

  setup(){
    this.setupRenderer();
    this.setupCSSRenderer();

    this.setupScene();
    this.setupCSSScene();

    this.setupElements();
    this.setupListeners();
    
    this.setupController();
    this.createGUI();
    this.setupUpdate();
    
    window.dispatchEvent(new Event('resize'));
  }

  setupRenderer(){
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    //this.camera.position.set(200, 200, 200);
    this.camera.position.set(0, 0, 200);
    //this.camera.position.set(0, 0, window.innerWidth);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene = new THREE.Scene();
    //this.scene.background = new THREE.Color(0xf0f0f0);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setupCSSRenderer(){
    this.cssScene = new THREE.Scene();
    this.cssCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    //this.cssCamera.position.set(200, 0, 200);
    this.cssCamera.position.set(0, 0, window.innerWidth);
    this.cssCamera.lookAt(new THREE.Vector3(0, 0, 0));

    //this.cssCamera.position.set(0, 0, window.innerWidth);
    //this.cssCamera.position.set(0, 0, 1120);

    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    this.cssRenderer.domElement.style.position = 'absolute';
    this.cssRenderer.domElement.style.top = '0px';
    this.cssRenderer.domElement.style.left = '0px';
  }

  c_hello(){
    console.log('Hello');
  }

  setupScene(){
    const geometry = new THREE.BoxGeometry( 50, 50, 50 ); 
    const material = new THREE.MeshBasicMaterial( {
      color: 0x00ff00,
      wireframe: true,
    } ); 
    const cube = new THREE.Mesh( geometry, material ); 
    this.cube = cube;
    this.scene.add( cube );
  }

  setupCSSScene(){

    // 
    // const element = document.createElement('div');
    const element = div({},button({onclick:this.c_hello.bind(this)},'Click Me'));
    element.style.width = '100px';
    element.style.height = '100px';
    //element.style.opacity =  1;
    element.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
    const cssObject = new CSS3DObject(element);
    cssObject.position.z = 1;
    this.cssScene.add(cssObject);

    //===========================================
    // WEBGL RENDERER
    //===========================================
    const webGlRenderer = this.renderer.domElement;
    //console.log(webGlRenderer)
    webGlRenderer.style.width = '1024px';
    webGlRenderer.style.height = '720px';
    
    const cssThreejs = new CSS3DObject(webGlRenderer);
    //console.log(cssThreejs);
    this.cssScene.add(cssThreejs);
  }

  setupController(){
    //need to append render before this else not working
    this.trackBallControls = new TrackballControls(this.cssCamera, this.cssRenderer.domElement);
    //this.trackBallControls = new TrackballControls(this.camera, this.cssRenderer.domElement);
    //this.trackBallControls.rotateSpeed = 10.0
    //this.trackBallControls = new TrackballControls(this.camera, this.renderer.domElement);
    //console.log(this.trackBallControls);
  }

  setupListeners(){
    window.addEventListener('resize',this.onResize.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  setupElements(){
    van.add(document.body,stats.dom);
    //van.add(document.body, this.renderer.domElement);
    van.add(document.body, this.cssRenderer.domElement);
  }

  resetCamera(){
    this.cssCamera.position.set(0, 0, window.innerWidth);
    this.cssCamera.lookAt(new THREE.Vector3(0, 0, 0));
    //this.cssCamera.rotation.set(0,0,0)
    this.cssCamera.rotation.x=0;
    this.cssCamera.rotation.y=0;
    this.cssCamera.rotation.z=0;
    console.log(this.cssCamera.rotation);
  }

  createGUI(){
    const gui = new GUI();
    this.gui = gui;
    // console.log(this.trackBallControls);
    const trackBallControlsFolder = gui.addFolder('trackBallControls')
    //reason is default prevent call function to disable html button
    trackBallControlsFolder.add(this.trackBallControls,'enabled').name('enabled(uncheck to click button)')
    trackBallControlsFolder.add(this.trackBallControls,'noPan')
    trackBallControlsFolder.add(this.trackBallControls,'noRotate')
    trackBallControlsFolder.add(this.trackBallControls,'minZoom')
    trackBallControlsFolder.add(this.trackBallControls,'panSpeed')
    trackBallControlsFolder.add(this.trackBallControls,'rotateSpeed')
    trackBallControlsFolder.add(this.trackBallControls,'zoomSpeed')

    const cameraFolder = gui.addFolder('Camera')
    cameraFolder.add(this,'resetCamera').name('Reset')

    const rendererFolder = gui.addFolder('Renderer')
    rendererFolder.add(this,'isResize');
  }

  //https://threejs.org/docs/#api/en/core/Raycaster
  onMouseMove(event){
    this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //console.log(this.pointer);
  }

  onResize(event){
    if(this.isResize==false)return;

    const pos = this.screenToWorld({
      x: 0,
      y: 0,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      camera:this.cssCamera
    });

    //console.log(pos);
    let _width = Math.abs(pos.x)*2;
    let _height = Math.abs(pos.y)*2;

    //note test screen 2D
    //this.camera.aspect = window.innerWidth / window.innerHeight;
    //this.camera.updateProjectionMatrix();
    //this.renderer.setSize( window.innerWidth, window.innerHeight );

    //note this is for cssobject3d position (x:0,y:0,z:0) forward z
    this.camera.aspect = _width / _height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( _width, _height );
    
    this.cssCamera.aspect = window.innerWidth / window.innerHeight;
    this.cssCamera.updateProjectionMatrix();
    this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
  }

  setupUpdate(){
    //set up frame render loop
    this.renderer.setAnimationLoop( this.update.bind(this));
  }

  update(){
    if(this.trackBallControls){
      this.trackBallControls.update();
    }
    if(this.cube){
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }
    stats.update();
    this.renderer.render(this.scene, this.camera);
    this.cssRenderer.render(this.cssScene, this.cssCamera);

  }

  // get domElement(){
  //   return this.cssRenderer.domElement;
  // }
}

const cssRenderer = new CSSRenderer();

//van.add(document.body, cssRenderer.renderer.domElement);
//van.add(document.body, cssRenderer.cssRenderer.domElement);
console.log("init css3d")