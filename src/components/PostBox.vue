<template>
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
import ImagesBox from '@/components/ImagesBox.vue'
import PostLikesBox from '@/components/PostLikesBox.vue'
import CommentEditorBox from '@/components/CommentEditorBox.vue'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
const { showImagesBox, showPostLikesBox, showCommentEditorBox } = storeToRefs(modalStore)
</script>
