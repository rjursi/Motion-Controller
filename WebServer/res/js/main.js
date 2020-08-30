const SERVER_URL = "https://jswebgame.run.goorm.io";
const MODELINGDATA_PATH = "/res/js/modelingData/";
const GIRL_MODEL_PATH = "girl/";
const BOY_MODEL_PATH = "boy/";
const MOVE_OBJECT_PATH = "moveobj/";
const HITBOX_DEFAULT_HEIGHT = 8;

// object는 일단 각종 요소(예를 들어 큐브) 등의 요소들이 들어가는 부분

var scene, camera, renderer, light, clock, anim_mixer, orbControls;

// 충돌하는 메쉬들이 들어가는 배열


let forFindMesh;

var collision_datas = [];
var stairHitbox_right_mesh_array = [];
var stairHitbox_left_mesh_array = [];

var ambLight, directionalLight;
// 오브젝트 로드를 위한 gltf loader 객체 변수 설정
var gltfLoader, dracoLoader;

// 플레이어 객체가 들어가 있는 배열, 총 2개 밖에 안들어감
var playerUIObj = {};
//var playerCollisionObj, col_geometry, col_material; // 충돌 테스트를 위한 임시 Mesh 요소

var playerCollisionObjs = [];

// 맵 관련 오브젝트가 들어갈 예정
var map_Elements = {};

// 맵 내 움직일 수 있는 오브젝트가 들어갈 배열
var map_objects = {};

var arr_interactBoxList = [];

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
	// 하녕이 수정하는 즁
	//scene.add(directionalLight);
	
	ambLight = new THREE.AmbientLight(0xffffff, 0.5);
	//scene.add(ambLight);
	
	
	// 이거는 테스트용 미니
	
	//////////////////////////// 여까지
	

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
	
	
	// 아래는 테스트용 
	var test_findLocationBox = new THREE.BoxGeometry(4,4,4);
	var test_findLocationGeometry = new THREE.MeshBasicMaterial({color : 0x000000});
	
	forFindMesh = new THREE.Mesh(test_findLocationBox, test_findLocationGeometry);
	
	forFindMesh.position.x = 300;
	forFindMesh.position.y = 77;
	forFindMesh.position.z = 72;	
	
	scene.add(forFindMesh);
	
	
	// 아래는 계단 충돌 메쉬 설정
	setStairsHitbox();
	
	// 테스트용 메쉬

	var targetGeometry = new THREE.BoxBufferGeometry( 5, 5, 50 );
	var targetMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	var targetMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00ff60 });
	
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

	LightTargetMesh.position.x = 305;
	LightTargetMesh.position.y = 50;
	LightTargetMesh.position.z = 55;

	LightTargetMesh2.position.x = 245;
	LightTargetMesh2.position.y = 50;
	LightTargetMesh2.position.z = 200;


	LightTargetMesh3.position.x = 245;
	LightTargetMesh3.position.y = 50;
	LightTargetMesh3.position.z = - 75;

	LightTargetMesh4.position.x = 400;
	LightTargetMesh4.position.y = 150;
	LightTargetMesh4.position.z = - 75;

	LightTargetMesh5.position.x = 400;
	LightTargetMesh5.position.y = 150;
	LightTargetMesh5.position.z = - 5;

	LightTargetMesh6.position.x = -140;
	LightTargetMesh6.position.y = -50;
	LightTargetMesh6.position.z = - 60;

	LightTargetMesh7.position.x = -225;
	LightTargetMesh7.position.y = -50;
	LightTargetMesh7.position.z = 50;


	setLight();
	//// 여까지
	
}

// 비동기 상호작용 처리 함수


	
	
