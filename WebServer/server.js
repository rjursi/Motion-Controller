var express = require('express');
var app = express();
var socketio = require('socket.io');
var ioEvents = require('./ioEvents');


app.use(express.static(__dirname + '/res'));

var server = app.listen(3000, ()=>{
  console.log('Listening at port number 3000...')
});
// express 웹서버 프레임워크로 3000 포트르 Listen


app.get('/', function(req, res){
	res.sendFile(__dirname + '/res/index.html');
});



//express 서버를 socket.io 서버로 업그레이드
var io = socketio.listen(server);


var Handler = new ioEvents(io);

// 다음에 각종 이벤트를 컨트롤하도록 함수를 호출
Handler.ioEventHandler();

