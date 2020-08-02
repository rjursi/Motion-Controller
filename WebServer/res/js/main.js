const SERVER_URL = "https://jswebgame.run.goorm.io";
const MODELINGDATA_PATH = "/res/js/modelingData/";
const GIRL_MODEL_PATH = "girl/";
const BOY_MODEL_PATH = "boy/";
const MOVE_OBJECT_PATH = "moveobj/";

// object는 일단 각종 요소(예를 들어 큐브) 등의 요소들이 들어가는 부분

var scene, camera, renderer, light, clock, anim_mixer, orbControls;

// 충돌하는 메쉬들이 들어가는 배열

var collision_datas = [];
var ambLight, directionalLight;
// 오브젝트 로드를 위한 gltf loader 객체 변수 설정
var gltfLoader, dracoLoader;

// 플레이어 객체가 들어가 있는 배열, 총 2개 밖에 안들어감
var playerUIObj = {};
//var playerCollisionObj, col_geometry, col_material; // 충돌 테스트를 위한 임시 Mesh 요소

var playerCollisionObjs = [];

// 맵 관련 오브젝트가 들어갈 예정
var map_Elements = {};;

// 맵 내 움직일 수 있는 오브젝트가 들어갈 배열
var map_objects = {};

// 위 형식은 일반 배열이 아닌 딕셔너리, 아래와 같이 인덱스 문자열과 함께 삽입 하면 됨
/*
game_sockets[socket.id] = {
				socket : socket,
				controller_id : undefined
			};
*/
function init(){

	
	scene = new THREE.Scene(); 
	//light = new THREE.HemisphereLight();
	directionalLight = new THREE.DirectionalLight(0xffffff,1);
	directionalLight.position.set(0,1,0);
    directionalLight.castShadow = true;
	
	scene.add(directionalLight);
	
	ambLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambLight);
	
	
	
	// scene.add(light)
	// camera 생	성, 일단은 PerspectiveCamera 로 설정
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 250;
	// 75 : 시야, 75도
	// window.innerWidth / window.innerHeight : 종횡비
	// 0.1, 1000 : 근거리 및 원거리 클리핑 평면
	//   카메라에서 멀거나 가까운 값보다 가까운 거리에 있는 물체는 렌더링 되지 않음
	//   값 비율을 조절할 것
	

	// renderer 생성
	// WebGL 을 사용하는 렌더러 사용
	renderer = new THREE.WebGLRenderer();

	// 앱을 렌더링할 크기를 설정해야함 - 여기서는 브라우저의 창 높이와 너비

	
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xffffff);
	renderer.outputEncoding = THREE.sRGBEncoding;
	// 여기 setSize 에서 앱의 크기를 유지하면서 더 낮은 해상도로 랜더링 할 경우에는 
	// setSize의 세번째 인수 (updateStyle)로 false를 넣고 렌더링 사이즈를 넣으면 됨

	
    orbControls = new THREE.OrbitControls( camera, renderer.domElement );
	orbControls.addEventListener('change', showCameraPosition);
	
	
	gltfLoader = new THREE.GLTFLoader();
	clock = new THREE.Clock();

	character_obj_init(); // 캐릭터 gltf 오브젝트를 넣어놓을 공간 초기화
	
	gltf_Load(); // 모든 gltf 모델 로드


	// 이벤트 정의, 아래는 윈도우 사이즈가 바뀔 경우에 대해서 이벤트 리스너 정의
	window.addEventListener( 'resize', onWindowResize);		
	
	document.body.appendChild(renderer.domElement);
	
	
}

function viewMap(){
	scene.add(map_Elements["map"].scene);
	scene.add(map_Elements["hitbox"].scene);
}
function character_obj_init(){
	
	playerUIObj["girl"] = {
		
		gltf_nowView : undefined,
		gltf_run : undefined,
		gltf_push : undefined,
		gltf_idle : undefined,
		gltf_cwalk : undefined,
		hitbox : undefined
		
	};
	
	playerUIObj["boy"] = {
		gltf_nowView : undefined,
		gltf_run : undefined,
		gltf_push : undefined,
		gltf_idle : undefined,
		gltf_cwalk : undefined,
	    hitbox : undefined
		
	}
	
	playerUIObj["view_status"] = false;
}


