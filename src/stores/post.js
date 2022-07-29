import { defineStore } from 'pinia'
// import { useUserStore } from './userStore'

// const userStore = useUserStore()

export const usePostStore = defineStore('postStore', {
  // data
  state: () => ({
    id: 'post',
    posts: [],
    // q => 搜尋項目
    // s => 資料排序
    postQuery: {
      q: '',
      s: 'new'
    },
    patchData: {}
  }),
  // methods
  actions: {
    async updateQuery (data) {
      // 傳入陣列
      Object.assign(this.postQuery, ...data)
    },
    async pushPosts (data) {
      // 傳入陣列
      this.posts.push(...data)
    },
    async updatePosts (data) {
      this.posts.length = 0
      Object.assign(this.posts, data)
    },
    // 更新編輯貼文資料
    async updatePatchData (data) {
      Object.assign(this.patchData, data)
    },
    // 重設編輯貼文資料
    async resetPatchData () {
      this.patchData = {}
    }
  },
  persist: {
    key: 'post-temp',
    storage: window.localStorage,
    paths: ['patchData']
  }
})
