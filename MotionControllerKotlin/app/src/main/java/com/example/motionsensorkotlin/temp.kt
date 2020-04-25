package com.example.motionsensorkotlin

import androidx.appcompat.app.AppCompatActivity
import com.example.motionsensorkotlin.IOSocket.IoSocket
import org.json.JSONObject

class temp(IoSocket : IoSocket) :  AppCompatActivity() {


    var IoSocket = IoSocket
    var voiceDataJson= JSONObject()

    fun add(bytearray : ByteArray){


        voiceDataJson.put("voice",bytearray)

        IoSocket.sendVoiceData(voiceDataJson)
    }


}