function setStairsHitbox(){
	
	// 오른쪽 계단
	var stairHitbox_right_box = new THREE.BoxGeometry(5,15,28);
	var stairHitbox_right_geometry = new THREE.MeshStandardMaterial({color : 0x000000});
	
	var stairHitbox_right_mesh_0 = new THREE.Mesh(stairHitbox_right_box, stairHitbox_right_geometry);
	
	stairHitbox_right_mesh_0.name = "stair_right_0";
	stairHitbox_right_mesh_0.position.x = 218;
	stairHitbox_right_mesh_0.position.y = 77;
	stairHitbox_right_mesh_0.position.z = -91;
	stairHitbox_right_mesh_0.visible = false;
	
	stairHitbox_right_mesh_array.push(stairHitbox_right_mesh_0);
	scene.add(stairHitbox_right_mesh_0);
	
	var stairHitbox_right_mesh_1 = new THREE.Mesh(stairHitbox_right_box, stairHitbox_right_geometry);
	
	stairHitbox_right_mesh_1.name = "stair_right_1";
	stairHitbox_right_mesh_1.position.x = 210;
	stairHitbox_right_mesh_1.position.y = 74;
	stairHitbox_right_mesh_1.position.z = -91;
	stairHitbox_right_mesh_1.visible = false;
	
	stairHitbox_right_mesh_array.push(stairHitbox_right_mesh_1);
	scene.add(stairHitbox_right_mesh_1);
	var stairHitbox_right_mesh_2 = new THREE.Mesh(stairHitbox_right_box, stairHitbox_right_geometry);
	
	
	
	stairHitbox_right_mesh_2.name = "stair_right_2";
	stairHitbox_right_mesh_2.position.x = 202.5;
	stairHitbox_right_mesh_2.position.y = 69;
	stairHitbox_right_mesh_2.position.z = -91;
	stairHitbox_right_mesh_2.visible = false;
	
	stairHitbox_right_mesh_array.push(stairHitbox_right_mesh_2);
	scene.add(stairHitbox_right_mesh_2);
	var stairHitbox_right_mesh_3 = new THREE.Mesh(stairHitbox_right_box, stairHitbox_right_geometry);
	
	stairHitbox_right_mesh_3.name = "stair_right_3";
	stairHitbox_right_mesh_3.position.x = 194.5;
	stairHitbox_right_mesh_3.position.y = 64;
	stairHitbox_right_mesh_3.position.z = -91;
	stairHitbox_right_mesh_3.visible = false;
	
	stairHitbox_right_mesh_array.push(stairHitbox_right_mesh_3);
	scene.add(stairHitbox_right_mesh_3);
	
	var stairHitbox_right_mesh_4 = new THREE.Mesh(stairHitbox_right_box, stairHitbox_right_geometry);
	
	
	stairHitbox_right_mesh_4.name = "stair_right_4";
	stairHitbox_right_mesh_4.position.x = 186.5;
	stairHitbox_right_mesh_4.position.y = 59;
	stairHitbox_right_mesh_4.position.z = -91;
	stairHitbox_right_mesh_4.visible = false;
	console.info(stairHitbox_right_mesh_4);
	stairHitbox_right_mesh_array.push(stairHitbox_right_mesh_4);
	scene.add(stairHitbox_right_mesh_4);
	
	var stairHitbox_right_mesh_5 = new THREE.Mesh(stairHitbox_right_box, stairHitbox_right_geometry);
	
	
	stairHitbox_right_mesh_5.name = "stair_right_5";
	stairHitbox_right_mesh_5.position.x = 179.5;
	stairHitbox_right_mesh_5.position.y = 54.5;
	stairHitbox_right_mesh_5.position.z = -91;
	stairHitbox_right_mesh_5.visible = false;
	
	stairHitbox_right_mesh_array.push(stairHitbox_right_mesh_5);
	scene.add(stairHitbox_right_mesh_5);
	var stairHitbox_right_mesh_6 = new THREE.Mesh(stairHitbox_right_box, stairHitbox_right_geometry);
	
	
	stairHitbox_right_mesh_6.name = "stair_right_6";
	stairHitbox_right_mesh_6.position.x = 171;
	stairHitbox_right_mesh_6.position.y = 49.5;
	stairHitbox_right_mesh_6.position.z = -91;
	stairHitbox_right_mesh_6.visible = false;
	
	stairHitbox_right_mesh_array.push(stairHitbox_right_mesh_6);
	scene.add(stairHitbox_right_mesh_6);
	var stairHitbox_right_mesh_7 = new THREE.Mesh(stairHitbox_right_box, stairHitbox_right_geometry);
	
	stairHitbox_right_mesh_7.name = "stair_right_7";

	stairHitbox_right_mesh_7.position.x = 163.5;
	stairHitbox_right_mesh_7.position.y = 45.5;
	stairHitbox_right_mesh_7.position.z = -91;
	stairHitbox_right_mesh_7.visible = false;
	
	stairHitbox_right_mesh_array.push(stairHitbox_right_mesh_7);
	scene.add(stairHitbox_right_mesh_7);
	
	
	var stairHitbox_right_mesh_8 = new THREE.Mesh(stairHitbox_right_box, stairHitbox_right_geometry);
	
	stairHitbox_right_mesh_8.name = "stair_right_8";

	stairHitbox_right_mesh_8.position.x = 157.5;
	stairHitbox_right_mesh_8.position.y = 41.5;
	stairHitbox_right_mesh_8.position.z = -91;
	stairHitbox_right_mesh_8.visible = false;
	
	stairHitbox_right_mesh_array.push(stairHitbox_right_mesh_8);
	scene.add(stairHitbox_right_mesh_8);
	
	
	// 왼쪽 계단
	
	
	var stairHitbox_left_box = new THREE.BoxGeometry(28,20,5);
	var stairHitbox_left_geometry = new THREE.MeshStandardMaterial({color : 0x000000});

	
	var stairHitbox_left_mesh_1 = new THREE.Mesh(stairHitbox_left_box, stairHitbox_left_geometry);
	
	
	stairHitbox_left_mesh_1.name = "stair_left_1";

	stairHitbox_left_mesh_1.position.x = 152;
	stairHitbox_left_mesh_1.position.y = 41.5;
	stairHitbox_left_mesh_1.position.z = -71;
	stairHitbox_left_mesh_1.visible = false;
	stairHitbox_left_mesh_array.push(stairHitbox_left_mesh_1);
	
	scene.add(stairHitbox_left_mesh_1);
	
	
	
	var stairHitbox_left_mesh_2 = new THREE.Mesh(stairHitbox_left_box, stairHitbox_left_geometry);
	
	
	stairHitbox_left_mesh_2.name = "stair_left_2";
	stairHitbox_left_mesh_2.position.x = 152;
	stairHitbox_left_mesh_2.position.y = 35;
	stairHitbox_left_mesh_2.position.z = -63.5;
	stairHitbox_left_mesh_2.visible = false;
	stairHitbox_left_mesh_array.push(stairHitbox_left_mesh_2);
	
	scene.add(stairHitbox_left_mesh_2);
	
	var stairHitbox_left_mesh_3 = new THREE.Mesh(stairHitbox_left_box, stairHitbox_left_geometry);
	
	
	stairHitbox_left_mesh_3.name = "stair_left_3";
	stairHitbox_left_mesh_3.position.x = 152;
	stairHitbox_left_mesh_3.position.y = 30.5;
	stairHitbox_left_mesh_3.position.z = -56.5;
	stairHitbox_left_mesh_3.visible = false;
	stairHitbox_left_mesh_array.push(stairHitbox_left_mesh_3);
	
	scene.add(stairHitbox_left_mesh_3);
	
	var stairHitbox_left_mesh_4 = new THREE.Mesh(stairHitbox_left_box, stairHitbox_left_geometry);
	
	
	stairHitbox_left_mesh_4.name = "stair_left_4";
	stairHitbox_left_mesh_4.position.x = 152;
	stairHitbox_left_mesh_4.position.y = 25.5;
	stairHitbox_left_mesh_4.position.z = -49;
	stairHitbox_left_mesh_4.visible = false;
	stairHitbox_left_mesh_array.push(stairHitbox_left_mesh_4);
	
	scene.add(stairHitbox_left_mesh_4);
	
	var stairHitbox_left_mesh_5 = new THREE.Mesh(stairHitbox_left_box, stairHitbox_left_geometry);
	
	
	stairHitbox_left_mesh_5.name = "stair_left_5";
	stairHitbox_left_mesh_5.position.x = 152;
	stairHitbox_left_mesh_5.position.y = 21;
	stairHitbox_left_mesh_5.position.z = -41.5;
	stairHitbox_left_mesh_5.visible = false;
	stairHitbox_left_mesh_array.push(stairHitbox_left_mesh_5);
	
	scene.add(stairHitbox_left_mesh_5);
	
	var stairHitbox_left_mesh_6 = new THREE.Mesh(stairHitbox_left_box, stairHitbox_left_geometry);
	
	
	stairHitbox_left_mesh_6.name = "stair_left_6";
	stairHitbox_left_mesh_6.position.x = 152;
	stairHitbox_left_mesh_6.position.y = 16;
	stairHitbox_left_mesh_6.position.z = -33;
	stairHitbox_left_mesh_6.visible = false;
	stairHitbox_left_mesh_array.push(stairHitbox_left_mesh_6);
	
	scene.add(stairHitbox_left_mesh_6);
	
	var stairHitbox_left_mesh_7 = new THREE.Mesh(stairHitbox_left_box, stairHitbox_left_geometry);
	
	
	stairHitbox_left_mesh_7.name = "stair_left_7";
	stairHitbox_left_mesh_7.position.x = 152;
	stairHitbox_left_mesh_7.position.y = 11.5;
	stairHitbox_left_mesh_7.position.z = -25.5;
	stairHitbox_left_mesh_7.visible = false;
	stairHitbox_left_mesh_array.push(stairHitbox_left_mesh_7);
	
	scene.add(stairHitbox_left_mesh_7);
	
	var stairHitbox_left_mesh_8 = new THREE.Mesh(stairHitbox_left_box, stairHitbox_left_geometry);
	
	
	
	stairHitbox_left_mesh_8.name = "stair_left_8";
	stairHitbox_left_mesh_8.position.x = 152;
	stairHitbox_left_mesh_8.position.y = 6.5;
	stairHitbox_left_mesh_8.position.z = -17.5;
	stairHitbox_left_mesh_8.visible = false;
	stairHitbox_left_mesh_array.push(stairHitbox_left_mesh_8);
	
	scene.add(stairHitbox_left_mesh_8);
	
	var stairHitbox_left_mesh_9 = new THREE.Mesh(stairHitbox_left_box, stairHitbox_left_geometry);
	
	stairHitbox_left_mesh_9.name = "stair_left_9";
	stairHitbox_left_mesh_9.position.x = 152;
	stairHitbox_left_mesh_9.position.y = -2;
	stairHitbox_left_mesh_9.position.z = -9;
	stairHitbox_left_mesh_9.visible = false;
	stairHitbox_left_mesh_array.push(stairHitbox_left_mesh_9);
	
	scene.add(stairHitbox_left_mesh_9);
}


