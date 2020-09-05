 var playerManager = require("./playerManager.js");

// 업데이트하기 위한 주기 값
var INTERVAL = 10;

var players = []; // 플레이어 들의 웹 소켓들이 저장되어 있는 공간

function RoomManager(io){
  var RmMg = this;
  RmMg.inviteCodeSockDict = {};
	
  RmMg.rooms = {}; // rooms 딕셔너리 아래 roomid와 그에 맞는 room 객체가 들어감
  RmMg.roomIndex = {}; // 플레이어 별 초대 코드가 들어가 있는 딕셔너리
  RmMg.roomSockets = {}; // 방별 소켓이 들어갈 공간
	
  // 하나의 방을 만드는 메소드
  RmMg.create = function(playerSock, inviteCode){
	  
	// 초대 코드로 방을 식별하는 것으로 설정
    var roomId = inviteCode;
	
	 // 해당 방에 대한 객체를 하나 만듬, 여기서 통신할 객체를 만듬
    
	
	// 해당 방에 대한 이름으로 room 을 생성
    playerSock.join(roomId);
	  
	// 플레이어가 생성이 될 때마다 지정한 초대 코드에 대한 플레이어의 소켓을 저장을 해 둠  
	RmMg.inviteCodeSockDict[roomId] = playerSock;
	

	RmMg.roomIndex[playerSock.id] = roomId;  
	// 해당 룸에 들어갔다는 신호를 보냄
	  
	RmMg.roomSockets[playerSock.id] = [playerSock];
	  
	console.info(RmMg.roomSockets[playerSock.id]);
    console.log("Room Created :", roomId);

  };
	
	
  RmMg.join = function(inviteCode, player2Sock_web){
	  // 초대 받은 방에 들어갈 초대 코드를 받아옴
	  var joinRoomId = inviteCode;
	  
	  // 초대 받은 방에 들어감
	  player2Sock_web.join(joinRoomId);
	  
	  // 초대코드를 생성한 방장
	  var player1Sock_web = RmMg.inviteCodeSockDict[joinRoomId];
	  
	  console.log("roomManager : Player2 Joined");
	  
	  players.push(player1Sock_web); 
	  players.push(player2Sock_web);
	  
	  
	  
	  var room = new Room(joinRoomId, player1Sock_web, player2Sock_web);
	  
	  // room 목록중에 하나로 다음 room 객체를 넣음
	  RmMg.rooms[joinRoomId] = room;
	  
	  // 플레이어별 초대 코드가 들어가있는 곳을 식별하기 위해 다음과 같이 저장
      RmMg.roomIndex[player1Sock_web.id] = joinRoomId;
      RmMg.roomIndex[player2Sock_web.id] = joinRoomId;
	  
	  RmMg.roomSockets[player1Sock_web.id].push(player2Sock_web);
	  RmMg.roomSockets[player2Sock_web.id].push(player1Sock_web);
	  
	  console.info(RmMg.roomSockets[player2Sock_web.id]);
	  // UI 상에다가 플레이어를 만들어달라고 신호를 보냄
	  var initPlayerObjArr = [];
	  
	  
	  initPlayerObjArr.push(room.objects[player1Sock_web.id]);
	  initPlayerObjArr.push(room.objects[player2Sock_web.id]);
	  
	  // 해당 생성된 방에 캐릭터를 생성하라는 신호를 보냄
	  io.to(joinRoomId).emit('ui_createPlayer', initPlayerObjArr);
	 
	  
  }
  
  RmMg.returnRoomSockets = function(onePlayerSock_id){
	  
	  /*
	  var roomId = RmMg.roomIndex[onePlayerSock_id];
      var room = RmMg.rooms[roomId];
	  
	  
	  return room.players;
	  */
	  
	  var roomSockets = RmMg.roomSockets[onePlayerSock_id];
	  console.info("roomSockets : " + roomSockets);
	  
	  return roomSockets;
	  
	  
	  
  }
  
  
  RmMg.destroy = function(playerSockId, LbMg){
	 
	
	var roomId = RmMg.roomIndex[playerSockId];
	  
	console.info(roomId); 
	
	/*
    var room = RmMg.rooms[roomId];
	*/
	  
	  
	var roomSockets = RmMg.returnRoomSockets(playerSockId);  
	console.info(RmMg.roomSockets[playerSockId]);
	 
	// 해당 romm 에다가 모든 UI를 지우는 역할을 함  
	io.to(roomId).emit('Disconnected_UI');
	  
	
    roomSockets.forEach(function(socket){
	
	  LbMg.kick(socket); // 로비에서도 해당 소켓을 끊어버림
		
      delete RmMg.roomIndex[socket.id];
	  delete RmMg.roomSockets[socket.id];
		
    });
	  
    delete RmMg.rooms[roomId];
	console.info("roomManager : 지정한 룸이 지워졌습니다.");
	
  };
	
	
  
  RmMg.updatePlayerGyroData = function(playerSock, gyroData){
  	
	  
	  // 해당 바꾸고자 하는 플레이어의 객체를 가져옴
	  // playerManager 객체를 가져옴
	var getPlayer = RmMg.rooms[RmMg.roomIndex[playerSock.id]].objects[playerSock.id];
	
	// 플레이어의 회전각 등 데이터 변경 - playerManager 객체에서 데이터 수정 -> 수정된 데이터 반환
	var updatedPlayerDataObj = getPlayer.updatePlayerGyroData(playerSock, gyroData);
				
	  
	// 해당 방의 지정한 플레이어 소켓에 플레이어 데이터 값을 업데이트
	RmMg.rooms[RmMg.roomIndex[playerSock.id]].objects[playerSock.id] = updatedPlayerDataObj;  
	
	  
  }	
  
  RmMg.updatePlayerJoystickData = function(playerSock, joystickData){
	let getRoom = RmMg.rooms[RmMg.roomIndex[playerSock.id]];
	var getPlayer = RmMg.rooms[RmMg.roomIndex[playerSock.id]].objects[playerSock.id];
	
	// 플레이어의 회전각 등 데이터 변경 - playerManager 객체에서 데이터 수정 -> 수정된 데이터 반환
	var updatedPlayerDataObj = getPlayer.updatePlayerJoystickData(playerSock, joystickData);
	  

	  
	io.to(getRoom.id).emit('playerStatusUpdate', updatedPlayerDataObj);
    // RmMg.rooms[RmMg.roomIndex[playerSock.id]].objects[playerSock.id] = updatedPlayerDataObj;  

	// 해당 방의 지정한 플레이어 소켓에 플레이어 데이터 값을 업데이트
	
  }
 

  
}


module.exports = RoomManager;

function Room(id, socket0, socket1) {
  this.id = id;
  this.status = "waiting";
  // this.players = [socket0,socket1]; // 하나의 방 안에 들어가 있는 플레이어 두개의 소켓을 넣어둠
  this.objects = {};

  this.objects[socket0.id] = new playerManager(socket0.id, "LEFT");
  this.objects[socket1.id] = new playerManager(socket1.id, "RIGHT");
	
	// 방에 들어갈 때부터 플레이어의 객체가 만들어짐
  
	
	// 방에서 공통으로 만들어질 맵 객체를 만들 예정
}