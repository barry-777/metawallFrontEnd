<template>
  <div
    v-if="showAlertText?.length"
    class="alert-box"
    :class="showAlertCls"
  >
    <div class="alert-container">
      <div class="alert-inner">
        <p
          v-for="t in showAlertText"
          :key="t"
        >
          {{ t }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { showAlertText, showAlertCls } = modalStore
</script>

<style scoped lang="scss">
@import '../../assets/scss/base/variables';
@import '../../assets/scss/base/mixins';
.alert-box {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  &.success {
    .alert-inner {
      background-color: $c-green;
      color: $c-white;
    }
  }
  &.error {
    .alert-inner {
      background-color: $c-red;
      color: $c-white;
    }
  }
}
.alert-container {
  width: auto;
  height: auto;
  .alert-inner {
    width: auto;
    height: auto;
    display: flex;
    align-content: center;
    padding: 12px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba($c-black, 0.5);
  }
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
  @include mobile {
    p {
      font-size: px(12);
    }
  }
}
</style>
