package com.example.motionsensorkotlin

import android.content.Context
import android.graphics.Paint
import android.graphics.PorterDuff
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.SurfaceHolder
import android.view.SurfaceView
import android.view.View
import android.view.View.OnTouchListener

class JoystickView : SurfaceView, SurfaceHolder.Callback, OnTouchListener {
    private var centerX = 0f
    private var centerY = 0f
    private var baseRadius = 0f
    private var hatRadius = 0f
    private var joystickCallback: JoystickListener? = null
    private fun setupDimensions() {
        centerX = width / 2.toFloat()
        centerY = width / 2.toFloat()
        baseRadius =
            Math.min(width, height) / 4.toFloat() // Math.min함수는 둘중 작은것을 반환
        hatRadius = Math.min(width, height) / 6.toFloat()
    }

    constructor(context: Context?) : super(context) {
        holder.addCallback(this)
        setOnTouchListener(this)
        if (context is JoystickListener) {
            joystickCallback = context
        }
    }

    constructor(
        context: Context?,
        attributes: AttributeSet?,
        style: Int
    ) : super(context, attributes, style) {
        holder.addCallback(this)
        setOnTouchListener(this)
        if (context is JoystickListener) {
            joystickCallback = context
        }
    }

    constructor(context: Context?, attributes: AttributeSet?) : super(
        context,
        attributes
    ) {
        holder.addCallback(this)
        setOnTouchListener(this)
        if (context is JoystickListener) {
            joystickCallback = context
        }
    }

    private fun drawJoystick(newX: Float, newY: Float) {
        if (holder.surface.isValid) {
            val myCanvas = this.holder.lockCanvas()
            val colors = Paint()
            //myCanvas.drawColor(0x00AAAAAA, PorterDuff.Mode.CLEAR)
            myCanvas.drawARGB(255,92,209,229);
            colors.setARGB(255, 50, 50, 50)
            myCanvas.drawCircle(centerX, centerY, baseRadius, colors)
            colors.setARGB(255, 255, 0, 0)
            myCanvas.drawCircle(newX, newY, hatRadius, colors)
            holder.unlockCanvasAndPost(myCanvas)
        }
    }

    override fun surfaceCreated(holder: SurfaceHolder) {
        setupDimensions()
        drawJoystick(centerX, centerY)
    }

    override fun surfaceChanged(
        holder: SurfaceHolder,
        format: Int,
        width: Int,
        height: Int
    ) {
    }

    override fun surfaceDestroyed(holder: SurfaceHolder) {}
    override fun onTouch(v: View, e: MotionEvent): Boolean {
        if (v == this) {
            if (e.action != MotionEvent.ACTION_UP) {
                val displacement = Math.sqrt(
                    Math.pow(
                        e.x - centerX.toDouble(),
                        2.0
                    ) + Math.pow(e.y - centerY.toDouble(), 2.0)
                ).toFloat()
                if (displacement < baseRadius) {
                    drawJoystick(e.x, e.y)
                    joystickCallback!!.onJoystickMoved(
                        (e.x - centerX) / baseRadius,
                        (e.y - centerY) / baseRadius,
                        id
                    )
                    //joystickCallback.onJoystickMoved(e.getX()-centerX,centerY-e.getY(),centerX,centerY, baseRadius, getId());
                } else {
                    val ratio = baseRadius / displacement
                    val constrainedX = centerX + (e.x - centerX) * ratio
                    val constrainedY = centerY + (e.y - centerY) * ratio
                    drawJoystick(constrainedX, constrainedY)
                    joystickCallback!!.onJoystickMoved(
                        (constrainedX - centerX) / baseRadius,
                        (constrainedY - centerY) / baseRadius,
                        id
                    )
                }
            } else {
                drawJoystick(centerX, centerY)
                joystickCallback!!.onJoystickMoved(0f, 0f, id)
            }
        }
        return true
    }

    interface JoystickListener {
        fun onJoystickMoved(
            xPercent: Float,
            yPercent: Float,
            source: Int
        ) // void onJoystickMoved(float posX, float posY, float centroX, float CentroY, float radio, int source);
    }
}