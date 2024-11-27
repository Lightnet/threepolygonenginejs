# Name: threepolygonenginejs

# License: MIT

# Created By: Lightnet

# Status:
 * work in progress
 * three.js module design
 * ECS
 * Unstable.

# Information:

  This is protoype to build the minecraft style. There will be example stand alone script for testing the builds.
  
  As to keep the model simple as possible to reduce lag in render for stable smooth application.

  There will be some different type of games for testing.
  
  Using the hono server framework, socket.io and sqlite.

  For local play with friend to play.

# Server:
  * hono js server 

# Programings Languages:
 * javascript module (main)
 * nodejs (main)
 * bun (N/A)

# Packages:
 * hono
 * socket.io
 * better-sqlite3
 * mini-van-plate
 * vanjs

# Set Up:
 Install nodejs.

```
  npm install
```
  Install the packages.

# Server:
```
npm run devh
```
  Run the server.

# Testing stand alone features:
 
 * [ ] threejs
   * [x] animation sprite 2D 
   * [x] line path
   * [x] tween.js
   * [x] pointerlock for mouse
   * [x] entity component system
   * [x] extrude test
   * [x] camera forward simple movement
   * [x] camera spaceship control
   * [x] tilemap
   * [x] card animation test
   * [x] follow path line

 * [ ] threejs rapier physics js
   * [x] collision detect test 
   * [ ] gui
     * [x] cube test
     * [x] random create cube

 * [ ] threejs ammo physics js
   * [x] collision detect test 
   * [ ] gui
     * [x] cube test
     * [x] random create cube

 * [ ] threejs jolt physics js
   * [x] collision detect test 
   * [ ] gui
     * [x] cube test
     * [x] random create cube

## threejspolygon folder test:
  Work in progress test build. Working on physics test.

  There are some area are being test. Threejs render, physics, gui and other still testing.

  GUI is depend on the html and threejs embbed renderer. As well canvas and shader render.

  Note config and params will take time to test and make sure the default works.

### Features / Noes:
 * strange bug that variable not loaded. Added delay to get the variable.
 * [ ] debug gui
   * [ ] add, remove and select entity cube.
 * Entity Component System:
   * [x] simple cube add / remove test
   * [ ] entity component chain
   * [ ] physics system
   * [x] renderer system (handle add and remove from scene test)
 * [ ] physics:
   * [ ] ammo.js
     * [x] load script
     * [ ] config setup
   * [ ] joltphysics.js
     * [x] load script
     * [ ] config setup
   * [ ] rapierjs
     * [x] load script
     * [ ] config setup
   * [ ] example_ammophysics01
     * [x] create box
     * [x] remove boxes
     * [x] create ground
     * [x] remove ground
   * [ ] example_joltphysics01
     * [x] create box
     * [x] remove boxes
     * [x] create ground
     * [x] remove ground
   * [ ] example_rapierphysics01
     * [x] create box
     * [x] remove boxes
     * [x] create ground
     * [x] remove ground

Note not easy to update script to match the layout for those three phyiscs. There are few different way to handle setup.

# Physics:
  Note physics has own ways to handle identity for to match the event collision contacts. 

  Still work in progress API testing.

## Joltphysics.js:
 * rigidbody.Pya = id
 * shape
 * settings

 Note this is has more config and destroy to clean up.

## Ammo.js:
 * rigidbody.hy = id
 * stepSimulation function must not be null it need delta number. Result rigid body position will NaN. So it will disappear for mesh.
```js
//...
const clock = new THREE.Clock();
//...
const deltaTime = clock.getDelta();
//...
this.world.stepSimulation(delta,10);
```

## Rapier:
  Note it required 3 objects for id, collision detect and update object
 * rigidBody
 * colliderDesc
 * collider

 * collider.handle = id

# Physics:
 * threejs_tests/threejs_physics_ammo01.js
 * threejs_tests/threejs_physics_cannon01.js
 * threejs_tests/threejs_physics_jolt01.js
 * threejs_tests/threejs_physics_oimophysics01.js
 * threejs_tests/threejs_physics_rapier01.js

  Those are almost the same for gui test for ground, box and gravity test. As well remove collisions.


# Notes:
 Below this section are just notes. It still work in progress.

