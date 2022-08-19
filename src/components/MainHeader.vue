<template>
  <div class="main-header">
    <div class="container">
      <div class="logo main-title small">
        <router-link to="/">
          {{ appTitle }}
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
            <router-link :to="`/user/likes/${userStore.user_id}`">
              我收藏的貼文
            </router-link>
          </li>
          <li>
            <router-link :to="`/user/comments/${userStore.user_id}`">
              我留言的貼文
            </router-link>
          </li>
          <li>
            <router-link to="/user/more">
              找朋友
            </router-link>
          </li>
          <li>
            <router-link
              to="/auth"
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
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'

const appTitle = ref(import.meta.env.VITE_APP_NAME)
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

onMounted(() => {
  const target = document.querySelector('.main-header')
  const scrollUp = 'scroll-up'
  const scrollDown = 'scroll-down'
  let lastScroll = 0

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset
    if (currentScroll <= 0) {
      target.classList.remove(scrollUp)
      return
    }
    if (currentScroll > lastScroll && !target.classList.contains(scrollDown)) {
      // down
      target.classList.remove(scrollUp)
      target.classList.add(scrollDown)
    } else if (
      currentScroll < lastScroll &&
      target.classList.contains(scrollDown)
    ) {
      // up
      target.classList.remove(scrollDown)
      target.classList.add(scrollUp)
    }
    lastScroll = currentScroll
  })
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  color: var(--dark);
  z-index: 20;
  transition: transform 0.4s;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--light);
    opacity: 0.5;
    z-index: 0;
    box-shadow: 0 2px 10px var(--dark2);
    backdrop-filter: blur(3px);
    content: '';
  }

  &.scroll-up {
    transform: translateY(0);
  }

  &.scroll-down {
    transform: translateY(-100%);
  }
}

.container {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 12px 50px;
  z-index: 1;

  @include pad {
    padding: 12px 25px;
  }
}

.other {
  display: flex;
  align-items: center;
}

.quick {
  display: inline-flex;
  align-items: center;
  margin-right: 25px;

  @include mobile {
    display: none;
  }

  a {
    display: inline-block;
    margin-right: 12px;
    font-size: px(14);
    font-weight: $medium;
    transition: 0.4s;

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
    position: relative;
    font-size: px(25);
    transition: 0.4s;
    cursor: pointer;
    flex-shrink: 0;
    user-select: none;

    &:hover {
      color: $c-first;
    }
  }
}

.bars-content {
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  z-index: 21;
  transition: opacity 0.2s;
  pointer-events: none;

  &.active {
    opacity: 1;
    pointer-events: all;
    transition: opacity 0.4s;

    .bars-inner {
      opacity: 1;
      transform: translateX(0);
      transition: opacity 0.4s 0.2s, transform 0.4s 0.2s;
    }
  }

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($c-black, 0.4);
    content: '';
  }

  .bars-inner {
    position: relative;
    overflow-y: auto;
    padding: 10vh 20px;
    width: 90%;
    max-width: 300px;
    color: var(--dark);
    background-color: var(--light2);
    opacity: 0;
    z-index: 1;
    transition: opacity 0.2s, transform 0.2s;
    transform: translateX(100%);

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }

  .close-button {
    margin-bottom: 30px;
  }

  .user-photo-outer {
    margin: 0;
    width: 60px;
    height: 60px;
  }

  .name {
    position: relative;
    margin-top: 15px;
    margin-bottom: 50px;
    font-size: px(20);
    font-weight: $medium;

    &::after {
      position: absolute;
      bottom: -30px;
      left: 50%;
      width: 40px;
      height: 4px;
      background-color: $c-first;
      content: '';
      transform: translateX(-50%);
    }
  }

  ul {
    width: 100%;
    height: 100%;
  }

  a {
    display: block;
    margin: 0 auto;
    padding: 10px 15px;
    font-size: px(16);
    text-align: center;
    transition: 0.4s;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: $c-first;
    }
  }
}
</style>
