import { defineStore } from 'pinia'
import router from '../router/index'
import axios from 'axios'
import { checkConsole } from '../services/helper'

export const useCommonStore = defineStore('commonStore', {
  // data
  state: () => ({
    token: null,
    isLoading: false,
    isLogin: false,
    errMsg: '',
    user_id: '',
    userInfo: {}
  }),
  // computed
  getters: {},
  // methods
  actions: {
    // 登入測試
    authTryLogin() {
      const token = localStorage.getItem('token')
      const user_id = localStorage.getItem('user_id')
      const tokenExpiration = localStorage.getItem('tokenExpiration')
      const expiresIn = +tokenExpiration - new Date().getTime()

      if (expiresIn < 0) {
        return (this.isLogin = false)
      }

      if (token && user_id) {
        this.isLogin = true
        return true
      }

      this.isLogin = false
    },
    // 設定登入訊息
    authSet(payload) {
      const expiresIn = 1000 * 3600 * 24
      const expirationDate = new Date().getTime() + expiresIn
      const { token, user } = payload

      localStorage.setItem('token', token)
      localStorage.setItem('user_id', user._id)
      localStorage.setItem('tokenExpiration', expirationDate)
    },
    // 註冊會員
    async authSignUp(payload) {
      try {
        this.errMsg = ''
        this.isLoading = true
        const api = `${import.meta.env.VITE_APP_API}/api/auth/signup`
        const { name, email, password, confirmPassword } = payload
        const res = await axios.post(api, { name, email, password, confirmPassword })
        const data = res.data.data
        this.isLoading = false
        checkConsole('註冊成功', data)
        return data
      } catch (err) {
        this.errMsg = err.response.data.message
        this.isLoading = false
        checkConsole('註冊失敗', err)
      }
    },
    // 登入會員
    async authLogin(payload) {
      try {
        this.errMsg = ''
        this.isLoading = true
        const api = `${import.meta.env.VITE_APP_API}/api/auth/login`
        const { email, password } = payload
        const res = await axios.post(api, { email, password })
        const data = res.data.data
        // 設定訊息
        this.authSet(data)
        this.isLoading = false
        this.isLogin = true
        router.push('/posts-wall')
        checkConsole('登入成功', data)
      } catch (err) {
        this.errMsg = err.response.data.message
        this.isLoading = false
        checkConsole('登入失敗', err)
      }
    },
    // 登出會員
    authLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('tokenExpiration')
      router.push('/auth')
    }
  }
})
