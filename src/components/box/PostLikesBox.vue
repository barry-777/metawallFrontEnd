<template>
  <div class="full-box">
    <div
      class="full-bg"
      @click="openPostLikesBox(false)"
    />
    <div class="full-container">
      <div class="full-inner">
        <div class="main-inner animate-inner">
          <div class="top-control">
            <div
              class="close-button"
              @click="openPostLikesBox(false)"
            >
              <i class="fa-solid fa-xmark" />
            </div>
          </div>
          <div class="full-title">
            目前收藏的會員
          </div>
          <ul>
            <li
              v-for="(list, index) in showPostLikesTemp"
              :key="'list' + index"
            >
              <router-link
                :to="`/user/info/${list._id}`"
                @click="openPostLikesBox(false)"
              >
                <div class="user-photo-outer">
                  <UserPhoto :photo="list.avatar" />
                </div>
                <div class="name">
                  {{ list.name }}
                </div>
              </router-link>
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
@import '../../assets/scss/base/variables';

.main-inner {
  width: 100%;
  max-width: 600px;
}

ul {
  margin-top: 30px;
}

li {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--dark);

  &:last-child {
    margin-bottom: 0;
  }

  a {
    display: inline-flex;
    align-items: center;

    &:hover {
      .name {
        color: $c-first;
      }
    }
  }

  .name {
    font-size: px(18);
    font-weight: $medium;
  }
}
</style>