function setLight() {

            var light = new THREE.AmbientLight(0xaccde0, 0.1);
	        scene.add(light);
            /////////////////////////////////////
            //////////////// 2층 ////////////////
            /////////////////////////////////////
            var light_2Froom = new THREE.PointLight(0xffffff, 1, 150);
	        light_2Froom.position.set(305, 110, 30);
            //light_2Froom.castShadow = true;
	        scene.add(light_2Froom);    // 2층 방 조명


                var light_2FroomBold = new THREE.SpotLight( 0xfff36c, 1, 100, 0.5, 0.4, 0.4 );
                light_2FroomBold.position.set( 305, 150, 55 );
		        //light_2FroomBold.castShadow = true;
                light_2FroomBold.target = LightTargetMesh;
	            scene.add(light_2FroomBold);    // 2층 방 강조 조명
                

                var light_2Fhallway = new THREE.SpotLight(0xffffff, 0.6, 400, 0.2, 0.3, 0.4);
                light_2Fhallway.position.set(245, 175, -250);
                light_2Fhallway.target = LightTargetMesh2;
                //light_2Fhallway.castShadow = true;
                scene.add(light_2Fhallway); // 2층 복도 조명
                

                var light_2Fsquarelamp = new THREE.PointLight(0xffffff, 0.7, 150);
                light_2Fsquarelamp.position.set(245, 150, -150);
                //light_2Fsquarelamp.castShadow = true;
                scene.add(light_2Fsquarelamp);  // 2층 복도끝 조명
                

                var light_2FsquarelampBold = new THREE.SpotLight(0xffff9c, 1, 250, 0.4, 0.1, 0.8);
                light_2FsquarelampBold.position.set(245, 150, -150);
                light_2FsquarelampBold.target = LightTargetMesh3;
                //light_2FsquarelampBold.castShadow = true;
                scene.add(light_2FsquarelampBold);  // 2층 복도끝 강조 조명
                

                var light_2Fstairs01 = new THREE.PointLight(0xffffff, 0.7, 200);
                light_2Fstairs01.position.set(145, 150, -5);
                //light_2Fstairs01.castShadow = true;
                scene.add(light_2Fstairs01); // 2층 계단 조명 오른쪽
                

                var light_2Fstairs01Bold = new THREE.SpotLight(0xffffff, 0.6, 250, 2, 0.1, 1.2);
                light_2Fstairs01Bold.position.set(140, 150, -5);
                light_2Fstairs01Bold.target = LightTargetMesh5;
                //light_2Fstairs01Bold.castShadow = true;
                scene.add(light_2Fstairs01Bold);    // 2층 계단 강조 조명 오른쪽
                

                var light_2Fstairs02 = new THREE.PointLight(0xffffff, 0.7, 200);
                light_2Fstairs02.position.set(145, 150, -75);
                //light_2Fstairs02.castShadow = true;
                scene.add(light_2Fstairs02);    // 2층 계단 조명 왼쪽
                

                var light_2Fstairs02Bold = new THREE.SpotLight(0xffffff, 0.6, 250, 2, 0.1, 1.2);
                light_2Fstairs02Bold.position.set(140, 150, -75);
                light_2Fstairs02Bold.target = LightTargetMesh4;
                //light_2Fstairs02Bold.castShadow = true;
                scene.add(light_2Fstairs02Bold);    //2층 계단 강조 조명 왼쪽
                


                var light_2Fstairs1F = new THREE.PointLight(0xffffff, 0.7, 200);
                light_2Fstairs1F.position.set(190, 50, -15);
                //light_2Fstairs1F.castShadow = true;
                scene.add(light_2Fstairs1F);    // 2층 계단 1층 조명
                
                /////////////////////////////////////
                //////////////// 1층 ////////////////
                /////////////////////////////////////

                var light_1Fhallway = new THREE.SpotLight(0xffffff, 1.3, 400, 1, 0.5, 0.4);
                light_1Fhallway.position.set(145, 60, 50);
                light_1Fhallway.target = LightTargetMesh7;
                light_1Fhallway.castShadow = true;
                scene.add(light_1Fhallway);     // 1층 복도 강조 조명
                

                var light_1Fkitchen = new THREE.PointLight(0xffffff, 1, 200);
	            light_1Fkitchen.position.set(-140, 50, -105);
                light_1Fkitchen.castShadow = true;
	            scene.add(light_1Fkitchen);     // 1층 부엌 조명
	            

                var light_1FkitchenBold = new THREE.SpotLight( 0xffffff, 1, 150, 0.6, 0.4, 0.4 );
                light_1FkitchenBold.position.set(-140, 100, -60);
                light_1FkitchenBold.target = LightTargetMesh6;
                light_1FkitchenBold.castShadow = true;
                scene.add(light_1FkitchenBold);     // 1층 부엌 강조 조명
                
                /////////////////////////////////////
                /////////////////////////////////////
                /////////////////////////////////////

                help_2Froom = new THREE.PointLightHelper(light_2Froom, 5);
	            scene.add(help_2Froom);
                
                help_2FroomBold = new THREE.SpotLightHelper( light_2FroomBold );
                scene.add( help_2FroomBold );

                help_2Fhallway = new THREE.SpotLightHelper(light_2Fhallway);
                scene.add(help_2Fhallway);

                help_2Fsquarelamp = new THREE.PointLightHelper(light_2Fsquarelamp, 5);
                scene.add(help_2Fsquarelamp);

            	help_2FsquarelampBold = new THREE.SpotLightHelper(light_2FsquarelampBold);
                scene.add(help_2FsquarelampBold);

                help_2Fstairs01 = new THREE.PointLightHelper(light_2Fstairs01, 5);
                scene.add(help_2Fstairs01);

                help_2Fstairs01Bold = new THREE.SpotLightHelper(light_2Fstairs01Bold);
                scene.add(help_2Fstairs01Bold);

                help_2Fstairs02 = new THREE.PointLightHelper(light_2Fstairs02, 5);
                scene.add(help_2Fstairs02);

                help_2Fstairs02Bold = new THREE.SpotLightHelper(light_2Fstairs02Bold);
                scene.add(help_2Fstairs02Bold);

                help_2Fstairs1F = new THREE.PointLightHelper(light_2Fstairs1F, 5);
                scene.add(help_2Fstairs1F);

                help_1Fhallway = new THREE.SpotLightHelper(light_1Fhallway);
                scene.add(help_1Fhallway);

                help_1Fkitchen = new THREE.PointLightHelper(light_1Fkitchen, 5);
	            scene.add(help_1Fkitchen);

                help_1FkitchenBold = new THREE.SpotLightHelper( light_1FkitchenBold );
	            scene.add(help_1FkitchenBold);
	
	
}



