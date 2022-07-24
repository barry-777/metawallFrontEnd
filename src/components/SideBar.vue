<template>
  <section class="side-bar">
    <div class="container">
      <button
        class="base-button"
        type="button"
      >
        張貼動態
      </button>
      <ul>
        <li>
          <router-link to="/auth">
            <div>
              <user-photo :photo="userStore.avatar" />
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
          <router-link to="/auth">
            <div>
              <i class="fa-regular fa-bell" />
            </div>
            <p>追蹤名單</p>
          </router-link>
        </li>
        <li>
          <router-link to="/auth">
            <div>
              <i class="fa-regular fa-thumbs-up" />
            </div>
            <p>我按讚的文章</p>
          </router-link>
        </li>
        <li>
          <router-link to="/auth">
            <div>
              <i class="fa-regular fa-comment" />
            </div>
            <p>我留言的貼文</p>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
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
</style>
