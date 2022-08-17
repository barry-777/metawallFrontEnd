<template>
  <div class="main-header">
    <div class="container">
      <div class="logo main-title small">
        <router-link to="/">
          MetaWall
        </router-link>
      </div>
      <div class="other">
        <div class="quick">
          <router-link to="/">
            首頁
          </router-link>
          <router-link to="/search">
            搜尋
          </router-link>
          <router-link :to="`/user/info/${userStore.user_id}`">
            個人資料
          </router-link>
        </div>
        <div
          class="bars"
          @click="barSwitch(true)"
        >
          <i class="fa-solid fa-bars" />
        </div>
      </div>
    </div>
  </div>
  <div
    class="bars-content"
    :class="{'active': barShow}"
  >
    <div class="bars-inner">
      <div>
        <div
          class="close-button"
          @click="barSwitch(false)"
        >
          <i class="fa-solid fa-xmark" />
        </div>
        <div class="user-photo-outer">
          <UserPhoto :photo="avatar" />
        </div>
        <div class="name">
          {{ name }}
        </div>
        <ul @click="barSwitch(false)">
          <li>
            <router-link :to="`/user/info/${userStore.user_id}`">
              個人資料
            </router-link>
          </li>
          <li>
            <router-link to="/user/update">
              編輯個人資料
            </router-link>
          </li>
          <li>
            <router-link
              to="/"
              @click="logoutAuth"
            >
              登出 MetaWall
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'

const userStore = useUserStore()
const modalStore = useModalStore()
const { avatar, name } = storeToRefs(userStore)
const { logoutAuth } = userStore
const { lockScroll, unLockScroll } = modalStore

const barShow = ref(false)
const barSwitch = (type) => {
  if (type) {
    barShow.value = type
    lockScroll()
  } else {
    barShow.value = type
    unLockScroll()
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.main-header {
  width: 100vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 20;
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: rgba($c-white, .5);
    backdrop-filter: blur(3px);
    box-shadow: 0 2px 10px rgba($c-black, .25);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
}
.container {
  display: flex;
  justify-content: space-between;
  padding: 12px 50px;
  position: relative;
  z-index: 1;
}
.other {
  display: flex;
  align-items: center;
}
.quick {
  display: inline-flex;
  align-items: center;
  margin-right: 25px;
  a {
    display: inline-block;
    font-size: px(14);
    font-weight: $medium;
    margin-right: 12px;
    transition: .4s;
    &:hover {
      color: $c-first;
    }
    &:last-child {
      margin: 0;
    }
  }
}
.bars {
  i {
    font-size: px(25);
    flex-shrink: 0;
    user-select: none;
    position: relative;
    cursor: pointer;
    transition: .4s;
    &:hover {
      color: $c-first;
    }
  }
}
.bars-content {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 21;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
  &.active {
    opacity: 1;
    pointer-events: all;
    transition: opacity .4s;
    .bars-inner {
      opacity: 1;
      transform: translateX(0);
      transition: opacity .4s .2s, transform .4s .2s;
    }
  }
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, .4);
  }
  .bars-inner {
    width: 15vw;
    padding: 10vh 20px;
    background-color: rgba(255, 255, 255, .9);
    position: relative;
    z-index: 1;
    overflow-y: auto;
    opacity: 0;
    transform: translateX(100%);
    transition: opacity .2s, transform .2s;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
  .close-button {
    margin-bottom: 20px;
  }
  .user-photo-outer {
    width: 60px;
    height: 60px;
    margin: 0;
  }
  .name {
    font-size: px(20);
    font-weight: $medium;
    margin-top: 15px;
    margin-bottom: 50px;
    position: relative;
    &::after {
      content: '';
      width: 40px;
      height: 4px;
      background-color: $c-first;
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  ul {
    width: 100%;
    height: 100%;
  }
  a {
    display: block;
    font-size: px(16);
    text-align: center;
    padding: 10px 15px;
    margin: 0 auto;
    cursor: pointer;
    user-select: none;
    transition: .4s;
    &:hover {
      color: $c-first;
    }
  }
}
</style>
