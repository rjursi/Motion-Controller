var load_Map = function(){
	
	const map = SERVER_URL + MODELINGDATA_PATH + "test_map.glb";
	
	
	gltfLoader.load(map, function(gltfObj){
		
		console.log(gltfObj);
		map_Elements.push(gltfObj);
		gltfObj.scene.scale.set( 5, 5, 5 );			   
		gltfObj.scene.position.x = 70;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
	
		scene.add( gltfObj.scene );	
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
}

var load_Map_Collision = function(){
	
	const map_collision = SERVER_URL + MODELINGDATA_PATH + "collision_map.glb";
	
	
	gltfLoader.load(map_collision, function(gltfObj){
		
		console.log(gltfObj);
		map_Elements.push(gltfObj);
		gltfObj.scene.scale.set( 5, 5, 5);			   
		gltfObj.scene.position.x = 70;    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
	
		scene.add( gltfObj.scene );	
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
}

var load_ManAnimation = function(){
	
}

var load_GirlAnimation = function(){
	
	const girl_run = SERVER_URL + MODELINGDATA_PATH + "girl_run.glb";
	
	
	gltfLoader.load(girl_run, function(gltfObj){
		
		
		playerUIObj.push(gltfObj);
		gltfObj.scene.scale.set( 5, 5, 5 );			   
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
	
		
		// console.log(gltfObj.animations)
		anim_mixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		gltfObj.animations.forEach((clip) => {
			anim_mixer.clipAction(clip).play();
		
		});
		
		
		scene.add( gltfObj.scene );	
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
}