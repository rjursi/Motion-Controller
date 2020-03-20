
var app = require('express')();
var server = require('http').Server(app);
// express 를 사용한 서버를 구축 (express : node.js 웹 프레임워크)
var ioHandler = require('./ioEvents.js');

const hostname = '0.0.0.0';
const port = 3000;



function onRequest(req, res){
  res.sendFile(__dirname + '/res/index.html');
  // 성공적으로 연결이 되면 해당 html 파일로 연결을 해라
  // 맨 처음으로 들어왔을때 클라이언트에게 보여줄 페이지를 여기서 설정

 
}


// 아래부터 소스 코드 시작
ioHandler.ioEventHandler(server);

server.listen(port, hostname, () =>
  console.log(`Listening on host ${hostname} and port ${port}`)
);

app.get('/', onRequest);
// 서버로부터 요청이 들어올 경우 아래 request 함수가 처리





