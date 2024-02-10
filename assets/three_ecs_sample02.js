//testing
// physics test
import { THREE, ECS, van } from "./triengine/dps.js";
import { TriECSEngine } from "./triengine/triecsengine.js";

const {button, canvas, input, label, div} = van.tags;

class TriECS_Sample extends TriECSEngine {
  constructor(args={}){
    super(args);
  }

  setup(){
    super.setup();
    this.createScene();
  }

  createScene(){
    // setup system and update
    ECS.addSystem(this.world,this.boxRotateSystem.bind(this));
    //simple button reset 
    ECS.addSystem(this.world,this.editorSystem.bind(this));
  }

  boxRotateSystem(world){

    const scene = this.getScene();
    const camera = this.getCamera();
    camera.position.z = 5;
    //GEO BOX 
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    //ECS BOX
    const ECSEntity = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSEntity, 'mesh', cube);
    const rigbodyBox = this.physics.create_body_ground();


    scene.add(cube);
    //GROUND
    const geoGround = new THREE.BoxGeometry( 1, 1, 1 );
    const matGround = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
    const ground = new THREE.Mesh( geoGround, matGround );
    ground.position.y=-1;

    const rigbodyGround = this.physics.create_body_cube({pos:{y:2}});

    const ECSGROUND = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSGROUND, 'mesh', ground);
    ECS.addComponentToEntity(world, ECSGROUND, 'rigbody', rigbodyGround);

    scene.add(ground);

    //loop update for ECS
    const onUpdate = function (dt) {
      const Entity = ECS.getEntity(world, [ 'mesh','rigbody']);
      if(Entity){
        //Entity.mesh.rotation.x += 0.01;
        //Entity.mesh.rotation.y += 0.01;
        //console.log(Entity.rigbody.translation())
        Entity.mesh.position.copy(Entity.rigbody.translation())
      }
    }
    // ECS api
    return { onUpdate }
  }

  // https://rapier.rs/docs/user_guides/javascript/rigid_bodies/#position
  editorSystem(world){
    function clickReset(){
      console.log("test");
      const Entity = ECS.getEntity(world, [ 'mesh','rigbody']);
      console.log(Entity);
      if(Entity){
        Entity.rigbody.setTranslation({ x: 0.0, y: 5.0, z: 0.0 }, true);
      }

    }
    const _panel = div({},
      button({onclick:()=>clickReset()},'Reset')
    );
    this.CSS3DEditorLeftBar.appendChild(_panel);


    const onUpdate = function (dt) {

    }
    return { 
      //onUpdate
    }
  }
}

const app = new TriECS_Sample({isPhysics:true,isEditor:true});
app.run();