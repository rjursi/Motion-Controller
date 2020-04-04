
// 해당 클래스를 밖에서 쓸수 있도록 다음과 같이 모듈화
module.exports = ioEvents;


// 클래스의 생성자
function ioEvents(io){
	this.io = io;
	
}

var whoIsOn = [];
	// 서버에 누가 있는지를 저장하는 배열

// 메서드를 따로 생성을 하기 위해서 다음과 같이 해당 클래스에 메소드를 만들수 있도록 함
var ioEventsPrototype = ioEvents.prototype;

// ioEventHandler : 하나의 메서드
ioEventsPrototype.ioEventHandler = function(){
	
	// 해당 사버는 어떤 클라이언트가 connection event 를 발생시키고 있는 것인지를 대기중

	// callback 으로 넘겨지는 socket 에는 현재 클라이언트와 연결되어있는 socket 관련 정보들이 다 들어가 있음
	
	// 클라이언트 안에서 연결되고 나서
	this.io.on('connection', function (socket){

	  var nickname = '';

	  // socket.on('login') : 클라이언트가 login 이벤트를 발생시키면
	  // 어떤 콜백 함수를 작동시킬 것인지를 설정하는 것
	  socket.on('login', function(data){
		console.log(`${data} has entered room! --------`);
		whoIsOn.push(data);
		nickname = data;


		var whoIsOnJson = `${whoIsOn}`

		console.log(whoIsOnJson)



		//io.emit과 socket.emit의 다른점은 io.는 서버에 연결된 모든 소켓에 보내는 것이고
		//socket.emit은 현재 그 소켓에만 보내는 것

		// io.emit('newUser',whoIsOnJson);
		// emit 은 데이터를 보내는 것

	  })

	  socket.on('AccData', function(data){

		console.log(`x : ${data.x}, y : ${data.y}, z : ${data.z}`)

	  }) 

	  socket.on('GyroData', function(data){
		console.log(`gyro-x : ${data.xRoll}, y : ${data.yPitch}, z : ${data.zYaw}`)
	  })

	  socket.on('say', function(data){ // 클라이언트가 say 라는 이벤트  를 발생시키면 해당 콜백 함수를 작동시켜라


		console.log(`${nickname} : ${data}`)


		socket.emit('myMsg',data);
		socket.broadcast.emit('newMsg',data);
		// socket.broadcast.emit 은 현재 소켓이외에 서버에 연결된 모든 소켓에 보내는 것

	  })

	  socket.on('disconnect', function(){
		console.log(`${nickname} has left this chatroom ---------`)


	  })

	  socket.on('logout', function(){

		// Delete User in the whoIsOn Array

		whoIsOn.splice(whoIsOn.indexOf(nickname), 1);

		var data = {
		  whoIsOn: whoIsOn,
		  disconnected : nickname
		}

		// jsonData	


		socket.emit('logout',data)
	  })
	});

}


