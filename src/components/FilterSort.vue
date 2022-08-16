<template>
  <div
    class="filter-select"
    :class="{'active': selecting}"
  >
    <div
      class="drop-top"
      @click="selecting = !selecting"
    >
      <div class="now-value">
        {{ selectValue === 'hot' ? '最熱門貼文' : selectValue === 'old' ? '最舊貼文' : '最新貼文' }}
      </div>
      <div class="arrow">
        <i class="fa-solid fa-caret-down" />
      </div>
    </div>
    <div class="drop-bottom">
      <ul>
        <li
          :class="{'selected': selectValue === null}"
          @click.stop="selected(null)"
        >
          最新貼文
        </li>
        <li
          :class="{'selected': selectValue === 'hot'}"
          @click.stop="selected('hot')"
        >
          最熱門貼文
        </li>
        <li
          :class="{'selected': selectValue === 'old'}"
          @click.stop="selected('old')"
        >
          最舊貼文
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()

const selecting = ref(false)
const selectValue = ref(null)
if (route.query.s) selectValue.value = route.query.s
const selected = async (sort) => {
  if (selectValue.value === sort) return
  selectValue.value = sort
  selecting.value = false
  await router.push({
    query: Object.assign({}, route.query, {
      s: selectValue.value
    })
  })
  window.location.reload()
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.filter-select {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;
  cursor: pointer;
  z-index: 5;
  &.active {
    .drop-top {
      border-radius: 8px 8px 0 0;
      transition: .4s;
    }
    .drop-bottom {
      opacity: 1;
      pointer-events: all;
      transform: translate(-50%, 0);
      transition: .4s;
    }
  }
}
.drop-top {
  width: 100%;
  min-height: 40px;
  display: flex;
  padding: 12px 15px 10px;
  background-color: $c-white;
  border: 2px solid $c-black;
  border-radius: 8px 8px 15px 15px;
  position: relative;
  z-index: 1;
  transition: .2s;
  .now-value {
    font-weight: $medium;
  }
  .arrow {
    font-size: px(20);
    margin-left: auto;
  }
}
.drop-bottom {
  width: 100%;
  border: 2px solid $c-black;
  border-radius: 0 0 15px 15px;
  position: absolute;
  top: calc(100% - 10px);
  left: 50%;
  transform: translate(-50%, 10px);
  z-index: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: .2s;
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    background-color: rgba($c-white, .6);
    backdrop-filter: blur(3px);
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    z-index: -1;
  }
  ul {
    padding-top: 8px;
    display: flex;
    flex-direction: column;
  }
  li {
    width: 100%;
    padding: 12px 12px;
    border-bottom: 1px solid $c-black;
    user-select: none;
    cursor: pointer;
    &.selected {
      background-color: $c-first;
      color: $c-white;
    }
  }
}
</style>
