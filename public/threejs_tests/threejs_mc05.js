/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// https://discourse.threejs.org/t/sprite-facing-camera-always/42788/6
// https://discourse.threejs.org/t/how-can-i-rotate-a-sprite-to-face-particular-x-y-coordinates/44629
// https://www.youtube.com/watch?v=tsOTCn0nROI&list=PLtzt35QOXmkKALLv9RzT8oGwN5qwmRjTo

//console.log("Test");

//import { THREE, OrbitControls, ECS, van } from "/dps.js";
//import { TriECSEngine } from "/components/triengine/triecsengine.js";

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

import { SimplexNoise } from 'https://unpkg.com/three@0.170.0/examples/jsm/math/SimplexNoise.js';
import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';

const {div,style} = van.tags;

const stats = new Stats();
van.add(document.body, stats.dom);


const collisionMaterial = new THREE.MeshBasicMaterial({
  //color: 0xff0000,
  color: 'red',
  transparent: true,
  opacity: 0.2,
  //alphaTest: 0.2,
});
const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);

class Physics {

  constructor(scene){
    this.helpers = new THREE.Group();
    scene.add(this.helpers);
  }

  update(dt, player, world){
    this.detectCollisions(player,world);
  }

  detectCollisions(player,world){

    this.helpers.clear();

    const candidates = this.broadPhase(player, world);
    const collisions = this.narrowPhase(candidates, player);

    if(candidates.length > 0){
      this.resolveCollision(collisions);
    }
  }

  broadPhase(player, world){
    const candidates = [];

    const extents = {
      x:{
        min: Math.floor(player.position.x - player.radius),
        max: Math.ceil(player.position.x + player.radius),
      },
      y:{
        min: Math.floor(player.position.y - player.height),
        max: Math.ceil(player.position.y),
      },
      z:{
        min: Math.floor(player.position.z - player.radius),
        max: Math.ceil(player.position.z + player.radius),
      },
    }

    for(let x = extents.x.min; x < extents.x.max;x++){
      for(let y = extents.y.min; y < extents.y.max;y++){
        for(let z = extents.z.min; z < extents.z.max;z++){
          const block = world.getBlock(x,y,z);
          if(block && block.id !== blocks.empty.id){
            const blockPos = {x,y,z};
            candidates.push(blockPos);
            this.addCollisionHelper(blockPos);
          }
        }
      }
    }

    console.log(`Broadphase Candidates: ${candidates.length}`);

    return candidates;
  }

  narrowPhase(candidates, player){
    const collisions = [];
    for (const block of candidates){
      // Get the point on the block that is closest to the center of the player's bounding cylinder
      const closestPoint = {
        x: Math.max(block.x - 0.5, Math.min(player.position.x, block.x + 0.5)),
        y: Math.max(block.y - 0.5, Math.min(player.position.y - (player.height / 2), block.y + 0.5)),
        z: Math.max(block.z - 0.5, Math.min(player.position.z, block.z + 0.5))
      };

      // Get distance along each axis between closest point and the center
      // of the player's bounding cylinder
      const dx = closestPoint.x - player.position.x;
      const dy = closestPoint.y - (player.position.y - (player.height / 2));
      const dz = closestPoint.z - player.position.z;

      if (this.pointInPlayerBoundingCylinder(closestPoint, player)) {




        
      }

    }
  }

  resolveCollision(collisions){

  }

  addCollisionHelper(block){
    const blockMesh = new THREE.Mesh(collisionGeometry,collisionMaterial);
    blockMesh.position.copy(block);
    this.helpers.add(blockMesh);
  }

  pointInPlayerBoundingCylinder(p, player) {
    const dx = p.x - player.position.x;
    const dy = p.y - (player.position.y - (player.height / 2));
    const dz = p.z - player.position.z;
    const r_sq = dx * dx + dz * dz;
  
    // Check if contact point is inside the player's bounding cylinder
    return (Math.abs(dy) < player.height / 2) && (r_sq < player.radius * player.radius);
  }

}

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

class Player {
  radius = 0.5;
  height = 1.75;

