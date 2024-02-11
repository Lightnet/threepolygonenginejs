//testing
// physics collision event
// sensor?
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

    ECS.addSystem(this.world,this.collisionEventSystem.bind(this));
  }

  boxRotateSystem(world){

    const scene = this.getScene();
    const camera = this.getCamera();
    camera.position.z = 5;

    //CREATE GROUND
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cubeGround = new THREE.Mesh( geometry, material );
    //ECS GROUND
    const Entity_GROUND = ECS.createEntity(world);
    ECS.addComponentToEntity(world, Entity_GROUND, 'mesh', cubeGround);
    const rigbodyGround = this.physics.create_body_ground();
    ECS.addComponentToEntity(world, Entity_GROUND, 'rigbody', rigbodyGround);
    ECS.addComponentToEntity(world, Entity_GROUND, 'id', 'ground');
    scene.add(cubeGround);

    //CREATE CUBE
    const geoGround = new THREE.BoxGeometry( 1, 1, 1 );
    const matGround = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
    const cube = new THREE.Mesh( geoGround, matGround );
    const rigbodyBox = this.physics.create_body_cube({pos:{y:7}});
    const ECS_CUBE = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECS_CUBE, 'mesh', cube);
    ECS.addComponentToEntity(world, ECS_CUBE, 'rigbody', rigbodyBox);
    ECS.addComponentToEntity(world, ECS_CUBE, 'id', 'cube');
    scene.add(cube);

    //sensor
    const geometry02 = new THREE.BoxGeometry( 1, 1, 1 );
    const material02 = new THREE.MeshBasicMaterial( { color: 0x0fffff } );
    const cube02 = new THREE.Mesh( geometry02, material02 );
    //cube02.position.set(0,0,0)
    //ECS BOX
    const ECSEntity02 = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSEntity02, 'mesh', cube02);
    const rigbodyBox02 = this.physics.create_body_sensor();
    ECS.addComponentToEntity(world, ECSEntity02, 'rigbody', rigbodyBox02);
    ECS.addComponentToEntity(world, ECSEntity02, 'id', 'sensor');
    scene.add(cube02);




    //loop update for ECS
    const onUpdate = function (dt) {
      const Entities = ECS.getEntities(world, [ 'mesh','rigbody']);
      for(const entity of Entities){
        if(entity){
          //console.log(entity);
          //console.log(Entity.rigbody.translation())
          entity.mesh.position.copy(entity.rigbody.translation())
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
        }
      }

      //const Entity = ECS.getEntity(world, [ 'mesh','rigbody']);
      //console.log(Entity);
      //if(Entity){
        //Entity.rigbody.setTranslation({ x: 0.0, y: 5.0, z: 0.0 }, true);
      //}

    }
    const _panel = div({},
      button({onclick:()=>clickReset()},'Reset')
    );
    this.CSS3DEditorLeftBar.appendChild(_panel);


    //const onUpdate = function (dt) { }
    return { 
      //onUpdate
    }
  }

  //working , need better code?
  collisionEventSystem(world){
    this.physics.event.listen("drainCollisionEvents",function(observable, eventType, data){
      console.log(data);
    });

    //const onUpdate = function (dt) { }
    return { 
      //onUpdate
    }
  }

}

const app = new TriECS_Sample({isPhysics:true,isEditor:true});
app.run();