import {THREE} from '/dps.js'

class CanvasText2D {

  canvasEl=null;
  canvasTexture=null;
  mesh=null;
  oldText="";

  constructor(){
    let canvasEl = document.createElement("canvas");
    canvasEl.style.width="100px";
    canvasEl.style.height="100px";
    const ctx = canvasEl.getContext("2d");
    ctx.canvas.width = 100;
    ctx.canvas.height = 100;
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 100, 100)
    this.canvasEl = canvasEl;

    let canvasTexture = new THREE.CanvasTexture(this.canvasEl);
    canvasTexture.magFilter = THREE.NearestFilter;
    canvasTexture.wrapS = THREE.RepeatWrapping;
    canvasTexture.wrapT = THREE.RepeatWrapping;
    this.canvasTexture = canvasTexture;

    //const spritePlane = new THREE.PlaneGeometry(1, 0.1);
    const spritePlane = new THREE.PlaneGeometry(1, 1);
    const spriteMaterial = new THREE.MeshBasicMaterial({
      map: this.canvasTexture,
      side: THREE.DoubleSide,
      transparent:true,
    });
    this.mesh = new THREE.Mesh(spritePlane, spriteMaterial);
  }

  setText(_text){
    if(this.oldText != _text){
      const ctx = this.canvasEl.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "20px serif";
      ctx.fillText(_text, 1, 50);

      this.canvasTexture.needsUpdate=true
    }
  }

}

export default CanvasText2D;