  maxSpeed = 10;
  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 200 );
  controls = new PointerLockControls( this.camera,document.body );
  cameraHelper = new THREE.CameraHelper(this.camera);

  constructor(scene){
    this.position.set(32,16,32);
    scene.add(this.camera);
    scene.add(this.cameraHelper);

    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));

    this.boundsHelper = new THREE.Mesh(
      new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
      new THREE.MeshBasicMaterial({wireframe:true})
    );
    scene.add(this.boundsHelper);
  }

  applyInputs(dt){

    if(this.controls.isLocked){
      //console.log('Player Update dt:', dt);
      this.velocity.x = this.input.x;
      this.velocity.z = this.input.z;
      this.controls.moveRight(this.velocity.x * dt);
      this.controls.moveForward(this.velocity.z * dt);

      document.getElementById('player-position').innerHTML = this.toString();
    }

  }

  onKeyDown(event){
    //console.log('key down');
    if(!this.controls.isLocked){
      this.controls.lock();
      console.log('locked');
    }

    switch(event.code){
      case 'KeyW':
        this.input.z = this.maxSpeed;
        break;
      case 'KeyA':
        this.input.x = -this.maxSpeed;
        break;
      case 'KeyS':
        this.input.z = -this.maxSpeed;
        break;
      case 'KeyD':
        this.input.x = this.maxSpeed;
        break;
      case 'KeyR':
        this.position.set(32,16,32);
        this.velocity.set(0, 0, 0);
        break;
    }
  }

  onKeyUp(event){
    //console.log('key up');
    switch(event.code){
      case 'KeyW':
        this.input.z = 0;
        break;
      case 'KeyA':
        this.input.x = 0;
        break;
      case 'KeyS':
        this.input.z = 0;
        break;
      case 'KeyD':
        this.input.x = 0;
        break;
    }

  }

  updateBoundsHelper(){
    this.boundsHelper.position.copy(this.position);
    this.boundsHelper.position.y -= this.height / 2;
  }

  get position(){
    return this.camera.position;
  }

  toString(){
    let str = '';
    str += `X: ${this.position.x.toFixed(3)}`;
    str += ` Y: ${this.position.y.toFixed(3)}`;
    str += ` Z: ${this.position.z.toFixed(3)}`;
    return str;
  }

}

const textureLoader = new THREE.TextureLoader();

function loadTexture(path){
  const texture = textureLoader.load(path)
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

const textures = {
  dirt:loadTexture('textures/blocks/dirt.png'),
  grass:loadTexture('textures/blocks/grass.png'),
  grassSide:loadTexture('textures/blocks/grass_side.png'),
  stone:loadTexture('textures/blocks/stone.png'),
  coalOre:loadTexture('textures/blocks/coal.png'),
  ironOre:loadTexture('textures/blocks/icon.png'),
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
    material:[
      new THREE.MeshLambertMaterial({map:textures.grassSide}), // right
      new THREE.MeshLambertMaterial({map:textures.grassSide}), // left
      new THREE.MeshLambertMaterial({map:textures.grass}), // top
      new THREE.MeshLambertMaterial({map:textures.dirt}), // bottom
      new THREE.MeshLambertMaterial({map:textures.grassSide}), // front
      new THREE.MeshLambertMaterial({map:textures.grassSide}) // back
    ]
  },
  dirt:{
    id:2,
    name:'dirt',
    color:0x807020,
    material: new THREE.MeshLambertMaterial({map:textures.dirt}),
  },
  stone:{
    id:3,
    name:'stone',
    color:0x808080,
    scale:{x:30, y:30, z:30},
    scarcity: 0.5,
    material: new THREE.MeshLambertMaterial({map:textures.stone}),
  },
  coalOre:{
    id:4,
    name:'coalOre',
    color:0x202020,
    scale:{x:20, y:20, z:20},
    scarcity: 0.8,
    material: new THREE.MeshLambertMaterial({map:textures.coalOre}),
  },
  ironOre:{
    id:5,
    name:'ironOre',
    color:0x806060,
    scale:{x:60, y:60, z:60},
    scarcity: 0.9,
    material: new THREE.MeshLambertMaterial({map:textures.ironOre}),
  }
}

const resources = [
  blocks.stone,
  blocks.coalOre,
  blocks.ironOre,
];

