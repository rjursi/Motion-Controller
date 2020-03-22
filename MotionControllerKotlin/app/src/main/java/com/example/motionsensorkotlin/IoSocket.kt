package com.example.motionsensorkotlin

import android.util.Log
import android.widget.Toast
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;


class IoSocket {

    fun connectIoServer(){


        val socket = IO.socket("WebPage Address Input")

        socket.connect().on(Socket.EVENT_CONNECT, { Log.e("info","connected")})
            .on(Socket.EVENT_DISCONNECT, { Log.e("info","disconnected")})
    }
}