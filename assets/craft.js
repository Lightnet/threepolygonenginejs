//testing

import { THREE, ECS, van } from "./triengine/dps.js";
import { TriECSEngine } from "./triengine/triecsengine.js";

const {button, canvas, input, label, div} = van.tags;

class TriCraft extends TriECSEngine{

  constructor(args){
    super(args);
  }

  setup(){
    super.setup();
    this.setupBaseScene();
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

  setupGround(){
    let pos = {x: 0, y: -1, z: 0};
    let scale = {x: 10, y: 0.1, z: 10};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));

    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    this.scene.add(blockPlane);
    //this.physics.create_body_ground();

  }

  setupBall(){
    let pos = {x: 0, y: 20, z: 0};
    let radius = 1;
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;

    //threeJS Section
    let ball = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));
    ball.position.set(pos.x, pos.y, pos.z);
    
    ball.castShadow = true;
    ball.receiveShadow = true;
    console.log(this.scene);

    this.scene.add(ball);

    let rigidBody = this.physics.create_body_cube({pos:{y:20}});

    //ball.userData.physicsBody = rigidBody;
    //this.physics.add_body_sync(ball);

  }

  setupBaseScene(){
    this.setupLights();
    //this.setupGround();
    //this.setupBall();
    ECS.addSystem(this.world,this.boxSampleSystem.bind(this));
  }

  boxSampleSystem(world){

    const scene = this.getScene();
    const camera = this.getCamera();
    //camera.position.z = 5;
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
  
  update(){
    super.update();
    //console.log("update?");
  }

}

const app = new TriCraft({isPhysics:true});
app.run();
