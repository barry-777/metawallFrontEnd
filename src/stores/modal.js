import { setTimeout } from 'core-js'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modalStore', {
  // data
  state: () => ({
    showLoading: false,
    showAlert: false,
    showAlertText: [],
    showAlertCls: ''
  }),
  // methods
  actions: {
    openLoading () {
      this.showLoading = true
    },
    closeLoading () {
      this.showLoading = false
    },
    openAlert (cls, ...info) {
      if (this.showAlert) return
      this.showAlert = true
      this.showAlertCls = cls
      info.forEach(t => {
        this.showAlertText.push(t)
      })
      setTimeout(() => {
        this.showAlert = false
        this.showAlertCls = ''
        this.showAlertText = []
      }, 2000)
    }
  }
})
