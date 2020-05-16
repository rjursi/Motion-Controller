
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
		
		for (var i = 0; i<string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			inviteCode += chars.substring(rnum,rnum+1);
		}	
		
		
		// 배열에 대하여 중복 검사
	    isDuplicate = inviteCodes.indexOf(inviteCode);
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
	var game_sockets = {};
	var controller_sockets = {};
	
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
					game_id : game_socket_id
				};

				socket.emit("controller_connected", true);
				
				// 아래 작업할 소켓은 컨트롤러가 연결될 시 연결되는 소켓.
				game_sockets[game_socket_id].controller_id = socket.id;
				// 웹 게임 소켓에다가 컨트롤러가 연결이 되었다고 알림
				game_sockets[game_socket_id].socket.emit("controller_connected", true);
				
			
				// 아래에서 초대코드를 만들고 초대 코드를 보내는 과정이 필요함	
				var inviteCode = '';
				
				// 로비에 해당 유저를 추가하는 과정, 웹페이지 소켓을 전송
				lobbyMgr.push(game_sockets[game_socket_id].socket);
				
				inviteCode = makeInviteString();
				
				socket.emit("server_inviteCode", inviteCode);
				
				// 유저 한명 당 방을 만드는 함수
				lobbyMgr.dispatch(roomMgr, inviteCode);
				
			}
			else{
				console.log("Controller failed to connect");
				
				socket.emit("controller_connected", false);
			}
		});
		
		socket.on('disconnect', function(){
			
			// 만약에 웹 상에서의 게임 소켓이 끊어질 경우
			if(game_sockets[socket.id]){
				
				// 플레이어가 웹사이트를 종료하였을시 이벤트를 설정
				// game_sockets[socket.id].socket.emit("ui_removeMyPlayer")
				console.log("Game disconnected");
				
				
				// 해당 웹 소켓에 해당하는 컨트롤러가 존재 할 경우
				if(controller_sockets[game_sockets[socket.id].controller_id]){
					
					// 관련된 컨트롤러 소켓이 연결이 끊어졌다고 알림
					controller_sockets[game_sockets[socket.id].controller_id].socket.emit("controller_connected", false);
					controller_sockets[game_sockets[socket.id].controller_id].game_id = undefined;
				}
				
				delete game_sockets[socket.id];
			}
			
			// 컨트롤러 소켓 작업
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
			
			// 컨트롤러 소켓 값이 저장되어 있을 경우
			if(controller_sockets[socket.id]){
				console.log(`gyro-x : ${data.xRoll}, y : ${data.yPitch}, z : ${data.zYaw}`);
			
				// 컨트롤하고자 하는 웹 소켓을 안드로이드 소켓을 이용하여 
				var game_socket = game_sockets[controller_sockets[socket.id].game_id].socket;

				// 해당 roomManager 에게 해당 컨트롤러와 연결되어있는 웹 소켓과 자이로스코프 데이터를 보냄 
				roomMgr.updatePlayerGyroData(game_socket, data);
			}
			
		});	
				
		socket.on('ad_pause', function(gamesocketId){

			// 안드로이드 단에서 어플이 잠깐 멈췃을 경우 (pause) 멈췃다고 메시지 날리기
			 console.log(`${gamesocketId} request pause.... ---------`)

		});
		
		

		  // 로그아웃 시에도 다음곽 같이 아이디를 받아와서 배열에서 없어지도록 처리	
		
		
		/*
		socket.on('ad_logout', function(gamesocketId){
			console.log(player);
			
			var game_socket = game_sockets[gamesocketId].socket;
			// 안드로이드 단에서 어플리 종료되었을 경우 위에서 logout 신호를 받아서 접속한 플레이어중 없어지도록 처리
			game_socket.emit('ui_removeMyPlayer');

			//
			// socket_ui.emit('ui_removeOtherPlayer', player);
			playerMgr.removePlayer(player);

			console.log(`${gamesocketId} has left this game ---------`)


		});
		*/
		
		

		
		
		socket.on('ad_stop', function(gamesocketId){

		// 안드로이드 단에서 화면에서 사라질 경우(거의 pause 상태랑 같이 이어짐) 

			console.log(`${gamesocketId} stopped.... ---------`)

		});

		
		
		
		// 안드로이드 단에서 날라올 메시지에 대한 소켓 이벤트 - 안드로이드 단에서 초대 코드를 넣었을때
		socket.on('ad_joinTothePlayer1Room', function(joinDataJson){
			var isDuplicate = 1;
			// 위 초대코드 배열에서 해당 초대 코드가 존재 하는지 먼저 검색을 실시
			
			var inviteCode = joinDataJson.inviteCode;
			
			console.log(`log : inviteCode - ${inviteCode}`);
			
			var gamesocketId = joinDataJson.gamesocketId;
			var player2Sock_web = game_sockets[gamesocketId].socket;
			console.log(inviteCodes);
			
			isDuplicate = inviteCodes.indexOf(inviteCode);
			
			console.log(isDuplicate);
			if(isDuplicate == -1){
				// 만약에 해당 초대 코드가 존재하지 않는다면

				socket.emit("ad_invalidInviteCode", "이 초대코드는 유효하지 않습니다.");
				console.log("존재하지 않는 초대 코드");
			}
			else{
				
				// 해당 초대 코드가 존재할 시 해당 방으로 진입
				lobbyMgr.join(roomMgr, inviteCode, player2Sock_web);

			}

		});

      
	});
	
	
}

					   
// 해당 클래스를 밖에서 쓸수 있도록 다음과 같이 모듈화
module.exports = ioEvents;


