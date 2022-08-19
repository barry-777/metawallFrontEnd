<template>
  <canvas id="canvas" />
  <section class="auth-base">
    <div class="container-box">
      <div class="container">
        <swiper
          class="swiper-no-swiping"
          :speed="1000"
          :auto-height="true"
          @swiper="onSwiper"
        >
          <swiper-slide>
            <div class="slide-inner">
              <div class="content-box">
                <h1 class="main-title">
                  {{ appTitle }}
                </h1>
                <h2>展開全新社交圈吧</h2>
                <div class="input-group">
                  <input
                    v-model="loginValue.email"
                    type="text"
                    placeholder="Email"
                  >
                  <input
                    v-model="loginValue.password"
                    type="password"
                    placeholder="Password"
                  >
                </div>
                <template v-if="errorMessage.all.length">
                  <div class="err-t">
                    <p
                      v-for="item in errorMessage.all"
                      :key="item"
                    >
                      {{ item }}
                    </p>
                  </div>
                </template>
                <div class="button-group">
                  <button
                    class="base-button blue"
                    type="button"
                    @click="loginEvent"
                  >
                    登入
                  </button>
                  <button
                    class="base-button"
                    type="button"
                    @click="slideToTarget(1)"
                  >
                    前往註冊
                  </button>
                </div>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="slide-inner">
              <div class="content-box">
                <h1 class="main-title">
                  {{ appTitle }}
                </h1>
                <h2>註冊會員！</h2>
                <div class="input-group">
                  <input
                    v-model="registerValue.name"
                    type="text"
                    placeholder="Name"
                  >
                  <input
                    v-model="registerValue.email"
                    type="text"
                    placeholder="Email"
                  >
                  <input
                    v-model="registerValue.password"
                    type="password"
                    placeholder="Password"
                  >
                  <input
                    v-model="registerValue.confirmPassword"
                    type="password"
                    placeholder="ConfirmPassword"
                  >
                </div>
                <template v-if="errorMessage.all.length">
                  <div class="err-t">
                    <p
                      v-for="item in errorMessage.all"
                      :key="item"
                    >
                      {{ item }}
                    </p>
                  </div>
                </template>
                <div class="button-group">
                  <button
                    class="base-button blue"
                    type="button"
                    @click="signUpEvent"
                  >
                    註冊
                  </button>
                  <button
                    class="base-button"
                    type="button"
                    @click="slideToTarget(0)"
                  >
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
import { reactive, ref, watch, onMounted } from 'vue'
import router from '@/router/index'
import { postLogin, postSignUp, getUserInfo } from '@/fetch/fetch'
import { isNotEmpty, isValidEmail, isValidPassword, isSamePassword } from '@/services/validate'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'
import { drawSpace } from '@/services/space'

const appTitle = ref(import.meta.env.VITE_APP_NAME)
// 錯誤訊息
const errorMessage = reactive({ all: [] })
// store 資料
const userStore = useUserStore()
const modalStore = useModalStore()
const { openLoading, closeLoading, openAlert } = modalStore
const { setAuth, patchUser } = userStore

// 重新設定
const resetValue = () => {
  loginValue.email = ''
  loginValue.password = ''
  registerValue.name = ''
  registerValue.email = ''
  registerValue.password = ''
  registerValue.confirmPassword = ''
  errorMessage.all.length = 0
}

// 登入
const loginValue = reactive({
  email: 'zion@gmail.com',
  password: 'q1234567'
})

