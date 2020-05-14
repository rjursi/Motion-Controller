package com.example.motionsensorkotlin.IOSocket

import android.content.Context
import android.telecom.Call
import android.util.Log
import android.widget.Toast
import com.example.motionsensorkotlin.MainActivity
import com.github.nkzawa.emitter.Emitter
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import org.json.JSONObject
import java.net.URISyntaxException


class  IoSocket (mainContext : Context){
    lateinit var mSocket: Socket
    lateinit var username: String
    lateinit var gamesockId: String
    var users: Array<String> = arrayOf()
    lateinit var inviteCode : String
    private var mainContext : Context = mainContext

    fun connectIoServer(gamesockId : String){
        this.gamesockId = gamesockId

        try{
            mSocket = IO.socket("https://jswebgame.run.goorm.io")

        } catch(e: URISyntaxException){
            Log.e("IOSocket", e.reason)
        }

        mSocket.connect()
        // server 측의 io.on('connection', function (socket) {-} 을 따라감
        // mSocket.emit('connection',socket)을 한 것 과 동일하다고 할 수 있음


        mSocket.on(Socket.EVENT_CONNECT, onConnect)
        // 위 연결이 성공적으로 연결이 되면 server 측에서 "connect" 이벤트를 발생

        mSocket.on("ad_invalidInviteCode", onInvalidInviteCode)
    }

    var onInvalidInviteCode : Emitter.Listener = Emitter.Listener { args ->
        val serverErrorMsg = args[0] as String

        Log.d("serverErrorMsg : ", serverErrorMsg)
    }



    val onConnect: Emitter.Listener = Emitter.Listener {
        // login 이벤트를 서버쪽으로 같이 보낼 예정


        // 로그인 한다는 이벤트를 보냄
        mSocket.emit("controller_connect", gamesockId)
        Log.d("IOSocket", "Socket is Connected with $gamesockId")


        mSocket.on("server_inviteCode", onGetInviteCode);

    }


    // 서버에서 만들고 보낸 초대 코드를 안드로이드 안에서도 사용이 가능하도록 처리
    private val onGetInviteCode : Emitter.Listener = Emitter.Listener{ args ->

        inviteCode = args[0] as String

        Log.d("Received InviteCode", inviteCode)
        Log.d("Message : " , "Get InviteCode Success")
    }

    fun sendJoinToInviteCode(inviteCode : String){
        Log.d("Send inviteCode", inviteCode)

        var joinDataJson = JSONObject()
        joinDataJson.put("inviteCode", inviteCode);
        joinDataJson.put("gamesocketId", gamesockId);

        mSocket.emit("ad_joinTothePlayer1Room", joinDataJson)
    }

    // 가속도 센서 데이터 보내는 함수
    fun sendAccData(data : JSONObject){
        mSocket.emit("ad_AccData", data)
    }

    // 자이로스코프 센서 데이터 보내는 함수

    fun sendGyroData(data : JSONObject){
        mSocket.emit("ad_GyroData",data)
    }

    fun sendVoiceData(data : JSONObject){
        mSocket.emit("ad_VoiceData", data)
    }

    fun sendLogoutMsg(){
        mSocket.emit("ad_logout", gamesockId)
    }


    fun sendPauseMsg(){
        mSocket.emit("ad_pause", gamesockId)
    }


    fun sendStopMsg(){
        mSocket.emit("ad_stop", gamesockId)
    }


    fun sendRestartMsg(){
        mSocket.emit("ad_restart", gamesockId)
    }
}