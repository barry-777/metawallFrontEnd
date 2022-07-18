<template>
  <div class="alert-box" :class="showAlertCls">
    <div class="alert-container move-obj">
      <template v-if="showAlertText.length">
        <p v-for="t in showAlertText" :key="t">{{ t }}</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { showAlertText, showAlertCls } = modalStore
</script>

<style scoped lang="scss">
@import '../assets/scss/base/variables';
@import '../assets/scss/base/mixins';
.alert-box {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  &.success {
    .alert-container {
      background-color: $c-success;
    }
  }
  &.error {
    .alert-container {
      background-color: $c-error;
    }
  }
}
.alert-container {
  width: auto;
  height: auto;
  padding: 12px 20px;
  display: flex;
  align-content: center;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba($c-black, 0.5);
  p {
    font-size: px(18);
    font-weight: $medium;
    margin: 3px;
    letter-spacing: 1.2px;
    line-height: 1.4;
    &:not(:first-child)::before {
      content: ', ';
    }
  }
}
</style>
