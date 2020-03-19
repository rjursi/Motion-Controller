const http = require('http');
var fs = require('fs'); // 파일 읽기, 쓰기 등이 가능한 모듈

const hostname = '0.0.0.0';
const port = 3000;


function onRequest(request, response){
  console.log(request);
	
  if(request.method == 'GET' && (request.url == '/' || request.url == '/index.html')){
   
    response.writeHead(200, {"Content-Type":"text/html"}); // 웹페이지 형식으로 출력을 할 것을 표시
    fs.createReadStream("./res/index.html").pipe(response); // 같은 디렉토리에 있는 index.html을 출력하는 용도
  } else{
    send404Message(response);
  }
  
}


function send404Message(response){
  response.writeHead(404, {"Content-Type":"text/plain"});
  response.write("404 Error....");
  response.end();
}

function ServerOn(){

 
  const server = http.createServer(onRequest);
  server.listen(port, hostname, () => { 
      // () => {} : 추가로 도는 함수를 의미
      // listen 하면서 추가로 되는 함수를 의미
      
      
    console.log(`Server running at https://${hostname}:${port}/`);
    //서버가 가동되었을때 나타나는 메시지

  });
}

module.exports.ServerOn = ServerOn;
