<template>
  <div class="full-box">
    <div
      class="full-bg"
      @click="openPostLikesBox(false)"
    />
    <div class="full-container">
      <div class="full-inner">
        <div
          class="close-button"
          @click="openPostLikesBox(false)"
        >
          <i class="fa-solid fa-xmark" />
        </div>
        <div class="main-inner">
          <div class="full-title">
            目前收藏的會員
          </div>
          <ul>
            <li
              v-for="(list, index) in showPostLikesTemp"
              :key="'list' + index"
            >
              <div class="user-photo-outer">
                <UserPhoto :photo="list.avatar" />
              </div>
              <div class="name">
                {{ list.name }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
const { showPostLikesTemp } = storeToRefs(modalStore)
const { openPostLikesBox } = modalStore

onMounted(() => {
  const element = document.querySelector('.main-inner')
  element.addEventListener('click', function (e) {
    e.stopPropagation()
  })
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/variables';
.close-button {
  margin-bottom: 30px;
}
.main-inner {
  width: 100%;
  max-width: 800px;
  padding: 50px 40px 60px;
  border: 4px solid $c-first;
  border-bottom: 6px solid $c-first;
  border-radius: 20px 20px 0 0;
  background-color: $c-white;
  box-shadow: 0 5px 8px rgba($c-black, .5);
  overflow: hidden;
}
ul {
  margin-top: 50px;
}
li {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .name {
    font-size: px(18);
    font-weight: $medium;
  }
}
</style>
