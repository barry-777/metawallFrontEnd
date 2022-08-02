<template>
  <div class="posts-outer">
    <div class="posts">
      <template v-if="posts.length">
        <PostItem
          v-for="post in posts"
          :key="post._id"
          :post="post"
          @images-value="imagesBoxHandler"
        />
      </template>
      <template v-else>
        <PostItem
          :post="{}"
        />
      </template>
    </div>
    <div
      ref="loadDetector"
      class="loading-detector"
    />
  </div>
  <Transition name="fade-model">
    <ImagesBox
      v-if="showImagesBox"
      :images="emitImages"
    />
  </Transition>
  <Transition name="fade-model">
    <CommentEditorBox
      v-if="showCommentEditorBox"
    />
  </Transition>
</template>

<script setup>
import PostItem from '@/components/PostItem.vue'
import ImagesBox from '@/components/ImagesBox.vue'
import CommentEditorBox from '@/components/CommentEditorBox.vue'
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { getPostsByRoute } from '@/fetch/fetch'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const postStore = usePostStore()
const { openAlert, openLoading, closeLoading, openImagesBox } = modalStore
const { patchPosts, patchQuery, addPosts, resetPosts, resetTempPostData } = postStore
const { showImagesBox, showCommentEditorBox } = storeToRefs(modalStore)
const { posts, postQuery } = storeToRefs(postStore)

const postPage = ref(1)
const isLoaded = ref(false)
const loadDetector = ref(null)
const isStopScroll = ref(false)

// 取得所有貼文
const getPosts = async () => {
  openLoading('取得貼文中')
  isStopScroll.value = true
  if (posts.value?.length) postPage.value += 1
  await patchQuery([route.query, { p: postPage.value }])
  const { data } = await getPostsByRoute(postQuery.value)

  // 判斷是否已經載入完全部貼文
  if (data.data?.length === 0) {
    isLoaded.value = true
    isStopScroll.value = true
    postPage.value -= 1
    closeLoading()
    openAlert('success', '已查看所有貼文')
    return false
  }

  // 判斷是否已抓取過資料
  if (posts.value?.length) {
    await addPosts(data.data)
    isStopScroll.value = false
  } else {
    await patchPosts(data.data)
    isStopScroll.value = false
  }

  closeLoading()
}
resetPosts()
getPosts()

// 載入更多
const scrollLoading = async () => {
  if (isStopScroll.value) return
  const { top } = loadDetector.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  if (!isStopScroll.value && top < windowHeight && !isLoaded.value) {
    await getPosts()
  }
}

onMounted(() => {
  window.addEventListener('scroll', scrollLoading)
  // 重置編輯暫存
  resetTempPostData()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollLoading)
  postPage.value = 1
  isLoaded.value = false
  isStopScroll.value = false
})

// 開啟更多照片燈箱
const emitImages = ref(null)
const imagesBoxHandler = (value) => {
  emitImages.value = value
  openImagesBox(true)
}
</script>

<style scoped lang="scss">
.posts {
  width: 100%;
}
</style>
