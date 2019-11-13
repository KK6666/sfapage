<template>
  <div class="view">
    <TopHead title="提交订单" class="header"></TopHead>
    <div class="main">
      <div class="receiver">
        <div class="info">
          <div class="name">收货人：XXX</div>
          <div class="tel">电话：12345678910</div>
        </div>
        <div class="address">
          <i class="iconfont">&#xe61f;</i>
          <span>陕西省西安市雁塔区XXXXXXXXXXXX</span>
        </div>
      </div>
      <div
        v-for="item in checkedArray"
        :key="item.warehouse.id"
        class="warehouse"
      >
        <div
          v-for="goods in item.goodsArray"
          :key="goods.goods.id"
          class="goods"
        >
          <div class="img">
            <img :src="goods.goods.img" />
          </div>
          <div class="content">
            <ul>
              <li class="goods-name">商品: {{ goods.goods.title }}</li>
              <li class="p-c">
                <div class="price">
                  价格：<span>{{ goods.count * goods.goods.monery }}元</span>
                </div>
                <div class="count">数量：{{ goods.count }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="remark">备注：{{ item.warehouse.remark }}</div>
      </div>
    </div>
    <footer>
      <div class="total">
        合计：<span>{{ priceTotal }}元</span>
      </div>
      <div class="button" @click="submitClick">
        提交
      </div>
    </footer>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'CartSubmit',
  data() {
    return {
      shopItem: null,
      checkedArray: [],
      priceTotal: 0
    }
  },
  computed: {
    ...mapState(['cartList', 'curOrderShop'])
  },
  created() {
    // 获取所属shop
    this.shopItem = this.getShop()
    // 建立checked的货物/仓库数组
    this.getCheckedArray()
    // 计算总价
    this.getPriceTotal()
  },
  methods: {
    ...mapMutations(['clearSubmitted']),
    submitClick() {
      Toast({
        message: '订单已提交',
        position: 'middle',
        duration: 500
      })
      this.clearSubmitted({
        shopId: this.shopItem.shop.id
      })
      setTimeout(() => {
        this.$router.push('/home')
      }, 500)
    },
    getPriceTotal() {
      this.checkedArray.forEach(item => {
        item.goodsArray.forEach(goods => {
          this.priceTotal += goods.count * goods.goods.monery
        })
      })
    },
    getCheckedArray() {
      this.shopItem.warehouseArray.forEach(warehouse => {
        let goodsChecked = warehouse.goodsArray.filter(goods => goods.checked)
        if (goodsChecked.length != 0) {
          this.checkedArray.push({
            warehouse: warehouse,
            goodsArray: goodsChecked
          })
        }
      })
    },
    getShop() {
      return this.cartList.find(cart => cart.shop.id == this.curOrderShop.id)
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

.main {
  padding-bottom: px2rem(100);
  .receiver {
    padding: px2rem(28);
    background-color: #fafafa;
    border-bottom: 1px solid #ccc;
    .info {
      font-size: px2rem(35);
      display: flex;
      justify-content: space-between;
    }
    .address {
      margin-top: px2rem(13);
      i {
        font-size: px2rem(30);
        color: red;
      }
      span {
        color: #ccc;
      }
    }
  }
  .warehouse {
    padding: px2rem(28) px2rem(28) 0;
    border-bottom: 1px solid #ccc;
    .goods {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      padding: 0 0 px2rem(28) 0;
      .img {
        width: px2rem(124);
        height: px2rem(124);
        margin-right: px2rem(28);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .goods-name {
          margin-bottom: px2rem(20);
        }
        .p-c {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .price {
            span {
              color: red;
            }
          }
          .count {
          }
        }
      }
    }
    .remark {
      height: px2rem(80);
      line-height: px2rem(80);
    }
  }
}

footer {
  background-color: #fff;
  padding: 0 px2rem(28);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: px2rem(100);
  border-top: 1px solid #ccc;
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
</style>
