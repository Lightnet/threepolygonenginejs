//testing
import { THREE, ECS } from "./triengine/dps.js";
import { TriECSEngine } from "./triengine/triecsengine.js";

class TriECS_Sample extends TriECSEngine {
  constructor(args={}){
    super(args);
  }

  setup(){
    super.setup();
    const scene = this.getScene();
    const camera = this.getCamera();

    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );

    const ECSEntity = ECS.createEntity(this.world);
    ECS.addComponentToEntity(this.world, ECSEntity, 'mesh', cube);

    scene.add(cube);

    ECS.addSystem(this.world,this.boxRotateSystem);
  }

  boxRotateSystem(world){

    //loop update
    const onUpdate = function (dt) {
      const Entity = ECS.getEntity(world, [ 'mesh']);
      if(Entity){
        Entity.mesh.rotation.x += 0.01;
        Entity.mesh.rotation.y += 0.01;
      }
    }
    // ECS api
    return { onUpdate }
  }
}

const app = new TriECS_Sample({isPhysics:true});
app.run();