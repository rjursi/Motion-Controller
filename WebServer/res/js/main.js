// object는 일단 각종 요소(예를 들어 큐브) 등의 요소들이 들어가는 부분

var scene, camera, renderer, container, objects = [];

var player_1_Obj, player_1_playerId, player_1_moveSpeed, player_1_turnSpeed;
var player_2_Obj, player_2_playerId, player_2_moveSpeed, player_2_turnSpeed;



var playerUIObj = [];
/*
var player_1_Elements = {};
var player_2_Elements = {};
*/

var map_Elements = [];

/*
var otherPlayers = [];
var otherPlayersId = [];
*/

// 초기 다양한 값 세팅하기 위한 함수
//init();
// renderer 를 통하여 camera 와 함께 화면에 표시하는 함수
//animate();

function init(){

	// 해당 3D 요소들이 위치할 공간
	container = document.getElementById('container');
	// console.log(container)
	
	scene = new THREE.Scene(); 

	// camera 생성, 일단은 PerspectiveCamera 로 설정
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
	// 여기 setSize 에서 앱의 크기를 유지하면서 더 낮은 해상도로 랜더링 할 경우에는 
	// setSize의 세번째 인수 (updateStyle)로 false를 넣고 렌더링 사이즈를 넣으면 됨


	// 큐브를 만들려면 BoxGeometry 가 필요하다.
	// 큐브의 모든 점(정점)과 채우기(면) 을 포함하는 객체
	var geometry = new THREE.BoxGeometry();

	// 색상을 지정할 material, 즉 재질이 필요, 아래는 색깔만 입힘
	var material = new THREE.MeshBasicMaterial({color : 0x000fff, wireframe : true});

	// 메쉬가 필요, 장면에 삽입하고 자유롭게 움직이도록 하는 것을 넣음 
	var cube = new THREE.Mesh(geometry, material);

	// 오브젝트 모음에 추가
	objects.push(cube);
	
	
	// 맵의 위치를 가늠해보기 위한 테스트
	
	/*
	cube.position.x = 0;
	cube.position.y = 1;
	cube.position.z = 1;
	
	*/

	
	
	
	// 기본적으로 아래와 같이 호출하면 좌표(0,0,0) 에 추가됨
	// 아래 메소드를 통하여 카메라와 큐브가 서로 내부에 있게 됨
	
	scene.add(cube);

	// 그래서 카메라를 약간 움직임
	camera.position.z = 10;


	// 이제 위의 값들을 렌더링할 렌더링 루프(함수) 가 필요함
	// 기본 초당 60회 
	
	
	// 이벤트 정의, 아래는 윈도우 사이즈가 바뀔 경우에 대해서 이벤트 리스너 정의
	window.addEventListener( 'resize', onWindowResize, false );
	
	container.appendChild(renderer.domElement);
	document.body.appendChild( container );

}

function animate(){
	requestAnimationFrame(animate);
	render();
}

function render(){
	
	/*
	if(player){
		updateCameraPosition();
		
		camera.lookAt(player.position);
	}
	*/
	
	renderer.clear();
	renderer.render(scene, camera);
}
	
// 해당 객체 정보를 가져와서 플레이어를 테스트로 생성하는 부분
var createPlayer = function(initPlayerObjArr){
	
	// 플레이어 데이터 객체 목록 갯수 만큼 해당 반복문 실행
	for(var i in initPlayerObjArr){
		
		console.log(initPlayerObjArr[i]);
		var cube_geometry = new THREE.BoxGeometry(initPlayerObjArr[i].objStatus.sizeX, initPlayerObjArr[i].objStatus.sizeY, initPlayerObjArr[i].objStatus.SizeZ);
		//var cube_geometry = new THREE.BoxGeometry();
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

		/*		
		player_1_playerId = playerObjData.playerId;
		player_1_moveSpeed = playerObjData.speed;
		player_1_turnSpeed = playerObjData.turnSpeed;
		*/

		// objects.push(player_Obj);

		// 플레이어 객체 목록에 추가
		playerUIObj.push(player_Obj);	
		scene.add(player_Obj);
		
	}
	
}

