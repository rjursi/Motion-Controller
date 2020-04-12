var socket = io();

socket.on('ui_updatePosition', function(data){
    updatePlayerPosition(data);
});

socket.on('ui_createPlayer', function(data){
    createPlayer(data);
});
socket.on('ui_addOtherPlayer', function(data){
    addOtherPlayer(data);
});
socket.on('ui_removeOtherPlayer', function(data){
    removeOtherPlayer(data);
});

// server.js 측에서 보내는(ioEvents) socket.io 메시지와 
// 자신 (main.js) 에서 보내는 socket.io 메시지를 공통으로 처리하는 부분
