import { defineStore } from 'pinia'

export const usePostStore = defineStore('postStore', {
  // data
  state: () => ({
    posts: [],
    // q => 搜尋項目
    // s => 資料排序
    postSort: {
      q: '',
      s: 'new'
    }
  }),
  // methods
  actions: {}
})
