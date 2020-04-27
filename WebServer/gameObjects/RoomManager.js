var playerManager = require("./playerManager.js");


var INTERVAL = 10;

var players = [];

function RoomManager(io){
  var RmMg = this;
  RmMg.inviteCodeSockDict = {};
  RmMg.rooms = {};
  RmMg.roomIndex = {};

	
  // 하나의 방을 만드는 메소드
  RmMg.create = function(playerSock, inviteCode){
	  
	// 초대 코드로 방을 식별하는 것으로 설정
    var roomId = inviteCode;
	
	 // 해당 방에 대한 객체를 하나 만듬, 여기서 통신할 객체를 만듬
    
	
	// 해당 방에 대한 이름으로 room 을 생성
    playerSock.join(roomId);
	RmMg.inviteCodeSockDict[roomId] = playerSock;

	// 해당 룸에 들어갔다는 신호를 보냄
	 
    console.log("Room Created :", roomId);

  };
	
	
  RmMg.join = function(inviteCode, player2Sock){
	  // 초대 받은 방에 들어갈 초대 코드를 받아옴
	  var joinRoomId = inviteCode;
	  
	  // 초대 받은 방에 들어감
	  player2Sock.join(joinRoomId);
	  
	  // 초대코드를 생성한 방장
	  var player1 = RmMg.inviteCodeSockDict[joinRoomId];
	  
	  // 초대 코드를 받아 진입한 두번째 플레이어
	  var player2 = player2Sock;
	  
	  console.log("roomManager : Player2 Joined");
	  
	  players.push(player1);
	  players.push(player2);
	  
	  var room = new Room(joinRoomId, player1, player2);
	  
	  // 룸 목록중에 하나로 다음 room 객체를 넣음
	  RmMg.rooms[joinRoomId] = room;
	  
	  // 플레이어별 초대 코드가 들어가있는 곳을 식별하기 위해 다음과 같이 저장
      RmMg.roomIndex[player1.id] = joinRoomId;
      RmMg.roomIndex[player2.id] = joinRoomId;
	  
	  
	  // UI 상에다가 플레이어를 만들어달라고 신호를 보냄
	  
	player1.emit('ui_createPlayer', room.objects[player1.id]);
	player2.emit('ui_createPlayer', room.objects[player2.id]);  
	  // 만들어진 플레이어의 객체에 대한 데이터를 포함간 객체를 보냄
	  
  }
  
  RmMg.destroy = function(roomId, LbMg){
    var room = RmMg.rooms[roomId];
    room.players.forEach(function(socket){
      LbMg.push(socket);
      delete RmMg.roomIndex[socket.id];
    });
    delete RmMg.rooms[roomId];
  };
	
	
  RmMg.updatePlayerGyroData = function(playerSock, gyroData){
  	
	var getPlayer = RmMg.rooms[RmMg.roomIndex[playerSock.id]].objects[playerSock.id];
	
	// 플레이어의 회전각 등 데이터 변경
	var player = getPlayer.updatePlayerGyroData(gyroData);
												   
	playerSock.emit('ui_updateMyDirection', gyroData);
	  
  }	
/*	
  RmMg.update = setInterval(function(){
    for(var roomId in RmMg.rooms){
      var room = RmMg.rooms[roomId];
      var statuses = [];
      for(var object in room.objects){
        var obj = room.objects[object];
		  
		  // 아래 오브젝트에서 에러 터짐. 아래서부터 수정
        obj.update();
        statuses.push(obj.status);
      }
      io.to(room.id).emit('update',statuses);
    }
  },INTERVAL);
*/
}


module.exports = RoomManager;

function Room(id, socket0, socket1) {
  this.id = id;
  this.status = "waiting";
  this.players = [socket0,socket1]; // 하나의 방 안에 들어가 있는 플레이어 두개의 소켓을 넣어둠
  this.objects = {};

  this.objects[socket0.id] = new playerManager(socket0.id, "LEFT");
  this.objects[socket1.id] = new playerManager(socket1.id, "RIGHT");
	
	// 방에 들어갈 때부터 플레이어의 객체가 만들어짐
  
}