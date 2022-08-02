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
    },
    // 新增留言
    async addCommentData (post_id, data) {
      const index = this.posts.findIndex(post => post._id === post_id)
      this.posts[index].comments.unshift(data)
    },
    // 編輯留言
    async updateCommentData (comment_id, post_id, data) {
      const postIndex = this.posts.findIndex(post => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex(comment => comment._id === comment_id)
      this.posts[postIndex].comments.splice(commentIndex, 1, data)
    },
    // 刪除留言
    async deleteCommentData (comment_id, post_id) {
      const postIndex = this.posts.findIndex(post => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex(comment => comment._id === comment_id)
      this.posts[postIndex].comments.splice(commentIndex, 1)
    }
  },
  persist: {
    key: 'post-temp',
    storage: window.localStorage,
    paths: ['patchData']
  }
})
