	var BaseObject = require("./BaseObject.js");

// 모든 플레이어 목록을 저장
var players = [];

// 플레이어의 ID 및 위치, 회전 값 정보가 포함되어 있는 객체
function playerManager(id, position){
	
	BaseObject.call(this); // 위치 클래스 상속
	
	// 플레이어의 id로 웹 게임 소켓을 받음
	this.playerId = id;
	
	switch(position){
		case "LEFT":
		// x,y,z 축 위치
			this.objStatus.x = 60;
			this.objStatus.y = -11.54;
			this.objStatus.z = 15.38;	
			
			this.color = 0xffffff;
			
			break;
		case "RIGHT":
			this.objStatus.x = 65;
			this.objStatus.y = -11.02;
			this.objStatus.z = 15.38;	
			
			this.color = 0x825fff;
			break;
	}
	
	
	// x,y,z 회전 각도
    this.objStatus.r_x = 0;
    this.objStatus.r_y = 0;
    this.objStatus.r_z = 0;
	
	// 플레이어가 만들어 질때 사이즈
	
    this.objStatus.sizeX = 20;
    this.objStatus.sizeY = 30;
    this.objStatus.sizeZ = 20;
	
	
	
	// 플레이어가 움직이는 스피드
    this.speed = 0.1;
	
	// 플레이어가 돌아갈 때 스피드
    this.turnSpeed = 0.03;
	
	
	// 플레이어 배열에 해당 객체 값이 들어감
	players.push(this);
}



/*
playerManager.prototype.addPlayer = function(id){

	// 여기서 플레이어 관련 각종 정보가 담겨져있는 객체 생성
	var player = new playerManager();
	
	// 어플리케이션에서 넘어온 아이디를 사용하여 플레이어의 아이디를 지정
	player.playerId = id;
	
	// 서버단 플레이어 목록에 객체 추가
	players.push( player );
	
	console.log(player.playerId + "entered on the game!");
	
	console.log("Now Player Members");
	console.log(players);
	
	return player;
};

*/

/*
playerManager.prototype.removePlayer = function(player){
	
	var index = players.indexOf(player);
	
	console.log("index : " + index);
	
	// 배열에서 해당 플레이어를 찾으면 로그아웃 시점이므로 없애버림
	if( index > -1){
		players.splice(index, 1);
	}
	
	console.log("PlayerManager : player removed");
	console.log(players);
};

*/

// 지정한 하나의 플레이어의 각종 값을 바꾸는 함수
playerManager.prototype.updatePlayerData = function(data){
	var player = playerForId(data.playerId);
	
	player.x = data.x;
	player.y = data.y;
	player.z = data.z;
	
	player.r_x = data.r_x;
	player.r_y = data.r_y;
	player.r_z = data.r_z;
	
	return player;
	
};


// 지정한 웹 플레이어 소켓을 가져옴
playerManager.prototype.updatePlayerGyroData = function(playerSock_web, gyroData){
	
	// 해당 플레이어의 데이터 객체를 가져옴
	var player = this.playerForId(playerSock_web.id);

	// 해당 플레이어의 객체를 찾음
	
	// 해당 객체의 회전각 데이터 값 수정
	player.objStatus.r_x = gyroData.xRoll;
	player.objStatus.r_y = gyroData.yPitch;
	player.objStatus.r_z = gyroData.zYaw;

	// 데이터 값이 수정된 해당 플레이어 정보 데이터 반환
	return player;
}

playerManager.prototype.updatePlayerJoystickData = function(playerSock_web, joystickData){
	var player = this.playerForId(playerSock_web.id);

	// 해당 플레이어의 객체를 찾음
	
	/*
	// 해당 객체의 회전각 데이터 값 수정
	player.objStatus.r_x = gyroData.xRoll;
	player.objStatus.r_y = gyroData.yPitch;
	player.objStatus.r_z = gyroData.zYaw;

	*/
	
	player.objStatus.x = joystickData.x;
	player.objStatus.y = joystickData.y;
	player.objStatus.z = joystickData.z;
	
	// 데이터 값이 수정된 해당 플레이어 정보 데이터 반환
	return player;
}

// 지정한 하나의 플레이어 값을 반환하는 함수
playerManager.prototype.playerForId = function(id){
	var player;
	
	for(var i = 0; i < players.length; i++){
		if(players[i].playerId === id){
			
		
			// 해당 플레이어 객체를 반환
			player = players[i];
			break;
		}
		
	}
	
	return player;
};



module.exports = playerManager;



