

// https://stackoverflow.com/questions/9252764/how-to-create-a-custom-mesh-on-three-js
// https://www.reddit.com/r/threejs/comments/w6w0rq/add_texture_to_a_buffergeometry_how_do_i_create/
// https://dustinpfister.github.io/2022/11/04/threejs-examples-uvmap-cube-canvas-update/
// https://discourse.threejs.org/t/complicated-please-help-how-to-update-uv-map-dynamically-from-intersected-geometry/48273/3
// https://stackoverflow.com/questions/70322392/three-js-how-to-create-a-cube-using-buffergeometry-with-6-different-textures
// 
// 
// https://github.com/mrdoob/three.js/blob/dev/src/geometries/BoxGeometry.js


const geometry = new THREE.BufferGeometry();

// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2

	 1.0,  1.0,  1.0, // v3
	-1.0,  1.0,  1.0, // v4
	-1.0, -1.0,  1.0  // v5
] );

// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const mesh = new THREE.Mesh( geometry, material );