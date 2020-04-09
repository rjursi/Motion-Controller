var express = require('express');
var app = express();
var socketio = require('socket.io');
var ioEvents = require('./ioEvents');

var playerManager = require('./playerManager');


var server = app.listen(3000, ()=>{
  console.log('Listening at port number 3000...')
});
// express 웹서버 프레임워크로 3000 포트르 Listen


// 기본 index.html 을 요청을 하면 
app.get('/', function(req, res){
	res.sendFile(__dirname + '/res/index.html');
});


app.get('/js/main.js', function(req, res){
	res.sendFile(__dirname + '/res/js/main.js');
});

//express 서버를 socket.io 서버로 업그레이드
var io = socketio.listen(server);
var userManager = new playerManager();
var Handler = new ioEvents(io);


// 다음에 각종 이벤트를 컨트롤하도록 함수를 호출
Handler.ioEventHandler(userManager);

