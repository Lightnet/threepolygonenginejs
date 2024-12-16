 * https://threejs.org/docs/#api/en/loaders/managers/LoadingManager
 * https://threejs.org/docs/#api/en/loaders/TextureLoader
 * 
 * 

```js
THREE.TextureLoader( manager : LoadingManager );
```

```js
// instantiate a loader
const loader = new THREE.TextureLoader();

// load a resource
loader.load(
	// resource URL
	'textures/land_ocean_ice_cloud_2048.jpg',

	// onLoad callback
	function ( texture ) {
		// in this example we create the material when the texture is loaded
		const material = new THREE.MeshBasicMaterial( {
			map: texture
		 } );
	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function ( err ) {
		console.error( 'An error happened.' );
	}
);
```
# TextureLoader
```js
//THREE.TextureLoader().load('textures/land_ocean_ice_cloud_2048.jpg' ); 
.load ( url : String, onLoad : Function, onProgress : Function, onError : Function ) : Texture
```
