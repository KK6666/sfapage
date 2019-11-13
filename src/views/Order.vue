<template>
  <div class="order view">
    <TopHead title="下单" class="header">
      <div slot="r" @click="toCart">
        <i class="icon iconfont icon-cart"></i>
      </div>
    </TopHead>
    <Search
      v-model="q"
      class="search"
      @handleSearch="handleSearch"
      @inputClear="inputClear"
    ></Search>
    <!-- 导航区 -->
    <div class="nav-wrap">
      <ul>
        <li :class="{ act: isOnSales }" @click="isOnSalesStatus">促销</li>
        <li :class="{ act: isAll }" @click="isAllStatus">全部</li>
        <li>XXXXX</li>
        <li>XXXXX</li>
        <li>XXXXX</li>
      </ul>
    </div>
    <!--  商品列表区域 -->
    <div class="goods-header">
      <div class="fl count-wrap">{{ cur }} / {{ total }}</div>
      <div class="fr">
        <ul class="type-list-wrap" @click="showSelectGoodsType = true">
          <li>{{ getFilterGoodsType }}</li>
          <li><i class="icon iconfont icon-filter"></i></li>
        </ul>
      </div>
    </div>
    <div id="main" ref="main" class="goods-list-wrap main">
      <mescroll-vue ref="mescroll" :up="mescrollUp" @init="mescrollInit">
        <ul class="goods-list">
          <li v-for="item in goods" :key="item.id">
            <router-link :to="`/goodsselect/${item.id}`">
              <GoodsListItem
                :number-visible="true"
                :goods="item"
              ></GoodsListItem>
            </router-link>
          </li>
        </ul>
      </mescroll-vue>
    </div>
    <popup v-model="showSelectGoodsType">
      <Checklist
        v-model="filterGoodsType"
        title="请选择"
        :options="['食品', '日化', '电器']"
      >
      </Checklist>
      <Button
        type="default"
        class="btn-select-type"
        @click="showSelectGoodsType = false"
      >
        确定
      </Button>
    </popup>
  </div>
</template>

