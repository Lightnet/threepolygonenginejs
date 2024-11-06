/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { THREE, ECS, van } from "/dps.js";
import { TriECSEngine } from "../../triengine/van_triecsengine.js";

const {button, canvas, input, label, div} = van.tags;

class TriEditor extends TriECSEngine{

  constructor(args){
    super(args);
  }

  setup(){
    super.setup();
    this.setupBaseScene();
  }

  cameraSystem(world){
    //const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    //camera
    //this.scene.add(camera);
    return {

    }
  }

  //testing camera
  mouseInputSystem(world){

    function mouseDown(e){

    }

    function mouseMove(e){
      //console.log(e);
    }

    function mouseWheel(e){
      const camera = this.getCamera();
      console.log(e);
      if(e.deltaY > 0){
        camera.position.z += 1
      }else{
        camera.position.z -= 1
      }
    }

    window.addEventListener('mousedown',mouseDown.bind(this))
    window.addEventListener('mousemove',mouseMove.bind(this))
    window.addEventListener('wheel',mouseWheel.bind(this))

    return {}
  }

  setupLights(){
    //Add hemisphere light
    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
    hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
    hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
    hemiLight.position.set( 0, 50, 0 );
    this.scene.add( hemiLight );

    //Add directional light
    let dirLight = new THREE.DirectionalLight( 0xffffff , 1);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.multiplyScalar( 100 );
    this.scene.add( dirLight );
  }

  setupBaseScene(){
    this.setupLights();
    //this.setupGround();
    //this.setupBall();
    ECS.addSystem(this.world,this.boxSampleSystem.bind(this));
    ECS.addSystem(this.world,this.editorSystem.bind(this));
    ECS.addSystem(this.world,this.cameraSystem.bind(this));
    ECS.addSystem(this.world,this.mouseInputSystem.bind(this));
  }

  boxSampleSystem(world){

    const scene = this.getScene();
    //scene.background = new THREE.Color( 0xff0000 );//red
    scene.background = new THREE.Color( 0x808080 );//gray

    const camera = this.getCamera();
    //camera.position.z = 5;
    //GEO Ground
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    //Physics
    const rigGround = this.physics.create_body_ground();
    //ECS BOX
    const ECSGROUND = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSGROUND, 'mesh', cube);
    ECS.addComponentToEntity(world, ECSGROUND, 'rigbody', rigGround);
    ECS.addComponentToEntity(world, ECSGROUND, 'id', 'ground');
    scene.add(cube);

    //Object Box
    const geoBox = new THREE.BoxGeometry( 1, 1, 1 );
    const matBox = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
    const objBox = new THREE.Mesh( geoBox, matBox );
    //Physics Box
    const rigbodyGround = this.physics.create_body_cube({pos:{y:10}});
    //ECS BOX
    const Entity_box = ECS.createEntity(world);
    ECS.addComponentToEntity(world, Entity_box, 'mesh', objBox);
    ECS.addComponentToEntity(world, Entity_box, 'rigbody', rigbodyGround);
    ECS.addComponentToEntity(world, Entity_box, 'id', 'cube');
    scene.add(objBox);

    //loop update for ECS
    const onUpdate = function (dt) {
      const Entities = ECS.getEntities(world, [ 'mesh','rigbody']);
      for(const entity of Entities){
        if(entity){
          //console.log(entity);
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
          //reset to zero for stop vec moving
          entity.rigbody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
          entity.rigbody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
        }
      }
    }
    const _panel = div({},
      button({onclick:()=>clickReset()},'Reset')
    );
    this.CSS3DEditorLeftBar.appendChild(_panel);

    //const onUpdate = function (dt) {}
    return { 
      //onUpdate
    }
  }

  update(){
    super.update();
    //console.log("update?");
  }
}

function Page_Game_Editor() {

  const app = new TriEditor({isPhysics:true,isEditor:true});
  app.run();
  //return div('vanthreejs')
  //return app
  return app.domElement();
}

export{
  Page_Game_Editor
}