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
    ECS.addSystem(this.world,this.scenePhysicsSystem.bind(this));
    //simple button reset 
    ECS.addSystem(this.world,this.editorSystem.bind(this));
  }

  scenePhysicsSystem(world){

    const scene = this.getScene();
    const camera = this.getCamera();
    camera.position.z = 5;

    //OBJ GROUND
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const ground = new THREE.Mesh( geometry, material );
    //PHYSICS
    const rigbodyGround = this.physics.create_body_ground();
    //ECS GROUND
    const Entity_Ground = ECS.createEntity(world);
    ECS.addComponentToEntity(world, Entity_Ground, 'mesh', ground);
    ECS.addComponentToEntity(world, Entity_Ground, 'rigbody', rigbodyGround);
    ECS.addComponentToEntity(world, Entity_Ground, 'id', 'ground');
    //SCENE
    scene.add(ground);

    //OBJ CUBE
    const geoCube = new THREE.BoxGeometry( 1, 1, 1 );
    const matCube = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
    const cube = new THREE.Mesh( geoCube, matCube );
    //PHYSICS
    const rigbodyCube = this.physics.create_body_cube({pos:{y:2}});
    //ECS
    const entity_Cube = ECS.createEntity(world);
    ECS.addComponentToEntity(world, entity_Cube, 'mesh', cube);
    ECS.addComponentToEntity(world, entity_Cube, 'rigbody', rigbodyCube);
    ECS.addComponentToEntity(world, entity_Cube, 'id', 'cube');
    //SCENE
    scene.add(cube);

    //loop update for ECS
    const onUpdate = function (dt) {
      const Entities = ECS.getEntities(world, [ 'mesh','rigbody']);
      for(const entity of Entities){
        if(entity){
          //console.log(entity);
          //console.log(entity.rigbody);
          //console.log(entity.rigbody.rotation());
          //console.log(Entity.rigbody.translation())
          entity.mesh.position.copy(entity.rigbody.translation())
          entity.mesh.quaternion.copy(entity.rigbody.rotation())
        }
      }
    }
    // ECS api
    return { onUpdate }
  }

  // https://rapier.rs/docs/user_guides/javascript/rigid_bodies/#position
  editorSystem(world){
    function clickReset(){
      console.log("test");
      const Entities = ECS.getEntities(world, [ 'mesh','rigbody']);
      for(const entity of Entities){
        if(entity?.id=='cube'){
          entity.rigbody.setTranslation({ x: 0.0, y: 5.0, z: 0.0 }, true);
          entity.rigbody.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 }, true)
          //entity.rigbody.resetForces(true);
          //entity.rigbody.resetTorques(true);
          entity.rigbody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);//need to reset zero
          entity.rigbody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);//need to reset zero
          console.log(entity.rigbody)
          
        }
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