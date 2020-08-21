const SERVER_URL = "https://jswebgame.run.goorm.io";
const MODELINGDATA_PATH = "/res/js/modelingData/";
const GIRL_MODEL_PATH = "girl/";
const BOY_MODEL_PATH = "boy/";
const MOVE_OBJECT_PATH = "moveobj/";
const HITBOX_DEFAULT_HEIGHT = 8;

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

function setLight() {

            var light = new THREE.AmbientLight(0xaccde0, 0.1);
	        scene.add(light);
            /////////////////////////////////////
            //////////////// 2층 ////////////////
            /////////////////////////////////////
            var light_2Froom = new THREE.PointLight(0xffffff, 1, 3);
	        light_2Froom.position.set(6.1, 2.2, 0.6);
            //light_2Froom.castShadow = true;
	        scene.add(light_2Froom);    // 2층 방 조명


                var light_2FroomBold = new THREE.SpotLight( 0xfff36c, 1, 2, 0.5, 0.4, 0.4 );
                light_2FroomBold.position.set( 6.1, 3, 1.1 );
		        //light_2FroomBold.castShadow = true;
                light_2FroomBold.target = mesh;
	            scene.add(light_2FroomBold);    // 2층 방 강조 조명
                

                var light_2Fhallway = new THREE.SpotLight(0xffffff, 0.6, 8, 0.2, 0.3, 0.4);
                light_2Fhallway.position.set(4.9, 3.5, -5);
                light_2Fhallway.target = mesh2;
                //light_2Fhallway.castShadow = true;
                scene.add(light_2Fhallway); // 2층 복도 조명
                

                var light_2Fsquarelamp = new THREE.PointLight(0xffffff, 0.7, 3);
                light_2Fsquarelamp.position.set(4.9, 3, -3);
                //light_2Fsquarelamp.castShadow = true;
                scene.add(light_2Fsquarelamp);  // 2층 복도끝 조명
                

                var light_2FsquarelampBold = new THREE.SpotLight(0xffff9c, 1, 5, 0.4, 0.1, 0.8);
                light_2FsquarelampBold.position.set(4.9, 3, -3);
                light_2FsquarelampBold.target = mesh3;
                //light_2FsquarelampBold.castShadow = true;
                scene.add(light_2FsquarelampBold);  // 2층 복도끝 강조 조명
                

                var light_2Fstairs01 = new THREE.PointLight(0xffffff, 0.7, 4);
                light_2Fstairs01.position.set(2.9, 3, -0.1);
                //light_2Fstairs01.castShadow = true;
                scene.add(light_2Fstairs01); // 2층 계단 조명 오른쪽
                

                var light_2Fstairs01Bold = new THREE.SpotLight(0xffffff, 0.6, 5, 2, 0.1, 1.2);
                light_2Fstairs01Bold.position.set(2.8, 3, -0.1);
                light_2Fstairs01Bold.target = mesh5;
                //light_2Fstairs01Bold.castShadow = true;
                scene.add(light_2Fstairs01Bold);    // 2층 계단 강조 조명 오른쪽
                

                var light_2Fstairs02 = new THREE.PointLight(0xffffff, 0.7, 4);
                light_2Fstairs02.position.set(2.9, 3, -1.5);
                //light_2Fstairs02.castShadow = true;
                scene.add(light_2Fstairs02);    // 2층 계단 조명 왼쪽
                

                var light_2Fstairs02Bold = new THREE.SpotLight(0xffffff, 0.6, 5, 2, 0.1, 1.2);
                light_2Fstairs02Bold.position.set(2.8, 3, -1.5);
                light_2Fstairs02Bold.target = mesh4;
                //light_2Fstairs02Bold.castShadow = true;
                scene.add(light_2Fstairs02Bold);    //2층 계단 강조 조명 왼쪽
                


                var light_2Fstairs1F = new THREE.PointLight(0xffffff, 0.7, 4);
                light_2Fstairs1F.position.set(3.8, 1, -0.3);
                //light_2Fstairs1F.castShadow = true;
                scene.add(light_2Fstairs1F);    // 2층 계단 1층 조명
                
                /////////////////////////////////////
                //////////////// 1층 ////////////////
                /////////////////////////////////////

                var light_1Fhallway = new THREE.SpotLight(0xffffff, 1.3, 8, 1, 0.5, 0.4);
                light_1Fhallway.position.set(2.9, 1.2, 1);
                light_1Fhallway.target = mesh7;
                light_1Fhallway.castShadow = true;
                scene.add(light_1Fhallway);     // 1층 복도 강조 조명
                

                var light_1Fkitchen = new THREE.PointLight(0xffffff, 1, 4);
	            light_1Fkitchen.position.set(-2.8, 1, -2.1);
                light_1Fkitchen.castShadow = true;
	            scene.add(light_1Fkitchen);     // 1층 부엌 조명
	            

                var light_1FkitchenBold = new THREE.SpotLight( 0xffffff, 1, 3, 0.6, 0.4, 0.4 );
                light_1FkitchenBold.position.set(-2.8, 2, -1.2);
                light_1FkitchenBold.target = mesh6;
                light_1FkitchenBold.castShadow = true;
                scene.add(light_1FkitchenBold);     // 1층 부엌 강조 조명
                
                /////////////////////////////////////
                /////////////////////////////////////
                /////////////////////////////////////

                var help_2Froom = new THREE.PointLightHelper(light_2Froom, 0.1);
	            scene.add(help_2Froom);
                
                help_2FroomBold = new THREE.SpotLightHelper( light_2FroomBold );
                scene.add( help_2FroomBold );

                var help_2Fhallway = new THREE.SpotLightHelper(light_2Fhallway);
                scene.add(help_2Fhallway);

                var help_2Fsquarelamp = new THREE.PointLightHelper(light_2Fsquarelamp, 0.1);
                scene.add(help_2Fsquarelamp);

                var help_2FsquarelampBold = new THREE.SpotLightHelper(light_2FsquarelampBold);
                scene.add(help_2FsquarelampBold);

                var help_2Fstairs01 = new THREE.PointLightHelper(light_2Fstairs01, 0.1);
                scene.add(help_2Fstairs01);

                var help_2Fstairs01Bold = new THREE.SpotLightHelper(light_2Fstairs01Bold);
                scene.add(help_2Fstairs01Bold);

                var help_2Fstairs02 = new THREE.PointLightHelper(light_2Fstairs02, 0.1);
                scene.add(help_2Fstairs02);

                var help_2Fstairs02Bold = new THREE.SpotLightHelper(light_2Fstairs02Bold);
                scene.add(help_2Fstairs02Bold);

                var help_2Fstairs1F = new THREE.PointLightHelper(light_2Fstairs1F, 0.1);
                scene.add(help_2Fstairs1F);

                var help_1Fhallway = new THREE.SpotLightHelper(light_1Fhallway);
                scene.add(help_1Fhallway);

                var help_1Fkitchen = new THREE.PointLightHelper(light_1Fkitchen, 0.1);
	            scene.add(help_1Fkitchen);

                var help_1FkitchenBold = new THREE.SpotLightHelper( light_1FkitchenBold );
	            scene.add(help_1FkitchenBold);
            }

