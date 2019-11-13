<template>
  <div class="tab">
    <div
      class="left"
      :class="{ active: active_index === 1 ? true : false }"
      @click="
        active_index = 1
        $emit('leftClick')
      "
    >
      <slot name="titleL"></slot>
    </div>
    <div
      class="right"
      :class="{ active: active_index === 2 ? true : false }"
      @click="
        active_index = 2
        $emit('rightClick')
      "
    >
      <slot name="titleR"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tab',
  data() {
    return {
      active_index: 1
    }
  }
}
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  justify-content: space-between;
  .left,
  .right {
    background: #fafafa;
    flex: 1;
    height: px2rem(100);
    line-height: px2rem(100);
    text-align: center;
    font-size: px2rem(35);
  }
  .left {
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .right {
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .active {
    background: white;
    border-bottom: none;
  }
}
</style>
