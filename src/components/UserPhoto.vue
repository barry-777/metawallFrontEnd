<template>
  <Transition name="fade">
    <img
      v-if="/\.(png|jpg|jpe?g)$/i.test(photo)"
      :src="photo"
    >
    <img
      v-else
      src="@img/user_default.jpg"
    >
  </Transition>
</template>

<script setup>
defineProps({
  photo: String
})
</script>

<style scoped lang="scss">
img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
