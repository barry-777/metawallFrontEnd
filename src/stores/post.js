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
      s: 'new',
      p: 1
    },
    tempPostData: {}
  }),
  // methods
  actions: {
    async patchQuery (data) {
      // 傳入陣列
      Object.assign(this.postQuery, ...data)
    },
    async addPosts (data) {
      // 傳入陣列
      this.posts.push(...data)
    },
    async patchPosts (data) {
      this.posts.length = 0
      Object.assign(this.posts, data)
    },
    async patchPost (data) {
      const index = this.posts.findIndex(post => post._id === data._id)
      Object.assign(this.posts[index], data)
    },
    async resetPosts () {
      this.posts.length = 0
    },
    // 更新編輯貼文資料
    async patchTempPostData (data) {
      Object.assign(this.tempPostData, data)
    },
    // 重設編輯貼文資料
    async resetTempPostData () {
      this.tempPostData = {}
    },
    // 新增留言
    async addCommentData (post_id, data) {
      const index = this.posts.findIndex(post => post._id === post_id)
      this.posts[index].comments.unshift(data)
    },
    // 編輯留言
    async patchCommentData (comment_id, post_id, data) {
      const postIndex = this.posts.findIndex(post => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex(comment => comment._id === comment_id)
      this.posts[postIndex].comments.splice(commentIndex, 1, data)
    },
    // 刪除留言
    async deleteCommentData (comment_id, post_id) {
      const postIndex = this.posts.findIndex(post => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex(comment => comment._id === comment_id)
      this.posts[postIndex].comments.splice(commentIndex, 1)
    },
    // 回覆留言
    async addReplyData (comment_id, post_id, data) {
      const postIndex = this.posts.findIndex(post => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex(comment => comment._id === comment_id)
      this.posts[postIndex].comments[commentIndex].commentReplies.unshift(data)
    },
    // 編輯回覆留言
    async patchReplyData (reply_id, comment_id, post_id, data) {
      const postIndex = this.posts.findIndex(post => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex(comment => comment._id === comment_id)
      const replyIndex = this.posts[postIndex].comments[commentIndex].commentReplies.findIndex(reply => reply._id === reply_id)
      this.posts[postIndex].comments[commentIndex].commentReplies.splice(replyIndex, 1, data)
    },
    // 刪除回覆留言
    async deleteReplyData (reply_id, comment_id, post_id) {
      const postIndex = this.posts.findIndex(post => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex(comment => comment._id === comment_id)
      const replyIndex = this.posts[postIndex].comments[commentIndex].commentReplies.findIndex(reply => reply._id === reply_id)
      this.posts[postIndex].comments[commentIndex].commentReplies.splice(replyIndex, 1)
    },
    // 新增／移除 收藏
    async patchPostLikesData (post_id, data) {
      const postIndex = this.posts.findIndex(post => post._id === post_id)
      this.posts[postIndex].likes = data.likes
    }
  }
})
