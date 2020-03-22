package com.example.motionsensorkotlin

import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.ActivityInfo
import android.hardware.Sensor
import android.hardware.SensorManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : AppCompatActivity() {
    // : - AppCompatActivity 클래스를 상속을 한다는 의미 (클래스 앞에 붙을 경우)

    private val sensorManager by lazy{
        // 지연된 초기화 사용
        getSystemService(Context.SENSOR_SERVICE) as SensorManager

        // sensorManager 변수를 처음 사용할 때 getSystemService() 메서드로 SensorManager 객체를 얻음
    }

    var accelerometerSensorListener : AccelerometerSensorListener = AccelerometerSensorListener()
    // 객체 생성 및 클래스 생성자를 통하여 초기화
    var IoSocketConn : IoSocket = IoSocket()


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

        IoSocketConn.connectIoServer()
        accTestBtn.setOnTouchListener { _: View, event:MotionEvent ->

            when(event.action){
                MotionEvent.ACTION_DOWN -> {
                    // 터치가 눌리면
                    sensorManager.registerListener(accelerometerSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
                        SensorManager.SENSOR_DELAY_GAME)

                    // 현재 액티비티에서 센서 값을 받도록 설정
                    // Sensor.TYPE_ACCELEROMETER - 가속도 센서 사용
                    // SensorManager.SENSOR_DELAY_GAME - 센서 값을 얼마나 자주 받을 것인지를 지정, 게임에 적합한 정도로 받음
                }

                MotionEvent.ACTION_UP -> {
                    sensorManager.unregisterListener(accelerometerSensorListener)
                }

            }

            true
        }
    }

    override fun onPause() {
        super.onPause()

        sensorManager.unregisterListener(accelerometerSensorListener)
    }
}
