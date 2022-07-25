<template>
  <div class="posts">
    <template v-if="!posts.length">
      <div class="post only">
        <div class="top-bar">
          <div />
          <div />
          <div />
        </div>
        <div class="content">
          <div class="no-t">
            目前尚無貼文，新增一則貼文吧！
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="post in posts"
        :key="post._id"
        class="post"
      >
        <div class="content">
          <div class="top">
            <div class="user-photo-outer">
              <UserPhoto :photo="post.user.avatar" />
            </div>
            <div class="user-name">
              <p>{{ post.user.name }}</p>
              <p>{{ dateFormat(post.createdAt) }}</p>
            </div>
          </div>
          <div class="middle">
            <div class="inner-t">
              {{ post.content }}
            </div>
            <div
              v-if="post.images.length"
              class="inner-photo"
            >
              <img
                :src="post.images[0]"
                alt=""
              >
              <div
                v-if="post.images.length > 1"
                @click="imagesBoxHandle(post.images)"
              >
                <i class="fa-regular fa-square-plus" />
                <p>MORE</p>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="tool">
              <!-- 讚 -->
              <div>
                <i class="fa-regular fa-thumbs-up" />
                <p>100</p>
              </div>
              <!-- 留言 -->
              <div>
                <div class="user-photo-outer">
                  <UserPhoto :photo="userStore.avatar" />
                </div>
                <div class="input-outer">
                  <input
                    type="text"
                    placeholder="留言 ..."
                  >
                  <button type="button">
                    留言
                  </button>
                </div>
              </div>
            </div>
            <!-- 留言牆 -->
            <div
              v-if="post.comments"
              class="comments"
            >
              <ul>
                <li
                  v-for="comment in post.comments"
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
                        {{ comment.content }}
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
                          {{ commonReply.content }}
                        </div>
                      </div>
                    </div>
                  </template>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <Transition name="fade-model">
    <ImagesBox
      v-if="showImagesBox"
      :images="imagesBoxValue"
    />
  </Transition>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import ImagesBox from '@/components/ImagesBox.vue'
import { ref } from 'vue'
import { getPostsByRoute } from '@/fetch/fetch'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { dateFormat } from '@/services/helper'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useModalStore } from '@/stores/modal'

const route = useRoute()
// store 資料
const userStore = useUserStore()
const postStore = usePostStore()
const modalStore = useModalStore()
const { openLoading, closeLoading, controlImagesBox } = modalStore
const { showImagesBox } = storeToRefs(modalStore)
const { posts, postSort } = storeToRefs(postStore)

// 取得所有貼文
const getPosts = async () => {
  openLoading()
  const newSort = Object.assign({}, postSort.value, route.query)
  const results = await getPostsByRoute(newSort)
  posts.value = results.data.data
  closeLoading()
}
getPosts()

// 多張照片燈箱
const imagesBoxValue = ref({})
const imagesBoxHandle = (value) => {
  imagesBoxValue.value = value
  controlImagesBox(true)
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.posts {
  width: 100%;
}
.post {
  width: 100%;
  background-color: $c-white;
  border-radius: 8px;
  border: 2px solid $c-black;
  border-bottom: 4px solid $c-black;
  box-shadow: 0 3px 5px rgba($c-black, 0.3);
  padding: 25px 22px;
  &:not(:first-child) {
    margin-top: 25px;
  }
}
.content {
  width: 100%;
  min-height: 100px;
}
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
.top {
  display: flex;
  align-items: flex-start;
  p:nth-child(1) {
    font-size: px(14);
    font-weight: $medium;
    margin-top: 5px;
  }
  p:nth-child(2) {
    font-size: px(12);
    color: $c-gray-4;
    margin-top: 5px;
  }
}
.middle {
  width: 100%;
  margin-top: 15px;
}
.inner-t {
  font-size: px(14);
  line-height: 1.4;
  letter-spacing: 1.2px;
}
.inner-photo {
  display: flex;
  align-items: stretch;
  margin-top: 10px;
  > img {
    width: calc(100% - 160px);
    border-radius: 10px;
    border: 2px solid $c-black;
  }
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-shrink: 0;
    width: 150px;
    padding: 15px;
    margin-left: 10px;
    border-radius: 10px;
    color: $c-white;
    background-color: rgba($c-black, 0.5);
    backdrop-filter: blur(3px);
    user-select: none;
    cursor: pointer;
    transition: 0.6s;
    &:hover {
      background-color: rgba($c-black, 0.6);
    }
    i {
      font-size: px(20);
    }
    p {
      font-size: px(14);
      font-weight: $medium;
      letter-spacing: 1.2px;
      margin-top: 5px;
    }
  }
}
.bottom {
  width: 100%;
}
.tool {
  width: 100%;
  margin-top: 25px;
  padding-left: 15px;
}
.tool > div:nth-child(1) {
  display: inline-flex;
  align-content: center;
  user-select: none;
  cursor: pointer;
  i {
    font-size: px(25);
    color: $c-first;
  }
  p {
    font-weight: $medium;
    margin-top: 5px;
    margin-left: 7px;
  }
}
.tool > div:nth-child(2) {
  width: 100%;
  display: flex;
  align-items: stretch;
  margin-top: 20px;
}
.input-outer {
  width: 100%;
  display: flex;
  button {
    width: 150px;
    height: 100%;
    font-size: px(18);
    font-weight: $medium;
    background-color: $c-first;
    color: $c-white;
    padding: 10px;
    border: 2px solid $c-black;
    border-left: none;
    user-select: none;
    transition: background-color 0.6s, color 0.2s, transform 0.4s;
    cursor: pointer;
    &:hover {
      background-color: darken($c-first, 8%);
    }
  }
}
.comments {
  width: 100%;
  padding-left: 40px;
  margin-top: 25px;
  position: relative;
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
}
// 無貼文樣式
.post.only {
  padding: 0;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .top-bar {
    display: flex;
    align-content: center;
  }
  .no-t {
    display: flex;
    align-content: center;
    justify-content: center;
  }
}
.top-bar {
  display: none;
  width: 100%;
  padding: 15px;
  border-bottom: 2px solid $c-black;
  padding: 12px 15px;
  > div {
    width: 8px;
    height: 8px;
    margin: 3px;
    border-radius: 50%;
    border: 1px solid $c-gray-4;
  }
  > div:nth-child(1) {
    background-color: $c-red;
  }
  > div:nth-child(2) {
    background-color: $c-yellow;
  }
  > div:nth-child(3) {
    background-color: $c-green;
  }
}
.no-t {
  display: none;
  width: 100%;
  height: 100%;
  color: $c-gray-4;
}
</style>
