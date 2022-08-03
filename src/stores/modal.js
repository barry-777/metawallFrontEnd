import { setTimeout } from 'core-js'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modalStore', {
  // data
  state: () => ({
    showLoading: false,
    showLoadingText: '載入中',
    showAlert: false,
    showAlertText: [],
    showAlertCls: '',
    showImagesBox: false,
    showPostUploadBox: false,
    showCommentEditorBox: false,
    showCommentEditorType: '',
    showCommentEditorTemp: {}
  }),
  // methods
  actions: {
    lockScroll () {
      const body = document.querySelector('body')
      body.style.overflow = 'hidden'
    },
    unLockScroll () {
      const body = document.querySelector('body')
      body.style.removeProperty('overflow')
    },
    openLoading (text) {
      if (text) this.showLoadingText = text
      this.showLoading = true
    },
    closeLoading () {
      this.showLoadingText = '載入中'
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
    },
    openImagesBox (control) {
      if (control) {
        this.lockScroll()
        this.showImagesBox = true
      } else {
        this.unLockScroll()
        this.showImagesBox = false
      }
    },
    openPostUploadBox (control) {
      if (control) {
        this.lockScroll()
        this.showPostUploadBox = true
      } else {
        this.unLockScroll()
        this.showPostUploadBox = false
      }
    },
    openCommentEditorBox (control, type, data) {
      // type: patchComment, postReply, patchReply
      if (control) {
        this.lockScroll()
        this.showCommentEditorType = type
        this.showCommentEditorBox = true
        if (data) this.showCommentEditorTemp = data
      } else {
        this.unLockScroll()
        this.showCommentEditorBox = false
        this.showCommentEditorType = ''
        this.showCommentEditorTemp = {}
      }
    }
  }
})
