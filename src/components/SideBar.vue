<template>
  <section class="side-bar">
    <div class="container">
      <button
        class="base-button"
        type="button"
        @click="openPostUploadBox(true)"
      >
        新增動態
      </button>
      <ul>
        <li>
          <router-link :to="`/user/info/${userStore.user_id}`">
            <div>
              <div class="user-photo-outer">
                <UserPhoto :photo="userStore.avatar" />
              </div>
            </div>
            <p v-if="userStore.name">
              {{ userStore.name }}
            </p>
            <p v-else>
              使用者名稱
            </p>
          </router-link>
        </li>
        <li>
          <router-link :to="`/user/likes/${userStore.user_id}`">
            <div>
              <i class="fa-solid fa-heart" />
            </div>
            <p>我收藏的貼文</p>
          </router-link>
        </li>
        <li>
          <router-link :to="`/user/comments/${userStore.user_id}`">
            <div>
              <i class="fa-solid fa-comment" />
            </div>
            <p>我留言的貼文</p>
          </router-link>
        </li>
        <li>
          <router-link :to="`/user/more`">
            <div>
              <i class="fa-solid fa-user" />
            </div>
            <p>尋找更多使用者</p>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
  <Transition name="fade-model">
    <PostUploadBox
      v-if="showPostUploadBox"
    />
  </transition>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import PostUploadBox from '@/components/box/PostUploadBox.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'

const userStore = useUserStore()
const modalStore = useModalStore()
const { showPostUploadBox } = storeToRefs(modalStore)
const { openPostUploadBox } = modalStore
</script>

<style scoped lang="scss">
@import '../assets/scss/base/variables';
@import '../assets/scss/base/mixins';
.side-bar {
  width: 100%;
  max-width: 300px;
  padding: 30px 20px 20px 20px;
  border: 2px solid $c-black;
  background-color: $c-white;
  position: sticky;
  top: 30px;
  > .container {
    width: 100%;
  }
  a {
    display: block;
  }
  li {
    width: 100%;
    &:first-child {
      margin: 25px 0 15px;
    }
    &:not(:first-child) {
      margin: 15px 0;
    }
    a {
      width: 100%;
      display: flex;
      align-items: center;
    }
    div {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: 50%;
      border: 2px solid $c-black;
      overflow: hidden;
      margin-right: 15px;
      background-color: $c-second;
    }
    i {
      font-size: px(20);
    }
  }
}
.user-photo-outer {
  margin: 0 !important;
}
</style>
