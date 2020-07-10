var express = require('express');
var app = express();

// 각종 게임 관련 작업 클래스 호출
var lobbyManager = require('./gameObjects/LobbyManager');
var roomManager = require('./gameObjects/RoomManager');
var playerManager = require('./gameObjects/playerManager');

var socketio = require('socket.io');
var ioEvents = require('./ioEvents');


// 각종 페이지 요청 파일들을 안내해주는 모듈 router
var router = require('./router')(app);


var server = app.listen(3000, ()=>{
  console.log('Listening at port number 3000...')
});
// express 웹서버 프레임워크로 3000 포트르 Listen
// 안드로이드 클라이언트가 접속하기 위한 소켓



//express 서버를 socket.io 서버로 업그레이드
const io = socketio.listen(server);


// 플레이어 목록을 관리하는 객체 생성
var playerMgr = new playerManager();
var lobbyMgr = new lobbyManager(io);
var roomMgr = new roomManager(io);

// io 소켓 통신을 관리하는 객체 생성
var Handler = new ioEvents(io);



// 다음에 각종 이벤트를 컨트롤하도록 함수를 호출
// 플레이어 컨트롤도 ioEventHandler 함수에서 연결되고나서 이루어 지므로 여기서도 객체를 전송
Handler.ioEventHandler(playerMgr, lobbyMgr, roomMgr);

