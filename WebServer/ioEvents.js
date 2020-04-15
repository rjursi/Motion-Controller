

// 클래스의 생성자
function ioEvents(io){
	this.io = io;
}


// ioEventHandler : 하나의 메서드
ioEvents.prototype.ioEventHandler = function(playerManager){
	
	// 해당 사버는 어떤 클라이언트가 connection event 를 발생시키고 있는 것인지를 대기중
	// callback 으로 넘겨지는 socket 에는 현재 클라이언트와 연결되어있는 socket 관련 정보들이 다 들어가 있음
	
	
	// 웹사이트 io 커넥션 관리
    const uiSide = this.io.of('/uiSide');
    const controlSide = this.io.of('/controlSide');
	var player, playerIdTemp;
	
	// 안드로이드 단 단말기를 통하여 클라이언트 안에서 연결되고 나면
	uiSide.on('connection', function (socket_ui){
		console.log('UI Side Connected');
		
		controlSide.on('connection', function(socket_ctrl){
			console.log('Control Side Connected');
			
			
		  // socket.on('login') : 클라이언트가 login 이벤트를 발생시키면
		  // 어떤 콜백 함수를 작동시킬 것인지를 설정하는 것
			socket_ctrl.on('ad_login', function(userId){

				// 안드로이드 단에서 보낸 고유 어플리케이션 Instance ID 값이 넘어옴
				console.log(`${userId} 가 Android 통하여 접속 --------`);


				playerManager.addPlayer(userId);

				player = playerManager.playerForId(userId);


				playerIdTemp = player.playerId;

				socket_ui.emit('ui_createPlayer', player);

				// socket_ui.broadcast.emit('ui_addOtherPlayer', player);


				//io.emit과 socket.emit의 다른점은 io.는 서버에 연결된 모든 소켓에 보내는 것이고
				//socket.emit은 현재 그 소켓에만 보내는 것

				// io.emit('newUser',whoIsOnJson);
				// emit 은 데이터를 보내는 것

			});

			socket_ctrl.on('ad_AccData', function(data){

				console.log(`x : ${data.x}, y : ${data.y}, z : ${data.z}`)

			}); 

			socket_ctrl.on('ad_GyroData', function(data){
				console.log(`gyro-x : ${data.xRoll}, y : ${data.yPitch}, z : ${data.zYaw}`);
				
				socket_ui.emit('ui_updateMyDirection', data);
			});


			/*
			socket_ctrl.on('disconnect', function(){

				console.log(`${playerIdTemp} disconnected of the server.... ---------`)
			});
			*/
			

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
				playerManager.removePlayer(player);
				
				console.log(`${userId} has left this game ---------`)


			});


			socket_ctrl.on('ad_stop', function(userId){

			// 안드로이드 단에서 어플리 종료되었을 경우 위에서 logout 신호를 받아서 접속한 플레이어중 없어지도록 처리

				console.log(`${userId} stopped.... ---------`)

			});


		});
      
	});
}


// 해당 클래스를 밖에서 쓸수 있도록 다음과 같이 모듈화
module.exports = ioEvents;


