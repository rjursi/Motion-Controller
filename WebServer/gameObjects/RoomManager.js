var playerManager = require("./playerManager.js");


var INTERVAL = 10;

function RoomManager(io){
  var RmMg = this;
  RmMg.rooms = {};
  RmMg.roomIndex = {};

  RmMg.create = function(playerSock, inviteCode){
    var roomId = inviteCode
	
	 // 해당 방에 대한 객체를 하나 만듬, 여기서 통신할 객체를 만듬
    
    playerSock.join(roomId);
    
	
	  // 해당 룸에 들어갔다는 신호를 보냄
	  
	/*  
    io.to(roomId).emit("in");
    
	*/
	  
    console.log("Room Created :", roomId);
	
	  
	  
	  
	// UI 상에다가 플레이어를 만들어달라고 신호를 보냄
	  /*
	socket0.emit('ui_createPlayer', room.objects[socket0.id]);
	socket1.emit('ui_createPlayer', room.objects[socket1.id]);  
	*/
  };
	
	
  RmMg.join = function(inviteCode, player2Sock){
	  var joinRoomId = inviteCode;
	  
	  // 초대 받은 방에 들어감
	  player2Sock.join(joinRoomId);
	  
	  
	  var room = new Room(joinRoomId,socket0,socket1);
	  RmMg.rooms[roomId] = room;
      RmMg.roomIndex[socket0.id] = roomId;
      RmMg.roomIndex[socket1.id] = roomId;
	  
	  
  }
  
  RmMg.destroy = function(roomId, LbMg){
    var room = RmMg.rooms[roomId];
    room.players.forEach(function(socket){
      LbMg.push(socket);
      delete RmMg.roomIndex[socket.id];
    });
    delete RmMg.rooms[roomId];
  };
	
  RmMg.update = setInterval(function(){
    for(var roomId in RmMg.rooms){
      var room = RmMg.rooms[roomId];
      var statuses = [];
      for(var object in room.objects){
        var obj = room.objects[object];
        obj.update();
        statuses.push(obj.status);
      }
      io.to(room.id).emit('update',statuses);
    }
  },INTERVAL);
}

module.exports = RoomManager;

function Room(id, socket0, socket1) {
  this.id = id;
  this.status = "waiting";
  this.players = [socket0,socket1];
  this.objects = {};
  this.objects[socket0.id] = new playerManager(socket0.id, "LEFT");
  this.objects[socket1.id] = new playerManager(socket1.id, "RIGHT");
  
}