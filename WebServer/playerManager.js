// 모든 플레이어 목록을 저장
var players = [];



// 플레이어의 ID 및 위치, 회전 값 정보가 포함되어 있는 객체
function playerManager(){
	
	this.playerId = players.length;
		
	// x,y,z 축 위치
	this.x = 1;
    this.y = 0;
    this.z = 1;
	
	// x,y,z 회전 각도
    this.r_x = 0;
    this.r_y = 0;
    this.r_z = 0;
	
	// 플레이어가 만들어 질때 사이즈
    this.sizeX = 1;
    this.sizeY = 1;
    this.sizeZ = 1;
	
	// 플레이어가 움직이는 스피드
    this.speed = 0.1;
	
	// 플레이어가 돌아갈 때 스피드
    this.turnSpeed = 0.03;
}




playerManager.prototype.addPlayer = function(id){

	// 여기서 플레이어 관련 각종 정보가 담겨져있는 객체 생성
	var player = new playerManager();
	
	
	player.playerId = id;
	
	// 서버단 플레이어 목록에 객체 추가
	players.push( player );
	
	console.log(player.playerId + "entered on the game!");
	
	console.log("Now Player Members");
	console.log(players);
	
	return player;
};

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


// 지정한 하나의 플레이어 값을 반환하는 함수
playerManager.prototype.playerForId = function(id){
	var player;
	
	for(var i = 0; i < players.length; i++){
		if(players[i].playerId === id){
			
			
			player = players[i];
			break;
		}
		
	}
	
	return player;
};



module.exports = playerManager;



