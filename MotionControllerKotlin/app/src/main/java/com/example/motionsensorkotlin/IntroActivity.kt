package com.example.motionsensorkotlin

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.motionsensorkotlin.Intro.IntroPart

class IntroActivity : AppCompatActivity() {

    private lateinit var uniqueID : String
    var introPart : IntroPart = IntroPart()
    private val intent_uniqueID = "intent_uniqueID"

    val DURATION : Long = 2000 // 1초 대기하고 이동하도록 설정

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_intro)

        uniqueID = introPart.getAppInstanceId()

        // 생성한 ID를 Toast 로 한번 출력
        Toast.makeText(this, "ID : " + uniqueID, Toast.LENGTH_LONG).show()

        // 아래 잠시 대기하도록 하여 1초 있다가 MainActivity 로 전환이 되도록 설정
        Handler().postDelayed({val intent = Intent(this, ConnectControllerActivity::class.java)

            intent.putExtra(intent_uniqueID, uniqueID)
            startActivity(intent)
            finish()
        },DURATION)



    }



}