const geometry = new THREE.BoxGeometry( 1, 1, 1 );

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
  

  constructor(size = {width:64, height:32}){
    super();
    this.size = size;
  }
  // https://www.youtube.com/watch?v=PxSb2thycmE&list=PLtzt35QOXmkKALLv9RzT8oGwN5qwmRjTo&index=3
  generate(){
    const rng = new RNG(this.params.seed);

    this.initializeTerrain();
    this.generateResources(rng);
    this.generateTerrain(rng);
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

  generateResources(rng){
    const simplex = new SimplexNoise(rng);
    resources.forEach(resource=>{
      for(let x = 0; x< this.size.width;x++){
        for(let y = 0; y< this.size.height;y++){
          for(let z = 0; z< this.size.width;z++){
            const value = simplex.noise3d(
              x / resource.scale.x,
              y / resource.scale.y,
              z / resource.scale.z 
            );
            if (value > resource.scarcity){
              this.setBlockId(x,y,z, resource.id);
            }
          }
        }
      }
    });
  }

  generateTerrain(rng){
    
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
            if(y < height && this.getBlock(x,y,z).id == blocks.empty.id){
              this.setBlockId(x,y,z,blocks.dirt.id);
            }else if(y== height){
              this.setBlockId(x,y,z,blocks.grass.id);
            }else if (y > height){
              this.setBlockId(x,y,z,blocks.empty.id);
            }
          }
        }
    }
  }

  generateMeshes(){
    this.clear();
    const MaxCount = this.size.width * this.size.width * this.size.height;
    const meshes = {};

    Object.values(blocks)
      .filter(blockType => blockType.id !== blocks.empty.id)
      .forEach(blockType =>{
        //console.log(blockType.material);
        const mesh = new THREE.InstancedMesh(geometry, blockType.material , MaxCount);
        mesh.name = blockType.name;
        mesh.count = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        meshes[blockType.id] = mesh;
      })
    //console.log(blocks);
    const matrix = new THREE.Matrix4();
    
    for (let x = 0; x < this.size.width; x++){
      for (let y = 0; y < this.size.height; y++){
        for (let z = 0; z < this.size.width; z++){
          const blockId = this.getBlock(x,y,z).id;
          
          if (blockId === blocks.empty.id) continue;

          const mesh = meshes[blockId];
          const instanceId = mesh.count;
         
          if(!this.isBlockObscured(x,y,z)){
            matrix.setPosition(x,y,z);
            mesh.setMatrixAt(instanceId, matrix);
            //mesh.setColorAt(instanceId, new THREE.Color(blockType.color));
            this.setBlockInstanceId(x, y, z, instanceId);
            mesh.count++;
          }
        }
      }
    }

    //this.add(mesh);
    this.add(...Object.values(meshes));
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

function createUI(world, player){
  const gui = new GUI();

  const playerFolder = gui.addFolder('Player');
  playerFolder.add(player,'maxSpeed', 1, 20).name('Max Speed');
  playerFolder.add(player.cameraHelper,'visible').name('Show Camera Helper');

  //gui.add(world,'generate');

  const terrainFolder = gui.addFolder('Terrain');
  terrainFolder.add(world.size,'width', 8, 128, 1).name('Width');
  terrainFolder.add(world.size,'height', 8, 128, 1).name('Height');

  terrainFolder.add(world.params,'seed', 0, 10000).name('Seed');
  terrainFolder.add(world.params.terrain,'scale', 10, 100).name('Scale');
  terrainFolder.add(world.params.terrain,'magnitude', 0, 1).name('Magnitude');
  terrainFolder.add(world.params.terrain,'offset', 0, 1).name('Offset');

  const resourcesFolder = gui.addFolder('Resources');
  resources.forEach(resource=>{
    const resourceFolder = resourcesFolder.addFolder(resource.name);
    resourceFolder.add(resource, 'scarcity', 0, 1).name('Scarcity')

    const scaleFolder = resourceFolder.addFolder('Scale');
    scaleFolder.add(resource.scale, 'x',10,100).name('X Scale')
    scaleFolder.add(resource.scale, 'y',10,100).name('Y Scale')
    scaleFolder.add(resource.scale, 'z',10,100).name('Z Scale')
  });
  

  gui.onChange(()=>{
    world.generate();
  });
}

const scene = new THREE.Scene();
const world = new World();
//console.log(world);
world.generate();
scene.add(world);
const player = new Player(scene);
const physics = new Physics(scene);

const orbitcamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
orbitcamera.position.set( -32, 16, -32 );
//camera.position.set( 0, 0, -5 );
//camera.lookAt(0,0,0);
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setClearColor( 0xffffff, 0 );
renderer.setClearColor( 0x80a0e0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// CAMERA CONTROL
const controls = new OrbitControls( orbitcamera, renderer.domElement );
controls.target.set(16,0,16)
controls.update() // must be called after any manual changes to the camera's transform

window.addEventListener('resize', function(event) {
  orbitcamera.aspect = window.innerWidth / window.innerHeight;
  orbitcamera.updateProjectionMatrix();
  player.camera.aspect = window.innerWidth / window.innerHeight;
  player.camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

let sun;
function setup_lights(){
  sun = new THREE.DirectionalLight();
  sun.intensity = 1.5;
  sun.position.set(50, 50, 50);
  sun.castShadow = true;

  // Set the size of the sun's shadow box
  sun.shadow.camera.left = -40;
  sun.shadow.camera.right = 40;
  sun.shadow.camera.top = 40;
  sun.shadow.camera.bottom = -40;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 200;
  sun.shadow.bias = -0.0001;
  sun.shadow.mapSize = new THREE.Vector2(2048, 2048);
  scene.add(sun);
  //scene.add(sun.target);
  const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
  scene.add(shadowHelper);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.2;
  scene.add(ambient);
}
// LOOP
let previousTime = performance.now();
function animate() {
  let currentTime = performance.now();
  let dt = (currentTime - previousTime) /1000;
  if(stats){
    stats.update();
  }
  player.applyInputs(dt);
  player.updateBoundsHelper();
  physics.update(dt, player, world);
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	//renderer.render( scene, camera );
	renderer.render( scene, player.controls.isLocked ? player.camera : orbitcamera );
  previousTime = currentTime;
}

//setup_point();
setup_lights();
createUI(world, player);

//set loop
renderer.setAnimationLoop( animate );
//APPEND RERENDER
van.add(document.body, renderer.domElement );

van.add(document.head,style(`
#info{
  position:absolute;
  right:0;
  bottom:0;
  fontsize:24px;
  color:white;
  margin:8px;
}
`))

van.add(document.body,div({id:'info'},
  div({id:'player-position'})
))

console.log('mc04');