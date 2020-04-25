
// 서버에서 생성한 각종 초대 코드들이 계속해서 모이는 곳
var inviteCodes = [];

// 클래스의 생성자
function ioEvents(io){
	this.io = io;
}


// 초대 코드 생성을 위한 6자리 랜덤 문자열 만들기
function makeInviteString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
	var string_length = 6;
	var inviteCode = '';
	
	// 초기엔 중복 상태로 진입
	var isDuplicate = 1;
	
	while(isDuplicate == 1){
		
		for (var i=0; i<string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			inviteCode += chars.substring(rnum,rnum+1);
		}	
		
		
		// 배열에 대하여 중복 검사
	    isDuplicate = inviteCodes.findIndex(x => x.value === inviteCode);
		// 중복이 아니면 , 즉 -1이 되면 해당 반복문을 빠져나옴
		
	}	
	
	inviteCodes.push(inviteCode);
	
//document.randform.randomfield.value = randomstring;
	return inviteCode;	
}


// ioEventHandler : 하나의 메서드
ioEvents.prototype.ioEventHandler = function(playerMgr, lobbyMgr, roomMgr){
	
	// 해당 사버는 어떤 클라이언트가 connection event 를 발생시키고 있는 것인지를 대기중
	// callback 으로 넘겨지는 socket 에는 현재 클라이언트와 연결되어있는 socket 관련 정보들이 다 들어가 있음
	
	
	// 웹사이트 io 커넥션 관리
    
	
	var player, playerIdTemp;
	// 웹 상에서 붙을시 저장할 딕셔너리 변수와 컨트롤러 단에서 붙을시 저장할 딕셔너리 변수를 지정
	var game_sockets = {}, controller_sockets = {};
	
	// 안드로이드 단 단말기를 통하여 클라이언트 안에서 연결되고 나면
	this.io.sockets.on('connection', function (socket){
		// uiSide 부분이 먼저 연결되고 나서
		
		socket.on('game_connect', function(){
			console.log(`Web Client Connected. ${socket.id}`);
		    // 유저 하나가 들어감
			
			game_sockets[socket.id] = {
				socket : socket,
				controller_id : undefined
			};
			
			// 게임 서버에 연결이 되었다고 신호를 보냄
			socket.emit('game_connected');
		});	
		
		// 그럼 안드로이드 단에도 웹 소켓을 보내야 됨, 데이터 값이 날라옴
		// 아래에는 안드로이드 단에서 날라오는 소켓
		socket.on('controller_connect', function(game_socket_id){
			if(game_sockets[game_socket_id]){
				console.log("controller connected");
			
				// 해당 컨트롤러 소켓이 저장됨
				controller_sockets[socket.id] = {
					socket : socket,
					game_id: game_socket_id
				};

				socket.emit("controller_connected", true);

				game_sockets[game_socket_id].controller_id = socket.id;
				game_sockets[game_socket_id].socket.emit("controller_connected", true);
				
				
				var inviteCode = '';
				// 로비에 해당 유저를 추가하는 과정
				lobbyMgr.push(game_sockets[game_socket_id].socket);
				
				inviteCode = makeInviteString();
				inviteCodes.push(inviteCode);
				
				lobbyMgr.dispatch(roomMgr, inviteCode);
				
			}
			else{
				console.log("Controller failed to connect");
				
				socket.emit("controller_connected", false);
			}
		});
		
		socket.on('disconnect', function(){
			
			// 만약에 웹 상에서의 게임 소켓일 경우
			if(game_sockets[socket.id]){
				
				console.log("Game disconnected");
				
				if(controller_sockets[game_sockets[socket.id].controller_id]){
					
					// 관련된 컨트롤러 소켓이 연결이 끊어졌다고 알림
					controller_sockets[game_sockets[socket.id].controller_id].socket.emit("controller_connected", false);
					controller_sockets[game_sockets[socket.id].controller_id].game_id = undefined;
				}
				
				delete game_sockets[socket.id];
			}
			
			// 만약에 컨트롤러 소켓이 끊어질 경우
			if(controller_sockets[socket.id]){
				
				console.log("Controller disconnected");
				
				
				// 만약에 컨트롤러 소켓이 게임에 연결이 되어있을 경우
				if(game_sockets[controller_sockets[socket.id].game_id]){
					
					// 컨트롤러가 끊어졌다고 웹 게임 소켓에게 알림
					game_sockets[controller_sockets[socket.id].game_id].socket.emit("controller_connected", false);
					
					// 컨트롤러 없어짐을 설정
					game_sockets[controller_sockets[socket.id].game_id].controller_id = undefined;	
				}
				
				delete controller_sockets[socket.id];
			}
		});
		
		
		// 해당 가속도, 센서값 소켓에는 안드로이드에서 접속한 소켓 값이 들어오게 됨
		socket.on('ad_AccData', function(data){

			console.log(`x : ${data.x}, y : ${data.y}, z : ${data.z}`)

		}); 

		socket.on('ad_GyroData', function(data){
			console.log(`gyro-x : ${data.xRoll}, y : ${data.yPitch}, z : ${data.zYaw}`);
			
			
			//socket_ui.emit('ui_updateMyDirection', data);
			
			roomMgr.updatePlayerData(socket, data);
		});	


		socket.on('ad_pause', function(gamesocketId){

			// 안드로이드 단에서 어플이 잠깐 멈췃을 경우 (pause) 멈췃다고 메시지 날리기
			 console.log(`${gamesocketId} request pause.... ---------`)

		});


		  // 로그아웃 시에도 다음곽 같이 아이디를 받아와서 배열에서 없어지도록 처리	
		socket.on('ad_logout', function(gamesocketId){
			console.log(player);

			// 안드로이드 단에서 어플리 종료되었을 경우 위에서 logout 신호를 받아서 접속한 플레이어중 없어지도록 처리
			socket_ui.emit('ui_removeMyPlayer', player);

			//
			// socket_ui.emit('ui_removeOtherPlayer', player);
			playerMgr.removePlayer(player);

			console.log(`${gamesocketId} has left this game ---------`)


		});


		socket.on('ad_stop', function(gamesocketId){

		// 안드로이드 단에서 어플리 종료되었을 경우 위에서 logout 신호를 받아서 접속한 플레이어중 없어지도록 처리

			console.log(`${gamesocketId} stopped.... ---------`)

		});


		socket.on('ad_joinTothePlayer1Room', function(inviteCode){
			var isDuplicate = 1;
			// 위 초대코드 배열에서 해당 초대 코드가 존재 하는지 먼저 검색을 실시
			isDuplicate = inviteCodes.findIndex(x => x.value === inviteCode);

			if(isDuplicate == -1){
				// 만약에 해당 초대 코드가 존재하지 않는다면

				socket_ctrl.emit("ad_invalidInviteCode", "이 초대코드는 유효하지 않습니다.");
			}
			else{
				// 해당 초대 코드가 존재할 시 해당 방으로 진입
				
				lobbyMgr.join(roomMgr, inviteCode, player2Sock);


			}

		});

      
	});
	
	
}

					   
// 해당 클래스를 밖에서 쓸수 있도록 다음과 같이 모듈화
module.exports = ioEvents;


