package com.example.motionsensorkotlin

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.ActivityInfo
import android.hardware.Sensor
import android.hardware.SensorManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import com.example.motionsensorkotlin.IOSocket.IoSocket
import com.example.motionsensorkotlin.SensorListener.AccelerometerSensorListener
import com.example.motionsensorkotlin.SensorListener.GyroScopeSensorListener
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : AppCompatActivity() {
    // : - AppCompatActivity 클래스를 상속을 한다는 의미 (클래스 앞에 붙을 경우)

    private val sensorManager by lazy{
        // 지연된 초기화 사용
        getSystemService(Context.SENSOR_SERVICE) as SensorManager

        // sensorManager 변수를 처음 사용할 때 getSystemService() 메서드로 SensorManager 객체를 얻음
    }

    // 앞 인트로 Activity 에서 보낸 User ID 값을 받기 위한 인텐트 설정
    lateinit var introIntent: Intent


    lateinit var uniqueID : String
    var IoSocketConn : IoSocket =
        IoSocket()
    var accelerometerSensorListener : AccelerometerSensorListener =
        AccelerometerSensorListener(
            IoSocketConn
        )
    // 객체 생성 및 클래스 생성자를 통하여 초기화
    var gyroScopeSensorListener : GyroScopeSensorListener =
        GyroScopeSensorListener(
            IoSocketConn
        )



    @SuppressLint("SourceLockedOrientationActivity")
    override fun onCreate(savedInstanceState: Bundle?) {
        // ? : Null 일 수 있음을 지칭함
        // savedInstanceState : 액티비티의 이전 상태, 즉 잠시 어플리케이션을 나갓다 오거나 어플리케이션의 이전 상태

        // 화면이 꺼지지 않도록 설정
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // 화면이 세로 모드로 고정이 되도록 지정
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;


        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


        // 앞 Intro Activity 에서 보낸 ID 값을 받음
        introIntent = intent
        uniqueID = introIntent.getStringExtra("intent_uniqueID")

        // 서버 연결
        IoSocketConn.connectIoServer(uniqueID)

        // 바로 센서가 동작하도록 설정, 센서 값은 보통 속도로 넘기도록 설정
        sensorManager.registerListener(gyroScopeSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE), SensorManager.SENSOR_DELAY_NORMAL)

        /*
        accTestBtn.setOnTouchListener { _: View, event:MotionEvent ->

            when(event.action){
                MotionEvent.ACTION_DOWN -> {
                    /*
                    // 가속도 센서 값을 보낼거라는 신호를 보냄
                    sensorManager.registerListener(accelerometerSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
                        SensorManager.SENSOR_DELAY_GAME)

                    // 현재 액티비티에서 센서 값을 받도록 설정
                    // Sensor.TYPE_ACCELEROMETER - 가속도 센서 사용
                    // SensorManager.SENSOR_DELAY_GAME - 센서 값을 얼마나 자주 받을 것인지를 지정, 게임에 적합한 정도로 받음


                     */


                    // 자이로스코프 센서를 사용할 경우
                    sensorManager.registerListener(gyroScopeSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE), SensorManager.SENSOR_DELAY_NORMAL)

                }

                MotionEvent.ACTION_UP -> {
                     // sensorManager.unregisterListener(accelerometerSensorListener)

                    sensorManager.unregisterListener(gyroScopeSensorListener)
                }

            }

            true
        }


        */
    }
    
    
    // 어플리케이션을 잠시 내렸을 경우
    override fun onPause() {
        super.onPause()

        sensorManager.unregisterListener(gyroScopeSensorListener)
        IoSocketConn.sendPauseMsg()
    }

    override fun onStop() {
        super.onStop()

        sensorManager.unregisterListener(gyroScopeSensorListener)
        IoSocketConn.sendStopMsg()
    }

    override fun onRestart() {
        super.onRestart()

        sensorManager.registerListener(gyroScopeSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE), SensorManager.SENSOR_DELAY_NORMAL)
        IoSocketConn.sendRestartMsg()
    }

    override fun onDestroy() {
        super.onDestroy()

        IoSocketConn.sendLogoutMsg();


    }
}
