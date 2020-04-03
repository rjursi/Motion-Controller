package com.example.motionsensorkotlin

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


    fun connectIoServer(){

        username = "testUser"

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
    }


    fun sendAccData(data : JSONObject){
        mSocket.emit("AccData", data)
    }

    fun sendGyroData(data : JSONObject){
        mSocket.emit("GyroData", data)
    }

    val onConnect: Emitter.Listener = Emitter.Listener {
        // login 이벤트를 서버쪽으로 같이 보낼 예정

        mSocket.emit("login", username)
        Log.d("IOSocket","Socket is Connected with ${username}")
    }


}