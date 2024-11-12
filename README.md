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

# Server:
```
npm run devh
```

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
|| Class Engine Frame Work (triecsengine.js)
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