<script>
import Search from '../components/Search'
import service from '../service'
import GoodsListItem from '../components/GoodsListItem'
import { Popup, Checklist, Button, Toast, Indicator } from 'mint-ui'
import MescrollVue from 'mescroll.js/mescroll.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Order',
  components: {
    Search,
    GoodsListItem,
    Popup,
    Checklist,
    Button,
    MescrollVue
  },
  data() {
    return {
      showSelectGoodsType: false,
      q: '',
      isOnSales: false, // 是否是促销，获取goods的参数一项为是否获取促销数据
      isAll: true, //是否是全部数据
      total: 0,
      cur: 0,
      filterGoodsType: ['食品', '日化', '电器'],
      loading: false,

      // mescroll相关
      mescroll: null, // mescroll实例对象
      mescrollUp: {
        // 上拉加载的配置.
        auto: false,
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 15 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 我是有底线的 --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        // // 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        // // 这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          src: require('@/assets/img/mescroll-totop.png'), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: 'main', //父布局的id (1.3.5版本支持传入dom元素)
          // icon: './static/mescroll/mescroll-empty.png', //图标,默认null,支持网络图
          tip: '暂无相关数据' //提示
        }
      },
      hasNext: true
    }
  },
  computed: {
    ...mapState(['goods', 'curOrderShop', 'cartList']),
    getFilterGoodsType() {
      return this.filterGoodsType.join('/')
    }
  },
  created() {},
  mounted() {
    // 设置mescroll定位的top值 ,下拉刷新关闭
    this.setMescroll()
    this.getData()
  },
  methods: {
    ...mapMutations(['goodsPush', 'emptyGoods']),
    handleSearch() {
      this.getData()
    },
    // 当搜索栏请空时，发起一次新的请求，避免页面无有用数据，增强用户体验
    inputClear() {
      this.getData()
    },
    getData() {
      // 搜索前，将数据清空，并且将mescroll的页码归0
      this.emptyGoods()
      this.mescrollUp.page.num = 0
      this.hasNext = true
      // 主动触发一次上拉加载,注意this.upCallback的写法是无效的。请求数据的axios写在upCallback里面，触发即可发起一次请求
      this.mescroll.triggerUpScroll()
    },
    isOnSalesStatus() {
      this.isOnSales = true
      this.isAll = false
      this.getData()
    },
    isAllStatus() {
      this.isOnSales = false
      this.isAll = true
      this.getData()
    },
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit(mescroll) {
      this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      console.log('upCallback')
      Indicator.open('请求数据中...')

      // 如果isOnSales激活了，就给params添加onsales：true，请求只会返回onsales的数据，否则默认返回所有数据
      let params = { q: this.q, _page: page.num, _limit: page.size }
      if (this.isOnSales) {
        params.onsales = this.isOnSales
      }
      service
        .getGoods(params)
        .then(res => {
          console.log(res)
          Indicator.close()

          // 使用yapi时，模拟搜索没有返回结果的情况（用服务器时可注释）///////////////
          if (this.q.length >= 4) {
            res.data = []
          }
          /////////////////////////////////////////////////////////////////////

          this.goodsPush(res.data)
          this.total = res.headers['x-total-count']

          //  使用yapi时，设置this.total（用服务器时注释）/////////////////////
          this.total = res.headers['x-total-count']
            ? res.headers['x-total-count']
            : this.isOnSales
            ? 159
            : 320
          //////////////////////////////////////////////////////////////////

          if (this.total <= page.size) {
            this.cur = this.total
          } else {
            this.cur = page.num * page.size
            if (this.cur >= this.total) {
              this.cur = this.total
            }
          }
          if (res.data.length <= 0 || this.goods.length >= 320) {
            this.hasNext = false
          }
          // 数据渲染成功后,隐藏下拉刷新的状态,可通过mescroll.endSuccess的第二个参数设置是否还有数据，列表如果无下一页数据,则提示无更多数据
          this.$nextTick(() => {
            mescroll.endSuccess(res.data.length, this.hasNext)
          })
        })
        .catch(e => {
          console.log(e)
          Indicator.close()
          Toast('请求数据失败')
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr()
        })
    },
    setMescroll() {
      // mescroll定位top
      this.$refs.mescroll.$el.style.top = this.$refs.main.offsetTop + 'px'
      // mescroll 下拉刷新关闭
      this.mescroll.lockDownScroll(true)
    },
    toCart() {
      // 暂时使用
      let shop = this.cartList.find(
        item => this.curOrderShop.id == item.shop.id
      )
      if (!shop || shop.warehouseArray.length === 0) {
        Toast({
          message: '该门店购物车是空的呦~',
          position: 'middle',
          duration: 1000
        })
        return
      }
      this.$router.push('/cart/00')
    }
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    })
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next()
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
  .header,
  .search,
  .goods-header {
    // TopHead的父组件（也就是整个页面）会全部使用flex布局，如果内容超出页面高度，子元素的flex-shrink默认为1，head设置的高度会缩小，设置为0后不会缩小
    flex-shrink: 0;
  }
  .main {
    // overflow: scroll;
  }
}
.mescroll {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: auto;
}
.search {
  margin-top: px2rem(20);
  margin-bottom: px2rem(20);
}
.nav-wrap {
  background-color: #fafafa;
  padding: px2rem(14) px2rem(28);
  font-size: px2rem(30);
  border: px2rem(1) solid #ccc;
  border-left: none;
  border-right: none;
  ul {
    display: flex;
    align-items: center;
    height: px2rem(58);
    line-height: px2rem(58);
    text-align: center;
    li {
      height: px2rem(68);
      flex: 1;
      border-right: px2rem(1) solid #ccc;
      line-height: px2rem(68);
      // background-color: pink;
    }
    li:last-child {
      border-right: none;
    }
    .act {
      color: #04afeb;
    }
  }
}
.goods-header {
  margin: 0 px2rem(28);
  // padding-right: px2rem(28);
  overflow: hidden;
  border-bottom: 1px solid #ccc;
  .count-wrap,
  .type-list-wrap {
    height: px2rem(84);
    font-size: px2rem(30);
    line-height: px2rem(84);
  }
  .type-list-wrap {
    display: flex;
    li {
      flex: 0 0 px2rem(58px);
      i {
        font-size: px2rem(30);
      }
    }
  }
}
.goods-list-wrap {
  padding-top: -px2rem(28);
  .goods-list {
    padding: 0 px2rem(28);
  }
}
.btn-select-type {
  margin-top: px2rem(10);
  width: px2rem(140);
  height: px2rem(60);
  font-size: px2rem(25);
}
</style>
