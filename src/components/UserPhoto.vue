<template>
  <Transition name="fade">
    <img
      v-if="/\.(png|jpg|jpe?g)$/i.test(photo?.link)"
      :src="photo?.link"
    >
    <img
      v-else
      src="@img/user_default.jpg"
    >
  </Transition>
</template>

<script setup>
defineProps({
  photo: Object
})
</script>