# Game Server (notes):
 Is is possible to run multiple game instance? Yes and No. Nodejs can't run threads.

 https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js

 It use worker_threads module. There are pros and cons to them.

 It need socket.io to handle the worker_threads and event handler instance of the world. As well some user and physics.

# Entities Components System:
  By using the ECS to handle almost every modules that will be set up. It is work in progress build.

  The modules would handle set up for render, input, physics and other things. As well server and client filter or configure settings.

  It base on the BevyEngine design. But still wanted to keep loop very simple as possible for the module set up.

## How many many entities?(Notes):
  Have not test how many enities that depend on how to set up. One reason is the system loop up for mesh and physics sync.

  The longer the loop call the lag? There is logic loop for each entities for example pathing and A.I behavior.

  It needs to be tested for offloading some worker threads.

# Main server:
 It depend on the packages.
 Hono js is cross platform for nodejs and bun.

 It would use socket.io.

 It will use ECS.js package for easy handle loop update. As well worker threads. To handle game instances.

 It will use default SQLITE and helper package.

# Layout:
  Work in progress build.


```
|| = browser  = ||
|| = Packages = ||
|| three        ||
|| socket.io    ||
|| van          ||
|| ecs          ||      || ==================||
|| phyiscs ()   || == > || Pyhiscs Framework || (physicsframework.js)
|| =============||      || prefab            ||
    | |                 || world             ||
    | |                 || ==================||
    | |                        | |
    | |                        | |
     V                          V

|| ==================================== ||
|| 
|| Class Framework (triframeworkecs.js)
|| -Entities Components Systems
|| -html element UI
|| -Physics
|| -Prefabs
|| -Editor UI
|| -UI
|| ==================================== ||
 | |
 | |
 | |
  V
|| = ================================== ||
|| Class sample extends Engine Frame Work
|| setup
|| create
|| run
|| = ================================== ||

```
Work in progress current prototype build.

## files:
 * triecsengine.js
   * server (node/bun n/a)
   * client (browser wip)
   * ECS
     * setup (wip)
     * update (part done)
     * remove (n/a)
     * Renderer (part done)
       * setup (added)
       * update (added)
     * CSS3DRenderer (part done)
       * setup (added)
       * update (added)
     * Resize (part done)
       * Renderer
       * CSS3DRender
     * physics (part done)
       * rapier (wip)
         * setup (added)
         * update (added)
       * ammo (prototype)
       * cannon-es (n/a)
   * socket.io (N/A)
     * login
     * multiplayer
     * object snycs
     * room
     * instance game world handler
   * account (N/A)
   * sandbox (N/A)
   * editor (N/A)

 * triengine.js (testing)
   * simple test
   * setup renderer

# Code Build ( Work in progress. ):
  By using the class and ECS setup funs. It is base on bevy engine design or simalar to setup but need some logic and layout design correctly for module work correct without any conflicts.

```js
class TriECS_Sample extends TriECSEngine {
  constructor(args={}){
    super(args);
  }

  //this will call from TriECSEngine if the physics is enable since it need to load by sync and await
  setup(){
    super.setup();
    this.createScene();
  }

  createScene(){
    ECS.addSystem(this.world,this.boxRotateSystem.bind(this));
  }

  boxRotateSystem(world){

    //const scene = this.getScene(); //testing
    //const camera = this.getCamera(); //testing
    // there is different method to get the scene
    // const Entity = ECS.getEntity(world, [ 'scene']);
    // Entity.scene.add(mesh)
    // note there need to set up for as well for render, scene and camera.


    //set up 
    const ECSGROUND = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSGROUND, 'mesh', ground);
    ECS.addComponentToEntity(world, ECSGROUND, 'rigbody', rigbodyGround);

    const onUpdate = function (dt) {
      const Entity = ECS.getEntity(world, [ 'mesh','rigbody']);
      if(Entity){
        Entity.mesh.position.copy(Entity.rigbody.translation());
      }
      //update here
    }
    // ECS api
    return { onUpdate }
  }
}

const app = new TriECS_Sample({isPhysics:true});
app.run();
```
  Note it work in progress. As the world can made to another instance world to handle scenes manage and can run back ground update. Plan ideas.

# Links:
 * https://github.com/mreinstein/ecs