//var io = io.connect();
const io_ui = io();
io_ui.connect();
var controller_state = {};

io_ui.on('connect', function(){
	  
	// 서버에 접속 되었다는 신호를 보내게 됨
	io_ui.emit('game_connect');
	io_ui.on('game_connected', game_connected);
	
	io_ui.on('controller_connected', function(connected){
		
		if(connected){
			
			// QRcode 숨기기
			
			info_element.style.display = "none";
			init();
			animate();
			
		}else{
			// QRcode 그대로 보이게
			info_element.style.display = "block"
			finish_render();
			
			controller_state = {};
			
			
		}
	});
});

io_ui.on('updateUI', function(objStatuses){
	
	// 각종 UI 오브젝트의 상태를 보내서 업데이트
	updateUI(objStatuses);
	
});

var create_QR = function(){
	var QR_code;
	var url = "https://jswebgame.run.goorm.io?id=" + io_ui.id;
	
	console.log(io_ui.id);
	
	info_element = document.createElement('div');
	info_element.id = "app_info";
	
	title_element = document.createElement('h1');
	title_element.innerHTML = "웹 브라우저와 연결";
	
	
	QR_code_element = document.createElement('div');
	QR_code_element.id = "QR_code";
	
	download_pageElement = document.createElement('div');
	wantApk_title = document.createElement('h1');
	wantApk_title.innerHTML = "아직 어플리케이션을 다운받지 않으셨나요?";
	
	downloadPageLink = document.createElement('a');
	downloadPageLink.setAttribute('href', "https://jswebgame.run.goorm.io/download");
	downloadPageLink.innerHTML = "어플리케이션 다운로드 페이지";
	
	
	
	// body 안에 추가함
	document.body.appendChild(info_element);
	document.getElementById("app_info").appendChild(title_element);
	document.getElementById("app_info").appendChild(QR_code_element);
	document.getElementById("app_info").appendChild(wantApk_title);
	document.getElementById("app_info").appendChild(downloadPageLink);
	
	QR_code = new QRCode("QR_code");
	QR_code.makeCode(url);
	
}

// 플레이어가 웹 게임에 접속을 할 경우 QR코드를 띄울 수 있도록 함수를 호출
var game_connected = function(){
	
	// main.js 에 있는 함수
	create_QR();
	
	// 더 이상 사용을 안하므로 해당 리스너를 지움
	io_ui.removeListener('game_connected', game_connected);
	
}

io_ui.on('Disconnected_UI', function(){
	// main.js 에 있는 함수
	DisconnectedUI();	  
});



// 서버로 부터 플레이어 캐릭터를 생성하라는 신호가 오면
io_ui.on('ui_createPlayer', function(initPlayerObjArr){
	console.log(initPlayerObjArr);
	
	// UI 단에서 플레이어를 생성하는 함수를 실행, 해당 객체 값은 플레이어의 각종 위치, 크기 등 정보가 들어있는 값임
    createPlayer(initPlayerObjArr);
});



// server.js 측에서 보내는(ioEvents) socket.io 메시지와 
// 자신 (main.js) 에서 보내는 socket.io 메시지를 공통으로 처리하는 부분
