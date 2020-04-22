

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
    const uiSide = this.io.of('/uiSide');
    const controlSide = this.io.of('/controlSide');
	var inviteCode = '';
	var player, playerIdTemp;
	
	// 안드로이드 단 단말기를 통하여 클라이언트 안에서 연결되고 나면
	uiSide.on('connection', function (socket_ui){
		// uiSide 부분이 먼저 연결되고 나서
		console.log(`UI Side Connected. ${socket_ui.id}`);
		// 유저 하나가 들어감
		
	
		// 아래 addPlayer 과정에서 새로운 플레이어 객체를 생성함
		/*
		playerMgr.addPlayer(userId);

		// 지정한 플레이어의 객체를 가져옴
		player = playerMgr.playerForId(userId);	


		playerIdTemp = player.playerId;
		
		*/

		
		
		
		// 그 다음 안드로이드 컨트롤 부분이 연결되는 구조
		controlSide.on('connection', function(socket_ctrl){ 
			console.log(`Control Side Connected. ${socket_ctrl.id}`);
	
			// 방을 만들기 위한 초대 코드를 만듬
			inviteCode = makeInviteString()
			console.log(inviteCode);

			// 초대 코드로 개인 방을 만듬
			
			// 접속한 유저 한명의 소켓을 로비로 보냄
			
			/*
			lobbyMgr.push(socket_ui);
			lobbyMgr.dispatch(roomMgr, inviteCode);
			*/
			
		  // socket.on('login') : 클라이언트가 login 이벤트를 발생시키면
		  // 어떤 콜백 함수를 작동시킬 것인지를 설정하는 것
			socket_ctrl.on('ad_login', function(userId){

				// 안드로이드 단에서 보낸 고유 어플리케이션 Instance ID 값이 넘어옴
				console.log(`${userId} 가 Android 통하여 접속 --------`);
				
				// 안드로이드 상에서 초대 코드를 보냄
				socket_ctrl.emit('server_inviteCode', inviteCode);
				
				// 로비에 한명 추가
				lobbyMgr.push(socket_ui);
				// 유저 한명당 방을 따로 하나 만듬
				lobbyMgr.dispatch(roomMgr, inviteCode);
				
				
			});

			socket_ctrl.on('ad_AccData', function(data){

				console.log(`x : ${data.x}, y : ${data.y}, z : ${data.z}`)

			}); 

			socket_ctrl.on('ad_GyroData', function(data){
				console.log(`gyro-x : ${data.xRoll}, y : ${data.yPitch}, z : ${data.zYaw}`);
				
				socket_ui.emit('ui_updateMyDirection', data);
			});


			socket_ctrl.on('ad_pause', function(userId){

				// 안드로이드 단에서 어플이 잠깐 멈췃을 경우 (pause) 멈췃다고 메시지 날리기
				 console.log(`${userId} request pause.... ---------`)

			});


			  // 로그아웃 시에도 다음곽 같이 아이디를 받아와서 배열에서 없어지도록 처리	
			socket_ctrl.on('ad_logout', function(userId){
				console.log(player);

				// 안드로이드 단에서 어플리 종료되었을 경우 위에서 logout 신호를 받아서 접속한 플레이어중 없어지도록 처리
				socket_ui.emit('ui_removeMyPlayer', player);
				
				//
				// socket_ui.emit('ui_removeOtherPlayer', player);
				playerMgr.removePlayer(player);
				
				console.log(`${userId} has left this game ---------`)


			});


			socket_ctrl.on('ad_stop', function(userId){

			// 안드로이드 단에서 어플리 종료되었을 경우 위에서 logout 신호를 받아서 접속한 플레이어중 없어지도록 처리

				console.log(`${userId} stopped.... ---------`)

			});
			
			
			socket_ctrl.on('ad_joinTothePlayer1Room', function(inviteCode){
				var isDuplicate = 1;
				// 위 초대코드 배열에서 해당 초대 코드가 존재 하는지 먼저 검색을 실시
				isDuplicate = inviteCodes.findIndex(x => x.value === inviteCode);
				
				if(isDuplicate == -1){
					// 만약에 해당 초대 코드가 존재하지 않는다면
					
					socket_ctrl.emit("ad_invalidInviteCode", "이 초대코드는 유효하지 않습니다.");
				}
				else{
					// 해당 초대 코드가 존재할 시 해당 방으로 진입
					var player2Sock = socket_ui;
					lobbyMgr.join(roomMgr, inviteCode, player2Sock);
				}
				
			});
		});
      
	});
	
	
	uiSide.on('disconnect', function (socket_ui){
		socket_ui.emit('ui_removeMyPlayer', player);
	});
}


// 해당 클래스를 밖에서 쓸수 있도록 다음과 같이 모듈화
module.exports = ioEvents;


