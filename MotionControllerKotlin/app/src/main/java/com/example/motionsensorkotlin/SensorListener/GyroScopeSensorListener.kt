package com.example.motionsensorkotlin.SensorListener

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.example.motionsensorkotlin.IOSocket.IoSocket
import org.json.JSONObject

class GyroScopeSensorListener (IoSocket : IoSocket) :  AppCompatActivity(), SensorEventListener {

    var IoSocket = IoSocket

    /* 아래는 단위 시간을 구하기 위한 변수 */

    var timestamp = 0.0

    /* 회전각을 구하기 위한 변수 */

    var rad_to_dgr = 180 / Math.PI
    val NS2S = 1.0 / 1000000000.0 // 나노 세컨트를 세컨트(초) 단위로 변환하기 위한 변수

    /* 각 센서 변경값을 저장하기 위한 변수 */

    var roll = 0.0 // x
    var pitch = 0.0 // y
    var yaw = 0.0 // z

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {

    }

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            /* Json 형식으로 보낼 데이터 객체 생성 */
            var gyroDataJson = JSONObject()

            var gyroX = event.values[0];
            var gyroY = event.values[1];
            var gyroZ = event.values[2];




            /* 단위 시간 계산 */
            var dt = (event.timestamp - timestamp)*NS2S
            timestamp = event.timestamp.toDouble()

            /* 만약에 단위 시간이 변화했다면 */
            if(dt-timestamp*NS2S != 0.0){

                roll = roll + gyroX*dt
                pitch = pitch + gyroY*dt
                yaw = yaw + gyroZ*dt


                gyroDataJson.put("xRoll", roll*rad_to_dgr)
                gyroDataJson.put("yPitch", pitch*rad_to_dgr)
                gyroDataJson.put("zYaw", yaw*rad_to_dgr)
                gyroDataJson.put("gamesocketId", IoSocket.gamesockId)
                Log.d("MainActivity","onSensorChanged: x" + " ${roll*rad_to_dgr}, y: ${pitch*rad_to_dgr}, z : ${yaw*rad_to_dgr}")
                IoSocket.sendGyroData(gyroDataJson)

            }
        }
    }




}