<template>
  <Transition name="fade">
    <img v-if="userStore.avatar !== ''" :src="userStore.avatar" />
    <img v-else src="@img/user_default.jpg" />
  </Transition>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>

<style scoped lang="scss">
img {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