function init(){

	
	scene = new THREE.Scene(); 
	//light = new THREE.HemisphereLight();
	directionalLight = new THREE.DirectionalLight(0xffffff,1);
	directionalLight.position.set(0,1,0);
    directionalLight.castShadow = true;
	// 하녕이 수정하는 즁
	scene.add(directionalLight);
	
	ambLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambLight);
	
	
	
	//////////////////////////// 여까지
	
	
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
	
	
	/// 하녕이 메쉬츄가
	
	
	var targetGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
	var targetMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	var targetMaterial2 = new THREE.MeshBasicMaterial( { color: 0x00ff60 } );
	

	LightTargetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
	LightTargetMesh2 = new THREE.Mesh(targetGeometry, targetMaterial);
	LightTargetMesh3 = new THREE.Mesh(targetGeometry, targetMaterial2);
	LightTargetMesh4 = new THREE.Mesh(targetGeometry, targetMaterial2);
	LightTargetMesh5 = new THREE.Mesh(targetGeometry, targetMaterial);
	LightTargetMesh6 = new THREE.Mesh(targetGeometry, targetMaterial);
	LightTargetMesh7 = new THREE.Mesh(targetGeometry, targetMaterial);


	scene.add(LightTargetMesh);
	scene.add(LightTargetMesh2);
	scene.add(LightTargetMesh3);
	scene.add( LightTargetMesh4 );
	scene.add( LightTargetMesh5 );
	scene.add( LightTargetMesh6 );
	scene.add( LightTargetMesh7 );

	LightTargetMesh.position.x = 6.1;
	LightTargetMesh.position.y = 1;
	LightTargetMesh.position.z = 1.1;

	LightTargetMesh2.position.x = 4.9;
	LightTargetMesh2.position.y = 1;
	LightTargetMesh2.position.z = 4;


	LightTargetMesh3.position.x = 4.9;
	LightTargetMesh3.position.y = 1;
	LightTargetMesh3.position.z = - 1.5;

	LightTargetMesh4.position.x = 8;
	LightTargetMesh4.position.y = 3;
	LightTargetMesh4.position.z = - 1.5;

	LightTargetMesh5.position.x = 8;
	LightTargetMesh5.position.y = 3;
	LightTargetMesh5.position.z = - 0.1;

	LightTargetMesh6.position.x = -2.8;
	LightTargetMesh6.position.y = -1;
	LightTargetMesh6.position.z = - 1.2;

	LightTargetMesh7.position.x = -4.5;
	LightTargetMesh7.position.y = -1;
	LightTargetMesh7.position.z = 1;
	
	//setLight();
	
	//// 여까지
	
}

