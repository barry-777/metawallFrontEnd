<template>
  <div class="full-box">
    <div
      class="full-bg"
      @click="openImagesBox(false)"
    />
    <div class="full-container">
      <div class="full-inner">
        <div
          class="close-button"
          @click="openImagesBox(false)"
        >
          <i class="fa-solid fa-xmark" />
        </div>
        <div class="main-inner">
          <swiper
            :modules="[Navigation, Pagination, EffectFade]"
            :speed="1000"
            :space-between="20"
            :pagination="{ clickable: true }"
            :navigation="true"
            :effect="'fade'"
            :fade-effect="{crossFade: true}"
          >
            <swiper-slide
              v-for="(image, index) in props.images"
              :key="'image' + index"
            >
              <img
                :src="image.link"
                alt=""
              >
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { Navigation, Pagination, EffectFade } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useModalStore } from '@/stores/modal'
import { onMounted } from 'vue'

const modalStore = useModalStore()
const { openImagesBox } = modalStore
const props = defineProps({
  images: Array
})

onMounted(() => {
  const element = document.querySelector('.main-inner')
  element.addEventListener('click', function (e) {
    e.stopPropagation()
  })
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/variables';
.swiper-slide {
  padding: 35px;
}
.main-inner {
  width: 100%;
  max-width: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    box-shadow: 0 3px 15px rgba($c-black, .5);
  }
}
</style>
