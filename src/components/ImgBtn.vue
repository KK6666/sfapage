<template>
  <div class="img-btn" @click="$emit('btnClick')">
    <i
      class="iconfont"
      :class="iconClass"
      :style="{ color: isred ? '#ff5656' : '#000' }"
    ></i>
    <p>{{ val }}</p>
  </div>
</template>

<script>
export default {
  name: 'ImgBtn',
  props: {
    iconClass: { type: String, default: '' },
    val: { type: String, default: '' },
    isred: { type: Boolean, default: false }
  },
  data() {
    return {}
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.img-btn {
  width: px2rem(210);
  height: px2rem(210);
  border: 1px solid #ccc;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  i {
    font-size: px2rem(50);
  }
  .red {
    color: red;
  }
}
</style>
