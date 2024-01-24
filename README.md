# Name: threepolygonenginejs

# Status:
 * work in progress
 * hono js server current testing...

# Information:
  This is protoype to keep things simple without the solid-js or preact-js. By using the vanjs for browser javascript module.

  To develop threejs game with mini game test build.
  
  Using the hono server framework, socket.io and sqlite.

  For basic local game build test for friend party test.

# Entities Components System:
 To keep things simple for not mess code. Since loop, update and render needs to call functions to update stuff.

 There are couple reason is one is server and client have different functions that has no requestAnimationFrame call in nodejs. The other is easy to handle or filter component on both side.

 Note have not tested the ECS yet.

# Packages:
 * hono
 * socket.io
 * better-sqlite3
 * drizzle-orm
 * mini-van-plate
  
# Main server:
 It depend on the packages.
 Hono js is cross platform for nodejs and bun.

# Server:
```
npm run devh
```

# Links:
 * 