function viewMap(){
	map_Elements["map"].scene.visible = true;
	
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
		
		pre_position_z : 0,
		
		move_x : 0,
		move_z : 0,
		
		now_movingDirection_x : 0,
		now_movingDirection_z : 0,
		

		hitbox : undefined,
		
		isPoseChangedStatus : false,
		
		
		// 상호작용중이냐?
		isTryInteraction : false
		
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
		
		pre_position_z : 0,
		
		move_x : 0,
		move_z : 0,
		now_movingDirection_x : 0,
		now_movingDirection_z : 0,
		

	    hitbox : undefined,
		
		isPoseChangedStatus : false,
		
		// 상호작용중이냐?
		isTryInteraction : false
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
	

	forUpdatePlayerObj.isTryInteraction = updatedPlayerData.objStatus.tryInteraction;
	// 현재 계단 위치에 진입을 했는지 체크
	
	forUpdatePlayerObj.now_position_x += updatedPlayerData.objStatus.move_x;
	forUpdatePlayerObj.now_position_z += updatedPlayerData.objStatus.move_z;

	
	forUpdatePlayerObj.move_x = updatedPlayerData.objStatus.move_x;
	forUpdatePlayerObj.move_z = updatedPlayerData.objStatus.move_z;
	
	forUpdatePlayerObj.now_movingDirection_x = updatedPlayerData.objStatus.movingDirection_x;
	forUpdatePlayerObj.now_movingDirection_z = updatedPlayerData.objStatus.movingDirection_z;
	// console.info(`now_movingDirection_x : ${forUpdatePlayerObj.now_movingDirection_x}, ${forUpdatePlayerObj.now_movingDirection_z}`)

	forUpdatePlayerObj.gltf_nowView.scene.position.x = forUpdatePlayerObj.now_position_x;
	forUpdatePlayerObj.gltf_nowView.scene.position.y = forUpdatePlayerObj.now_position_y;
	forUpdatePlayerObj.gltf_nowView.scene.position.z = forUpdatePlayerObj.now_position_z;

	forUpdatePlayerObj.hitbox.position.x = forUpdatePlayerObj.now_position_x;
	forUpdatePlayerObj.hitbox.position.y = forUpdatePlayerObj.now_position_y + HITBOX_DEFAULT_HEIGHT;
	forUpdatePlayerObj.hitbox.position.z = forUpdatePlayerObj.now_position_z;


	forUpdatePlayerObj.gltf_nowView.scene.rotation.y = updatedPlayerData.objStatus.seeDirection;
		
		
	
	// 맵 벽 충돌 체크
	collision_check();
	
	// 계단에 진입했는지 확인
	stair_check();
	
	// 상호작용 시도했는지 확인
	useInteraction();
	
	
	
	
}



