<template>
  <div class="posts">
    <template v-if="posts.length">
      <PostItem
        v-for="post in posts"
        :key="post._id"
        :post="post"
        @images-value="imagesBoxHandle"
      />
    </template>
    <template v-else>
      <PostItem
        :post="{}"
      />
    </template>
  </div>
  <Transition name="fade-model">
    <ImagesBox
      v-if="showImagesBox"
      :images="emitImages"
    />
  </Transition>
</template>

<script setup>
import PostItem from '@/components/PostItem.vue'
import ImagesBox from '@/components/ImagesBox.vue'
import { ref } from 'vue'
import { getPostsByRoute } from '@/fetch/fetch'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'

const route = useRoute()
const modalStore = useModalStore()
const postStore = usePostStore()
const { openLoading, closeLoading, controlImagesBox } = modalStore
const { updatePosts, updateQuery } = postStore
const { showImagesBox } = storeToRefs(modalStore)
const { posts, postQuery } = storeToRefs(postStore)

// 取得所有貼文
const getPosts = async () => {
  openLoading()
  await updateQuery(route.query)
  const results = await getPostsByRoute(postQuery.value)
  await updatePosts(results.data.data)
  closeLoading()
}
getPosts()

// 開啟更多照片燈箱
const emitImages = ref(null)
const imagesBoxHandle = (value) => {
  emitImages.value = value
  controlImagesBox(true)
}
</script>

<style scoped lang="scss">
.posts {
  width: 100%;
}
</style>
