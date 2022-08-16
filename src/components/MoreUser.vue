<template>
  <div class="more-user">
    <div
      class="common-title"
    >
      <p>尋找更多使用者</p>
    </div>
    <div class="users">
      <template v-if="users.length">
        <UserItem
          v-for="user in users"
          :key="user._id"
          :user="user"
        />
      </template>
      <template v-else>
        <UserItem
          :user="{}"
        />
      </template>
    </div>
    <div class="button-wrap">
      <button
        class="base-button blue"
        type="button"
        @click.stop="getData()"
      >
        再次尋找
      </button>
    </div>
  </div>
</template>

<script setup>
import UserItem from '@/components/UserItem.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { getRandomUsers } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'

const modalStore = useModalStore()
const userStore = useUserStore()
const { user_id } = storeToRefs(userStore)
const { openLoading, closeLoading } = modalStore

const users = ref([])
const getData = async () => {
  openLoading('尋找中')
  const { data: usersData } = await getRandomUsers()
  const checkSelf = usersData.data.findIndex(user => user._id === user_id.value)
  if (checkSelf > -1) usersData.data.splice(checkSelf, 1)
  users.value = usersData.data
  closeLoading()
}
getData()
</script>

<style scoped lang="scss">
@import '../assets/scss/base/variables';
@import '../assets/scss/base/mixins';
.users {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 25px;
}
.button-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}
.base-button {
  max-width: 250px;
  margin-top: 40px;
}
</style>
