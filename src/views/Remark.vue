<template>
  <div class="view">
    <TopHead :title="wName" class="header"></TopHead>
    <div class="main">
      <textarea
        ref="textarea"
        v-model="value"
        placeholder="请填写备注信息~"
      ></textarea>
      <div class="length">字数( {{ length }}/50 )</div>
    </div>
    <footer @click="confirmClick">
      提交
    </footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Toast } from 'mint-ui'
export default {
  name: 'Remark',
  data() {
    return {
      shopId: this.$route.params.shopId,
      warehouseId: this.$route.params.warehouseId,
      wName: '',
      value: '',
      length: 0
    }
  },
  computed: {
    ...mapState(['cartList'])
  },
  watch: {
    value: function() {
      this.length = this.$refs.textarea.value.length
      if (this.length >= 50) {
        this.length = 50
        this.value = this.value.substring(0, 49)
      }
    }
  },
  created() {
    // 获取vuex里的仓库名称和已存在的备注信息
    let shopItem = this.cartList.find(shop => shop.shop.id == this.shopId)
    let warehouseItem = shopItem.warehouseArray.find(
      warehouse => warehouse.warehouse.id == this.warehouseId
    )
    this.wName = warehouseItem.warehouse.reponame
    this.value = warehouseItem.remark
  },
  methods: {
    ...mapMutations(['setRemark']),
    confirmClick() {
      if (!this.value) {
        Toast({
          message: '您还没输入内容呦~',
          position: 'middle',
          duration: 1000
        })
        return
      }
      this.setRemark({
        shopId: this.shopId,
        warehouseId: this.warehouseId,
        value: this.value
      })
      Toast({
        message: '提交成功',
        position: 'middle',
        duration: 500
      })
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
// 页面实现header固定，main单独实现滑动
.view {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  .header {
    // TopHead的父组件（也就是整个页面）会全部使用flex布局，如果内容超出页面高度，子元素的flex-shrink默认为1，head设置的高度会缩小，设置为0后不会缩小
    flex-shrink: 0;
  }
  .main {
    overflow-y: scroll;
  }
}

textarea {
  width: 100%;
  height: px2rem(380);
  box-sizing: border-box;
  border: none;
  background: #fafafa;
  padding: px2rem(20);
}
// 针对所有的文本框,改变placeholder颜色
::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #ccc;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #ccc;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #ccc;
}
:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #ccc;
}

.length {
  text-align: right;
  padding-right: px2rem(28);
}

footer {
  border-top: 1px solid #ccc;
  height: px2rem(110);
  line-height: px2rem(110);
  font-size: px2rem(36);
  color: #10903d;
  text-align: center;
  font-weight: bold;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
