<template>
  <div
    v-if="comments"
    class="comments"
  >
    <ul>
      <li
        v-for="comment in comments"
        :key="comment._id"
      >
        <div class="div-wrap">
          <div class="user-photo-outer">
            <UserPhoto :photo="comment.user.avatar" />
          </div>
          <div class="comment-outer">
            <div class="name">
              {{ comment.user.name }}
            </div>
            <div class="date">
              {{ dateFormat(comment.createdAt) }}
            </div>
            <div class="comment">
              <!-- eslint-disable vue/no-v-html -->
              <div v-html="comment.content" />
              <!--eslint-enable-->
            </div>
            <div
              v-if="comment.user._id === userStore.user_id"
              class="control-panel"
            >
              <button
                type="button"
                @click="openCommentEditorBox(true, 'postReply', comment)"
              >
                回覆
              </button>
              <button
                type="button"
                @click="openCommentEditorBox(true, 'patchComment', comment)"
              >
                編輯
              </button>
              <button
                type="button"
                @click="deleteCommentHandler(comment._id, comment.post)"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
        <template v-if="comment.commentReplies">
          <div
            v-for="commonReply in comment.commentReplies"
            :key="commonReply._id"
            class="div-wrap2"
          >
            <div class="user-photo-outer">
              <UserPhoto :photo="commonReply.user.avatar" />
            </div>
            <div class="comment-outer">
              <div class="name">
                {{ commonReply.user.name }}
              </div>
              <div class="date">
                {{ dateFormat(commonReply.createdAt) }}
              </div>
              <div class="comment">
                <!-- eslint-disable vue/no-v-html -->
                <div v-html="commonReply.content" />
                <!--eslint-enable-->
              </div>
              <div
                v-if="commonReply.user._id === userStore.user_id"
                class="control-panel"
              >
                <button type="button">
                  編輯
                </button>
                <button type="button">
                  刪除
                </button>
              </div>
            </div>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { dateFormat } from '@/services/helper'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useModalStore } from '@/stores/modal'
import { deleteOneComment } from '@/fetch/fetch'

const userStore = useUserStore()
const postStore = usePostStore()
const modalStore = useModalStore()
const { deleteCommentData } = postStore
const { openLoading, closeLoading, openAlert, openCommentEditorBox } = modalStore

defineProps({
  comments: Array
})

// 刪除留言
const deleteCommentHandler = async (comment_id, post_id) => {
  openLoading('刪除留言中')
  await deleteOneComment(comment_id)
  await deleteCommentData(comment_id, post_id)
  closeLoading()
  openAlert('success', '刪除留言成功！')
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.user-photo-outer {
  width: 45px;
  height: 45px;
  margin-right: 12px;
  flex-shrink: 0;
  position: relative;
  border: 2px solid $c-black;
  border-radius: 50%;
  overflow: hidden;
}
.comments {
  width: 100%;
  padding-left: 40px;
  margin-top: 25px;
  position: relative;
}
ul {
  width: 100%;
}
li {
  width: 100%;
  padding: 15px;
  background-color: $c-gray-1;
  border-radius: 10px;
  &:not(:first-child) {
    margin-top: 15px;
  }
}
.div-wrap {
  width: 100%;
  display: flex;
  align-items: flex-start;
}
.div-wrap2 {
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding-top: 20px;
  padding-left: 50px;
}
.comment-outer {
  width: 100%;
}
.name {
  font-size: px(14);
  font-weight: $medium;
}
.date {
  font-size: px(12);
  color: $c-gray-4;
  margin-top: 8px;
}
.comment {
  font-size: px(14);
  margin-top: 12px;
  line-height: 1.4;
  letter-spacing: 1.2px;
}
.control-panel {
  width: 100%;
  display: flex;
  margin-top: 25px;
  button {
    font-weight: $medium;
    color: $c-gray-4;
    user-select: none;
    cursor: pointer;
    &:not(:first-child) {
      margin-left: 8px;
    }
  }
}
</style>
