<template>
  <div class="shopinfo view">
    <TopHead title="拜访门店" class="header">
      <div slot="r" class="end" @click="stopVisit">结束</div>
    </TopHead>
    <div class="main">
      <div class="name">{{ thisShop.name }}--门店</div>
      <ul class="itemWrap">
        <li>
          <div class="left">
            <i class="iconfont">&#xe634;</i>
            <span>月完成销售量</span>
          </div>
          <div class="right">{{ shopSales.MonthSales.toFixed(0) }}</div>
        </li>
        <li>
          <div class="left">
            <i class="iconfont">&#xe661;</i>
            <span>半年内月均销售量</span>
          </div>
          <div class="right">{{ shopSales.MonthAvgSales.toFixed(0) }}</div>
        </li>
        <li class="noborder">
          <div class="left">
            <i class="iconfont">&#xe682;</i>
            <span>核心分销完成率</span>
          </div>
          <div class="right">{{ shopSales.DivSalesPercent.toFixed(0) }} %</div>
        </li>
        <div class="progress-bar">
          <div
            class="progress-bar-val"
            :style="{ width: `${shopSales.DivSalesPercent}%` }"
          ></div>
        </div>
      </ul>
      <div class="remarkWrap">
        <p>历史拜访备注：</p>
        <textarea placeholder="点击填写历史备注~"></textarea>
      </div>
      <div class="btn-wrap">
        <div class="btn" @click="$router.push('/order/' + $route.params.id)">
          下单
        </div>
        <div class="btn active">
          <router-link :to="`/shopsign/${$route.params.id}`">
            商铺签到
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../service'
import { mapState } from 'vuex'
export default {
  name: 'Shopinfo',
  data() {
    return {
      id: 0,
      thisShop: null,
      shopSales: {
        DivSalesPercent: 0,
        MonthAvgSales: 0,
        MonthSales: 0
      }
    }
  },
  computed: {
    ...mapState({
      shopList: 'shopList'
    })
  },
  created() {
    this.id = this.$route.params.id
    this.getShopSales(this.id)

    this.thisShop = this.shopList.find(item => item.id == this.id)
    // 将当前要下订单门店信息存入store（{ ...this.thisShop }写法保证存入一个与当前this.thisShop指向不同的新对象）
    this.$store.commit('initCurOrderShop', { ...this.thisShop })
  },
  mounted() {},
  methods: {
    stopVisit() {
      this.$router.go(-1)
    },
    getShopSales(id) {
      service
        .getShopSales(id)
        .then(res => {
          console.log(res)
          // this.shopSales = res.data
          // 使用GreenSock实现进度条动画，查看vue文档示例TweenLite.to(要变化的属性, 动画时间, 属性最后要变成的值)
          // eslint-disable-next-line
          TweenLite.to(this.shopSales, 1, res.data)
        })
        .catch(e => {
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
    // 如果内容超出页面高度，子元素的flex-shrink默认为1，head设置的高度会缩小，设置为0后不会缩小
    flex-shrink: 0;
  }
  .main {
    overflow-y: scroll;
  }
}

.end {
  font-size: px2rem(30);
}

.name {
  height: px2rem(100);
  line-height: px2rem(100);
  text-align: center;
  font-weight: bold;
}

.itemWrap {
  padding: 0 px2rem(20);
  li {
    height: px2rem(100);
    display: flex;
    justify-content: space-between;
    line-height: px2rem(100);
    border-bottom: 1px solid #ccc;
    .left {
      height: 100%;
      i {
        font-size: px2rem(30);
        margin-right: px2rem(10);
      }
    }
    .right {
      height: 100%;
    }
  }
  .noborder {
    border: none;
  }
  .progress-bar {
    height: px2rem(12);
    border-radius: px2rem(6);
    background-color: #e4e4e4;
    .progress-bar-val {
      height: px2rem(12);
      border-radius: 6px;
      background: linear-gradient(to right, #868ce4, #57c988);
    }
  }
}

.remarkWrap {
  border: 2px solid #ccc;
  border-radius: px2rem(10);
  overflow: hidden;
  margin: px2rem(20);
  p {
    background: #fafafa;
    height: px2rem(60);
    line-height: px2rem(60);
    padding-left: px2rem(10);
  }
  textarea {
    width: 96%;
    height: px2rem(200);
    border: none;
    margin: 2%;
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
}

.btn-wrap {
  padding-top: px2rem(168);
  .btn {
    height: px2rem(84);
    line-height: px2rem(84);
    margin: 0 auto px2rem(54);
    width: px2rem(480);
    font-size: px2rem(36);
    color: #10903d;
    border: px2rem(2) solid #10903d;
    text-align: center;
    border-radius: px2rem(5);
  }
  .active {
    color: #fff;
    background-color: #10903d;
  }
}
</style>
