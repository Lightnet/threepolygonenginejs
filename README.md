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

  This is protoype to build the minecraft style since it limited by bandwidth. As well hosting limits bandwidth cap. Required all files stand alone to deal with sandbox worker. Work in progress.
  
  By using the vanjs for browser and javascript module. To develop threejs game with mini games.
  
  Using the hono server framework, socket.io and sqlite.

  For basic local game build test for friend party test.

# Game Server (notes):
 Is is possible to run multiple game instance? Yes and No. Nodejs can't run threads.

 https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js

 It use worker_threads module. There are pros and cons to them.

 It need socket.io to handle the worker_threads and event handler instance of the world. As well some user and physics.
 
  Note it for local testing for friends tests.

# Entities Components System:
 To keep things simple for not mess code. Since loop, update and render needs to call functions to update stuff.

 There are couple reason is one is server and client have different functions that has no requestAnimationFrame call in nodejs. The other is easy to handle or filter component on both side.

 Note have not tested the ECS yet.

## Modules:
 To create modules to handle module components for server and client to deal with set up entities and inputs but required more testing.

# Main server:
 It depend on the packages.
 Hono js is cross platform for nodejs and bun.

# Server:
```
npm run devh
```

# Links:
 * 