function animate(){
	
	update();
	render();
	requestAnimationFrame(animate);
	
	///////// 테스트용 나중에 지워도 됌 /////////
	help_2Froom.update();
	help_2FroomBold.update();
	help_2Fhallway.update();
	help_2Fsquarelamp.update();
	help_2FsquarelampBold.update();
	help_2Fstairs01.update();
	help_2Fstairs01Bold.update();
	help_2Fstairs02.update();
	help_2Fstairs02Bold.update();
	help_2Fstairs1F.update();
	help_1Fhallway.update();
	help_1Fkitchen.update();
	help_1FkitchenBold.update();
	//////////////////////////////////////////
	
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

async function useInteraction(){
	
	// Player 1, 2 마다 반복문으로 모두 처리
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
		
		
		// 오른쪽 계단
		for (var vertexIndex = 0; vertexIndex <	playerCollisionObj.geometry.vertices.length; vertexIndex++)
		{		


			var localVertex =  playerCollisionObj.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4(   playerCollisionObj.matrix );
			var directionVector = globalVertex.sub(   playerCollisionObj.position );

			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			// arr_interactBoxList : 상호작용 처리할, 즉 부딛힐 박스의 목록
			// 해당 배열에다가 부딛힐 Mesh 들 추가하면 됨, 전역변수로 넣어둠
			
			var collisionResults = ray.intersectObjects( arr_interactBoxList );
			
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
			
				// 플레이어가 상호작용을 시도했다면
				if(playerUIObj[gltf_key].isTryInteraction === true){
					
				}
				
				// collisionResults[0] : 맨 마지막으로 부딛히는 Mesh를 가르킴, 해당 Mesh 에 접근할려면 collisionResults[0].object 로 접근
				// ex) collisionResults[0].object.position.x = 10;
				
				// 여기다 부딛혔을때 할 원하는 작업 하면 됨
				
			}
		}
	}
}
	
	
async function stair_check(){
	
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
		
		
		// 오른쪽 계단
		for (var vertexIndex = 0; vertexIndex <	playerCollisionObj.geometry.vertices.length; vertexIndex++)
		{		


			var localVertex =  playerCollisionObj.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4(   playerCollisionObj.matrix );
			var directionVector = globalVertex.sub(   playerCollisionObj.position );

			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( stairHitbox_right_mesh_array );
			
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
				console.info("stair Hit!!");
				console.info(`after hit : ${playerUIObj[gltf_key].now_movingDirection_x}, ${playerUIObj[gltf_key].now_movingDirection_z}`);
				
				playerUIObj[gltf_key].now_position_y = collisionResults[0].object.position.y;
				playerUIObj[gltf_key].gltf_nowView.scene.position.y = playerUIObj[gltf_key].now_position_y;
				playerUIObj[gltf_key].hitbox.position.y = playerUIObj[gltf_key].now_position_y;
				
				
			}
		}
		
		
		// 왼쪽 계단
		for (var vertexIndex = 0; vertexIndex <	playerCollisionObj.geometry.vertices.length; vertexIndex++)
		{		


			var localVertex =  playerCollisionObj.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4(   playerCollisionObj.matrix );
			var directionVector = globalVertex.sub(   playerCollisionObj.position );

			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( stairHitbox_left_mesh_array );
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
				console.info("stair Hit!!");
				
				
				playerUIObj[gltf_key].now_position_y = collisionResults[0].object.position.y;
				playerUIObj[gltf_key].gltf_nowView.scene.position.y = playerUIObj[gltf_key].now_position_y;
				playerUIObj[gltf_key].hitbox.position.y = playerUIObj[gltf_key].now_position_y;
			
			}
		}
		
	}
	
}