function animate(){
	
	update();
	render();
	requestAnimationFrame(animate);
	
}
function update(){
	
	// 플레이어 UI 객체가 보이는 상태이면
	if(playerUIObj["view_status"]){
		anim_mixer.update(clock.getDelta());
		collision_check();
	}
	
	
	
}

/*
function makeCollisionVertices(){
	let vertices_tmp;
	const vertices = [];
	
	
	for(let i = 0; 	i< collision_datas.length; i++){
		let geometry = collision_datas[i].geometry;
		
		const positions = geometry.attributes.position.array;
		
		for(let k = 0; k < positions.length; k +=3){
			vertices_tmp.set(positions[k], positions[k + 1], positions[k + 2]);
			vertices.push(vertices_tmp.clone());
		}
	}
	
	return vertices;
}
*/


function collision_check(){
	
	
	for(var playerCollisionObj of playerCollisionObjs){
		
		console.log("playerCollisionObj : " + playerCollisionObj);
		var originPoint = playerCollisionObj.position.clone();
	

		for (var vertexIndex = 0; vertexIndex <	playerCollisionObj.geometry.vertices.length; vertexIndex++)
		{		


			var localVertex =  playerCollisionObj.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4(   playerCollisionObj.matrix );
			var directionVector = globalVertex.sub(   playerCollisionObj.position );

			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( collision_datas );
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){

				console.log("hit");
			}
		}	
	}
}


	
function render(){
	renderer.render(scene, camera);
}

function finish_render(){
	renderer.clear();
	renderer = undefined;
	document.body.removeChild(renderer.domElement);
}
	

function showCameraPosition(){
	var cameraPosition_x = Math.floor(camera.position.x);
	var cameraPosition_y = Math.floor(camera.position.y);
	var cameraPosition_z = Math.floor(camera.position.z);
	
	console.log(`Camera position : X : ${cameraPosition_x}, Y : ${cameraPosition_y}, Z : ${cameraPosition_z}`);
	
}
// 해당 객체 정보를 가져와서 플레이어를 테스트로 생성하는 부분
var createPlayer = function(initPlayerObjArr){
	
	
	
	// 플레이어 데이터 객체 목록 갯수 만큼 해당 반복문 실행
	for(var i in initPlayerObjArr){
		
		var nowPlayerKey = Object.keys(playerUIObj)[i];
		
		console.log(initPlayerObjArr[i]);
		var cube_geometry = new THREE.BoxGeometry(initPlayerObjArr[i].objStatus.sizeX, initPlayerObjArr[i].objStatus.sizeY, initPlayerObjArr[i].objStatus.SizeZ);
		
		var cube_material = new THREE.MeshBasicMaterial({color :initPlayerObjArr[i].color , wireframe : true});

		// 여기서 해당 플레이어에 대한 각종 캐릭터 값을 만듬
		var player_Obj = new THREE.Mesh(cube_geometry, cube_material);



		console.log("createPlayer : playerInfo : ");
		console.log(player_Obj);

		
		// player.rotation.set(0,0,0);
		
		// 각 플레이어의 정보를 가지고 player_obj 객체를 생성
		player_Obj.position.x = initPlayerObjArr[i].objStatus.x;
		player_Obj.position.y = initPlayerObjArr[i].objStatus.y;
		player_Obj.position.z = initPlayerObjArr[i].objStatus.z;
		
		
		// 기본 자세를 가만히 있는 idle 자세로 수정
		playerUIObj[nowPlayerKey].nowView = playerUIObj[nowPlayerKey].gltf_idle;
		
		
		// 현재 눈에 보이는 gltf 모델의 위치를 수정
		playerUIObj[nowPlayerKey].nowView.scene.position.x = initPlayerObjArr[i].objStatus.x;
		playerUIObj[nowPlayerKey].nowView.scene.position.y = initPlayerObjArr[i].objStatus.y;
		playerUIObj[nowPlayerKey].nowView.scene.position.z = initPlayerObjArr[i].objStatus.z;

		console.log(player_Obj.position);
		
		playerUIObj[nowPlayerKey].hitbox = player_Obj;
		
		scene.add(player_Obj); // 충돌 hitbox 추가
		playerCollisionObjs.push(player_Obj);
		//console.log(playerUIObj[nowPlayerKey].nowView.scene);
		scene.add(playerUIObj[nowPlayerKey].nowView.scene); // 현재 설정된 gltf view 추가
		
	}
	
	playerUIObj["view_status"] = true;
	
}

