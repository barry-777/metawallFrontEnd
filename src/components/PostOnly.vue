<template>
  <div class="post-only">
    <div class="tool">
      <a
        class="back"
        @click.prevent="router.back()"
      >
        <i class="fa-solid fa-circle-arrow-left" />
      </a>
    </div>
    <template v-if="posts?.length">
      <PostItem
        v-for="post in posts"
        :key="post._id"
        :post="post"
      />
    </template>
    <template v-else>
      <PostItem
        :post="{}"
      />
    </template>
  </div>
  <Transition name="fade">
    <ImagesBox
      v-if="showImagesBox"
    />
  </Transition>
  <Transition name="fade-model">
    <PostLikesBox
      v-if="showPostLikesBox"
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
import PostLikesBox from '@/components/PostLikesBox.vue'
import CommentEditorBox from '@/components/CommentEditorBox.vue'
import { onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { getPostOnly } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const postStore = usePostStore()
const { showImagesBox, showPostLikesBox, showCommentEditorBox } = storeToRefs(modalStore)
const { posts } = storeToRefs(postStore)
const { openLoading, closeLoading } = modalStore
const { resetPosts } = postStore

const getPostHandler = async (post_id) => {
  openLoading()
  const { data } = await getPostOnly(post_id)
  if (!data.data) router.push('/notfound')
  posts.value.push(...data.data)
  closeLoading()
}

getPostHandler(route.params.post_id)

watch(() => route.params.post_id, () => {
  const rule = router.currentRoute.value.fullPath.startsWith('/post/')
  if (!rule) return false
  getPostHandler(route.params.post_id)
})

onBeforeUnmount(() => {
  resetPosts()
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.tool {
  width: 100%;
  margin-bottom: 20px;
  .back {
    font-size: px(24);
    cursor: pointer;
    user-select: none;
  }
}
</style>
