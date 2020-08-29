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
		// x,y,z 초기 축 위치
			this.objStatus.x = 300;
			this.objStatus.y = 77;
			this.objStatus.z = 72;	
			
			this.color = 0xffffff;
			
			break;
			
		case "RIGHT":
			this.objStatus.x = 320;
			this.objStatus.y = 77;
			this.objStatus.z = 72;	
			
			this.color = 0x825fff;
			break;
	}
	
	
	// 움직이는 방향값, 여기에 증감하는 스피드가 대입이 될 예정
	this.objStatus.move_x = 0;
	this.objStatus.move_z = 0;
	
	this.objStatus.tryInteraction = false;
	this.objStatus.movingDirection_x = 1;
	this.objStatus.movingDirection_y = 1;
	this.objStatus.movingDirection_z = 1;
	
	
    this.objStatus.seeDirection = 0;
   
	
	// hitbox 사이즈
	
    this.objStatus.sizeX = 5;
    this.objStatus.sizeY = 15;
    this.objStatus.sizeZ = 5;
	
	// 플레이어가 움직이는 스피드
    this.speed = 0.3;
	
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


playerManager.prototype.holdPlayerPosition = function(playerId){
	var player = this.playerForId(playerId);
	
}

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


	var seeDirection;
	var move_x, move_z;
	var angle = Math.PI / 4;


	player.objStatus.isMoving = true;


	switch(joystickData){
		case 0:
			move_x = 0;
			move_z = 0;

			
		
			seeDirection = player.objStatus.seeDirection; // 마지막으로 초기화 한 값 반환
			player.objStatus.isMoving = false;
			break;
		case 0.5:
			
			
			move_x = 0;
			move_z = 0;
			player.objStatus.tryInteraction = true;
			seeDirection = player.objStatus.seeDirection; // 마지막으로 초기화 한 값 반환
			player.objStatus.isMoving = false;
			break;
			
		case 6:
			seeDirection = 0;
			move_x = 0;
			move_z = player.speed;
			
			player.objStatus.movingDirection_x = 1;
			player.objStatus.movingDirection_z = 1;
			player.objStatus.tryInteraction = false;
			break;

		case 4.5:
			seeDirection = angle;
			move_x = player.speed;
			move_z = player.speed;
			
			
			player.objStatus.movingDirection_x = 1;
			player.objStatus.movingDirection_z = 1;
			player.objStatus.tryInteraction = false;
			break;

		case 3:
			seeDirection = angle * 2;
			move_x = player.speed;
			move_z = 0;
			
			player.objStatus.movingDirection_x = 1;
			player.objStatus.movingDirection_z = 1;
			player.objStatus.tryInteraction = false;
			break;

		case 1.5:
			seeDirection = angle * 3;
			move_x = player.speed;
			move_z = -player.speed;

			player.objStatus.movingDirection_x = 1;
			player.objStatus.movingDirection_z = -1;
			player.objStatus.tryInteraction = false;
			break;

		case 12:
			seeDirection = angle * 4;
			move_x = 0;
			move_z = -player.speed;

			player.objStatus.movingDirection_x = 1;
			player.objStatus.movingDirection_z = -1;
			player.objStatus.tryInteraction = false;
			break;

		case 10.5:
			seeDirection = angle * 5;
			move_x = -player.speed;
			move_z = -player.speed;
		
			player.objStatus.movingDirection_x = -1;
			player.objStatus.movingDirection_z = -1;
			player.objStatus.tryInteraction = false;

			break;

		case 9:
			seeDirection = angle * 6;
			move_x = -player.speed;
			move_z = 0;
			
			player.objStatus.movingDirection_x = -1;
			player.objStatus.movingDirection_z = 1;
			player.objStatus.tryInteraction = false;

			break;

		case 7.5:


			seeDirection = angle * 7;
			move_x = -player.speed;
			move_z = player.speed;

			
			player.objStatus.movingDirection_x = -1;
			player.objStatus.movingDirection_z = 1;
			player.objStatus.tryInteraction = false;
			
			break;

	}

	console.info("Moving Status : " + player.objStatus.isMoving);

	player.objStatus.move_x = move_x;
	player.objStatus.move_z = move_z;
	player.objStatus.seeDirection = seeDirection;
		
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



