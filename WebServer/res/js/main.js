const SERVER_URL = "https://jswebgame.run.goorm.io";
const MODELINGDATA_PATH = "/res/js/modelingData/";
const GIRL_MODEL_PATH = "girl/";
const BOY_MODEL_PATH = "boy/";
const MOVE_OBJECT_PATH = "moveobj/";

// object는 일단 각종 요소(예를 들어 큐브) 등의 요소들이 들어가는 부분

var scene, camera, renderer, light, clock, anim_mixer, orbControls;


var playerBufferGeo;
var ambLight, directionalLight;
// 오브젝트 로드를 위한 gltf loader 객체 변수 설정
var gltfLoader, dracoLoader;

// 플레이어 객체가 들어가 있는 배열, 총 2개 밖에 안들어감
var playerUIObj = [];

// 맵 관련 오브젝트가 들어갈 예정
var map_Elements = [];

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
	camera.position.z = 250;
	
	gltfLoader = new THREE.GLTFLoader();
	clock = new THREE.Clock();
	


	load_Map();
	load_Map_Collision();
	load_GirlAnimation();
	
	console.log(map_Elements[0]);
	console.log(map_Elements[1]);
	
	
	// 이벤트 정의, 아래는 윈도우 사이즈가 바뀔 경우에 대해서 이벤트 리스너 정의
	window.addEventListener( 'resize', onWindowResize);		
	
	document.body.appendChild(renderer.domElement);
	
	
}

function animate(){
	
	update();
	render();
	requestAnimationFrame(animate);
	
}
function update(){
	if(playerUIObj[0]){
		anim_mixer.update(clock.getDelta());
		//collision_check();
	}
	
	
	
}

function collision_check(){
	
	
	console.log(playerUIObj[0]);
	
	var originPoint = playerUIObj[0].scene.position.clone();
	
	//console.log(playerUIObj[0]);
	for (var vertexIndex = 0; vertexIndex <	 originPoint.length(); vertexIndex++)
	{		
		
		console.log(originPoint[vertexIndex]);
		var localVertex =  originPoint[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4(  playerUIObj[0].scene.matrix );
		var directionVector = globalVertex.sub(  playerUIObj[0].scene.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( map_Elements );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
			
			console.log("hit");
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

		console.log(player_Obj.position);
		
		
		playerUIObj.push(player_Obj);	
		scene.add(player_Obj);
		
	}
	
}

var updateUI = function(objStatuses){
	var player_1_status = objStatuses[0];
	var player_2_status = objStatuses[1];
	
	
	// player_1 정보 업데이트
	playerUIObj[0].rotation.x = player_1_status.objStatus.r_x;
	playerUIObj[0].rotation.y = player_1_status.objStatus.r_y;
	playerUIObj[0].rotation.z = player_1_status.objStatus.r_z;
	
	// player_2 정보 업데이트
	playerUIObj[1].rotation.x = player_2_status.objStatus.r_x;
	playerUIObj[1].rotation.y = player_2_status.objStatus.r_y;
	playerUIObj[1].rotation.z = player_2_status.objStatus.r_z;
	
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
