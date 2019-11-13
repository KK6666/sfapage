<template>
  <div class="cart view">
    <TopHead title="购物车" class="header"></TopHead>
    <div v-if="isEmpty" class="empty">购物车当前无商品</div>
    <div v-if="!isEmpty" class="main">
      <Warehouse
        v-for="warehouseItem in shopItem.warehouseArray"
        :key="warehouseItem.id"
        :warehouse-item="warehouseItem"
        :shop-id="shopItem.shop.id"
      ></Warehouse>
    </div>
    <footer>
      <Check
        class="left"
        :checked="shopItem.checked"
        @checkClick="checkClick"
      ></Check>
      <div class="right">
        <div>全选</div>
        <div class="total">
          合计：<span>{{ getPriceTotal }}元</span>
        </div>
        <div class="button" @click="confirmClick">
          确认
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import Check from '../components/Check'
import { mapState, mapMutations } from 'vuex'
import Warehouse from '../components/Warehouse'
export default {
  name: 'Cart',
  components: {
    Warehouse,
    Check
  },
  data() {
    return {
      shopItem: null //当前门店对应的购物车信息
    }
  },
  computed: {
    ...mapState(['cartList', 'curOrderShop']),
    // 计算总价格
    getPriceTotal: function() {
      let total = 0
      this.shopItem.warehouseArray.forEach(warehouse => {
        warehouse.goodsArray.forEach(goods => {
          if (goods.checked == true) {
            total += goods.count * goods.goods.monery
          }
        })
      })
      return total
    },
    // 检测当前门店下是否还有商品
    isEmpty: function() {
      return this.shopItem.warehouseArray.length == 0 ? true : false
    }
  },
  created() {
    // 获取当前门店所有信息
    this.shopItem = this.getShop()
    // 检查门店下是否呦未选中的仓库，有则说明没有全选，或者检测改shop下是还有商品，单独将全选取消
    this.handleAllCheckedFalse()
  },
  methods: {
    ...mapMutations(['allCheckedClick', 'allCheckedFalse']),
    checkClick() {
      this.allCheckedClick({
        shopId: this.shopItem.shop.id,
        allChecked: this.allChecked
      })
    },
    confirmClick() {
      if (this.getPriceTotal == 0) {
        Toast({
          message: '您还没选择商品呦~',
          position: 'middle',
          duration: 500
        })
        return
      }
      this.$router.push('/cartsubmit')
    },
    getShop() {
      return this.cartList.find(cart => cart.shop.id == this.curOrderShop.id)
    },
    handleAllCheckedFalse() {
      if (this.isEmpty) {
        this.allCheckedFalse({ shopId: this.shopItem.shop.id })
        return
      }
      this.shopItem.warehouseArray.forEach(warehouse => {
        if (warehouse.checked == false) {
          this.allCheckedFalse({ shopId: this.shopItem.shop.id })
        }
      })
    }
    // backClick() {
    //   console.log('bc')
    //   // this.$router.push({path:`/goodslist/${$route.params.id}`})
    //   this.$router.go(-1)
    //   console.log('bc11')
    // }
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
    padding-bottom: px2rem(100);
  }
}

.empty {
  text-align: center;
  margin-top: px2rem(50);
  color: #ccc;
}

footer {
  background-color: #fff;
  padding-right: px2rem(28);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: px2rem(100);
  border-top: 1px solid #ccc;
  display: flex;
  align-items: center;
  .left {
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .total {
      span {
        color: red;
      }
    }
    .button {
      width: px2rem(168);
      height: px2rem(70);
      line-height: px2rem(70);
      text-align: center;
      background-color: #109d3d;
      border-radius: px2rem(5);
      color: white;
    }
  }
}
</style>
