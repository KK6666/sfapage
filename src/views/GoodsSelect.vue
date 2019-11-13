<template>
  <div class="view goodsSelect">
    <TopHead title="产品选择" class="header"></TopHead>
    <div class="main item-wrap">
      <GoodsListItem
        class="goodsListItem"
        :number-visible="false"
        :goods="goodsInfo"
      ></GoodsListItem>
      <ul class="item-wrap">
        <li>
          <div>仓库</div>
          <div class="warehouse">
            <span>{{ warehouse.reponame }}</span>
            <i class="iconfont">&#xe84e;</i>
          </div>
        </li>
        <li>
          <div>库存</div>
          <div>{{ goodsInfo.number }}</div>
        </li>
        <li>
          <div>数量</div>
          <Count v-model="count" :max="goodsInfo.number" class="count"></Count>
        </li>
      </ul>
    </div>
    <footer>
      <div @click="$router.go(-1)">取消</div>
      <div @click="addToCart">加入购物车</div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import service from '../service'
import GoodsListItem from '../components/GoodsListItem'
import Count from '../components/Count'
export default {
  name: 'GoodsList',
  components: {
    GoodsListItem,
    Count
  },
  data() {
    return {
      goodsId: 0,
      goodsInfo: null,
      warehouse: {},
      count: 1
    }
  },
  computed: {
    ...mapState(['goods', 'warehouseList'])
  },
  created() {
    // order页面的购物车icon图标，辅助实现跳转，暂时使用！！
    if (!this.$route.params.id) return

    this.goodsId = this.$route.params.id
    // 获取当前货物信息
    this.goodsInfo = this.goods.find(item => item.id == this.goodsId)
    // 将当前下订单货物信息存入vuex
    this.initCurOrderGoods(this.goodsInfo)
    // 获取当前商品对应仓库的信息
    this.getWarehouse()
  },
  mounted() {},
  methods: {
    ...mapMutations([
      'initWarehouseList',
      'initCurOrderGoods',
      'initCurOrderWarehouse',
      'addToCartList'
    ]),
    addToCart() {
      if (this.count <= 0) {
        return
      }
      this.$router.push(`/cart/${this.goodsId}`)
      this.addToCartList({ count: this.count })
    },
    getWarehouse() {
      service
        .getWarehouse()
        .then(res => {
          // res为所有的仓库信息，后面都会用到，存进vuex
          if (!this.warehouseList) {
            this.initWarehouseList(res.data)
          }
          this.warehouse = this.warehouseList.find(
            item => item.id == this.goodsInfo.warehouseId
          )
          // 将当前下订单仓库信息存入vuex
          this.initCurOrderWarehouse(this.warehouse)
        })
        .catch(e => {
          console.log('获取当前仓库信息失败 getWarehouse failed')
          console.log(e)
        })
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
  padding: 0 px2rem(28);
  .item-wrap {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: px2rem(100);
      border-bottom: 1px solid #ccc;
      .warehouse {
        display: flex;
        align-items: center;
      }
    }
    .count {
      margin-right: px2rem(-18);
    }
  }
}
footer {
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 0;
  border-top: 1px solid #ccc;
  div {
    flex: 1;
    height: px2rem(100);
    line-height: px2rem(100);
    text-align: center;
  }
  div:first-child {
    color: red;
    border-right: 1px solid #ccc;
  }
  div:last-child {
    color: #23bb59;
  }
}
</style>
