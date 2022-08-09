<template>
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
              <div class="left-box">
                <img
                  src="@img/login_img.svg"
                  alt=""
                >
              </div>
              <div class="right-box">
                <h1>MetaWall</h1>
                <h2>從元宇宙展開全新社交圈</h2>
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
                    class="base-button"
                    type="button"
                    @click="loginEvent"
                  >
                    登入
                  </button>
                  <button
                    class="base-button simple"
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
              <div class="left-box">
                <img
                  src="@img/register_img.svg"
                  alt=""
                >
              </div>
              <div class="right-box">
                <h1>MetaWall</h1>
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
                    placeholder="confirmPassword"
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
                    class="base-button"
                    type="button"
                    @click="signUpEvent"
                  >
                    註冊
                  </button>
                  <button
                    class="base-button simple"
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
import { reactive, ref, watch } from 'vue'
import router from '@/router/index'
import { postLogin, postSignUp, getUserInfo } from '@/fetch/fetch'
import { isNotEmpty, isValidEmail, isValidPassword, isSamePassword } from '@/services/validate'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'

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
      router.push('/posts')
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
    slideToTarget(0)
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
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.auth-base {
  width: 100%;
  .container-box {
    background-color: $c-gray-6;
  }
  > .container-box .container {
    width: 100%;
    max-width: 870px;
    margin: 0 auto;
    padding: 70px 0;
    border: 2px solid $c-black;
    background-color: $c-gray-1;
    box-shadow: 0px 5px 10px 8px $c-white;
  }
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px;
  }
  .slide-inner {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left-box {
    width: 45%;
    margin-right: 60px;
  }
  .right-box {
    width: 55%;
    max-width: 370px;
    position: relative;
  }
  h1 {
    font-size: 50px;
    font-weight: $regular;
    font-family: 'Paytone One', sans-serif;
    letter-spacing: 0.8px;
    color: $c-first;
  }
  h2 {
    font-size: px(20);
    font-weight: $regular;
    line-height: 1.4;
    letter-spacing: 1px;
    color: $c-black;
    margin: 8px 0 20px;
  }
  .err-t {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 15px;
    margin-bottom: -20px;

    p {
      margin: 3px;
      color: $c-error;
      &:not(:first-child)::before {
        content: ', ';
      }
    }
  }
  .input-group input:not(:first-child),
  button:not(:first-child) {
    margin-top: 12px;
  }
  .button-group {
    margin-top: 65px;
  }

  @include pad {
    .container {
      padding: 50px 5vw;
    }
  }
}
</style>
