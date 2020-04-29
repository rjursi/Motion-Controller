function LobbyManager(io){
  var LbMg = this;
  LbMg.lobby = []; // 해당 로비에는 플레이어 웹 소켓이 계속 쌓이게 된다.
  LbMg.updating = false;

  LbMg.dispatch = function(RmMg, inviteCode){
    if(LbMg.dispatching) return;
    LbMg.dispatching = true;

	  
	// 플레이어 한명의 소켓을 가져옴
	var playerSock = LbMg.lobby.splice(0,1);
	
	// roomManager를 통하여 하나의 방을 만드는 함수를 호출
	RmMg.create(playerSock[0], inviteCode);
    
    LbMg.dispatching = false;
  };	
	
  LbMg.push = function(socket){
	  // 로비에 플레이어 한명을 추가
    LbMg.lobby.push(socket);
  };
	
	
	
  // 초대 코드를 받을 경우 그때부터 특정 방에 들어가도록 구현	
  LbMg.join = function(RmMg, inviteCode, player2Sock){
	  RmMg.join(inviteCode, player2Sock);
  };	
	
	

  LbMg.kick = function(socket){
    var index = LbMg.lobby.indexOf(socket);
    if(index >= 0) LbMg.lobby.splice(index,1);
  };
	
  LbMg.clean = function(){
    var sockets = LbMg.lobby;
    LbMg.lobby = sockets.filter(function(socket){ return socket !== null; });
  };
	
  
	
  
}
module.exports = LobbyManager;