

//import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import {THREE} from '/dps.js'

class SpriteAnimation2DTileMap{
  isLoop=false;
  isPlay=false;
  playSpriteIndices=[];
  runningTileArrayIndex=0;
  currentTile=0;
  maxDisplayTime=0;
  elapsedTime=0;

  constructor(args={}){

    let texturePath = args?.path || '/textures/characters/small_8_direction_characters.png';
    let cols = args?.cols || 8;
    let rows = args?.rows || 12;

    this.width = args?.width || 1;
    this.height = args?.height || 1;

    this.cols = cols;
    this.rows = rows;

    let mapTexture = new THREE.TextureLoader().load(texturePath);
    mapTexture.magFilter = THREE.NearestFilter;
    mapTexture.wrapS = THREE.RepeatWrapping;
    mapTexture.wrapT = THREE.RepeatWrapping;
    mapTexture.repeat.set(
      1/cols,
      1/rows
    ); // MAP TILE cols and rows
    this.mapTexture = mapTexture;

    const spritePlane = new THREE.PlaneGeometry(this.width, this.height);
    this.spritePlane = spritePlane;

    const spriteMaterial = new THREE.MeshBasicMaterial({
      map: mapTexture,
      side: THREE.DoubleSide,
      transparent:true,
    });
    this.spriteMaterial = spriteMaterial;

    const mesh = new THREE.Mesh(spritePlane, spriteMaterial);
    mesh.scale.set(2,2,2)
    this.mesh = mesh;
  }

  textureTileMapIdx(index){
    const cols = this.cols;
    const rows = this.rows;
    const col = index % cols;
    const row = Math.floor( index / cols );

    this.mapTexture.offset.x = col / cols;
    this.mapTexture.offset.y = 1 - ( ( 1 + row ) / rows );
  }

  loopPlay(playSpriteIndices, totalDuration){
    this.isLoop=true;
    this.playSpriteIndices = playSpriteIndices;
    this.runningTileArrayIndex = 0;
    this.currentTile = playSpriteIndices[this.runningTileArrayIndex];
    this.maxDisplayTime = totalDuration / this.playSpriteIndices.length;
    this.isPlay = true;
    //console.log(myObject);
  }

  oncePlay(playSpriteIndices, totalDuration){
    this.isLoop=false;
    this.playSpriteIndices = playSpriteIndices;
    this.runningTileArrayIndex = 0;
    this.currentTile = playSpriteIndices[this.runningTileArrayIndex];
    this.maxDisplayTime = totalDuration / this.playSpriteIndices.length;
    this.isPlay = true;
    //console.log(myObject);
  }

  update(dt){
    if (!this.isPlay) return;
    this.elapsedTime += dt;
    if(this.maxDisplayTime > 0 && this.elapsedTime >= this.maxDisplayTime){
      this.elapsedTime = 0;
      if(this.isLoop){
        console.log("loop...")
        this.runningTileArrayIndex = (this.runningTileArrayIndex + 1) % this.playSpriteIndices.length;
      }else{
        
        let index = this.runningTileArrayIndex + 1
        console.log("once... index: ", index ," LEN:", this.playSpriteIndices.length)
        if (index >= this.playSpriteIndices.length){
          index = this.playSpriteIndices.length
          this.isPlay = false;
          console.log("Finish...")
        }
        this.runningTileArrayIndex = (index) % this.playSpriteIndices.length;
      }
      
      this.currentTile = this.playSpriteIndices[this.runningTileArrayIndex];
      this.textureTileMapIdx(this.currentTile)
    }
  }

}

export default SpriteAnimation2DTileMap;