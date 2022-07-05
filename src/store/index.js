import { defineStore } from 'pinia'

export default defineStore('commonStore', {
  // data
  state: () => ({
    token: null,
    isLogin: false,
    isLoading: false
  }),
  // computed
  getters: {},
  // methods
  actions: {}
})