/*
var createPlayer1 = function(data){
	// 서버 측 플레이어 정보 값이 여기로 넘어옴, 즉 플레이어 아이디가 playerData에 저장되어 있음
	// 여기에 각 플레이어의 위치, 회전 값이 초기에 전달이 됨
	

	var cube_geometry = new THREE.BoxGeometry(data.objStatus.sizeX, data.objStatus.sizeY, data.objStatus.SizeZ);
	//var cube_geometry = new THREE.BoxGeometry();
	var cube_material = new THREE.MeshBasicMaterial({color : data.color , wireframe : true});
	
	// 여기서 해당 플레이어에 대한 각종 캐릭터 값을 만듬
	player_1_Obj = new THREE.Mesh(cube_geometry, cube_material);
	
	
	console.log("createPlayer : playerInfo : ");
	console.log(player_1_Obj);
	
	// player.rotation.set(0,0,0);
	player_1_Obj.position.x = data.objStatus.x;
	player_1_Obj.position.y = data.objStatus.y;
	player_1_Obj.position.z = data.objStatus.z;
	
	console.log(player_1_Obj.position);
	
	player_1_playerId = data.playerId;
	player_1_moveSpeed = data.speed;
	player_1_turnSpeed = data.turnSpeed;
	
	objects.push(player_1_Obj);
	scene.add(player_1_Obj);
	
	//camera.lookAt(player.position);
	
	
};

var createPlayer2 = function(data){
	// 서버 측 플레이어 정보 값이 여기로 넘어옴, 즉 플레이어 아이디가 playerData에 저장되어 있음
	// 여기에 각 플레이어의 위치, 회전 값이 초기에 전달이 됨
	
	
	var cube_geometry = new THREE.BoxGeometry(data.sizeX, data.sizeY, data.SizeZ);
	// var cube_geometry = new THREE.BoxGeometry();
	var cube_material = new THREE.MeshBasicMaterial({color : data.color , wireframe : true});
	
	// 여기서 해당 플레이어에 대한 각종 캐릭터 값을 만듬
	player_2_Obj = new THREE.Mesh(cube_geometry, cube_material);
	
	
	console.log("createPlayer : playerInfo : ");
	console.log(player_2_Obj);
	
	// player.rotation.set(0,0,0);
	player_2_Obj.position.x = data.objStatus.x;
	player_2_Obj.position.y = data.objStatus.y;
	player_2_Obj.position.z = data.objStatus.z;
	
	console.log(player_2_Obj.position);
	
	player_2_playerId = data.playerId;
	player_2_moveSpeed = data.speed;
	player_2_turnSpeed = data.turnSpeed;
	
	objects.push(player_2_Obj);
	scene.add(player_2_Obj);
	
	//camera.lookAt(player.position);
		
};
*/

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

var removeMyPlayer = function(){
	scene.remove(player);
	
}



var updateMyDirection = function(data){
	player.rotation.x = data.xRoll;
	player.rotation.y = data.yPitch;
	player.rotation.z = data.zYaw;	
}


// 특정 플레이어의 위치 값을 바꾸는 함수
var updatePlayerPosition = function(data){
	var somePlayer = playerForId(data.playerId);
	
	somePlayer.position.x = data.x;
	somePlayer.position.y = data.y;
	somePlayer.position.z = data.z;
	
	somePlayer.rotation.x = data.r_x;
	somePlayer.rotation.y = data.r_y;
	somePlayer.rotation.z = data.r_z;
	
	
};


var updatePlayerData = function(){
	
	playerData.x = player.position.x;
	playerData.y = player.position.y;
	playerData.z = player.position.z;
	
	
	playerData.r_x = player.rotation.x;
	playerData.r_y = player.rotation.y;
	playerData.r_z = player.rotation.z;
	
	
};




var addOtherPlayer = function(data){
    var cube_geometry = new THREE.BoxGeometry(data.sizeX, data.sizeY, data.sizeZ);
    var cube_material = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: false});
    var otherPlayer = new THREE.Mesh(cube_geometry, cube_material);

    otherPlayer.position.x = data.x;
    otherPlayer.position.y = data.y;
    otherPlayer.position.z = data.z;

    otherPlayersId.push( data.playerId );
    otherPlayers.push( otherPlayer );
    objects.push( otherPlayer );
    scene.add( otherPlayer );

};


var removeOtherPlayer = function(data){

	var removePlayerObj;
	var index;
	
	console.log("Data On Remove : ");
	console.log(data);
	// 지울 객체를 가져옴
	removePlayerObj = playerForId(data.playerId);
	
	console.log("removeOtherPlayer : index");
	console.log(index);
	
	if(index > -1){
		
		scene.remove(removePlayerObj);
		
	}
	
};


var updateCameraPosition = function(){

    camera.position.x = player.position.x + 6 * Math.sin( player.rotation.y );
    camera.position.y = player.position.y + 6;
    camera.position.z = player.position.z + 6 * Math.cos( player.rotation.y );

};


var playerForId = function(id){
    var index;
	
    for (var i = 0; i < otherPlayersId.length; i++){
        if (otherPlayersId[i] == id){
            index = i;
            break;
        }
    }
	
	console.log(otherPlayers[index]);
    return otherPlayers[index];
};



function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