var updateUI = function(objStatuses){
	var player_1_status = objStatuses[0];
	var player_2_status = objStatuses[1];
	
	
	// player_1 회전각 업데이트
	playerUIObj["girl"].nowView.scene.rotation.x = player_1_status.objStatus.r_x;
	playerUIObj["girl"].nowView.scene.rotation.y = player_1_status.objStatus.r_y;
	playerUIObj["girl"].nowView.scene.rotation.z = player_1_status.objStatus.r_z;
	
	// player_1 위치 업데이트
	playerUIObj["girl"].nowView.scene.position.x = player_1_status.objStatus.x;
	playerUIObj["girl"].nowView.scene.position.y = player_1_status.objStatus.y;
	playerUIObj["girl"].nowView.scene.position.z = player_1_status.objStatus.z;
	
	// player_1 hitbox 위치 업데이트
	playerUIObj["girl"].hitbox.position.x = player_1_status.objStatus.x;
	playerUIObj["girl"].hitbox.position.y = player_1_status.objStatus.y;
	playerUIObj["girl"].hitbox.position.z = player_1_status.objStatus.z;
	
	
	
	
	
	
	// player_2 회전각 업데이트
	playerUIObj["boy"].nowView.scene.rotation.x = player_2_status.objStatus.r_x;
	playerUIObj["boy"].nowView.scene.rotation.y = player_2_status.objStatus.r_y;
	playerUIObj["boy"].nowView.scene.rotation.z = player_2_status.objStatus.r_z;
	
	// player_2 위치 업데이트
	playerUIObj["boy"].nowView.scene.position.x = player_2_status.objStatus.x;
	playerUIObj["boy"].nowView.scene.position.y = player_2_status.objStatus.y;
	playerUIObj["boy"].nowView.scene.position.z = player_2_status.objStatus.z;
	
	
	// player_2 hitbox 위치 업데이트
	
	playerUIObj["boy"].hitbox.position.x = player_2_status.objStatus.x;
	playerUIObj["boy"].hitbox.position.y = player_2_status.objStatus.y;
	playerUIObj["boy"].hitbox.position.z = player_2_status.objStatus.z;
	
}


// 한쪽에서 Disconnect 되었을 때 처리하는 함수
var DisconnectedUI = function(){
	
	
	// 화면, 즉 scene 안에 있는 모든 오브젝트 들을 모두 지워버림
	
	while(scene.children.length > 0){ 
    	scene.remove(scene.children[0]); 
	}
	
	alert("플레이어 한쪽이 Disconnect 되어서 새로 게임 시작시 새로고침 해야합니다.");
	
}


// scene 상에서 플레이어 모두를 지우기 위한 함수
var removePlayers = function(){
	
	for(var obj in playerUIObj){
		scene.remove(obj);
	}
	
}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}



//////////////////////////////////////////////// gltf 로딩 부분


function gltf_Load(){
	gltfload_Map();
	gltfload_Map_Collision();
	gltfload_GirlAnimation();
	gltfload_ManAnimation();
}

