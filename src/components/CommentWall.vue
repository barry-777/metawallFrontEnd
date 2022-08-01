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

defineProps({
  comments: Array
})
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
.other-comment-input {
  width: 100%;
  display: flex;
  align-items: stretch;
  padding-left: 15px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 10;
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
.other-comment {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 10px;
  button {
    font-size: px(14);
    font-weight: $medium;
    color: $c-gray-6;
    user-select: none;
    cursor: pointer;
  }
}
</style>