//맵 충돌 체크 함수

async function collision_check(){
	
	
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
				
			
				playerUIObj[gltf_key].now_position_x = playerUIObj[gltf_key].pre_position_x;
				playerUIObj[gltf_key].now_position_z = playerUIObj[gltf_key].pre_position_z;
				
				playerUIObj[gltf_key].gltf_nowView.scene.position.x = playerUIObj[gltf_key].now_position_x;
				playerUIObj[gltf_key].gltf_nowView.scene.position.z = playerUIObj[gltf_key].now_position_z;
				
				playerUIObj[gltf_key].hitbox.position.x = playerUIObj[gltf_key].now_position_x;
				playerUIObj[gltf_key].hitbox.position.z = playerUIObj[gltf_key].now_position_z;
				
				
			
			}else{
				
				// 부딛히지 않으면 바라보는 방향의 뒷 방향으로 복귀 위치를 저장
				if(playerUIObj[gltf_key].now_movingDirection_x !== 0){
					playerUIObj[gltf_key].pre_position_x = playerUIObj[gltf_key].now_position_x + ((playerUIObj[gltf_key].move_x * 1.5 ) * -1);
				}if(playerUIObj[gltf_key].now_movingDirection_z !== 0){
					playerUIObj[gltf_key].pre_position_z = playerUIObj[gltf_key].now_position_z + ((playerUIObj[gltf_key].move_z * 1.5 ) * -1);
				}
				
				
				
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
		
		playerUIObj[nowPlayerKey].gltf_nowView.animations.forEach((clip) => {
			playerUIObj[nowPlayerKey].gltf_nowView_animMixer.clipAction(clip).play();
		}); // 멈춤
			
		
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
			
			selectedPlayerObj.gltf_nowView.animations.forEach((clip) => {
				selectedPlayerObj.gltf_nowView_animMixer.clipAction(clip).play();
			}); // 선텍된 애니메이션 플레이
			
			scene.add(selectedPlayerObj.gltf_nowView.scene); 
			
		}
		
	}else{
		
		
		if(selectedPlayerObj.isPoseChangedStatus == true){
			
			console.log("player_1_isStop....");
			
			
			selectedPlayerObj.isPoseChangedStatus = false;
			
			selectedPlayerObj.gltf_nowView.animations.forEach((clip) => {
				selectedPlayerObj.gltf_nowView_animMixer.clipAction(clip).stop();
			}); // 멈춤
			
			
			scene.remove(selectedPlayerObj.gltf_nowView.scene); 
			
			selectedPlayerObj.gltf_nowView_animMixer = selectedPlayerObj.gltf_idle_animMixer;
			selectedPlayerObj.gltf_nowView = selectedPlayerObj.gltf_idle;
			
			selectedPlayerObj.gltf_nowView.animations.forEach((clip) => {
				selectedPlayerObj.gltf_nowView_animMixer.clipAction(clip).play();
			}); //
			
			scene.add(selectedPlayerObj.gltf_nowView.scene);
		}
		
	}
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
	gltfload_ManAnimation();
	gltfload_GirlAnimation();
	
}

