const http = require('http');


// http 모듈을 사용, import 와 같은 거라고 보면 됨


const hostname = '0.0.0.0';
// 외부에서 접속이 되도록 할려먼 0.0.0.0으로 세팅을 해줘야 함

const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});


server.listen(port, hostname, function(){ 
    // () => {} : 추가로 도는 함수를 의미
    // listen 하면서 추가로 되는 함수를 의미
    
    
  console.log(`Server running at http://${hostname}:${port}/`);
});