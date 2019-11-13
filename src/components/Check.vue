<template>
  <div class="check" @click="$emit('checkClick')">
    <i v-show="checked" class="iconfont">&#xe61e;</i>
    <div v-show="!checked"></div>
  </div>
</template>

<script>
export default {
  name: 'Check',
  props: {
    checked: { type: Boolean, default: false }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.check {
  padding: px2rem(28);
  div {
    border: 1px solid #ccc;
    border-radius: 50%;
    width: px2rem(40);
    height: px2rem(40);
    box-sizing: border-box;
  }
  i {
    display: block;
    border-radius: 50%;
    background: $bgc;
    width: px2rem(40);
    height: px2rem(40);
    font-size: px2rem(30);
    text-align: center;
    color: white;
  }
}
</style>