async function gltfload_Map() {
	
	const map = SERVER_URL + MODELINGDATA_PATH + "map_texture.glb";
	
	
	gltfLoader.load(map, function(gltfObj){
		
		
		
		
		map_Elements["map"] = gltfObj;
		
		gltfObj.scene.scale.set( 5, 5, 5 );			   
		gltfObj.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltfObj.scene.position.y = 0;				    //Position (y = up+, down-)
		gltfObj.scene.position.z = 0;				    //Position (z = front +, back-)
	
		console.log("gltfLoader : Map Loaded.");
		
		// 아래는 좌표 테스트 용으로 띄워 놓음. 
		scene.add( gltfObj.scene );	
		// gltfObj.scene.visible = false; // 초기에는 안보이게
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

async function gltfload_Map_Collision(){
	
	const map_collision = SERVER_URL + MODELINGDATA_PATH + "collision.glb";

	gltfLoader.load(map_collision, function(gltfObj){
		
		// 충돌 판정이기 때문에 플레이어의 눈에 보이지 않도록 설정
		
		
		gltfObj.scene.traverse(function(children){
			
			 if(children.type == "Mesh"){
				 collision_datas.push(children);
			 }
			 	
		});
		
		console.info(collision_datas);
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

async function gltfload_ManAnimation(){
	
	
	const boy_run = SERVER_URL + MODELINGDATA_PATH + BOY_MODEL_PATH + "boy_run.glb";
	const boy_idle = SERVER_URL + MODELINGDATA_PATH + BOY_MODEL_PATH + "boy_idle.glb";
	const boy_cwalk = SERVER_URL + MODELINGDATA_PATH + BOY_MODEL_PATH + "boy_cwalk.glb";
	const boy_push = SERVER_URL + MODELINGDATA_PATH + BOY_MODEL_PATH + "boy_push.glb";
	
	
	gltfLoader.load(boy_run, function(gltfObj){
		
		gltfObj.scene.scale.set( 3, 3, 3 );			   
		
		playerUIObj["boy"].gltf_run = gltfObj;
		playerUIObj["boy"].gltf_run_animMixer = new THREE.AnimationMixer(playerUIObj["boy"].gltf_run.scene);
		
		
		/*
		playerUIObj["boy"].gltf_run.animations.forEach((clip) => {
			playerUIObj["boy"].gltf_run_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		*/
		
		
		
	
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
		
		
		/*
		playerUIObj["boy"].gltf_idle.animations.forEach((clip) => {
			playerUIObj["boy"].gltf_idle_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		*/
		
		
		
	
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
		
		
		
		/*
		playerUIObj["boy"].gltf_cwalk.animations.forEach((clip) => {
			playerUIObj["boy"].gltf_cwalk_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		*/
		
		
	
	
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
		
		
		/*
		playerUIObj["boy"].gltf_push.animations.forEach((clip) => {
			playerUIObj["boy"].gltf_push_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		*/
		
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



async function gltfload_GirlAnimation(){
	
	const girl_run = SERVER_URL + MODELINGDATA_PATH + GIRL_MODEL_PATH + "girl_run.glb";
	const girl_idle = SERVER_URL + MODELINGDATA_PATH + GIRL_MODEL_PATH + "girl_idle.glb";
	const girl_cwalk = SERVER_URL + MODELINGDATA_PATH + GIRL_MODEL_PATH + "girl_cwalk.glb";
	const girl_push = SERVER_URL + MODELINGDATA_PATH + GIRL_MODEL_PATH + "girl_push.glb";
	
	
	gltfLoader.load(girl_run, function(gltfObj){
		
		
		gltfObj.scene.scale.set( 3, 3, 3 );			   
		
		playerUIObj["girl"].gltf_run = gltfObj;
	
		playerUIObj["girl"].gltf_run_animMixer = new THREE.AnimationMixer(playerUIObj["girl"].gltf_run.scene);
		
		
		/*
		playerUIObj["girl"].gltf_run.animations.forEach((clip) => {
			playerUIObj["girl"].gltf_run_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		*/
		
	
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
		
		
		/*
		playerUIObj["girl"].gltf_idle.animations.forEach((clip) => {
			playerUIObj["girl"].gltf_idle_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		*/
		
	
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
		
		
		/*
		playerUIObj["girl"].gltf_cwalk.animations.forEach((clip) => {
			playerUIObj["girl"].gltf_cwalk_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		*/
		
		
		
		
	
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
		
		
		/*
		playerUIObj["girl"].gltf_push.animations.forEach((clip) => {
			playerUIObj["girl"].gltf_push_animMixer.clipAction(clip).play();
		}); // 애니메이션 실행시켜놓음
		*/
		
	
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


