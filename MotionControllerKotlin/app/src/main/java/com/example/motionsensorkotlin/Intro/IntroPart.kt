package com.example.motionsensorkotlin.Intro

import java.util.*

class IntroPart {

    // lateinit : 절대로 Null 이 될 수 없는 속성인데
    //              초기화를 선언과 동시에 해줄 수 없거나 성능나 기타 다른 조건들로 인해
    //              초기화를 미뤄아할대 사용
    private lateinit var uniqueID : String

    fun getAppInstanceId(): String {

        // 앱을 설치한 이후에 고유적으로 부여되는 ID 생성
        // 해당 ID 는 앱이 제거될때마다 ID가 바뀜

        uniqueID = UUID.randomUUID().toString()

        return uniqueID

    }
}