function viewMap(){
	scene.add(map_Elements["map"].scene);
	
	// 충돌판정을 안보이게 하고 해당 판정을 맵에 추가
	map_Elements["hitbox"].scene.visible = false;
	scene.add(map_Elements["hitbox"].scene);
}
function character_obj_init(){
	
	playerUIObj["girl"] = {
		
		playerId : undefined,
		
		gltf_nowView : undefined,
		gltf_nowView_animMixer : undefined,
		gltf_run : undefined,
		gltf_run_animMixer : undefined,
		gltf_push : undefined,
		gltf_push_animMixer : undefined,
		gltf_idle : undefined,
		gltf_idle_animMixer : undefined,
		gltf_cwalk : undefined,
		gltf_cwalk_animMixer : undefined,
		
		
		now_position_x : 0,
		now_position_y : 0,
		now_position_z : 0,
		
		
		pre_position_x : 0,
		pre_position_y : 0,
		pre_position_z : 0,
		
		hitbox : undefined,
		
		isPoseChangedStatus : false,
		isCanMove : true
		
	};
	
	playerUIObj["boy"] = {
		
		playerId : undefined,
		
		gltf_nowView : undefined,
		gltf_nowView_animMixer : undefined,
		gltf_run : undefined,
		gltf_run_animMixer : undefined,
		gltf_push : undefined,
		gltf_push_animMixer : undefined,
		gltf_idle : undefined,
		gltf_idle_animMixer : undefined,
		gltf_cwalk : undefined,
		gltf_cwalk_animMixer : undefined,
		
		
		now_position_x : 0,
		now_position_y : 0,
		now_position_z : 0,
		
		pre_position_x : 0,
		pre_position_y : 0,
		pre_position_z : 0,
		
		
	    hitbox : undefined,
		
		isPoseChangedStatus : false,
		isCanMove : true
	}
	
	playerUIObj["view_status"] = false;
}

