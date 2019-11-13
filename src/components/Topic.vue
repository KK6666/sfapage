<template>
  <router-link :to="url" class="topic" tag="div">
    <img :src="imgUrl" />
    <p>{{ menuName }}</p>
  </router-link>
</template>

<script>
export default {
  name: 'Topic',
  props: {
    url: { type: String, default: '' },
    imgUrl: { type: String, default: '' },
    menuName: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.topic {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20% 0;
  img {
    width: px2rem(70);
    height: px2rem(70);
  }
  p {
    font-size: $text-size-mid;
    margin-top: px2rem(25);
  }
}
</style>
