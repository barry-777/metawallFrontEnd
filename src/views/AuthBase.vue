<template>
  <section class="auth-base">
    <div class="container-box">
      <div class="container">
        <swiper class="swiper-no-swiping" :speed="1000" :auto-height="true" @swiper="onSwiper">
          <swiper-slide>
            <div class="slide-inner">
              <div class="left-box">
                <img src="@img/login_img.svg" alt="" />
              </div>
              <div class="right-box">
                <h1>MetaWall</h1>
                <h2>從元宇宙展開全新社交圈</h2>
                <div class="input-group">
                  <input v-model="email" type="text" placeholder="Email" />
                  <input v-model="password" type="password" placeholder="Password" />
                </div>
                <p v-if="errMsg" class="err-text">{{ errMsg }}</p>
                <div class="button-group">
                  <button class="base-button" type="button" @click="loginEvent">登入</button>
                  <button class="base-button simple" type="button" @click="slideToTarget(1)">
                    前往註冊
                  </button>
                </div>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="slide-inner">
              <div class="left-box">
                <img src="@img/register_img.svg" alt="" />
              </div>
              <div class="right-box">
                <h1>MetaWall</h1>
                <h2>註冊會員！</h2>
                <div class="input-group">
                  <input v-model="name" type="text" placeholder="Name" />
                  <input v-model="email" type="text" placeholder="Email" />
                  <input v-model="password" type="password" placeholder="Password" />
                  <input v-model="confirmPassword" type="password" placeholder="confirmPassword" />
                </div>
                <p v-if="errMsg" class="err-text">{{ errMsg }}</p>
                <div class="button-group">
                  <button class="base-button" type="button" @click="signUpEvent">註冊</button>
                  <button class="base-button simple" type="button" @click="slideToTarget(0)">
                    前往登入
                  </button>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { ref } from 'vue'
import { useCommonStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'

// 會員資料
const name = ref('')
const email = ref('zion@gmail.com')
const password = ref('q1234567')
const confirmPassword = ref('')
// store 資料
const commonStore = useCommonStore()
const { errMsg } = storeToRefs(commonStore)
const { authSignUp, authLogin } = commonStore

// 重新設定
const resetValue = () => {
  name.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  errMsg.value = ''
}

// 註冊
const signUpEvent = async () => {
  if (
    name.value == '' ||
    email.value == '' ||
    password.value == '' ||
    confirmPassword.value == ''
  ) {
    return (errMsg.value = '填寫欄位不得為空')
  } else if (name.value.length < 2) {
    return (errMsg.value = '暱稱至少 2 個字元以上')
  } else if (!email.value.includes('@')) {
    return (errMsg.value = 'E-mail 格式錯誤')
  } else if (password.value.length < 8) {
    return (errMsg.value = '密碼 字數低於8碼')
  } else if (password.value !== confirmPassword.value) {
    return (errMsg.value = '密碼 不一致')
  }

  const payload = {
    name: name.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value
  }

  const result = await authSignUp(payload)
  if (result) {
    slideToTarget(0)
  }
}

// 登入
const loginEvent = async () => {
  if (email.value == '' || password.value == '') {
    return (errMsg.value = '填寫欄位不得為空')
  } else if (!email.value.includes('@')) {
    return (errMsg.value = 'E-mail 格式錯誤')
  } else if (password.value.length < 8) {
    return (errMsg.value = '密碼 字數低於8碼')
  }

  const payload = {
    email: email.value,
    password: password.value
  }

  authLogin(payload)
}

// swiper 事件
const mySwiper = ref(null)
const onSwiper = swiper => {
  mySwiper.value = swiper
}
const slideToTarget = n => {
  mySwiper.value.slideTo(n)
  resetValue()
}
</script>