function updatePlayerStatus(updatedPlayerData){
	
	var forUpdatePlayerObj;
	for(var index in playerUIObj){
		
		if(playerUIObj[index].playerId == updatedPlayerData.playerId){
			forUpdatePlayerObj = playerUIObj[index];
			break;
		}
	}
	
	
	playerPoseChangeCheck(updatedPlayerData);
	
	if(forUpdatePlayerObj.isCanMove == true){
		// 이전 위치 값 백업
	
		
		
		forUpdatePlayerObj.now_position_x += updatedPlayerData.objStatus.move_x;
		forUpdatePlayerObj.now_position_z += updatedPlayerData.objStatus.move_z;

		
		forUpdatePlayerObj.gltf_nowView.scene.position.x = forUpdatePlayerObj.now_position_x;
		forUpdatePlayerObj.gltf_nowView.scene.position.y = forUpdatePlayerObj.now_position_y;
		forUpdatePlayerObj.gltf_nowView.scene.position.z = forUpdatePlayerObj.now_position_z;
		
		forUpdatePlayerObj.hitbox.position.x = forUpdatePlayerObj.now_position_x;
		forUpdatePlayerObj.hitbox.position.y = forUpdatePlayerObj.now_position_y + HITBOX_DEFAULT_HEIGHT;
		forUpdatePlayerObj.hitbox.position.z = forUpdatePlayerObj.now_position_z;

		
		forUpdatePlayerObj.gltf_nowView.scene.rotation.y = updatedPlayerData.objStatus.seeDirection;
		
		
	}
	
	collision_check();
	
	
}



