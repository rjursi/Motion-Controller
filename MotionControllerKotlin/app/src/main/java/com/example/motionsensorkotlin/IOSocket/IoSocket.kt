package com.example.motionsensorkotlin.IOSocket

import android.telecom.Call
import android.util.Log
import android.widget.Toast
import com.github.nkzawa.emitter.Emitter
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import org.json.JSONObject
import java.net.URISyntaxException


class IoSocket {
    lateinit var mSocket: Socket
    lateinit var username: String

    var users: Array<String> = arrayOf()

    lateinit var userId : String
    lateinit var inviteCode : String

    fun connectIoServer(uniqueID : String){

        userId = uniqueID

        try{

            mSocket = IO.socket("https://jswebgame.run.goorm.io" + "/controlSide")

        } catch(e: URISyntaxException){
            Log.e("IOSocket", e.reason)
        }


        mSocket.connect()
        // server 측의 io.on('connection', function (socket) {-} 을 따라감
        // mSocket.emit('connection',socket)을 한 것 과 동일하다고 할 수 있음


        mSocket.on(Socket.EVENT_CONNECT, onConnect)
        // 위 연결이 성공적으로 연결이 되면 server 측에서 "connect" 이벤트를 발생
    }

    val onConnect: Emitter.Listener = Emitter.Listener {
        // login 이벤트를 서버쪽으로 같이 보낼 예정


        // 로그인 한다는 이벤트를 보냄
        mSocket.emit("ad_login", userId)
        Log.d("IOSocket", "Socket is Connected with $userId")


        mSocket.on("server_inviteCode", onGetInviteCode);

    }


    private val onGetInviteCode : Emitter.Listener = Emitter.Listener{ args ->


        inviteCode = args[0] as String



        Log.e("Received InviteCode", inviteCode)

    }

    // 가속도 센서 데이터 보내는 함수
    fun sendAccData(data : JSONObject){
        mSocket.emit("ad_AccData", data)
    }

    // 자이로스코프 센서 데이터 보내는 함수

    fun sendGyroData(data : JSONObject){
        mSocket.emit("ad_GyroData", data)
    }


    fun sendLogoutMsg(){
        mSocket.emit("ad_logout", userId)
    }


    fun sendPauseMsg(){
        mSocket.emit("ad_pause", userId)
    }


    fun sendStopMsg(){
        mSocket.emit("ad_stop", userId)
    }


    fun sendRestartMsg(){
        mSocket.emit("ad_restart", userId)
    }
}