const loginEvent = async () => {
  // 清空錯誤
  errorMessage.all.length = 0
  // 驗證格式
  if (isNotEmpty(loginValue.email)) {
    errorMessage.all.push(`信箱 ${isNotEmpty(loginValue.email)}`)
  }
  if (isNotEmpty(loginValue.password)) {
    errorMessage.all.push(`密碼 ${isNotEmpty(loginValue.password)}`)
  }
  if (isValidEmail(loginValue.email)) {
    errorMessage.all.push(isValidEmail(loginValue.email))
  }
  if (isValidPassword(loginValue.password)) {
    errorMessage.all.push(isValidPassword(loginValue.password))
  }
  if (errorMessage.all.length) {
    openAlert('error', ...errorMessage.all)
    return
  }

  openLoading('登入中')
  const { data } = await postLogin(loginValue)
  if (data.status === true) {
    setAuth({
      token: data.data.token
    })
    const { data: userData } = await getUserInfo(data.data.user._id)
    if (userData.status === true) {
      patchUser({
        user_id: userData.data._id,
        name: userData.data.name,
        avatar: userData.data.avatar
      })
      router.push('/')
      // 清空錯誤
      errorMessage.all.length = 0
    }
    closeLoading()
    openAlert('success', '登入成功！')
  } else {
    closeLoading()
    openAlert('error', '登入失敗，請洽管理員')
    errorMessage.all.push(data.message)
  }
}

// 註冊
const registerValue = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const signUpEvent = async () => {
  // 清空錯誤
  errorMessage.all.length = 0
  // 驗證格式
  if (isNotEmpty(registerValue.name)) {
    errorMessage.all.push(`名字 ${isNotEmpty(registerValue.name)}`)
  }
  if (isNotEmpty(registerValue.email)) {
    errorMessage.all.push(`信箱 ${isNotEmpty(registerValue.email)}`)
  }
  if (isNotEmpty(registerValue.password)) {
    errorMessage.all.push(`密碼 ${isNotEmpty(registerValue.password)}`)
  }
  if (isValidEmail(registerValue.email)) {
    errorMessage.all.push(isValidEmail(registerValue.email))
  }
  if (isValidPassword(registerValue.password)) {
    errorMessage.all.push(isValidPassword(registerValue.password))
  }
  if (isSamePassword(registerValue.password, registerValue.confirmPassword)) {
    errorMessage.all.push(isSamePassword(registerValue.password, registerValue.confirmPassword))
  }
  if (errorMessage.all.length) {
    openAlert('error', ...errorMessage.all)
    return
  }

  openLoading('註冊中')
  const { data } = await postSignUp(registerValue)
  if (data.status === true) {
    closeLoading()
    openAlert('success', '註冊成功！')
    loginValue.email = registerValue.email
    loginValue.password = registerValue.password
    loginEvent()
  } else {
    closeLoading()
    openAlert('error', '註冊失敗，請洽管理員')
    errorMessage.all.push(data.message)
  }
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
const slideUpdate = () => {
  setTimeout(() => {
    mySwiper.value.update()
  }, 100)
}

watch(errorMessage, () => {
  slideUpdate()
})

onMounted(() => {
  const body = document.querySelector('body')
  body.classList.remove('dark-theme')
  body.classList.add('light-theme')
  drawSpace()
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
canvas {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 0;
}
.auth-base {
  width: 100%;
  position: relative;
  z-index: 1;
  .container-box {
    width: 100%;
  }
  > .container-box .container {
    width: 100%;
    max-width: 870px;
    margin: 0 auto;
    padding: 60px 0;
    border: 2px solid $c-black;
    box-shadow: 0px 0px 20px #fff;
    position: relative;
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      background-color: rgba($c-gray-1, .8);
      backdrop-filter: blur(3px);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
    }
  }
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 25px 50px;
  }
  .slide-inner {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content-box {
    width: 100%;
    position: relative;
  }
  h2 {
    font-size: px(20);
    font-weight: $regular;
    line-height: 1.4;
    letter-spacing: 1px;
    color: $c-black;
    margin: 12px 0 25px;
  }
  .input-group input:not(:first-child),
  button:not(:first-child) {
    margin-top: 12px;
  }
  .button-group {
    margin-top: 65px;
  }

  @include pad {
    .container-box {
      padding: 60px 20px;
    }
    > .container-box .container {
      max-width: 600px;
      padding: 20px 0;
    }
    h2 {
      font-size: px(18);
    }
    .swiper-slide {
      padding: 20px;
    }
  }
}
</style>
