/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://jsfiddle.net/8g2Lhafb/2/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

// init

const color = new THREE.Color();
const matrix = new THREE.Matrix4();
matrix.scale(5, 5, 5);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 125;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8FBCD4);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 100, 50);
scene.add(dirLight);

const geometry = createMorphGeometry();
const material = new THREE.MeshStandardMaterial({
  flatShading: true,
  wireframe:true
});

const count = 74;
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

const halfCount = count / 2;
for (let i = 0; i < count; i++) {
  const x = Math.random() * 100 - 50;
  const y = Math.random() * 100 - 50;
  const z = Math.random() * 100 - 50;

  matrix.makeTranslation(x, y, z);
  matrix.scale({
    x: 3,
    y: 3,
    z: 3
  });

  instancedMesh.setMatrixAt(i, matrix);

  instancedMesh.setColorAt(i, color.set((i <= halfCount ? 0x4BE501 : 0xF90000) ));

  instancedMesh.setMorphAt(i, {
    morphTargetInfluences: [0, 0]
  });
}

scene.add(instancedMesh);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// animation

function animation(time) {

  animateMorph();

  renderer.render(scene, camera);

}

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateMorph() {
  const halfCount = count / 2;
  for (let i = 0; i < count; i++) {

    instancedMesh.getMatrixAt(i, matrix);
    let x = matrix.elements[12] + 0.25;
    if (x >= 50) x = -50;
    matrix.elements[12] = x;

    instancedMesh.setMatrixAt(i, matrix);

    const interpolation = (x + 50) / 100;

    instancedMesh.setMorphAt(i, {
      morphTargetInfluences: [
        i < halfCount ? 0 : interpolation,
        i > halfCount ? 0 : interpolation,
      ]
    })
  }

  instancedMesh.morphTexture.needsUpdate = true;
  instancedMesh.instanceMatrix.needsUpdate = true;
}

function createMorphGeometry() {

  //const geometry = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32);//default
  const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);

  // create an empty array to  hold targets for the attribute we want to morph
  // morphing positions and normals is supported
  geometry.morphAttributes.position = [];

  // the original positions of the cube's vertices
  const positionAttribute = geometry.attributes.position;

  // for the first morph target we'll move the cube's vertices onto the surface of a sphere
  const spherePositions = [];

  // for the second morph target, we'll twist the cubes vertices
  const twistPositions = [];
  const direction = new THREE.Vector3(1, 0, 0);
  const vertex = new THREE.Vector3();

  for (let i = 0; i < positionAttribute.count; i++) {

    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);

    spherePositions.push(

      x * Math.sqrt(1 - (y * y / 2) - (z * z / 2) + (y * y * z * z / 3)),
      y * Math.sqrt(1 - (z * z / 2) - (x * x / 2) + (z * z * x * x / 3)),
      z * Math.sqrt(1 - (x * x / 2) - (y * y / 2) + (x * x * y * y / 3))

    );

    // stretch along the x-axis so we can see the twist better
    vertex.set(x * 2, y, z);

    vertex.applyAxisAngle(direction, Math.PI * x / 2).toArray(twistPositions, twistPositions.length);

  }

  // add the spherical positions as the first morph target
  geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);

  // add the twisted positions as the second morph target
  geometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(twistPositions, 3);

  return geometry;
}
