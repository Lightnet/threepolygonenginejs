
// https://github.com/pmndrs/cannon-es/blob/master/src/objects/RigidVehicle.ts

import { Vec3 } from '../math/Vec3'
import { Body } from '../objects/Body'
import { Sphere } from '../shapes/Sphere'
import { Box } from '../shapes/Box'
import { HingeConstraint } from '../constraints/HingeConstraint'

/**
 * Simple vehicle helper class with spherical rigid body wheels.
 */
export class RigidVehicle {
  /**
   * The bodies of the wheels.
   */
  wheelBodies=[]
  coordinateSystem;
  /**
   * The chassis body.
   */
  chassisBody;
  /**
   * The constraints.
   */
  constraints=[]
  /**
   * The wheel axes.
   */
  wheelAxes;
  /**
   * The wheel forces.
   */
  wheelForces;

  constructor(
    options = {}
  ) {
    this.wheelBodies = []
    this.coordinateSystem =
      typeof options.coordinateSystem !== 'undefined' ? options.coordinateSystem.clone() : new Vec3(1, 2, 3)

    if (options.chassisBody) {
      this.chassisBody = options.chassisBody
    } else {
      // No chassis body given. Create it!
      this.chassisBody = new Body({ mass: 1, shape: new Box(new Vec3(5, 0.5, 2)) })
    }

    this.constraints = []
    this.wheelAxes = []
    this.wheelForces = []
  }

  /**
   * Add a wheel
   */
  addWheel(
    options = {}
  ) {
    let wheelBody;

    if (options.body) {
      wheelBody = options.body
    } else {
      // No wheel body given. Create it!
      wheelBody = new Body({ mass: 1, shape: new Sphere(1.2) })
    }

    this.wheelBodies.push(wheelBody)
    this.wheelForces.push(0)

    // Position constrain wheels
    const position = typeof options.position !== 'undefined' ? options.position.clone() : new Vec3()

    // Set position locally to the chassis
    const worldPosition = new Vec3()
    this.chassisBody.pointToWorldFrame(position, worldPosition)
    wheelBody.position.set(worldPosition.x, worldPosition.y, worldPosition.z)

    // Constrain wheel
    const axis = typeof options.axis !== 'undefined' ? options.axis.clone() : new Vec3(0, 0, 1)
    this.wheelAxes.push(axis)

    const hingeConstraint = new HingeConstraint(this.chassisBody, wheelBody, {
      pivotA: position,
      axisA: axis,
      pivotB: Vec3.ZERO,
      axisB: axis,
      collideConnected: false,
    })
    this.constraints.push(hingeConstraint)

    return this.wheelBodies.length - 1
  }

  /**
   * Set the steering value of a wheel.
   * @todo check coordinateSystem
   */
  setSteeringValue(value, wheelIndex) {
    // Set angle of the hinge axis
    const axis = this.wheelAxes[wheelIndex]

    const c = Math.cos(value)
    const s = Math.sin(value)
    const x = axis.x
    const z = axis.z
    this.constraints[wheelIndex].axisA.set(-c * x + s * z, 0, s * x + c * z)
  }

  /**
   * Set the target rotational speed of the hinge constraint.
   */
  setMotorSpeed(value, wheelIndex) {
    const hingeConstraint = this.constraints[wheelIndex]
    hingeConstraint.enableMotor()
    hingeConstraint.motorTargetVelocity = value
  }

  /**
   * Set the target rotational speed of the hinge constraint.
   */
  disableMotor(wheelIndex) {
    const hingeConstraint = this.constraints[wheelIndex]
    hingeConstraint.disableMotor()
  }

  /**
   * Set the wheel force to apply on one of the wheels each time step
   */
  setWheelForce(value, wheelIndex) {
    this.wheelForces[wheelIndex] = value
  }

  /**
   * Apply a torque on one of the wheels.
   */
  applyWheelForce(value, wheelIndex) {
    const axis = this.wheelAxes[wheelIndex]
    const wheelBody = this.wheelBodies[wheelIndex]
    const bodyTorque = wheelBody.torque

    axis.scale(value, torque)
    wheelBody.vectorToWorldFrame(torque, torque)
    bodyTorque.vadd(torque, bodyTorque)
  }

  /**
   * Add the vehicle including its constraints to the world.
   */
  addToWorld(world) {
    const constraints = this.constraints
    const bodies = this.wheelBodies.concat([this.chassisBody])

    for (let i = 0; i < bodies.length; i++) {
      world.addBody(bodies[i])
    }

    for (let i = 0; i < constraints.length; i++) {
      world.addConstraint(constraints[i])
    }

    world.addEventListener('preStep', this._update.bind(this))
  }

  _update() {
    const wheelForces = this.wheelForces
    for (let i = 0; i < wheelForces.length; i++) {
      this.applyWheelForce(wheelForces[i], i)
    }
  }

  /**
   * Remove the vehicle including its constraints from the world.
   */
  removeFromWorld(world) {
    const constraints = this.constraints
    const bodies = this.wheelBodies.concat([this.chassisBody])

    for (let i = 0; i < bodies.length; i++) {
      world.removeBody(bodies[i])
    }

    for (let i = 0; i < constraints.length; i++) {
      world.removeConstraint(constraints[i])
    }
  }

  /**
   * Get current rotational velocity of a wheel
   */
  getWheelSpeed(wheelIndex){
    const axis = this.wheelAxes[wheelIndex]
    const wheelBody = this.wheelBodies[wheelIndex]
    const w = wheelBody.angularVelocity
    this.chassisBody.vectorToWorldFrame(axis, worldAxis)
    return w.dot(worldAxis)
  }
}

const torque = new Vec3()

const worldAxis = new Vec3()