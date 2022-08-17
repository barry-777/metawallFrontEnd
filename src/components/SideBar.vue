<template>
  <aside class="side-bar">
    <div class="container">
      <button
        class="base-button blue"
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
          <router-link to="/user/more">
            <div>
              <i class="fa-solid fa-user" />
            </div>
            <p>尋找使用者</p>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>

  <aside class="mobile-bar">
    <ul>
      <li>
        <router-link to="/">
          <i class="fa-solid fa-house" />
          <p>首頁</p>
        </router-link>
      </li>
      <li>
        <router-link to="/search">
          <i class="fa-solid fa-magnifying-glass" />
          <p>搜尋</p>
        </router-link>
      </li>
      <li class="add">
        <a
          href="javascript:;"
          @click.prevent="openPostUploadBox(true)"
        >
          <i class="fa-solid fa-circle-plus" />
        </a>
      </li>
      <li>
        <router-link :to="`/user/likes/${userStore.user_id}`">
          <i class="fa-solid fa-heart" />
          <p>收藏</p>
        </router-link>
      </li>
      <li>
        <router-link :to="`/user/info/${userStore.user_id}`">
          <i class="fa-solid fa-user" />
          <p>個人</p>
        </router-link>
      </li>
    </ul>
  </aside>

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
  border-bottom: 4px solid $c-black;
  border-radius: 8px 8px 15px 15px;
  background-color: $c-white;
  position: sticky;
  top: 40px;
  margin-right: 30px;
  > .container {
    width: 100%;
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
      &:hover {
        p {
          color: $c-first;
        }
      }
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
  @include pad {
    display: none;
  }
}
.mobile-bar {
  display: none;
  width: 100vw;
  border: 2px solid $c-black;
  border-radius: 15px 15px 0 0;
  background-color: $c-white;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 20;
  overflow: hidden;
  ul {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  li {
    width: 100%;
    a {
      width: 100%;
      height: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &.router-link-exact-active {
        background-color: $c-first;
        color: $c-white;
      }
    }
    i {
      font-size: px(20);
    }
    p {
      font-size: px(12);
      margin-top: 10px;
    }
    &.add {
      a {
        animation: move 1.5s infinite alternate-reverse ease;
      }
      i {
        font-size: px(30);
      }
    }
  }
  @keyframes move {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-5px);
    }
  }
  @include pad {
    display: block;
  }
  @include mobile {
    li{
      i {
        font-size: px(18);
      }
    }
  }
  @include mobileS {
    li{
      p {
        display: none;
      }
    }
  }
}
.user-photo-outer {
  margin: 0 !important;
}
</style>