function animate(){
	
	update();
	render();
	requestAnimationFrame(animate);
	
}
function update(){
	
	// 플레이어 UI 객체가 보이는 상태이면
	if(playerUIObj["view_status"]){
		
		let clockTime = clock.getDelta();
		playerUIObj["girl"].gltf_nowView_animMixer.update(clockTime);
		playerUIObj["boy"].gltf_nowView_animMixer.update(clockTime);
		
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
	
	
	for(var index in playerCollisionObjs){
		
		var gltf_key;
		if(index == 0){
			gltf_key = "girl";
		}else if(index == 1){
			gltf_key = "boy";
		}
		
		var playerCollisionObj = playerCollisionObjs[index];
		//console.log("playerCollisionObj : " + playerCollisionObj);
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
				
				
				
				playerUIObj[gltf_key].isCanMove = false;
				
				playerUIObj[gltf_key].now_position_x = playerUIObj[gltf_key].pre_position_x;
				playerUIObj[gltf_key].now_position_y = playerUIObj[gltf_key].pre_position_y;
				playerUIObj[gltf_key].now_position_z = playerUIObj[gltf_key].pre_position_z;
				
				playerUIObj[gltf_key].gltf_nowView.scene.position.x = playerUIObj[gltf_key].pre_position_x;
				playerUIObj[gltf_key].gltf_nowView.scene.position.y = playerUIObj[gltf_key].pre_position_y;
				playerUIObj[gltf_key].gltf_nowView.scene.position.z = playerUIObj[gltf_key].pre_position_z;
				
				playerUIObj[gltf_key].hitbox.position.x = playerUIObj[gltf_key].pre_position_x;
				playerUIObj[gltf_key].hitbox.position.y = playerUIObj[gltf_key].pre_position_y + HITBOX_DEFAULT_HEIGHT;
				playerUIObj[gltf_key].hitbox.position.z = playerUIObj[gltf_key].pre_position_z;
				
				
				playerUIObj[gltf_key].isCanMove = true;
				
				
				
			}else{
				
				playerUIObj[gltf_key].pre_position_x = playerUIObj[gltf_key].gltf_nowView.scene.position.x;
				playerUIObj[gltf_key].pre_position_y = playerUIObj[gltf_key].gltf_nowView.scene.position.y;
				playerUIObj[gltf_key].pre_position_z = playerUIObj[gltf_key].gltf_nowView.scene.position.z;
				

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
		
		console.log("i : " + i);
		var nowPlayerKey = Object.keys(playerUIObj)[i];
		console.log("now player key : " + nowPlayerKey);
		console.log(`hitbox Size : ${initPlayerObjArr[i].objStatus.sizeX}, ${initPlayerObjArr[i].objStatus.sizeY}, ${initPlayerObjArr[i].objStatus.sizeZ}`);
		
		
		var cube_geometry = new THREE.BoxGeometry(initPlayerObjArr[i].objStatus.sizeX, initPlayerObjArr[i].objStatus.sizeY, initPlayerObjArr[i].objStatus.sizeZ);
		
		var cube_material = new THREE.MeshBasicMaterial({color :initPlayerObjArr[i].color, wireframe : true});

		// 여기서 해당 플레이어에 대한 각종 캐릭터 값을 만듬
		var player_Obj = new THREE.Mesh(cube_geometry, cube_material);



		console.log("createPlayer : playerInfo : ");
		console.log(player_Obj);

		
		
		
		// 각 플레이어의 정보를 가지고 player_obj 객체를 생성
		player_Obj.position.x = initPlayerObjArr[i].objStatus.x;
		player_Obj.position.y = initPlayerObjArr[i].objStatus.y + HITBOX_DEFAULT_HEIGHT;
		player_Obj.position.z = initPlayerObjArr[i].objStatus.z;
		
		
		playerUIObj[nowPlayerKey].playerId = initPlayerObjArr[i].playerId;
		
		// 기본 자세를 가만히 있는 idle 자세로 수정
		playerUIObj[nowPlayerKey].gltf_nowView = playerUIObj[nowPlayerKey].gltf_idle;
		
		playerUIObj[nowPlayerKey].gltf_nowView_animMixer = playerUIObj[nowPlayerKey].gltf_idle_animMixer;
		
		
		// 현재 눈에 보이는 gltf 모델의 위치를 수정
		playerUIObj[nowPlayerKey].now_position_x = initPlayerObjArr[i].objStatus.x;
		playerUIObj[nowPlayerKey].now_position_y = initPlayerObjArr[i].objStatus.y;
		playerUIObj[nowPlayerKey].now_position_z = initPlayerObjArr[i].objStatus.z;


		playerUIObj[nowPlayerKey].gltf_nowView.scene.position.x = playerUIObj[nowPlayerKey].now_position_x;
		playerUIObj[nowPlayerKey].gltf_nowView.scene.position.y = playerUIObj[nowPlayerKey].now_position_y;
		playerUIObj[nowPlayerKey].gltf_nowView.scene.position.z = playerUIObj[nowPlayerKey].now_position_z;
		
		
		playerUIObj[nowPlayerKey].hitbox = player_Obj;
	
		
		scene.add(playerUIObj[nowPlayerKey].hitbox); // 충돌 hitbox 추가
		playerCollisionObjs.push(playerUIObj[nowPlayerKey].hitbox);
		console.info(nowPlayerKey + " : gltfObj View");
		scene.add(playerUIObj[nowPlayerKey].gltf_nowView.scene); // 현재 설정된 gltf view 추가
		
	}
	
	playerUIObj["view_status"] = true;
	
}


function playerPoseChangeCheck(player_status){
	
	var selectedPlayerObj;
	
	
	for(var index in playerUIObj){
		
		if(playerUIObj[index].playerId == player_status.playerId){
			selectedPlayerObj = playerUIObj[index];
			break;
		}
	}

	
	if(player_status.objStatus.isMoving == true){
		
		
		if(selectedPlayerObj.isPoseChangedStatus == false){
			console.log("player_1_isMoving....");
			
			
			scene.remove(selectedPlayerObj.gltf_nowView.scene); 
			
			selectedPlayerObj.isPoseChangedStatus = true;

			selectedPlayerObj.gltf_nowView_animMixer = selectedPlayerObj.gltf_run_animMixer;
			selectedPlayerObj.gltf_nowView = selectedPlayerObj.gltf_run;

			if(player_status.objStatus.isCWalking == true){
				selectedPlayerObj.gltf_nowView_animMixer = selectedPlayerObj.gltf_cwalk_animMixer;
				selectedPlayerObj.gltf_nowView = selectedPlayerObj.gltf_cwalk;
			}else if(player_status.objStatus.isPushing == true){
				selectedPlayerObj.gltf_nowView_animMixer = selectedPlayerObj.gltf_push_animMixer;
				selectedPlayerObj.gltf_nowView = selectedPlayerObj.gltf_push;
			}
			
			
			scene.add(selectedPlayerObj.gltf_nowView.scene); 
			
		}
		
	}else{
		
		
		if(selectedPlayerObj.isPoseChangedStatus == true){
			
			console.log("player_1_isStop....");
			
			
			selectedPlayerObj.isPoseChangedStatus = false;
			
			scene.remove(selectedPlayerObj.gltf_nowView.scene); 
			
			selectedPlayerObj.gltf_nowView_animMixer = selectedPlayerObj.gltf_idle_animMixer;
			selectedPlayerObj.gltf_nowView = selectedPlayerObj.gltf_idle;
			
			scene.add(selectedPlayerObj.gltf_nowView.scene);
		}
		
	}
}

/*
function playerPoseChangeCheck(player_1_status, player_2_status){

	if(player_1_status.objStatus.isMoving == true){
		
		
		if(playerUIObj["girl"].isPoseChangedStatus == false){
			console.log("player_1_isMoving....");
			
			
			scene.remove(playerUIObj["girl"].gltf_nowView.scene); 
			
			playerUIObj["girl"].isPoseChangedStatus = true;

			playerUIObj["girl"].gltf_nowView_animMixer = playerUIObj["girl"].gltf_run_animMixer;
			playerUIObj["girl"].gltf_nowView = playerUIObj["girl"].gltf_run;

			if(player_1_status.objStatus.isCWalking == true){
				playerUIObj["girl"].gltf_nowView_animMixer = playerUIObj["girl"].gltf_cwalk_animMixer;
				playerUIObj["girl"].gltf_nowView = playerUIObj["girl"].gltf_cwalk;
			}else if(player_1_status.objStatus.isPushing == true){
				playerUIObj["girl"].gltf_nowView_animMixer = playerUIObj["girl"].gltf_push_animMixer;
				playerUIObj["girl"].gltf_nowView = playerUIObj["girl"].gltf_push;
			}
			
			
			scene.add(playerUIObj["girl"].gltf_nowView.scene); 
			
		}
	}else{
		
		
		if(playerUIObj["girl"].isPoseChangedStatus == true){
			
			console.log("player_1_isStop....");
			
			
			playerUIObj["girl"].isPoseChangedStatus = false;
			scene.remove(playerUIObj["girl"].gltf_nowView.scene); 
			playerUIObj["girl"].gltf_nowView_animMixer = playerUIObj["girl"].gltf_idle_animMixer;
			playerUIObj["girl"].gltf_nowView = playerUIObj["girl"].gltf_idle;
			scene.add(playerUIObj["girl"].gltf_nowView.scene);
		}
		
	}
	
	
	
	if(player_2_status.objStatus.isMoving == true){
		if(playerUIObj["boy"].isPoseChangedStatus == false){	
			console.log("player_2_isMoving....");
		
			
			scene.remove(playerUIObj["boy"].gltf_nowView.scene); 
			
			playerUIObj["boy"].isPoseChangedStatus = true;
			playerUIObj["boy"].gltf_nowView_animMixer = playerUIObj["boy"].gltf_run_animMixer;
			playerUIObj["boy"].gltf_nowView = playerUIObj["boy"].gltf_run;

			if(player_2_status.objStatus.isCWalking == true){
				playerUIObj["boy"].gltf_nowView_animMixer = playerUIObj["boy"].gltf_cwalk_animMixer;
				playerUIObj["boy"].gltf_nowView = playerUIObj["boy"].gltf_cwalk;
			}else if(player_2_status.objStatus.isPushing == true){
				playerUIObj["boy"].gltf_nowView_animMixer = playerUIObj["boy"].gltf_push_animMixer;
				playerUIObj["boy"].gltf_nowView = playerUIObj["boy"].gltf_push;
			}
			
			
			scene.add(playerUIObj["boy"].gltf_nowView.scene); 
		}	
	}else{
		
		
		
		if(playerUIObj["boy"].isPoseChangedStatus == true){	
			console.log("player_2_isStop....");
			playerUIObj["boy"].isPoseChangedStatus = false;
			scene.remove(playerUIObj["boy"].gltf_nowView.scene); 
			playerUIObj["boy"].gltf_nowView_animMixer = playerUIObj["boy"].gltf_idle_animMixer;
			playerUIObj["boy"].gltf_nowView = playerUIObj["boy"].gltf_idle;
			scene.add(playerUIObj["boy"].gltf_nowView.scene);
		}		
	}
	
	
	
}

*/

/*
var updateUI = function(objStatuses){
	var player_1_status = objStatuses[0];
	var player_2_status = objStatuses[1];
	
	
	
	
	
	
	// player_1 회전각 업데이트
	playerUIObj["girl"].gltf_nowView.scene.rotation.x = player_1_status.objStatus.r_x;
	playerUIObj["girl"].gltf_nowView.scene.rotation.y = player_1_status.objStatus.r_y;
	playerUIObj["girl"].gltf_nowView.scene.rotation.z = player_1_status.objStatus.r_z;
	
	// player_1 위치 업데이트
	playerUIObj["girl"].gltf_nowView.scene.position.x = player_1_status.objStatus.x;
	playerUIObj["girl"].gltf_nowView.scene.position.y = player_1_status.objStatus.y;
	playerUIObj["girl"].gltf_nowView.scene.position.z = player_1_status.objStatus.z;
	
	// player_1 hitbox 위치 업데이트
	playerUIObj["girl"].hitbox.position.x = player_1_status.objStatus.x;
	playerUIObj["girl"].hitbox.position.y = player_1_status.objStatus.y + HITBOX_DEFAULT_HEIGHT;
	playerUIObj["girl"].hitbox.position.z = player_1_status.objStatus.z;
	
	
	
	

	
	// player_2 회전각 업데이트
	playerUIObj["boy"].gltf_nowView.scene.rotation.x = player_2_status.objStatus.r_x;
	playerUIObj["boy"].gltf_nowView.scene.rotation.y = player_2_status.objStatus.r_y;
	playerUIObj["boy"].gltf_nowView.scene.rotation.z = player_2_status.objStatus.r_z;
	
	// player_2 위치 업데이트
	playerUIObj["boy"].gltf_nowView.scene.position.x = player_2_status.objStatus.x;
	playerUIObj["boy"].gltf_nowView.scene.position.y = player_2_status.objStatus.y;
	playerUIObj["boy"].gltf_nowView.scene.position.z = player_2_status.objStatus.z;
	
	
	// player_2 hitbox 위치 업데이트
	
	playerUIObj["boy"].hitbox.position.x = player_2_status.objStatus.x;
	playerUIObj["boy"].hitbox.position.y = player_2_status.objStatus.y + HITBOX_DEFAULT_HEIGHT;
	playerUIObj["boy"].hitbox.position.z = player_2_status.objStatus.z;
	
}

*/


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
	gltfload_ManAnimation();
	gltfload_GirlAnimation();
	
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

		console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

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
		
		// 충돌 판정이기 때문에 플레이어의 눈에 보이지 않도록 설정
		
		
		gltfObj.scene.traverse(function(children){
			
			 if(children.type == "Mesh"){
				 collision_datas.push(children);
			 }
			 	
		});
		
		// console.log(collision_datas);
		map_Elements["hitbox"] = gltfObj;
		gltfObj.scene.scale.set( 5, 5, 5);			   
		gltfObj.scene.position.x = 0;    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
		
	
		
		console.log("gltfLoader : Map Collision Loaded.");
		
		},
		function ( xhr ) {

			console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

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
		
		gltfObj.scene.scale.set( 3, 3, 3 );			   
		
		playerUIObj["boy"].gltf_run = gltfObj;
		playerUIObj["boy"].gltf_run_animMixer = new THREE.AnimationMixer(playerUIObj["boy"].gltf_run.scene);
		
		
		
		playerUIObj["boy"].gltf_run.animations.forEach((clip) => {
			playerUIObj["boy"].gltf_run_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		
		
	
	},
	function ( xhr ) {

		console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	gltfLoader.load(boy_idle, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 3, 3, 3 );	   
		
		playerUIObj["boy"].gltf_idle = gltfObj;
		
		playerUIObj["boy"].gltf_idle_animMixer = new THREE.AnimationMixer(playerUIObj["boy"].gltf_idle.scene);
		
		
		
		playerUIObj["boy"].gltf_idle.animations.forEach((clip) => {
			playerUIObj["boy"].gltf_idle_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		
		
		
	
	},
	function ( xhr ) {

		console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	
	gltfLoader.load(boy_cwalk, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 3, 3, 3 );	
		
		playerUIObj["boy"].gltf_cwalk = gltfObj;
		
		// console.log(gltfObj.animations)
		playerUIObj["boy"].gltf_cwalk_animMixer = new THREE.AnimationMixer(playerUIObj["boy"].gltf_cwalk.scene);
		
		
		
		playerUIObj["boy"].gltf_cwalk.animations.forEach((clip) => {
			playerUIObj["boy"].gltf_cwalk_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		
	
	
	},
	function ( xhr ) {

		console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	
	gltfLoader.load(boy_push, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 3, 3, 3 );
	
		playerUIObj["boy"].gltf_push = gltfObj;
		
		// console.log(gltfObj.animations)
		playerUIObj["boy"].gltf_push_animMixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		playerUIObj["boy"].gltf_push.animations.forEach((clip) => {
			playerUIObj["boy"].gltf_push_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		
		//scene.add( gltfObj.scene );	
		
	
	},
	function ( xhr ) {

		console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

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
		
		
		gltfObj.scene.scale.set( 3, 3, 3 );			   
		
		playerUIObj["girl"].gltf_run = gltfObj;
	
		playerUIObj["girl"].gltf_run_animMixer = new THREE.AnimationMixer(playerUIObj["girl"].gltf_run.scene);
		
		
		
		playerUIObj["girl"].gltf_run.animations.forEach((clip) => {
			playerUIObj["girl"].gltf_run_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		
	
	},
	function ( xhr ) {

		console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	gltfLoader.load(girl_idle, function(gltfObj){
		
	
		gltfObj.scene.scale.set( 3, 3, 3 );		   
		
		playerUIObj["girl"].gltf_idle = gltfObj;
	
		playerUIObj["girl"].gltf_idle_animMixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		playerUIObj["girl"].gltf_idle.animations.forEach((clip) => {
			playerUIObj["girl"].gltf_idle_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
	
		
	
	},
	function ( xhr ) {

		console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	
	gltfLoader.load(girl_cwalk, function(gltfObj){
		
		
		
		
		
		gltfObj.scene.scale.set( 3, 3, 3 );	
		playerUIObj["girl"].gltf_cwalk = gltfObj;
		playerUIObj["girl"].gltf_cwalk_animMixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		playerUIObj["girl"].gltf_cwalk.animations.forEach((clip) => {
			playerUIObj["girl"].gltf_cwalk_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
		
		
		
	
	},
	function ( xhr ) {

		console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
	
	
	gltfLoader.load(girl_push, function(gltfObj){
		

		gltfObj.scene.scale.set( 3, 3, 3 );	
		playerUIObj["girl"].gltf_push = gltfObj;
		

		playerUIObj["girl"].gltf_push_animMixer = new THREE.AnimationMixer(gltfObj.scene);
		
		
		
		playerUIObj["girl"].gltf_push.animations.forEach((clip) => {
			playerUIObj["girl"].gltf_push_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		
	
	},
	function ( xhr ) {

		console.log( Math.floor(( xhr.loaded / xhr.total * 100 )) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' + error );

	}			   
	);
	
}
