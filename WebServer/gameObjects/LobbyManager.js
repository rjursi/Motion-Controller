function LobbyManager(io){
  var LbMg = this;
  LbMg.lobby = [];
  LbMg.updating = false;

  LbMg.push = function(socket){
	  // 로비에 플레이어 한명을 추가
    LbMg.lobby.push(socket);
  };
	
  LbMg.kick = function(socket){
    var index = LbMg.lobby.indexOf(socket);
    if(index >= 0) LbMg.lobby.splice(index,1);
  };
	
  LbMg.clean = function(){
    var sockets = LbMg.lobby;
    LbMg.lobby = sockets.filter(function(socket){ return socket !== null; });
  };
	
  LbMg.dispatch = function(RmMg, inviteCode){
    if(LbMg.dispatching) return;
    LbMg.dispatching = true;

	var playerSock = LbMg.lobby.splice(0,1);
	
	RmMg.create(playerSock[0], inviteCode);
    
    LbMg.dispatching = false;
  };
	
  LbMg.join = function(RmMg, inviteCode, player2Sock){
	  RmMg.join(inviteCode, player2Sock);
  };
}
module.exports = LobbyManager;