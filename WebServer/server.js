var express = require('express');
var app = express();
var socketio = require('socket.io');


var server = app.listen(3000, ()=>{
  console.log('Listening at port number 3000...')
});
// express 웹서버 프레임워크로 3000 포트르 Listen

var io = socketio.listen(server);
//express 서버를 socket.io 서버로 업그레이드


var whoIsOn = [];
// 서버에 누가 있는지를 저장하는 배열


// 해당 사버는 어떤 클라이언트가 connection event 를 발생시키고 있는 것인지를 대기중


// callback 으로 넘겨지는 socket 에는 현재 클라이언트와 연결되어있는 socket 관련 정보들이 다 들어가 있음

io.on('connection', function (socket){
  
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
    console.log(`${data}`)
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