function gltfload_Map() {
	
	const map = SERVER_URL + MODELINGDATA_PATH + "map_texture.glb";
	
	
	gltfLoader.load(map, function(gltfObj){
		
		
		map_Elements["map"] = gltfObj;
		gltfObj.scene.scale.set( 5, 5, 5 );			   
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
	
		console.log("gltfLoader : Map Loaded.");
		//scene.add( gltfObj.scene );	
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

function gltfload_Map_Collision(){
	
	const map_collision = SERVER_URL + MODELINGDATA_PATH + "collision.glb";

	gltfLoader.load(map_collision, function(gltfObj){
		
	
		gltfObj.scene.traverse(function(children){
			
			 if(children.type == "Mesh"){
				 collision_datas.push(children);
			 }
			 	
		});
		
		console.log(collision_datas);
		map_Elements["hitbox"] = gltfObj;
		gltfObj.scene.scale.set( 5, 5, 5);			   
		gltfObj.scene.position.x = 0;    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		
		// 충돌 판정이기 때문에 플레이어의 눈에 보이지 않도록 설정
		gltfObj.scene.visible = false;
		//scene.add( gltfObj.scene );	
		
		
		console.log("gltfLoader : Map Collision Loaded.");
		
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

function gltfload_ManAnimation(){
	
	
	const boy_run = SERVER_URL + MODELINGDATA_PATH + BOY_MODEL_PATH + "boy_run.glb";
	const boy_idle = SERVER_URL + MODELINGDATA_PATH + BOY_MODEL_PATH + "boy_idle.glb";
	const boy_cwalk = SERVER_URL + MODELINGDATA_PATH + BOY_MODEL_PATH + "boy_cwalk.glb";
	const boy_push = SERVER_URL + MODELINGDATA_PATH + BOY_MODEL_PATH + "boy_push.glb";
	
	
	gltfLoader.load(boy_run, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 5, 5, 5 );			   
		
		/*
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		*/
		
		
		// console.log(gltfObj.animations)
		anim_mixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		gltfObj.animations.forEach((clip) => {
			anim_mixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		playerUIObj["boy"].gltf_run = gltfObj;
		//scene.add( gltfObj.scene );	
		
	
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	gltfLoader.load(boy_idle, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 5, 5, 5 );			   
		/*
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		*/
		
		
		// console.log(gltfObj.animations)
		anim_mixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		gltfObj.animations.forEach((clip) => {
			anim_mixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		playerUIObj["boy"].gltf_idle = gltfObj;
		//scene.add( gltfObj.scene );	
		
	
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	
	gltfLoader.load(boy_cwalk, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 5, 5, 5 );		
		/*
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		*/
		
		
		// console.log(gltfObj.animations)
		anim_mixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		gltfObj.animations.forEach((clip) => {
			anim_mixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		playerUIObj["boy"].gltf_cwalk = gltfObj;
		//scene.add( gltfObj.scene );	
		
	
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	
	gltfLoader.load(boy_push, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 5, 5, 5 );		
		/*
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		*/
		
		
		// console.log(gltfObj.animations)
		anim_mixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		gltfObj.animations.forEach((clip) => {
			anim_mixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		playerUIObj["boy"].gltf_push = gltfObj;
		//scene.add( gltfObj.scene );	
		
	
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



function gltfload_GirlAnimation(){
	
	const girl_run = SERVER_URL + MODELINGDATA_PATH + GIRL_MODEL_PATH + "girl_run.glb";
	const girl_idle = SERVER_URL + MODELINGDATA_PATH + GIRL_MODEL_PATH + "girl_idle.glb";
	const girl_cwalk = SERVER_URL + MODELINGDATA_PATH + GIRL_MODEL_PATH + "girl_cwalk.glb";
	const girl_push = SERVER_URL + MODELINGDATA_PATH + GIRL_MODEL_PATH + "girl_push.glb";
	
	
	gltfLoader.load(girl_run, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 5, 5, 5 );			   
		
		/*
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		*/
		
		
		// console.log(gltfObj.animations)
		anim_mixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		gltfObj.animations.forEach((clip) => {
			anim_mixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		playerUIObj["girl"].gltf_run = gltfObj;
		//scene.add( gltfObj.scene );	
		
	
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	gltfLoader.load(girl_idle, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 5, 5, 5 );			   
		/*
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		*/
		
		
		// console.log(gltfObj.animations)
		anim_mixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		gltfObj.animations.forEach((clip) => {
			anim_mixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		playerUIObj["girl"].gltf_idle = gltfObj;
		//scene.add( gltfObj.scene );	
		
	
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	
	gltfLoader.load(girl_cwalk, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 5, 5, 5 );		
		/*
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		*/
		
		
		// console.log(gltfObj.animations)
		anim_mixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		gltfObj.animations.forEach((clip) => {
			anim_mixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		playerUIObj["girl"].gltf_cwalk = gltfObj;
		//scene.add( gltfObj.scene );	
		
	
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	
	gltfLoader.load(girl_push, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 5, 5, 5 );		
		/*
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		*/
		
		
		// console.log(gltfObj.animations)
		anim_mixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		gltfObj.animations.forEach((clip) => {
			anim_mixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		playerUIObj["girl"].gltf_push = gltfObj;
		//scene.add( gltfObj.scene );	
		
	
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
