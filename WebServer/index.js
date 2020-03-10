const http = require('http');


// http 모듈을 사용, import 와 같은 거라고 보면 됨


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => { 
    // () => {} : 추가로 도는 함수를 의미
    // listen 하면서 추가로 되는 함수를 의미
    
    
  console.log(`Server running at http://${hostname}:${port}/`);
});