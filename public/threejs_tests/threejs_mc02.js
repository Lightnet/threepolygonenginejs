/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// https://discourse.threejs.org/t/sprite-facing-camera-always/42788/6
// https://discourse.threejs.org/t/how-can-i-rotate-a-sprite-to-face-particular-x-y-coordinates/44629
// https://www.youtube.com/watch?v=tsOTCn0nROI&list=PLtzt35QOXmkKALLv9RzT8oGwN5qwmRjTo

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

import { SimplexNoise } from 'https://unpkg.com/three@0.170.0/examples/jsm/math/SimplexNoise.js';

const stats = new Stats();
van.add(document.body, stats.dom);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
const material = new THREE.MeshLambertMaterial();

class RNG {
  m_w = 123456789;
  m_z = 987654321;
  mask = 0xffffffff;

  constructor(seed) {
    this.m_w = (123456789 + seed) & this.mask;
    this.m_z = (987654321 - seed) & this.mask;
  }

  // Returns number between 0 (inclusive) and 1.0 (exclusive),
  // just like Math.random().
  random() {
      this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
      this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
      let result = ((this.m_z << 16) + (this.m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
  }
}

const blocks = {
  empty:{
    id:0,
    name:'empty',
  },
  grass:{
    id:1,
    name:'grass',
    color:0x559020,
  },
  dirt:{
    id:2,
    name:'dirt',
    color:0x807020,
  }
}

class World extends THREE.Group{
  /*
  * @type:{{
      id:number
      instanceId:number
    }[][][]}
  */
  data = [];

  params = {
    seed: 0,
    terrain:{
      scale: 30,
      magnitude: 0.5,
      offset: 0.2
    }
  };
  

  constructor(size = {width:32, height:16}){
    super();
    this.size = size;
  }
  // https://www.youtube.com/watch?v=PxSb2thycmE&list=PLtzt35QOXmkKALLv9RzT8oGwN5qwmRjTo&index=3
  generate(){
    this.initializeTerrain();
    this.generateTerrain();
    this.generateMeshes();
  }

  initializeTerrain(){
    this.data = [];
    for(let x = 0; x< this.size.width;x++){
      const slice = [];
      for (let y = 0; y < this.size.height;y++){
        const row = [];
        for (let z = 0; z < this.size.width; z++){
          row.push({
            id: blocks.empty.id,
            instanceId:null
          })
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  generateTerrain(){
    const rng = new RNG(this.params.seed);
    const simplex = new SimplexNoise(rng);

    for(let x = 0; x< this.size.width;x++){
        for (let z = 0; z < this.size.width; z++){
          const value = simplex.noise(
            x / this.params.terrain.scale,
            z / this.params.terrain.scale
          );

          const scaleNoise = this.params.terrain.offset + this.params.terrain.magnitude * value;
          let height = Math.floor(this.size.height * scaleNoise);
          height = Math.max(0, Math.min(height, this.size.height - 1));

          // terrain height below
          for (let y = 0; y < this.size.height;y++){
            if(y < height){
              this.setBlockId(x,y,z,blocks.dirt.id);
            }else if(y== height){
              this.setBlockId(x,y,z,blocks.grass.id);
            }else{
              this.setBlockId(x,y,z,blocks.empty.id);
            }
          }
        }
    }
  }

  generateMeshes(){
    this.clear();

    const MaxCount = this.size.width * this.size.width * this.size.height;
    const mesh = new THREE.InstancedMesh(geometry, material , MaxCount);
    mesh.count = 0;

    const matrix = new THREE.Matrix4();

    for (let x = 0; x < this.size.width; x++){
      for (let y = 0; y < this.size.height; y++){
        for (let z = 0; z < this.size.width; z++){
          const blockId = this.getBlock(x,y,z).id;
          const blockType = Object.values(blocks).find(x => x.id === blockId);
          const instanceId = mesh.count;
          

          if(blockId !== blocks.empty.id && !this.isBlockObscured(x,y,z)){
            matrix.setPosition(x+0.5,y+0.5,z+0.5);
            mesh.setMatrixAt(instanceId, matrix);
            mesh.setColorAt(instanceId, new THREE.Color(blockType.color));
            this.setBlockInstanceId(x, y, z, instanceId);
            mesh.count++;
          }
        }
      }
    }

    this.add(mesh);
  }

  getBlock(x,y,z){
    if (this.inBounds(x,y,z)){
      return this.data[x][y][z];
    }else{
      return null;
    }
  }

  setBlockId(x,y,z,id){
    if (this.inBounds(x,y,z)){
      this.data[x][y][z].id = id;
    }
  }

  setBlockInstanceId(x,y,z,instanceId){
    if (this.inBounds(x,y,z)){
      this.data[x][y][z].instanceId = instanceId;
    }
  }

  inBounds(x,y,z){
    if(x >= 0 && x < this.size.width &&
      y >= 0 && y < this.size.height &&
      z >= 0 && z < this.size.width
    ){
      return true;
    }else{
      return false;
    }
  }

  isBlockObscured(x,y,z){
    const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
    const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
    const left = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
    const right = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
    const forward = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
    const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;
  
    // If any of the block's sides is exposed, it is not obscured
    if (up === blocks.empty.id ||
        down === blocks.empty.id || 
        left === blocks.empty.id || 
        right === blocks.empty.id || 
        forward === blocks.empty.id || 
        back === blocks.empty.id) {
      return false;
    } else {
      return true;
    }
  }

  disposeChildren() {
    this.traverse(obj => {
      if (obj.dispose) obj.dispose();
    })
    this.clear();
  }

}

function createUI(world){
  const gui = new GUI();
  gui.add(world.size,'width', 8, 128, 1).name('Width');
  gui.add(world.size,'height', 8, 128, 1).name('Height');
  //gui.add(world,'generate');

  const terrainFolder = gui.addFolder('Terrain');

  terrainFolder.add(world.params,'seed', 0, 10000).name('Seed');
  terrainFolder.add(world.params.terrain,'scale', 10, 100).name('Scale');
  terrainFolder.add(world.params.terrain,'magnitude', 0, 1).name('Magnitude');
  terrainFolder.add(world.params.terrain,'offset', 0, 1).name('Offset');

  gui.onChange(()=>{
    world.generate();
  });
}

const scene = new THREE.Scene();
const world = new World();
//console.log(world);
world.generate();
scene.add(world);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( -32, 16, -32 );
//camera.position.set( 0, 0, -5 );
//camera.lookAt(0,0,0);
const renderer = new THREE.WebGLRenderer();
//renderer.setClearColor( 0xffffff, 0 );
renderer.setClearColor( 0x80a0e0);
renderer.setSize( window.innerWidth, window.innerHeight );

// CAMERA CONTROL
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set(16,0,16)
controls.update() // must be called after any manual changes to the camera's transform

window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

function setup_lights(){
  const light1 = new THREE.DirectionalLight();
  light1.position.set(1, 1, 1);
  scene.add( light1 );

  const light2 = new THREE.DirectionalLight();
  light2.position.set(-1, 1, -0.5);
  scene.add( light2 );

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add( light1 );
}

function animate() {
  if(stats){
    stats.update();
  }
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}

//setup_point();
setup_lights();
createUI(world)
//set loop
renderer.setAnimationLoop( animate );
//APPEND RERENDER
document.body.appendChild( renderer.domElement );