

function ioEventHandler(server){
  this.server = server;
  // 서버 객체 할당
  
  var io = require('socket.io')(server);
  // 해당 서버롤 socket.io 가 지원되는 서버로 업그레이드 한다.

  io.on('connection', ioConnected); // 처음 연결시 이벤트
}
 
function ioConnected(socket){
  console.log('Player connected!', socket.id);
    // 콘솔에 특정 데이터나 그런게 왓을 경우 메시지를 띄우는 역할을 함
    
    
    socket.on('', function (data){
      // 해당 유형의 데이터(data)
      console.log(data);
    });
}


module.exports = {
  ioEventHandler,
}

