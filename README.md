# Name: threepolygonenginejs

# Status:
 * work in progress
 * hono js server
 * three.js module design
 * ECS
 * socket.io

# License: MIT

# Created By: Lightnet

# Programings Languages:
 * javascript
 * nodejs
 * bun

# Packages:
 * hono
 * socket.io
 * better-sqlite3
 * drizzle-orm
 * mini-van-plate

# Information:

  This is protoype to build the minecraft style as well on other games as well to keep the world simple to run the game. By using the vanjs for browser and javascript module. To develop threejs with mini games.
  
  Using the hono server framework, socket.io and sqlite.

  For local play with friend to play.

# Game Server (notes):
 Is is possible to run multiple game instance? Yes and No. Nodejs can't run threads.

 https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js

 It use worker_threads module. There are pros and cons to them.

 It need socket.io to handle the worker_threads and event handler instance of the world. As well some user and physics.

# Entities Components System:
  By using the ECS to handle almost every modules that will be set up. It is work in progress build.

  The modules would handle set up for render, input, physics and other things. As well server and client filter or configure settings.

# Main server:
 It depend on the packages.
 Hono js is cross platform for nodejs and bun.

# Server:
```
npm run devh
```

# Layout:
  Work in progress build.

## files:
 * triecsengine.js
   * server (node/bun n/a)
   * client (browser wip)
   * ECS
     * update (part done)
     * remove (n/a)
   * renderer (part done)
   * physics (part done)
     * rapier (wip)
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

# Code Build:
  By using the class and ECS setup funs. Work in progress.

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
 * 