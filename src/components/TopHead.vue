<template>
  <div class="topHead">
    <div
      class="tp-l"
      @click="routerData ? $router.push(routerData) : $router.go(-1)"
    >
      <i class="icon iconfont icon-back"></i>
    </div>
    <div class="title">{{ title }}</div>
    <div class="tp-r">
      <slot name="r"></slot>
    </div>
  </div>
</template>

<script>
import '../assets/font/iconfont.css'
export default {
  name: 'TopHead',
  props: {
    title: { type: String, default: '' },
    routerData: { type: Object, default: null }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.topHead {
  width: 100%;
  height: px2rem(120);
  //line-height可以起到保持高度作用
  line-height: px2rem(120);
  font-size: px2rem(36);
  background-color: #23bb59;
  color: #fff;
  display: flex;
  justify-content: space-between;
  .title {
    flex: 1;
    text-align: center;
  }
  .tp-r {
    width: px2rem(200);
    padding-right: px2rem(30);
    text-align: right;
    font-size: px2rem(28);
    .icon {
      font-size: px2rem(36);
    }
  }
  .tp-l {
    width: px2rem(200);
    padding-left: px2rem(30);
    .icon {
      font-size: px2rem(36);
    }
  }
}
</style>
