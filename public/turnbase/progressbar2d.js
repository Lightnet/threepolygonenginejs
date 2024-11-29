
import {THREE} from '/dps.js'

class ProgressBar2D {

  canvasEl=null;
  canvasTexture=null;
  mesh=null;
  oldPercent=0;
  //percent=0;

  constructor(){
    let canvasEl = document.createElement("canvas");
    canvasEl.style.width="100px";
    canvasEl.style.height="100px";
    const ctx = canvasEl.getContext("2d");
    ctx.canvas.width = 100;
    ctx.canvas.height = 100;
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, 100, 100)
    
    this.canvasEl = canvasEl;

    let canvasTexture = new THREE.CanvasTexture(this.canvasEl);
    canvasTexture.magFilter = THREE.NearestFilter;
    canvasTexture.wrapS = THREE.RepeatWrapping;
    canvasTexture.wrapT = THREE.RepeatWrapping;
    this.canvasTexture = canvasTexture;

    //const spritePlane = new THREE.PlaneGeometry(1, 0.1);
    const spritePlane = new THREE.PlaneGeometry(1, 0.2);
    const spriteMaterial = new THREE.MeshBasicMaterial({
      map: canvasTexture,
      side: THREE.DoubleSide,
      //transparent:true,
    });
    this.mesh = new THREE.Mesh(spritePlane, spriteMaterial);

    this.init();
  }

  init(){
    
  }

  setPercent(_num){
    if(this.oldPercent != _num){
      if(_num > 100){
        _num = 100;
      }
      if(_num < 0){
        _num = 0;
      }
      const ctx = this.canvasEl.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 100, 100)
      ctx.fillStyle = "green";
      ctx.fillRect(0, 0, _num, 100)
      this.canvasTexture.needsUpdate=true
      this.oldPercent = _num;
    }
  }

  update(){

  }

}

export default ProgressBar2D;