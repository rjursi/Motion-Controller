package com.example.motionsensorkotlin

import android.Manifest
import android.annotation.SuppressLint
import android.app.Dialog
import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.content.pm.ActivityInfo
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorManager
import android.media.MediaPlayer
import android.media.MediaRecorder
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import com.example.motionsensorkotlin.IOSocket.IoSocket
import com.example.motionsensorkotlin.SensorListener.AccelerometerSensorListener
import com.example.motionsensorkotlin.SensorListener.GyroScopeSensorListener
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.dialog_inputinvitecode.view.*
import java.io.IOException


class MainActivity : AppCompatActivity(), JoystickView.JoystickListener {
    // : - AppCompatActivity 클래스를 상속을 한다는 의미 (클래스 앞에 붙을 경우)

    private val sensorManager by lazy{
        // 지연된 초기화 사용
        getSystemService(Context.SENSOR_SERVICE) as SensorManager

        // sensorManager 변수를 처음 사용할 때 getSystemService() 메서드로 SensorManager 객체를 얻음
    }

    // 앞 인트로 Activity 에서 보낸 User ID 값을 받기 위한 인텐트 설정
    lateinit var byConnIntent: Intent


    lateinit var gamesocketId : String
    var IoSocketConn : IoSocket = IoSocket(this)
    var accelerometerSensorListener : AccelerometerSensorListener =
        AccelerometerSensorListener(
            IoSocketConn
        )
    // 객체 생성 및 클래스 생성자를 통하여 초기화
    var gyroScopeSensorListener : GyroScopeSensorListener =
        GyroScopeSensorListener(
            IoSocketConn
        )

    override fun onJoystickMoved(xPercent: Float, yPercent: Float, source: Int) {

        when (source) {
            R.id.joystickLeft ->
            {
                Log.d("Left Joystick", "X percent: $xPercent Y percent: $yPercent")

                if ((yPercent < 0.3 && yPercent > -0.3) && (xPercent > 0.0 && xPercent < 1.0 ))
                {
                    tvLog.text = "Right"
                }
                if ((yPercent < 0.3 && yPercent > -0.3) && (xPercent < 0.0 && xPercent > -1.0 ))
                {
                    tvLog.text = "Left"
                }
                if ((yPercent > -1.0 && yPercent < 0.0) && (xPercent > -0.3 && xPercent < 0.3 ))
                {
                    tvLog.text = "Up"
                }
                if ((yPercent > 0.0 && yPercent < 1.0) && (xPercent > -0.3 && xPercent < 0.3 ))
                {
                    tvLog.text = "Down"
                }
                if (yPercent == 0F && xPercent == 0F)
                {
                    tvLog.text = ""
                }
            }
        }
    }

    var texto: TextView? = null


    ////////////////////////

    var voicedata : temp = temp(IoSocketConn)

    private var mediaRecorder: MediaRecorder? = null
    private var mediaPlayer: MediaPlayer? = null
    private var fileName: String? = null

    companion object {
        private const val REQUEST_RECORD_AUDIO_PERMISSION = 200
    }
    /////////////////////////////


    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        var permissionToRecordAccepted = false
        when (requestCode) {
            REQUEST_RECORD_AUDIO_PERMISSION -> permissionToRecordAccepted = grantResults[0] == PackageManager.PERMISSION_GRANTED
        }
        if (permissionToRecordAccepted == false) finish()
    }



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

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED)
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.RECORD_AUDIO), REQUEST_RECORD_AUDIO_PERMISSION)


        // 앞 Intro Activity 에서 보낸 socket ID 값을 받음
        byConnIntent = intent
        gamesocketId = byConnIntent.getStringExtra("gamesocketId")

        // 서버 연결
        IoSocketConn.connectIoServer(gamesocketId)

        // 바로 센서가 동작하도록 설정, 센서 값은 보통 속도로 넘기도록 설정
        accTestBtn.setOnClickListener {
            sensorManager.registerListener(gyroScopeSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE), SensorManager.SENSOR_DELAY_GAME)
        }


        inputInviteCode.setOnClickListener {
            showInputInviteCodePopUp()
        }

        /*
        fileName = externalCacheDir!!.absolutePath + "/record.3gp"

        if (mediaRecorder == null)
            startRecording()
        else
            stopRecording()
        recordBtn!!.setOnClickListener {
            if (mediaRecorder != null)
                stopRecording()
            else startRecording()
        }

        playBtn!!.setOnClickListener {
            if (mediaPlayer == null) {
                startPlaying()
            }
            else
                stopPlaying()
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
        IoSocketConn.sendLogoutMsg();
        super.onDestroy()
    }




    private fun showInputInviteCodePopUp(){
        val inflater = getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val view = inflater.inflate(R.layout.dialog_inputinvitecode, null);

        var dialog_listener = object: DialogInterface.OnClickListener {
            override fun onClick(dialog: DialogInterface?, which: Int) {
                Log.d("EditText String", view.inputInviteCode.text.toString())
                IoSocketConn.sendJoinToInviteCode(view.inputInviteCode.text.toString())

            }
        }

        val alertDialog = AlertDialog.Builder(this)
            .setTitle("초대 코드 입력")
            .setPositiveButton("확인", dialog_listener)
            .setNegativeButton("취소",null)
            .create()

        alertDialog.setView(view)
        alertDialog.show()


    }

    private fun startRecording() {
        statusText!!.text = "녹음중"
        recordBtn!!.text = "녹음 중지"
        mediaRecorder = MediaRecorder()
        mediaRecorder!!.setAudioSource(MediaRecorder.AudioSource.MIC)
        mediaRecorder!!.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
        mediaRecorder!!.setOutputFile(fileName)
        mediaRecorder!!.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)
        try {
            mediaRecorder!!.prepare()
        } catch (e: IOException) {
            e.printStackTrace()
            Toast.makeText(this, "녹음실패", Toast.LENGTH_SHORT).show()
            statusText!!.text = "대기상태"
            recordBtn!!.text = "녹음시작"
            mediaRecorder = null
        }
        mediaRecorder!!.start()
    }

    private fun stopRecording() {
        statusText!!.text = "대기상태"
        recordBtn!!.text = "녹음시작"
        if (mediaRecorder != null) {
            mediaRecorder!!.stop()
            mediaRecorder!!.release()
            mediaRecorder = null
        }
    }

    private fun startPlaying() {
        statusText!!.text = "재생중"
        playBtn!!.text = "재생중지"
        mediaPlayer = MediaPlayer()
        mediaPlayer!!.setOnCompletionListener { stopPlaying() }
        try {
            mediaPlayer!!.setDataSource(fileName)
            mediaPlayer!!.prepare()
            mediaPlayer!!.start()
        } catch (e: IOException) {
            e.printStackTrace()
            Toast.makeText(this, "재생실패", Toast.LENGTH_SHORT).show()
            statusText!!.text = "대기상태"
            playBtn!!.text = "재생시작"
            mediaPlayer = null
        }
    }

    private fun stopPlaying() {
        statusText!!.text = "대기상태"
        playBtn!!.text = "재생시작"
        if (mediaPlayer != null) {
            mediaPlayer!!.release()
            mediaPlayer = null
        }
    }


}
