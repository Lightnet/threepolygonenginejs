

# collision event:
```js
let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
  .setTranslation(position.x, position.y, position.z);

let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x, size.y, size.z);
let rigidBody = this.world.createRigidBody(rigidBodyDesc);
let collider = this.world.createCollider(colliderDesc, rigidBody);

let collider = this.world.createCollider(colliderDesc, rigidBody);
    collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT);
    collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

collider.setActiveHooks(RAPIER.ActiveHooks.FILTER_INTERSECTION_PAIR);//works,
//collider.setActiveHooks(RAPIER.ActiveHooks.FILTER_CONTACT_PAIRS);//nope crash

console.log(collider.hander)//id

//...

eventQueue.drainCollisionEvents((handle1, handle2, started) => {
  /* Handle the collision event. */
  
  console.log("drainCollisionEvents...");
  console.log(handle1) //ID > collider.hander == ID
  console.log(handle2) //ID
  console.log(started)
});

```
# setSensor:
https://rapier.rs/docs/user_guides/javascript/colliders
```js

let colliderDesc = new RAPIER.ColliderDesc(new RAPIER.Ball(0.5))
    // The collider translation wrt. the body it is attached to.
    // Default: the zero vector.
    .setTranslation(1.0, 2.0, 3.0)
    // The collider rotation wrt. the body it is attached to, as a unit quaternion.
    // Default: the identity rotation.
    .setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 })
    // The collider density. If non-zero the collider's mass and angular inertia will be added
    // to the inertial properties of the body it is attached to.
    // Default: 1.0
    .setDensity(1.3)
    // The friction coefficient of this collider.
    // Default: 0.5
    .setFriction(0.8)
    // Whether this collider is a sensor.
    // Default: false
    .setSensor(true); //<- this here enable

```